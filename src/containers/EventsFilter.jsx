import React from 'react';
import FilterPopup from '../components/FilterPopup';
import SelectDateRange from '../components/SelectDateRange';
import SelectFilterOptions from '../components/SelectFilterOptions';
import SelectSorting from '../components/SelectSorting';
import { getAllBodies } from '../api';

const EventsFilter = ({
  filters,
  handlePopupClose,
  sortByOptions
}) => {
  const mountNodeRef = React.useRef();
  const [allBodies, setAllBodies] = React.useState([]);
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

  React.useEffect(() => {
    //to prevent setting react state when the component is unmounted
    let didCancel = false;

    const fetchAllBodies = async () => {
      const allBodies = await getAllBodies();
      if (!didCancel) {
        setAllBodies(allBodies);
      }
    };

    fetchAllBodies();

    return (() => {
      didCancel = true;
    })
  }, []);

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