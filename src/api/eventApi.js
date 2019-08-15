import * as firebase from "firebase";
import { getAllResources, getSingleResource } from './baseApi'
import { fetchJson } from './utils'
const storage = firebase.storage();

export async function getAllEvents() {
    return getAllResources('event')
}

/**
 * @param {object} takes a single record from getAll, just needs {id: id}
 * @returns {object} returns the same object with the transcript attached
 */

export async function getSingleEvent(eventData){
    const [firstTranscript] = await getSingleResource('transcript', 'event_id', eventData.id)
    // some reason the query below not working
    //const secondQuery = await getSingleResource('file', 'id', transcript.file_id)

    // inefficient yet working
    const allFiles = await getAllResources('file');
    const thisFile = allFiles.find(el => el.id === firstTranscript.file_id)
    
    // https://firebase.google.com/docs/storage/web/download-files
    var gsReference = storage.refFromURL(thisFile.uri);
    const transcript = await gsReference.getDownloadURL()
        .then(url => fetchJson(url))
    if (transcript && transcript.data) {
        return {
            ...eventData,
            transcript: transcript.data
        }
    }
    // something went wrong
    return null
}


export async function getVotesForEvent(eventId){
    // get all minute items for a single event
    const extractedMinutes = await getSingleResource('event_minutes_item', 'event_id', eventId)
    // filter out minute items that are not votes
    const minuteItemsWithDecisions = extractedMinutes.filter(minute => minute.decision !== null)
    
    // instead of getting all minutes items, we could create an array of promises as below
    const allMinuteItems = await getAllResources('minutes_item')
    const formattedItems = []
    minuteItemsWithDecisions.forEach(item => {
        const thisMinuteItem = allMinuteItems.find(minuteItem => minuteItem.id === item.minutes_item_id)
        formattedItems.push({
            matter: thisMinuteItem.matter,
            name: thisMinuteItem.name,
            id: item.id,
            decision: item.decision
        })
    })

    const allPeople = await getAllResources('person')   
    const promises = []
    formattedItems.forEach(item => {
        const getVotesForMinuteItem = getSingleResource('vote', 'event_minutes_item_id', item.id)
        promises.push(getVotesForMinuteItem)
    })
    await Promise.all(promises)
        .then(res => {
            res.forEach(votesForMinuteItem => {
                const thisEventMinutesItemId = votesForMinuteItem[0].event_minutes_item_id               
                const formattedMinutesItem = formattedItems.find(item => item.id === thisEventMinutesItemId)
                const votesByPerson = []
                votesForMinuteItem.forEach(unformattedVote => {
                    const person = allPeople.find(person => person.id === unformattedVote.person_id)
                    votesByPerson.push({
                        decision: unformattedVote.decision,
                        person_id: unformattedVote.person_id,
                        full_name: person.full_name
                    })
                })
                formattedMinutesItem.formattedIndividualVotes = votesByPerson
            })
        })
    return formattedItems
}
