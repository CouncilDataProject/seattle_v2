import React from 'react';
import VotingTable from './VotingTable'
import { Card } from 'semantic-ui-react'
import styled from "@emotion/styled";

const FlexContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
})

const Person = ({personHistory: {full_name, email, phone, website, votes}}) => {
    return (
    <FlexContainer>
        <Card style={{padding: '1rem', width: '100%'}}>
            <Card.Header>{full_name}</Card.Header>
            <a href={`mailto:${email}`}>{email}</a>
            <div>{phone}</div>
            <div>
                Website:  
                <a  target={'_blank'}
                    rel="noopener noreferrer"
                    href={website}>{website}</a>
            </div>
        </Card>
        <VotingTable votingData={votes} isPerson={true} />
    </FlexContainer>
    )
}

export default Person;