import React from 'react'
import { Icon, Label, Menu, Table, TableBody } from 'semantic-ui-react'

const Headers = [
    {
        accessor: 'matter',
        text: 'Matter',
    },
    {
        accessor: 'name',
        text: 'Name',
    },
    {
        accessor: 'decision',
        text: 'Decision'
    }
]

const EventVotingPane = ({ votingData }) => {
    console.log('voting data', votingData)
    if(!votingData) {
        return <div>spinner</div>
    }
    return (
    <div style={{width: '100%'}}>
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {Headers.map(headerMetaData => {
                        return <Table.HeaderCell>{headerMetaData.text}</Table.HeaderCell>
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {votingData.map(votingDatum => (
                    <Table.Row>
                        {Headers.map(headerMetaData => {
                            return <Table.HeaderCell>{votingDatum[headerMetaData.accessor]}</Table.HeaderCell>
                        })}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
    )
}

export default EventVotingPane;