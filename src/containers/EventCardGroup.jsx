import React, { useCallback } from 'react';
import { Button, Form } from 'semantic-ui-react';
import {
  getCheckboxText,
  getDateText,
  getSelectedOptions,
  getSortingText,
  useFilter,
} from '@councildataproject/cdp-instance';
import DataApiContainer from './DataApiContainer';
import EventCardGroup from '../components/EventCardGroup';
import EventsFilterContainer from './EventsFilterContainer';
import { FiltersSection, Results } from './AllEvents';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDataApi from '../hooks/useDataApi';
import { useHistory } from 'react-router-dom';

const EventCardGroupContainer = ({ query }) => {
  const [searchQuery, setSearchQuery] = React.useState(query);
  const dateRangeFilter = useFilter(
    'Date',
    { start: '', end: '' },
    '',
    getDateText
  );
  const committeeFilter = useFilter('Committee', {}, false, getCheckboxText);
  const sortFilter = useFilter(
    'Sort',
    { by: 'value', order: 'desc', label: 'Most relevant' },
    '',
    getSortingText
  );
  const [apiState, setFunctionArgs] = useDataApi(
    'getEventsByIndexedTerm',
    [
      query,
      dateRangeFilter.state,
      getSelectedOptions(committeeFilter.state),
      sortFilter.state,
    ],
    null
  );
  useDocumentTitle(`Search - ${searchQuery}`);
  const history = useHistory();

  const onSearchQueryChange = (e, { value }) => {
    setSearchQuery(value);
  };

  const prevCommitteeRef = React.useRef({});
  const prevDateRangeRef = React.useRef({
    start: '',
    end: ''
  });
  const prevSortRef = React.useRef({
    by: 'value',
    order: 'desc',
    label: 'Most relevant'
  });
  const prevSearchRef = React.useRef(query);

  // memoizedHandlePopupClose is a callback for when one of the FilterPopups in EventsFilterContainer closes.
  // It will perform filtering, depending on whether any of filter state or the searchQuery have changed.
  const memoizedHandlePopupClose = useCallback(() => {
    if (
      !committeeFilter.isSameState(prevCommitteeRef.current) ||
      !dateRangeFilter.isSameState(prevDateRangeRef.current) ||
      !sortFilter.isSameState(prevSortRef.current) ||
      prevSearchRef.current !== searchQuery
    ) {
      window.scroll(0, 0);
      // update args of api function so that custom hook useDataApi will fetch new data
      setFunctionArgs(() => {
        const newFunctionArgs = [
          searchQuery,
          dateRangeFilter.state,
          getSelectedOptions(committeeFilter.state),
          sortFilter.state,
        ];
        prevCommitteeRef.current = committeeFilter.state;
        prevDateRangeRef.current = dateRangeFilter.state;
        prevSortRef.current = sortFilter.state;
        prevSearchRef.current = searchQuery;
        return newFunctionArgs;
      });
      history.replace({
        pathname: '/search',
        search: `?q=${searchQuery.trim().replace(/\s+/g, '+')}`,
      });
    }
  }, [
    searchQuery,
    committeeFilter,
    dateRangeFilter,
    sortFilter,
    setFunctionArgs,
    history,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    memoizedHandlePopupClose();
  };

  return (
    <React.Fragment>
      <FiltersSection>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths='2'>
            <Form.Input
              placeholder='Enter a keyword to search meeting transcripts'
              action={
                <Button type='submit' primary>
                  Search
                </Button>
              }
              value={searchQuery}
              onChange={onSearchQueryChange}
            />
          </Form.Group>
        </Form>
        <EventsFilterContainer
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={memoizedHandlePopupClose}
          sortOptions={[
            { by: 'value', order: 'desc', label: 'Most relevant' },
            { by: 'date', order: 'desc', label: 'Newest first' },
            { by: 'date', order: 'asc', label: 'Oldest first' },
          ]}
        />
      </FiltersSection>
      <Results>
        <DataApiContainer apiState={apiState}>
          <EventCardGroup
            events={apiState.data}
            query={prevSearchRef.current}
          />
        </DataApiContainer>
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
