import React from "react";
import { Button, Form } from "semantic-ui-react";
import EventCardGroup from "../components/EventCardGroup";
import EventsFilter from "./EventsFilter";
import { getDateText } from "../components/SelectDateRange";
import { getCheckboxText } from "../components/SelectFilterOptions";
import { getSortText } from "../components/SelectSorting";
import { FiltersSection, ResultCount, LoadingText, Results } from "./AllEvents";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFilter, { getSelectedOptions, isSameValue } from "../hooks/useFilter";
import { useHistory } from "react-router-dom";
import { getEventsByIndexedTerm } from "../api";

const EventCardGroupContainer = ({
  query,
  committeeFilterValue,
  start,
  end,
  sortBy,
  sortOrder
}) => {
  const [initialGetEventsComplete, setInitialGetEventsComplete] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [visibleEvents, setVisibleEvents] = React.useState([]);
  const dateRangeFilter = useFilter({ start: start, end: end }, 'Date', '', getDateText);
  const committeeFilter = useFilter(committeeFilterValue, 'Committee', false, getCheckboxText);
  const sortFilter = useFilter({ by: sortBy, order: sortOrder }, 'Sort', '', getSortText);
  useDocumentTitle(`Search - ${searchQuery}`);
  const history = useHistory();

  React.useEffect(() => {
    //to prevent setting react state when the component is unmounted
    let didCancel = false;

    const fetchEventsByIndexedTerm = async () => {
      const events = await getEventsByIndexedTerm(query,
        { start: start, end: end },
        getSelectedOptions(committeeFilterValue),
        { by: sortBy, order: sortOrder });
      if (!didCancel) {
        setVisibleEvents(events);
        setInitialGetEventsComplete(true);
      }
    };

    fetchEventsByIndexedTerm();

    return (() => {
      didCancel = true;
    });
  }, [query, committeeFilterValue, start, end, sortBy, sortOrder]);

  const onSearchQueryChange = (e, { value }) => {
    setSearchQuery(value);
  };

  const prevCommitteeRef = React.useRef();
  const prevDateRangeRef = React.useRef();
  const prevSortRef = React.useRef();
  const prevSearchRef = React.useRef(query);

  const handlePopupClose = () => {
    if (!isSameValue(prevCommitteeRef.current, committeeFilter.value) ||
      !isSameValue(prevDateRangeRef.current, dateRangeFilter.value) ||
      !isSameValue(prevSortRef.current, sortFilter.value) ||
      prevSearchRef.current !== searchQuery) {
      window.scroll(0, 0);
      setInitialGetEventsComplete(false);
      setVisibleEvents([]);
      const ids = getSelectedOptions(committeeFilter.value).join(',');
      const start = dateRangeFilter.value.start;
      const end = dateRangeFilter.value.end;
      const sortBy = sortFilter.value.by;
      const sortOrder = sortFilter.value.order;
      let url = `/search?q=${searchQuery}`;
      url += ids ? `&ids=${ids}` : '';
      url += start ? `&from=${start}` : '';
      url += end ? `&to=${end}` : '';
      url += sortBy ? `&sortBy=${sortBy}` : '';
      url += sortOrder ? `&sortOrder=${sortOrder}` : '';
      prevCommitteeRef.current = committeeFilter.value;
      prevDateRangeRef.current = dateRangeFilter.value;
      prevSortRef.current = sortFilter.value;
      prevSearchRef.current = searchQuery;
      history.replace(url);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePopupClose();
  };

  return (
    <React.Fragment>
      <FiltersSection visible={true}>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='2'>
            <Form.Input
              placeholder='Enter a keyword to search meeting transcripts'
              action={<Button type='submit' primary>Search</Button>}
              value={searchQuery}
              onChange={onSearchQueryChange} />
          </Form.Group>
        </Form>
        <EventsFilter
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={handlePopupClose}
          sortByOptions={[{ label: 'Committee', value: 'name' },
          { label: 'Date', value: 'date' },
          { label: 'Relevance ', value: 'value' }]} />
      </FiltersSection>
      <Results>
        {(!initialGetEventsComplete) ? (
          <LoadingText>Loading...</LoadingText>
        ) : (
            <ResultCount>{visibleEvents.length} results</ResultCount>
          )}
        <EventCardGroup events={visibleEvents} query={searchQuery}/>
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;