import React, { useEffect, useState } from "react";
import {  getVotesForEvent } from '../api'
import EventVotingPane from "../components/EventVotingPane";

const EventVotingPaneContainer = ({ eventId }) => {
    const [votingData, updateVotingData] = useState(null);
    useEffect(() => {
        async function fetchData() {
           const res = await getVotesForEvent(eventId);
           updateVotingData(res);
        }
        fetchData()
    }, [eventId])
    return <EventVotingPane votingData={votingData} />;
};

export default EventVotingPaneContainer;
