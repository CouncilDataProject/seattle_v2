import React from "react";
import { Select } from "semantic-ui-react";
import moment from "moment";
import styled from "@emotion/styled";
import { db } from "../api/database";
import { getBasicEventById } from "../api/eventApi";
import EventCardGroup from "../components/EventCardGroup";

const FiltersSection = styled.div({
  margin: "1em 0 3em !important"
});

const ResultCount = styled.span({
  display: "block",
  color: "grey",
  paddingLeft: "15px",
  paddingTop: "8px"
});

const LoadingText = styled.span({
  color: "grey",
  fontWeight: "700",
  fontSize: "18px"
});

const Results = styled.div({
  paddingLeft: "15px"
});

const DateFilter = styled(Select)({});

const EventCardGroupContainer = ({ query }) => {
  const [allEvents, setAllEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [visibleEvents, setVisibleEvents] = React.useState([]);

  const handleDateFilter = (e, { value }) => {
    if (value === "all") {
      setVisibleEvents(allEvents);
    } else {
      const comparisonDate = moment().subtract(value, "months");
      const isAfter = date => moment(date).isAfter(comparisonDate);
      setVisibleEvents(allEvents.filter(({ date }) => isAfter(date)));
    }
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      const allEvents = await db.selectRowsAsArray("event");
      const basicEventData = await Promise.all(
        allEvents.map(({ id }) => getBasicEventById(id))
      );
      setAllEvents(basicEventData);
      setVisibleEvents(basicEventData);
      setIsLoading(false);
    })();
  }, []);

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
      <FiltersSection>
        <DateFilter
          placeholder="Filter by date range"
          options={filterOptions}
          onChange={handleDateFilter}
        />
        <ResultCount>{visibleEvents.length} results</ResultCount>
      </FiltersSection>
      <Results>
        {isLoading ? (
          <LoadingText>Loading...</LoadingText>
        ) : (
          <EventCardGroup events={visibleEvents} />
        )}
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
