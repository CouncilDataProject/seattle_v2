import React, { useEffect, useState } from 'react'
import { getAllPeople } from '../api'
import PeopleCardGroup from '../components/PeopleCardGroup'
import { Loader } from "semantic-ui-react";

const PeopleCardGroupContainer = () => {
    const [people, updatePeople] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const data = await getAllPeople()
            updatePeople(data)
        }
        fetchData()
    },[])

    if(!people) {
        return <Loader active/>
    }
    return (
        <PeopleCardGroup people={people} />
    )
}

export default PeopleCardGroupContainer;