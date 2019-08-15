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

