import React, { useCallback } from 'react';
import styled from '@emotion/styled';
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
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDataApi from '../hooks/useDataApi';

export const FiltersSection = styled.div({
  position: 'sticky',
  top: '0',
  backgroundColor: 'white',
  zIndex: '1',
  padding: '1em 0 2em',
  '> .ui.button': {
    marginBottom: '0.5em',
    '@media(max-width:500px)': {
      width: '100%',
    },
  },
});

export const ResultCount = styled.span({
  display: 'block',
  color: 'grey',
  marginBottom: '2em',
});

export const Results = styled.div({
  paddingLeft: '1em',
});

const EventCardGroupContainer = ({ query }) => {
  const dateRangeFilter = useFilter(
    'Date',
    { start: '', end: '' },
    '',
    getDateText
  );
  const committeeFilter = useFilter('Committee', {}, false, getCheckboxText);
  const sortFilter = useFilter(
    'Sort',
    { by: 'date', order: 'desc', label: 'Newest first' },
    '',
    getSortingText
  );
  const [apiState, setFunctionArgs] = useDataApi('getEvents', null, null);
  useDocumentTitle('Committee Events');

  const prevCommitteeRef = React.useRef({});
  const prevDateRangeRef = React.useRef({
    start: '',
    end: ''
  });
  const prevSortRef = React.useRef({
    by: 'date',
    order: 'desc',
    label: 'Newest first'
  });

  // memoizedHandlePopupClose is a callback for when one of the FilterPopups in EventsFilterContainer closes.
  // It will perform filtering, depending on whether any of filter state have changed.
  const memoizeHandlePopupClose = useCallback(() => {
    if (
      !committeeFilter.isSameState(prevCommitteeRef.current) ||
      !dateRangeFilter.isSameState(prevDateRangeRef.current) ||
      !sortFilter.isSameState(prevSortRef.current)
    ) {
      window.scroll(0, 0);
      // update args of api function so that custom hook useDataApi will fetch new data
      setFunctionArgs(() => {
        const newFunctionArgs = [
          dateRangeFilter.state,
          getSelectedOptions(committeeFilter.state),
          sortFilter.state,
        ];
        prevCommitteeRef.current = committeeFilter.state;
        prevDateRangeRef.current = dateRangeFilter.state;
        prevSortRef.current = sortFilter.state;
        return newFunctionArgs;
      });
    }
  }, [committeeFilter, dateRangeFilter, sortFilter, setFunctionArgs]);

  return (
    <React.Fragment>
      <FiltersSection>
        <EventsFilterContainer
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={memoizeHandlePopupClose}
          sortOptions={[
            { by: 'date', order: 'desc', label: 'Newest first' },
            { by: 'date', order: 'asc', label: 'Oldest first' },
          ]}
        />
      </FiltersSection>
      <Results>
        <DataApiContainer apiState={apiState}>
          {apiState.data && (
            <ResultCount>{apiState.data.length} results</ResultCount>
          )}
          <EventCardGroup events={apiState.data} />
        </DataApiContainer>
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
