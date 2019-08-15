import React, { useEffect, useState } from 'react';
import { getAllEvents, getSingleEvent, getAllPeople, getVotesForPerson } from './api/'

function App() {
  const [events, updateEvents] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await getAllEvents()
      updateEvents(res)
      const people = await getAllPeople()
      console.log('people', people)
      const [firstPerson] = people
      const votesForPerson = await getVotesForPerson(firstPerson)
      console.log('votesForPerson', votesForPerson);
    }
    fetchData();
  },[])
  useEffect(() => {
    async function fetchData() {
      const [first] = events
      const res = await getSingleEvent(first);
      console.log('should be an event data with transcript', res);
    }
    if(events) {
      fetchData()
    }
  }, [events])
  console.log('events', events)
  return (
    <div>
    </div>
  );
}

export default App;
