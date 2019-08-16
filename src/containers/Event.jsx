import React from "react";
import { getEventById } from "../api/eventApi";
import { Loader } from "semantic-ui-react";
import Event from "../components/Event";

const EventContainer = ({ id }) => {
  const [event, setEvent] = React.useState();

  React.useEffect(() => {
    try {
      (async () => {
        const eventData = await getEventById(id);
        setEvent(eventData);
      })();
    } catch (e) {
      // log error and display message
    }
  }, []);

  return event ? (
    <Event
      id={id}
      title={event.name}
      date={event.date}
      description={event.description}
      scPageUrl={event.scPageUrl}
      videoUrl={event.videoUrl}
      minutes={event.minutes}
      transcript={event.transcript}
    />
  ) : <Loader active/>;
};

export default EventContainer;
