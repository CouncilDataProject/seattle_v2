import React from "react";
import { Input } from "semantic-ui-react";
import styled from "@emotion/styled";
import { getAllEvents, getBasicEventById } from "../api/eventApi";
import EventCardGroup from "../components/EventCardGroup";
import isSubstring from "../utils/isSubstring";

const pagelimit = 10;
const SearchBar = styled(Input)({
  width: "50% !important",
  margin: "1em 0 3em !important"
});

const EventCardGroupContainer = () => {
  const [searchQuery, setSearchQuery] = React.useState();
  const [events, setEvents] = React.useState([]);
  const [visibleEvents, setVisibleEvents] = React.useState([]);

  const handleSearch = (e, { value }) => {
    setSearchQuery(value);
    // filter all events by name and set visible event
    setVisibleEvents(events.filter(({ name }) => isSubstring(name, value)));
  };

  React.useEffect(() => {
    // Fetch events once
    try {
      (async () => {
        const allEvents = await getAllEvents();
        const basicEventData = await Promise.all(
          allEvents.map(({ id }) => getBasicEventById(id))
        );
        setEvents(basicEventData);
        setVisibleEvents(basicEventData.slice(0, pagelimit));
      })();
    } catch (e) {
      // log and display error message
    }
  }, []);
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
