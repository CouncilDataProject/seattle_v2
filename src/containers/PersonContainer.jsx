import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { getVotesForPerson } from '../api';
import Person from '../components/Person';
import { Loader } from "semantic-ui-react";


const PersonContainer = ({ match: { params: { id }} }) => {
    const [personHistory, updatePersonHistory] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const votes = await getVotesForPerson(id);
            updatePersonHistory(votes);
        }
        fetchData()
    }, [id])
    console.log('personHistory', personHistory)
    if(!personHistory) {
        return <Loader />
    }
    return (
        <Person personHistory={personHistory}/>
    )
}

export default withRouter(PersonContainer);