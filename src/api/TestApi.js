import React, { useEffect, useState } from 'react';
import {
    getAllEvents,
    // getSingleEvent,
    getVotesForEvent,
} from './'

export function TestApi() {
  const [events, updateEvents] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await getAllEvents()
      updateEvents(res)
    //   const people = await getAllPeople()
    //   console.log('people', people)
    //   const [firstPerson] = people
    //   const votesForPerson = await getVotesForPerson(firstPerson)
    //   console.log('votesForPerson', votesForPerson);
    const allVotesForFirstEvent = await getVotesForEvent(res[7].id)
    console.log('should be all votes for event', allVotesForFirstEvent);
    }
    fetchData();
  },[])
  console.log('events', events)
  return (
    <div>
    </div>
  );
}
