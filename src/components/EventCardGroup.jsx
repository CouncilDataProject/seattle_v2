import React from "react";
import EventCard from "./EventCard";
import { Card } from "semantic-ui-react";

const EventCardGroup = ({ events }) => {
  return (
    <Card.Group>
      {events.map(({ title, date, description, id }) => (
        <EventCard
          title={title}
          date={date}
          description={description}
          link={`/events/${id}`}
        />
      ))}
    </Card.Group>
  );
};

export default EventCardGroup;
