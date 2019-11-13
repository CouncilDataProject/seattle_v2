import React from "react";
import { Input, Select } from "semantic-ui-react";
import moment from "moment";
import styled from "@emotion/styled";
import { getEventsByIndexedTerm } from "../api";
import EventCardGroup from "../components/EventCardGroup";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SearchSection = styled.div({
  margin: "1em 0 3em !important"
});
const SearchBar = styled(Input)({
  width: "50% !important",
  marginBottom: "1em"
});

const SearchResultCount = styled.span({
  display: "block",
  color: "grey",
  paddingLeft: "15px"
});

const SearchResults = styled.div({
  paddingLeft: "15px"
});

const DateFilter = styled(Select)({
  marginLeft: "15px !important"
});

const EventCardGroupContainer = ({ query }) => {
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [searchInProgress, setSearchInProgress] = React.useState(false);
  const [allEvents, setAllEvents] = React.useState([]);
  const [visibleEvents, setVisibleEvents] = React.useState([]);
  useDocumentTitle(`${searchQuery} - Search`);

  const handleDateFilter = (e, { value }) => {
    if (value === "all") {
      setVisibleEvents(allEvents);
    } else {
      const comparisonDate = moment.utc().subtract(value, "months");
      const isAfter = date => moment.utc(date).isAfter(comparisonDate);
      setVisibleEvents(allEvents.filter(({ date }) => isAfter(date)));
    }
  };

  React.useEffect(() => {
    (async () => {
      if (searchQuery) {
        setSearchInProgress(true);
        const matchedEvents = await getEventsByIndexedTerm(searchQuery);
        // filter all events by name and set visible event
        setAllEvents(matchedEvents);
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
    setAllEvents(matchedEvents);
    setVisibleEvents(matchedEvents);
    setSearchInProgress(false);
  };

  const filterOptions = [
    { key: "-1", value: "all", text: "All" },
    { key: "0.25", value: "0.25", text: "Past week" },
    { key: "1", value: "1", text: "Past month" },
    { key: "3", value: "3", text: "Past 3 months" },
    { key: "6", value: "6", text: "Past 6 months" },
    { key: "12", value: "12", text: "Past year" }
  ];

  return (
    <React.Fragment>
      <SearchSection>
        <SearchBar
          placeholder="Search by event name"
          value={searchQuery}
          onChange={handleSearch}
          loading={searchInProgress}
        />
        <DateFilter
          placeholder="Filter by date range"
          options={filterOptions}
          onChange={handleDateFilter}
        />
        {searchQuery !== "" && (
          <SearchResultCount>{visibleEvents.length} results</SearchResultCount>
        )}
      </SearchSection>
      <SearchResults>
        <EventCardGroup events={visibleEvents} />
      </SearchResults>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
