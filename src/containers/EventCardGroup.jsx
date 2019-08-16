import React from "react";
import { Input } from "semantic-ui-react";
import styled from "@emotion/styled";
import { getEventsByIndexedTerm } from "../api/eventApi";
import EventCardGroup from "../components/EventCardGroup";

const SearchBar = styled(Input)({
  width: "50% !important",
  margin: "1em 0 3em !important"
});

const EventCardGroupContainer = ({ query }) => {
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [searchInProgress, setSearchInProgress] = React.useState(false);
  const [visibleEvents, setVisibleEvents] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      if (searchQuery) {
        setSearchInProgress(true);
        const matchedEvents = await getEventsByIndexedTerm(searchQuery);
        // filter all events by name and set visible event
        setVisibleEvents(matchedEvents);
        setSearchInProgress(false);
      }
    })();
  }, []);

  const handleSearch = async (e, { value }) => {
    setSearchQuery(value);
    setSearchInProgress(true);
    const matchedEvents = await getEventsByIndexedTerm(value);
    // filter all events by name and set visible event
    setVisibleEvents(matchedEvents);
    setSearchInProgress(false);
  };

  return (
    <React.Fragment>
      <SearchBar
        placeholder="Search by event name"
        value={searchQuery}
        onChange={handleSearch}
        loading={searchInProgress}
      />
      <EventCardGroup events={visibleEvents} />
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
