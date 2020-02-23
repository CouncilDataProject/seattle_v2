import React from "react";
import styled from "@emotion/styled";
import DataApiContainer from "./DataApiContainer";
import EventCardGroup from "../components/EventCardGroup";
import EventsFilterContainer from "./EventsFilterContainer";
import { getDateText } from "../components/SelectDateRange";
import { getCheckboxText } from "../components/SelectFilterOptions";
import { getSortText } from "../components/SelectSorting";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useFilter, { getSelectedOptions } from "../hooks/useFilter";
import useDataApi from "../hooks/useDataApi";

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

export const Results = styled.div({
  paddingLeft: "1em"
});

const EventCardGroupContainer = ({ query }) => {
  const dateRangeFilter = useFilter({ start: '', end: '' }, 'Date', '', getDateText);
  const committeeFilter = useFilter({}, 'Committee', false, getCheckboxText);
  const sortFilter = useFilter({ by: '', order: '' }, 'Sort', '', getSortText);
  const [apiState, setFunctionArgs] = useDataApi('getEvents', null, null);
  useDocumentTitle('Committee Events');

  const prevCommitteeRef = React.useRef();
  const prevDateRangeRef = React.useRef();
  const prevSortRef = React.useRef();

  // handlePopupClose is a callback for when one of the FilterPopups in EventsFilterContainer closes. 
  // It will perform filtering, depending on whether any of filter values have changed.
  const handlePopupClose = async () => {
    if (!committeeFilter.isSameValue(prevCommitteeRef.current) ||
      !dateRangeFilter.isSameValue(prevDateRangeRef.current) ||
      !sortFilter.isSameValue(prevSortRef.current)) {
      window.scroll(0, 0);
      // update args of api function so that custom hook useDataApi will fetch new data
      setFunctionArgs(() => {
        const newFunctionArgs = [
          dateRangeFilter.value,
          getSelectedOptions(committeeFilter.value),
          sortFilter.value
        ]
        prevCommitteeRef.current = committeeFilter.value;
        prevDateRangeRef.current = dateRangeFilter.value;
        prevSortRef.current = sortFilter.value;
        return newFunctionArgs;
      });
    }
  }

  return (
    <React.Fragment>
      <FiltersSection>
        <EventsFilterContainer
          filters={[committeeFilter, dateRangeFilter, sortFilter]}
          handlePopupClose={handlePopupClose}
          sortByOptions={[{ label: 'Committee', value: 'name' },
          { label: 'Date', value: 'date' }]} />
      </FiltersSection>
      <Results>
        <DataApiContainer apiState={apiState}>
          {apiState.data && <ResultCount>{apiState.data.length} results</ResultCount>}
          <EventCardGroup events={apiState.data} />
        </DataApiContainer>
      </Results>
    </React.Fragment>
  );
};

export default EventCardGroupContainer;
