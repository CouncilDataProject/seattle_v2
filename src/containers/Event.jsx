import React from "react";
import DataApiContainer from "./DataApiContainer";
import Event from "../components/Event";
import useDataApi from "../hooks/useDataApi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import getDateTime from "../utils/getDateTime";

const EventContainer = ({ id, query, videoTimePoint }) => {
  const [apiState] = useDataApi("getEventById", [id], null);
  useDocumentTitle(
    apiState.data ? `${apiState.data.name} - ${getDateTime(apiState.data.date)}` : "Loading..."
  );
  return (
    <DataApiContainer apiState={apiState}>
      <Event
        id={id}
        eventData={apiState.data}
        query={query}
        videoTimePoint={videoTimePoint}
      />
    </DataApiContainer>
  );
};

export default EventContainer;
