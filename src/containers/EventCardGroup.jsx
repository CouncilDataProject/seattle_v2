import React from "react";
import { getAllEvents, getEventById, getBasicEventById } from "../api/eventApi";
import EventCardGroup from "../components/EventCardGroup";
const pagelimit = 9;

const EventCardGroupContainer = () => {
  const [visibleEvents, setVisibleEvents] = React.useState([]);

  React.useEffect(() => {
    // Fetch events once
    try {
      (async () => {
        const allEvents = await getAllEvents();
        const basicEventData = await Promise.all(
          allEvents.slice(0, pagelimit).map(({ id }) => getBasicEventById(id))
        );
        setVisibleEvents(basicEventData);
      })();
    } catch (e) {
      // log and display error message
    }
  }, []);
  return <EventCardGroup events={visibleEvents} />;
};

export default EventCardGroupContainer;
