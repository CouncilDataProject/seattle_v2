import firebase from "firebase/app";
import "firebase/storage";
import moment from "moment";
import natural from "natural";
import { flatten, sortBy, reverse, groupBy, mapValues, filter } from "lodash";
import { db, WhereCondition, WHERE_OPERATORS, OrderCondition, ORDER_OPERATORS } from "./database";
import { fetchJson } from "./utils";

const storage = firebase.storage();

export async function getAllEvents() {
  return await db.selectRowsAsArray("event", [], new OrderCondition(["event_datetime", ORDER_OPERATORS.desc]));
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

export async function getBasicEventById(id) {
  try {
    const event = await db.selectRowById("event", id);
    const body = await getEventBody(event.body_id);

    return {
      id,
      name: body.name,
      description: body.description,
      date: moment
        .utc(event.event_datetime.toMillis())
        .toISOString()
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getEventsByIndexedTerm(term) {
  const valueMin = 0;
  try {
    natural.PorterStemmer.attach();

    const stemmedTokens = term.tokenizeAndStem();

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

    // reverse to get highest value first
    const sortedSummedMatches = reverse(
      sortBy(
        filter(summedMatchValueByEventId, ({ value }) => value >= valueMin),
        ({ value }) => value
      )
    );

    // fetch events in order of value and return
    const events = await Promise.all(
      sortedSummedMatches.map(({ event_id }) => getBasicEventById(event_id))
    );

    return events;
  } catch (e) {
    return Promise.reject(e);
  }
}
