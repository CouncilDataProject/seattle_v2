import React from 'react'
import { Table, Loader } from 'semantic-ui-react'
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
        text: 'Votes',
        width: '4'
    }
]

const LoadingContainer = styled('div')({
    minHeight: '100px',
    width: '100%',
})

const MiniTable = styled('div')({
    display: 'flex'
})

const MiniTableCell = styled('div')({
    width: '50%'
})

const TableData = ({votingData}) => (
<Table striped>
    <Table.Header>
        <Table.Row>
            {Headers.map(headerMetaData => (<Table.HeaderCell 
                width={headerMetaData.width}>{headerMetaData.text}
                </Table.HeaderCell>
            ))}
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {votingData.map(votingDatum => (
            <Table.Row>
                {Headers.map(headerMetaData => {
                    if(headerMetaData.accessor !== 'votingRecords') {
                        return <Table.Cell>{votingDatum[headerMetaData.accessor]}</Table.Cell>
                    }
                    return (
                        <Table.Cell>
                            {votingDatum.formattedIndividualVotes.map(record => {
                                return (
                                <MiniTable>
                                    <MiniTableCell>{record.full_name}</MiniTableCell>
                                    <MiniTableCell>{record.decision}</MiniTableCell>
                                </MiniTable>
                                )
                            })}
                        </Table.Cell>
                    )
                })}
            </Table.Row>
        ))}
    </Table.Body>
</Table>
)

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
       <TableData votingData={votingData}/>
    </div>
    )
}

export default EventVotingPane;