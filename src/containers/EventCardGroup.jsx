import React from "react";
import mockEvents from "../data/events";
import EventCardGroup from "../components/EventCardGroup";

const EventCardGroupContainer = () => {
  //   TODO: fetch events
  return <EventCardGroup events={mockEvents} />;
};

export default EventCardGroupContainer;
