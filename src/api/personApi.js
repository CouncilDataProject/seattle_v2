import { db, WhereCondition, WHERE_OPERATORS, OrderCondition, ORDER_OPERATORS } from './database';
import { orderBy } from 'lodash';
import moment from 'moment';

/**
 * @return {Object[]} The list of persons sorted by full_name.
 */
export async function getAllPeople() {
  try {
    const allPeople = await db.selectRowsAsArray(
      'person',
      [],
      new OrderCondition(['full_name', ORDER_OPERATORS.asc])
    );
    return allPeople;
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 
 * @param {String} personId The person's id.
 * @return {Object} The voting records and details of the person.
 */
export async function getVotesForPerson(personId) {
  try {
    const formattedVotes = [];
    const person = await db.selectRowById('person', personId);
    const votes = await db.selectRowsAsArray(
      'vote',
      [new WhereCondition(['person_id', WHERE_OPERATORS.eq, personId])],
    );
    const eventMinutesItemsPromises = votes.map(vote => db.selectRowById('event_minutes_item', vote.event_minutes_item_id));
    const eventMinutesItems = await Promise.all(eventMinutesItemsPromises);
    const minutesItemsPromises = eventMinutesItems.map(item => db.selectRowById('minutes_item', item.minutes_item_id));
    const minutesItems = await Promise.all(minutesItemsPromises);
    // commented this out for now, but we could link to the file if we get this data
    // const allMinuteFiles = await getAllResources('minutes_item_file')
    const eventsPromises = eventMinutesItems.map(item => db.selectRowById('event', item.event_id));
    const events = await Promise.all(eventsPromises);
    const allBodies = await db.selectRowsAsArray('body');

    votes.forEach((voteData, i) => {
      const eventMinuteItem = eventMinutesItems[i];
      const minuteItem = minutesItems[i];
      const event = events[i];
      const body = allBodies.find(item => item.id === event.body_id);
      // const file = allMinuteFiles.find(item => item.minutes_item_id === minuteItem.id)
      const formattedVote = {
        id: voteData.id,
        matter: minuteItem.matter,
        name: minuteItem.name,
        // what this person voted
        voteForPerson: voteData.decision,
        // what the council decided
        decision: eventMinuteItem.decision,
        eventId: eventMinuteItem.event_id,
        index: eventMinuteItem.index,
        eventDate: moment.utc(event.event_datetime.toMillis()).toISOString(),
        body_name: body.name
        // file
      }
      formattedVotes.push(formattedVote)
    });
    const sortedVotes = orderBy(formattedVotes, ['eventDate', 'index'], ['desc', 'desc']);
    return { ...person, votes: sortedVotes };
  } catch (e) {
    return Promise.reject(e);
  }
}
