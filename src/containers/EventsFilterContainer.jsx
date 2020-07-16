import React from 'react';
import DataApiContainer from './DataApiContainer';
import EventsFilter from '../components/EventsFilter';
import useDataApi from '../hooks/useDataApi';

const EventsFilterContainer = ({ filters, handlePopupClose, sortOptions }) => {
  const [apiState] = useDataApi('getAllBodies', null, null);

  return (
    <DataApiContainer showLoader={false} apiState={apiState}>
      <EventsFilter
        allBodies={apiState.data}
        filters={filters}
        handlePopupClose={handlePopupClose}
        sortOptions={sortOptions}
      />
    </DataApiContainer>
  );
};

export default EventsFilterContainer;
