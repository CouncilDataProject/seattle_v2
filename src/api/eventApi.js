import * as firebase from "firebase";
import { getAllResources, getSingleResource } from './baseApi'
const storage = firebase.storage();


function fetchJson(uri){
    return fetch(uri)
        .then(res => res.json())
        .then(json => JSON.stringify(json));
}

export async function getAllEvents() {
    return getAllResources('event')
}

export async function getSingleEvent(eventId){
    const [firstTranscript] = await getSingleResource('transcript', 'event_id', eventId)
    console.log('transcript', firstTranscript);
    // some reason the query below not working
    //const secondQuery = await getSingleResource('file', 'id', transcript.file_id)

    // inefficient yet working
    const allFiles = await getAllResources('file');
    const thisFile = allFiles.find(el => el.id === firstTranscript.file_id);

    // https://firebase.google.com/docs/storage/web/download-files
    var gsReference = storage.refFromURL(thisFile.uri);
    // hitting a cors error here.
    const transcript = await gsReference.getDownloadURL()
        .then(url => fetchJson(url))
    return transcript
}

