import React, { useEffect, useState } from 'react';
import { getAllEvents, getSingleEvent } from './api/'

function App() {
  const [events, updateEvents] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await getAllEvents();
      updateEvents(res);
    }
    fetchData();
  },[])
  useEffect(() => {
    async function fetchData() {
      const [first] = events
      const res = await getSingleEvent(first.id);
      console.log('should be an ID', res);
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
