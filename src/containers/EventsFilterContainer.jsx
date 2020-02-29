import React from 'react';
import DataApiContainer from './DataApiContainer';
import EventsFilter from '../components/EventsFilter';
import useDataApi from '../hooks/useDataApi';

const EventsFilterContainer = ({
  filters,
  handlePopupClose,
  sortByOptions
}) => {
  const [apiState] = useDataApi('getAllBodies', null, null);

  return (
    <DataApiContainer showLoader={false} apiState={apiState}>
      <EventsFilter
        allBodies={apiState.data}
        filters={filters}
        handlePopupClose={handlePopupClose}
        sortByOptions={sortByOptions}
      />
    </DataApiContainer>
  );
};

export default EventsFilterContainer;
