import React from 'react';
import FilterPopup from './FilterPopup';
import SelectDateRange from './SelectDateRange';
import SelectFilterOptions from './SelectFilterOptions';
import SelectSorting from './SelectSorting';

const EventsFilter = ({
  allBodies,
  filters,
  handlePopupClose,
  sortByOptions
}) => {
  const mountNodeRef = React.useRef(); //where the FilterPopup will be mounted
  const [committeeFilter, dateRangeFilter, sortFilter] = filters;
  const [committeeQuery, setCommitteeQuery] = React.useState('');

  const getCommitteeNameOptions = () => {
    return allBodies.map(body => {
      return {
        name: body.id,
        text: body.name
      }
    });
  };

  return (
    <React.Fragment>
      <FilterPopup
        filter={committeeFilter}
        header='Select Committees'
        handlePopupClose={handlePopupClose}
        mountNodeRef={mountNodeRef}>
        <SelectFilterOptions
          filter={committeeFilter}
          options={getCommitteeNameOptions()}
          optionQuery={committeeQuery}
          setOptionQuery={setCommitteeQuery} />
      </FilterPopup>
      <FilterPopup
        filter={dateRangeFilter}
        header='Select Date Range'
        handlePopupClose={handlePopupClose}
        mountNodeRef={mountNodeRef}>
        <SelectDateRange
          filter={dateRangeFilter} />
      </FilterPopup>
      <FilterPopup
        filter={sortFilter}
        header='Select Sorting'
        handlePopupClose={handlePopupClose}
        mountNodeRef={mountNodeRef}>
        <SelectSorting
          filter={sortFilter}
          sortByOptions={sortByOptions} />
      </FilterPopup>
      <div ref={mountNodeRef} />
    </React.Fragment>
  )
};

export default React.memo(EventsFilter);