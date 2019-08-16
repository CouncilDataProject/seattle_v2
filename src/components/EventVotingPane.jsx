import React from 'react'
import { Loader } from 'semantic-ui-react'
import VotingTable from './VotingTable'
import styled from "@emotion/styled";

const LoadingContainer = styled('div')({
    minHeight: '100px',
    width: '100%',
})

const EventVotingPane = ({ votingData }) => {
    if(!votingData) {
        return (
            <LoadingContainer>
                <Loader active />
            </LoadingContainer>
        ) 
    }
    if(!votingData.length) {
        return (
            <div>No votes found for this event.</div>
        )
    }
    return (
    <div style={{width: '100%'}}>
       <VotingTable votingData={votingData}/>
    </div>
    )
}

export default EventVotingPane;