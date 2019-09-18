import { getAllResources, getSingleResource, getResourceById } from './baseApi';
import { orderBy } from 'lodash';
import moment from 'moment';

export async function getAllPeople(){
    const allPeople = await getAllResources('person')
    return allPeople
}

/**
 * @param {object} personData takes data from person query, all it needs is {id: id}
 * @returns {object} that has the person information and an array of votes with the following data:
 * { id, matter, name, voteForPerson, decision, eventId, index, eventDate, body_name }
 */

export async function getVotesForPerson(personId){
    const formattedVotes = [];
    const person = await getResourceById('person',personId);
    const votes = await getSingleResource('vote', 'person_id', personId);
    const allEventMinutesItems = await getAllResources('event_minutes_item');
    const allMinuteItems = await getAllResources('minutes_item');
    // commented this out for now, but we could link to the file if we get this data
    // const allMinuteFiles = await getAllResources('minutes_item_file')
    const allEvents = await getAllResources('event');
    const allBodies = await getAllResources('body');
    
    votes.forEach((voteData) => {
        const eventMinuteItem = allEventMinutesItems.find(item => item.id === voteData.event_minutes_item_id);
        const minuteItem = allMinuteItems.find(item => item.id === eventMinuteItem.minutes_item_id);
        const event = allEvents.find(item => item.id === eventMinuteItem.event_id);
        const body = allBodies.find(item => item.id === event.body_id);
        // const file = allMinuteFiles.find(item => item.minutes_item_id === minuteItem.id)
        const formattedVote = {
            id: voteData.id,
            matter: minuteItem.matter,
            name: minuteItem.name,
            // what this person voted
            voteForPerson: voteData.decision,
            // what the coucile decided
            decision: eventMinuteItem.decision,
            eventId: eventMinuteItem.event_id,
            index: eventMinuteItem.index,
            eventDate: moment.utc(event.event_datetime.toDate()).format('MM-DD-YYYY HH:mm:ss'),
            body_name: body.name
            // file
        }
       formattedVotes.push(formattedVote)
    });

    return {...person, votes: orderBy(formattedVotes, ['eventDate', 'index'], ['desc', 'desc'])};
}