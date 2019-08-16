import React from "react";
import { Input } from "semantic-ui-react";
import styled from "@emotion/styled";
import {
  getAllEvents,
  getBasicEventById,
  getEventsByIndexedTerm
} from "../api/eventApi";
import EventCardGroup from "../components/EventCardGroup";

const SearchBar = styled(Input)({
  width: "50% !important",
  margin: "1em 0 3em !important"
});

const EventCardGroupContainer = ({ query }) => {
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [visibleEvents, setVisibleEvents] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      if (searchQuery) {
        const matchedEvents = await getEventsByIndexedTerm(searchQuery);
        // filter all events by name and set visible event
        setVisibleEvents(matchedEvents);
      }
    })();
  }, []);

  const handleSearch = async (e, { value }) => {
    setSearchQuery(value);
    const matchedEvents = await getEventsByIndexedTerm(value);
    // filter all events by name and set visible event
    setVisibleEvents(matchedEvents);
  };

  return (
    <React.Fragment>
      <SearchBar
        placeholder="Search by event name"
        value={searchQuery}
        onChange={handleSearch}
      />
      <EventCardGroup events={visibleEvents} />
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
