import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { getVotesForPerson } from '../api';
import Person from '../components/Person';
import { Loader } from "semantic-ui-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

const PersonContainer = ({ match: { params: { id }} }) => {
    const [personHistory, updatePersonHistory] = useState(null);
    useDocumentTitle(personHistory ? personHistory.full_name : 'Loading...');
    useEffect(() => {
        async function fetchData() {
            const votes = await getVotesForPerson(id);
            updatePersonHistory(votes);
        }
        fetchData()
    }, [id])
    if(!personHistory) {
        return <Loader active/>
    }
    return (
        <Person personHistory={personHistory}/>
    )
}

export default withRouter(PersonContainer);