import React from "react";
import styled from "@emotion/styled";
import EventCardGroup from "../components/EventCardGroup";
import EventsFilter from "./EventsFilter";
import { getDateText } from "../components/SelectDateRange";
import { getCheckboxText } from "../components/SelectFilterOptions";
import { getSortText } from "../components/SelectSorting";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFilter, { getSelectedOptions, isSameValue } from "../hooks/useFilter";
import { getAllEvents, getFilteredEvents } from "../api";

export const FiltersSection = styled.div({
  position: "sticky",
  top: "0",
  backgroundColor: "white",
  zIndex: "1",
  padding: "1em 0 2em",
  "> .ui.button": {
    marginBottom: "0.5em",
    "@media(max-width:500px)": {
      width: "100%"
    }
  }
});

export const ResultCount = styled.span({
  display: "block",
  color: "grey",
  marginBottom: "2em"
});

export const LoadingText = styled.span({
  color: "grey",
  fontWeight: "700",
  fontSize: "1.5em",
  marginTop: "1em",
});

export const Results = styled.div({
  paddingLeft: "1em"
});

const EventCardGroupContainer = ({ query }) => {
  const [initialGetEventsComplete, setInitialGetEventsComplete] = React.useState(false);
  const [filterEventsComplete, setFilterEventsComplete] = React.useState(true);
  const [visibleEvents, setVisibleEvents] = React.useState([]);
  const dateRangeFilter = useFilter({ start: '', end: '' }, 'Date', '', getDateText);
  const committeeFilter = useFilter({}, 'Committee', false, getCheckboxText);
  const sortFilter = useFilter({ by: '', order: '' }, 'Sort', '', getSortText);
  useDocumentTitle('Committee Events');

  React.useEffect(() => {
    //to prevent setting react state when the component is unmounted
    let didCancel = false;

    const fetchAllEvents = async () => {
      const allEvents = await getAllEvents();
      if (!didCancel) {
        setVisibleEvents(allEvents);
        setInitialGetEventsComplete(true);
      }
    };

    fetchAllEvents();

    return (() => {
      didCancel = true;
    });
  }, []);

  const prevCommitteeRef = React.useRef();
  const prevDateRangeRef = React.useRef();
  const prevSortRef = React.useRef();

  const handlePopupClose = async () => {
    if (!isSameValue(prevCommitteeRef.current, committeeFilter.value) ||
      !isSameValue(prevDateRangeRef.current, dateRangeFilter.value) ||
      !isSameValue(prevSortRef.current, sortFilter.value)) {
      window.scroll(0, 0);
      setFilterEventsComplete(false);
      setVisibleEvents([]);
      const events = await getFilteredEvents(dateRangeFilter.value,
        getSelectedOptions(committeeFilter.value),
        sortFilter.value);
      setVisibleEvents(events);
      prevCommitteeRef.current = committeeFilter.value;
      prevDateRangeRef.current = dateRangeFilter.value;
      prevSortRef.current = sortFilter.value;
      setFilterEventsComplete(true);
    }
  }

  return (
    <React.Fragment>
      <FiltersSection>
        <EventsFilter
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={handlePopupClose}
          sortByOptions={[{ label: 'Committee', value: 'name' },
          { label: 'Date', value: 'date' }]} />
      </FiltersSection>
      <Results>
        {(!initialGetEventsComplete || !filterEventsComplete) ? (
          <LoadingText>Loading...</LoadingText>
        ) : (
            <ResultCount>{visibleEvents.length} results</ResultCount>
          )}
        <EventCardGroup events={visibleEvents} />
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
