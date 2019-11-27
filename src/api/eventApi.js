import firebase from "firebase/app";
import "firebase/storage";
import moment from "moment";
import natural from "natural";
import { flatten, orderBy, sortBy, groupBy, mapValues, filter } from "lodash";
import { db, WhereCondition, WHERE_OPERATORS, OrderCondition, ORDER_OPERATORS } from "./database";
import { fetchJson } from "./utils";

const storage = firebase.storage();

export async function getAllEvents() {
  try {
    const allEvents = await db.selectRowsAsArray(
      "event",
      [],
      new OrderCondition(["event_datetime", ORDER_OPERATORS.desc])
    );
    return await getBasicEvents(allEvents);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getEventMinutes(eventId, indexOrder) {
  try {
    const eventMinutes = await db.selectRowsAsArray(
      "event_minutes_item",
      [new WhereCondition(["event_id", WHERE_OPERATORS.eq, eventId])],
      new OrderCondition(["index", indexOrder])
    );
    return eventMinutes;
  } catch (e) {
    return Promise.reject(e);
  };
}

export async function getEventMinutesItem(eventMinutesItem) {
  try {
    const minutesItem = await db.selectRowById("minutes_item", eventMinutesItem.minutes_item_id);
    const minutesItemFiles = await db.selectRowsAsArray(
      "minutes_item_file",
      [new WhereCondition(["minutes_item_id", WHERE_OPERATORS.eq, eventMinutesItem.minutes_item_id])],
      new OrderCondition(['name', ORDER_OPERATORS.asc])
    );

    return {
      ...eventMinutesItem,
      minutes_item: {
        id: eventMinutesItem.minutes_item_id,
        ...minutesItem,
        file: minutesItemFiles
      }
    };
  } catch (e) {
    return Promise.reject(e);
  };
}

export async function getEventBody(bodyId) {
  try {
    const body = await db.selectRowById('body', bodyId);
    return body;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getEventTranscriptMetadata(eventId) {
  try {
    const [firstTranscript] = await db.selectRowsAsArray(
      "transcript",
      [new WhereCondition(["event_id", WHERE_OPERATORS.eq, eventId])]
    );

    const transcriptMetadata = await db.selectRowById("file", firstTranscript.file_id);

    // https://firebase.google.com/docs/storage/web/download-files
    const gsReference = storage.refFromURL(transcriptMetadata.uri);
    const transcript = await gsReference
      .getDownloadURL()
      .then(url => fetchJson(url));
    return transcript;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getVotesForEvent(minutesItems) {
  const minuteItemsWithDecisions = minutesItems.filter(
    minute => minute.decision !== null
  );

  const formattedItems = [];
  minuteItemsWithDecisions.forEach(item => {
    formattedItems.push({
      matter: item.minutes_item.matter,
      name: item.minutes_item.name,
      id: item.id,
      decision: item.decision,
      index: item.index
    });
  });

  const votePromises = formattedItems.map(item =>
    db.selectRowsAsArray(
      "vote",
      [new WhereCondition(["event_minutes_item_id", WHERE_OPERATORS.eq, item.id])]
    )
  );

  const minuteItemVotes = await Promise.all(votePromises);

  const allPeople = await db.selectRowsAsArray("person");

  formattedItems.forEach((item, i) => {
    const votes = minuteItemVotes[i];
    const votesByPerson = [];
    votes.forEach(vote => {
      const person = allPeople.find(person => person.id === vote.person_id)
      votesByPerson.push({
        decision: vote.decision,
        person_id: vote.person_id,
        full_name: person.full_name
      });
    });

    item.formattedIndividualVotes = sortBy(votesByPerson, vote => vote.full_name);
  });

  return formattedItems;
}

export async function getEventById(id) {
  try {
    const event = await db.selectRowById("event", id);
    const body = await getEventBody(event.body_id);
    const minutes = await getEventMinutes(id, ORDER_OPERATORS.asc);
    const minutesItems = await Promise.all(
      minutes.map(minute => getEventMinutesItem(minute))
    );
    const transcript = await getEventTranscriptMetadata(id);
    const votes = await getVotesForEvent(minutesItems);

    return {
      id,
      name: body.name,
      description: body.description,
      videoUrl: event.video_uri,
      date: moment
        .utc(event.event_datetime.toMillis())
        .toISOString(),
      minutes: minutesItems,
      transcript: transcript.data,
      scPageUrl: event.source_uri,
      votes: votes
    };
  } catch (e) {
    return Promise.reject(e);
  }
}
/**
* @param {string} term The search term
* @param {Object} dateRange The start and end dates to filter search results.
* @param {string} dateRange.start
* @param {string} dateRange.end 
* @param {string[]} bodyIDs The list of committee/body ids to filter search results.
* @param {Object} sort The sort by and sort order options.
* @param {string} sort.by
* @param {string} sort.order 
* @return {Object[]} The search results, where each event's date is within
* the date range and the event's body id is in bodyIDs(if it's non-empty). The search
* results are sorted according to the sort options.
*/
export async function getEventsByIndexedTerm(term, dateRange = {}, bodyIDs = [], sort = {}) {
  const valueMin = 0;
  try {
    natural.PorterStemmer.attach();

    const stemmedTokens = term.tokenizeAndStem();
    if (stemmedTokens.length === 0) {
      return [];
    }

    // get matches for each term
    const matches = await Promise.all(
      stemmedTokens.map(stemmedToken =>
        db.selectRowsAsArray(
          "indexed_event_term",
          [new WhereCondition(["term", WHERE_OPERATORS.eq, stemmedToken])]
        )
      )
    );

    // create a map of event id to object with id and sum of match values
    const summedMatchValueByEventId = mapValues(
      groupBy(flatten(matches), match => match.event_id),
      (eventTermMatches, key) =>
        eventTermMatches.reduce(
          (current, item) => ({
            ...current,
            value: current.value + item.value
          }),
          { event_id: key, value: 0 }
        )
    );

    // get only event id with summed values > valueMin
    const sortedSummedMatches = filter(summedMatchValueByEventId, ({ value }) => value > valueMin);
    let events = await Promise.all(
      sortedSummedMatches.map(({ event_id }) => db.selectRowById('event', event_id))
    );

    events = await getBasicEvents(events);

    events.forEach((event, i) => {
      event.id = sortedSummedMatches[i].event_id;
      event.value = sortedSummedMatches[i].value;
    });

    events = filterEvents(events, dateRange, bodyIDs);
    events = sortEvents(events, sort, true);
    return events;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getAllBodies() {
  try {
    return db.selectRowsAsArray(
      'body',
      [],
      new OrderCondition(['name', ORDER_OPERATORS.asc])
    );
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
* @param {Object} dateRange The start and end dates to filter events.
* @param {string} dateRange.start
* @param {string} dateRange.end 
* @param {string[]} bodyIDs The list of committee/body ids to filter events.
* @param {Object} sort The sort by and sort order options.
* @param {string} sort.by
* @param {string} sort.order 
* @return {Object[]} A list of events, where each event's date is within
* the date range and the event's body id is in bodyIDs(if it's non-empty). The events
* are sorted according to the sort options.
*/
export async function getFilteredEvents(dateRange, bodyIDs, sort) {
  try {
    const promises = [];
    if (bodyIDs.length) {
      bodyIDs.forEach(id => promises.push(getFilteredEventsHelper(dateRange, id)));
    } else {
      promises.push(getFilteredEventsHelper(dateRange));
    }
    let events = flatten(await Promise.all(promises));
    events = await getBasicEvents(events);
    events = sortEvents(events, sort);
    return events;
  } catch (e) {
    return Promise.reject(e);
  }
}

async function getFilteredEventsHelper(dateRange, bodyID = null) {
  const filters = [];
  if (bodyID) {
    filters.push(new WhereCondition(['body_id', WHERE_OPERATORS.eq, bodyID]));
  }
  if (dateRange.start) {
    const startDate = moment.utc(dateRange.start, 'YYYY-MM-DD')
    const start = firebase.firestore.Timestamp.fromMillis(startDate.valueOf());
    filters.push(new WhereCondition(['event_datetime', WHERE_OPERATORS.gteq, start]));
  }
  if (dateRange.end) {
    const endDate = moment.utc(dateRange.end, 'YYYY-MM-DD').add(1, 'days').subtract(1, 'milliseconds');
    const end = firebase.firestore.Timestamp.fromMillis(endDate.valueOf());
    filters.push(new WhereCondition(['event_datetime', WHERE_OPERATORS.lteq, end]));
  }

  return db.selectRowsAsArray(
    'event',
    filters
  );
}

/**
* @param {Object[]} events The list of events
* @return {Object[]} The formatted list of events with basic information for front-end.
*/
async function getBasicEvents(events) {
  const allBodies = await getAllBodies();
  return events.map(event => {
    const body = allBodies.find(body => body.id === event.body_id);
    return {
      id: event.id,
      body_id: body.id,
      name: body.name,
      description: body.description,
      date: moment
        .utc(event.event_datetime.toMillis())
        .toISOString()
    };
  });
}

/**
* @param {Object[]} events The list of events to filter.
* @param {Object} dateRange The start and end dates to filter events.
* @param {string} dateRange.start 
* @param {string} dateRange.end 
* @param {string[]} bodyIDs The list of committee/body ids to filter events.
* @return {Object[]} A list of events, where each event's date is within
* date range and the event's body id is in bodyIDs(if its non-empty).
*/
function filterEvents(events, dateRange, bodyIDs) {
  return events.filter(event => {
    if (bodyIDs.length && bodyIDs.indexOf(event.body_id) === -1) {
      return false;
    }

    if (dateRange.start && moment.utc(event.date).isBefore(moment.utc(dateRange.start))) {
      return false;
    }

    if (dateRange.end) {
      const endDate = moment.utc(dateRange.end, 'YYYY-MM-DD').add(1, 'days').subtract(1, 'milliseconds');
      if (moment.utc(event.date).isAfter(endDate)) {
        return false;
      }
    }

    return true;
  });
}

/**
* @param {Object[]} events The list of events to sort.
* @param {Object} sortOption The sort by and sort order options.
* @param {string} sortOption.by
* @param {string} sortOption.order 
* @param {boolean} isSearch Whether the list of events is from the search page.
* @return {Object[]} A list of events sorted according to sortOption.
*/
function sortEvents(events, sortOption, isSearch = false) {
  if (sortOption.by && sortOption.order) {
    events = orderBy(events, [sortOption.by], [sortOption.order]);
  } else {
    events = orderBy(events, [isSearch ? 'value' : 'date'], [ORDER_OPERATORS.desc]);
  }

  return events;
}