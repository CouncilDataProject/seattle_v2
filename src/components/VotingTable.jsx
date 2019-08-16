import React from 'react'
import { Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from "@emotion/styled";

const Headers = [
    {
        accessor: 'matter',
        text: 'Matter',
        width: '2'
    },
    {
        accessor: 'decision',
        text: 'Decision',
        width: '2',
    },
    {
        accessor: 'name',
        text: 'Name',
        width: '6'
    },
    {
        accessor: 'votingRecords',
        text: 'Vote',
        width: '4'
    }
]

const MiniTable = styled('div')({
    display: 'flex'
})

const MiniTableCell = styled('div')({
    width: '50%'
})


const VotingTable = ({ votingData, isPerson }) => (
    <Table striped>
        <Table.Header>
            <Table.Row>
                {Headers.map(headerMetaData => (<Table.HeaderCell 
                    key={headerMetaData.text}
                    width={headerMetaData.width}>{headerMetaData.text}
                    </Table.HeaderCell>
                ))}
                {/* If we are rendering votes for a person, we want to link to the event */}
                {isPerson && <Table.HeaderCell>Event</Table.HeaderCell>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {votingData.map(votingDatum => (
                <Table.Row>
                    {Headers.map(headerMetaData => {
                        if(headerMetaData.accessor !== 'votingRecords') {
                            return (
                                <Table.Cell key={headerMetaData.accessor}>
                                    {votingDatum[headerMetaData.accessor]}
                                </Table.Cell>
                            )
                        }
                        if (votingDatum.formattedIndividualVotes) {
                            return (
                                <Table.Cell>
                                    {votingDatum.formattedIndividualVotes.map(record => {
                                        return (
                                        <MiniTable key={record.full_name}>
                                            <MiniTableCell>{record.full_name}</MiniTableCell>
                                            <MiniTableCell>
                                                {record.decision}
                                            </MiniTableCell>
                                        </MiniTable>
                                        )
                                    })}
                                </Table.Cell>
                            )
                        } else {
                            return (
                            <React.Fragment>
                                <Table.Cell>
                                    {votingDatum.voteForPerson}
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={`/events/${votingDatum.eventId}`}>
                                        <Icon name="linkify"/>
                                    </Link>
                                </Table.Cell>
                            </React.Fragment>  
                            )
                        }
                    })}
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
)

export default VotingTable