import React from "react";
import mockEvent from "../data/event";
import Event from "../components/Event";

const EventContainer = () => {
  //   TODO: fetch event details

  const {
    title,
    date,
    description,
    scPageUrl,
    videoUrl,
    transcript
  } = mockEvent;

  return (
    <Event
      title={title}
      date={date}
      description={description}
      scPageUrl={scPageUrl}
      videoUrl={videoUrl}
      transcript={transcript}
    />
  );
};

export default EventContainer;
