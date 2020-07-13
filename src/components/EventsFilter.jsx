import React from 'react';

import {
  FilterPopup,
  SelectDateRange,
  SelectSorting,
  SelectTextFilterOptions,
} from '@councildataproject/cdp-instance';

const EventsFilter = ({
  allBodies,
  filters,
  handlePopupClose,
  sortOptions,
}) => {
  const [committeeFilter, dateRangeFilter, sortFilter] = filters;
  const [committeeQuery, setCommitteeQuery] = React.useState('');

  const getCommitteeNameOptions = () => {
    return allBodies.map((body) => {
      return {
        name: body.id,
        label: body.name,
        disabled: false,
      };
    });
  };

  const handleSortingPopupClose = () => {
    sortFilter.setPopupIsOpen(false);
    handlePopupClose();
  };

  return (
    <React.Fragment>
      <FilterPopup
        clear={committeeFilter.clear}
        getTextRep={committeeFilter.getTextRep}
        isActive={committeeFilter.isActive}
        header='Select Committees'
        popupIsOpen={committeeFilter.popupIsOpen}
        setPopupIsOpen={committeeFilter.setPopupIsOpen}
        handlePopupClose={handlePopupClose}
        closeOnChange={false}
      >
        <SelectTextFilterOptions
          name={committeeFilter.name}
          state={committeeFilter.state}
          update={committeeFilter.update}
          options={getCommitteeNameOptions()}
          optionQuery={committeeQuery}
          setOptionQuery={setCommitteeQuery}
        />
      </FilterPopup>
      <FilterPopup
        clear={dateRangeFilter.clear}
        getTextRep={dateRangeFilter.getTextRep}
        isActive={dateRangeFilter.isActive}
        header='Select Date Range'
        popupIsOpen={dateRangeFilter.popupIsOpen}
        setPopupIsOpen={dateRangeFilter.setPopupIsOpen}
        handlePopupClose={handlePopupClose}
        closeOnChange={false}
      >
        <SelectDateRange
          state={dateRangeFilter.state}
          update={dateRangeFilter.update}
        />
      </FilterPopup>
      <FilterPopup
        clear={sortFilter.clear}
        getTextRep={sortFilter.getTextRep}
        isActive={sortFilter.isActive}
        header='Sort Results By'
        popupIsOpen={sortFilter.popupIsOpen}
        setPopupIsOpen={sortFilter.setPopupIsOpen}
        handlePopupClose={handlePopupClose}
        closeOnChange={true}
      >
        <SelectSorting
          sortOptions={sortOptions}
          state={sortFilter.state}
          update={sortFilter.update}
          onPopupClose={handleSortingPopupClose}
        />
      </FilterPopup>
    </React.Fragment>
  );
};

export default React.memo(EventsFilter);
