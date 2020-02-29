import React from "react";
import { Button, Form } from "semantic-ui-react";
import DataApiContainer from "./DataApiContainer";
import EventCardGroup from "../components/EventCardGroup";
import EventsFilterContainer from "./EventsFilterContainer";
import { getDateText } from "../components/SelectDateRange";
import { getCheckboxText } from "../components/SelectFilterOptions";
import { getSortText } from "../components/SelectSorting";
import { FiltersSection, ResultCount, Results } from "./AllEvents";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFilter, { getSelectedOptions } from "../hooks/useFilter";
import useDataApi from "../hooks/useDataApi";
import { useHistory } from "react-router-dom";

const EventCardGroupContainer = ({
  query,
}) => {
  const [searchQuery, setSearchQuery] = React.useState(query);
  const dateRangeFilter = useFilter({ start: '', end: '' }, 'Date', '', getDateText);
  const committeeFilter = useFilter({}, 'Committee', false, getCheckboxText);
  const sortFilter = useFilter({ by: '', order: '' }, 'Sort', '', getSortText);
  const [apiState, setFunctionArgs] = useDataApi(
    'getEventsByIndexedTerm',
    [query, dateRangeFilter.value, getSelectedOptions(committeeFilter.value), sortFilter.value],
    null
  );
  useDocumentTitle(`Search - ${searchQuery}`);
  const history = useHistory();

  const onSearchQueryChange = (e, { value }) => {
    setSearchQuery(value);
  };

  const prevCommitteeRef = React.useRef();
  const prevDateRangeRef = React.useRef();
  const prevSortRef = React.useRef();
  const prevSearchRef = React.useRef(query);

  // handlePopupClose is a callback for when one of the FilterPopups in EventsFilterContainer closes. 
  // It will perform filtering, depending on whether any of filter values or the searchQuery have changed.
  const handlePopupClose = () => {
    if (!committeeFilter.isSameValue(prevCommitteeRef.current) ||
      !dateRangeFilter.isSameValue(prevDateRangeRef.current) ||
      !sortFilter.isSameValue(prevSortRef.current) ||
      prevSearchRef.current !== searchQuery) {
      window.scroll(0, 0);
      // update args of api function so that custom hook useDataApi will fetch new data
      setFunctionArgs(() => {
        const newFunctionArgs = [
          searchQuery,
          dateRangeFilter.value,
          getSelectedOptions(committeeFilter.value),
          sortFilter.value
        ];
        prevCommitteeRef.current = committeeFilter.value;
        prevDateRangeRef.current = dateRangeFilter.value;
        prevSortRef.current = sortFilter.value;
        prevSearchRef.current = searchQuery;
        return newFunctionArgs;
      });
      history.replace({
        pathname: '/search',
        search: `?q=${searchQuery.trim().replace(/\s+/g, '+')}`
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePopupClose();
  };

  return (
    <React.Fragment>
      <FiltersSection>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='2'>
            <Form.Input
              placeholder='Enter a keyword to search meeting transcripts'
              action={<Button type='submit' primary>Search</Button>}
              value={searchQuery}
              onChange={onSearchQueryChange} />
          </Form.Group>
        </Form>
        <EventsFilterContainer
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={handlePopupClose}
          sortByOptions={[{ label: 'Committee', value: 'name' },
          { label: 'Date', value: 'date' },
          { label: 'Relevance ', value: 'value' }]} />
      </FiltersSection>
      <Results>
        <DataApiContainer apiState={apiState}>
          {apiState.data && <ResultCount>{apiState.data.length} results</ResultCount>}
          <EventCardGroup events={apiState.data} query={prevSearchRef.current} />
        </DataApiContainer>
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;