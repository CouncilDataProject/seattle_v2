import React from "react";
import EventCard from "./EventCard";
import { Card } from "semantic-ui-react";

const EventCardGroup = ({ events }) => {
  return (
    <Card.Group centered>
      {events.map(({ name, date, description, id }) => (
        <EventCard
          key={id}
          name={name}
          date={date}
          description={description}
          link={`/events/${id}`}
        />
      ))}
    </Card.Group>
  );
};

export default EventCardGroup;
