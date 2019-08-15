import { getAllResources, getSingleResource } from './baseApi'

export async function getAllEvents() {
    const allData = []
    await getAllResources('event')()
        .then((queryResult) => {
            queryResult.forEach(doc => {
                const thisEvent = {
                    id: doc.id,
                    data: doc.data()
                }
                allData.push(thisEvent);
            })
        })
    return allData
}

export async function getSingleEvent(eventId){
    return getSingleResource('event', eventId)()
}

