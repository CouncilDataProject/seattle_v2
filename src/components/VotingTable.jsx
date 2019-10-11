import React from 'react'
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from "moment";
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
    width: '1'
  },
  {
    accessor: 'name',
    text: 'Name',
    width: '6'
  },
  {
    accessor: 'votingRecords',
    text: 'Vote',
    width: '5'
  }
]

const MiniTable = styled('div')({
  display: 'flex'
});

const Person = styled('div')({
  width: '70%'
});

const Decision = styled('div')({
  width: '30%'
});

const StyledTableHeader = styled(Table.Header)({
  '@media(max-width:767px)': {
    display: 'none !important'
  }
});


const VotingTable = ({ votingData, isPerson }) => (
  <Table striped>
    <StyledTableHeader>
      <Table.Row>
        {Headers.map(headerMetaData => (<Table.HeaderCell
          key={headerMetaData.text}>{headerMetaData.text}
          </Table.HeaderCell> 
        ))}
        {/* If we are rendering votes for a person, we want to link to the event */}
        {isPerson && <Table.HeaderCell key={'Event'}>Event</Table.HeaderCell>}
      </Table.Row>
    </StyledTableHeader>
    <Table.Body>
      {votingData.map(votingDatum => (
        <Table.Row key={votingDatum.id}>
          {Headers.map(headerMetaData => {
            if (headerMetaData.accessor !== 'votingRecords') {
              return (
                <Table.Cell key={headerMetaData.accessor} width={headerMetaData.width}>
                  {votingDatum[headerMetaData.accessor]}
                </Table.Cell>
              )
            }
            if (votingDatum.formattedIndividualVotes) {
              return (
                <Table.Cell key={headerMetaData.accessor} width={headerMetaData.width}>
                  {votingDatum.formattedIndividualVotes.map(record => {
                    return (
                      <MiniTable key={record.full_name}>
                        <Person>
                          <Link to={`/people/${record.person_id}`}>
                            {record.full_name}
                          </Link>
                        </Person>
                        <Decision>
                          {record.decision}
                        </Decision>
                      </MiniTable>
                    )
                  })}
                </Table.Cell>
              )
            } else {
              return (
                <React.Fragment key={headerMetaData.accessor}>
                  <Table.Cell width={'1'}>
                    {votingDatum.voteForPerson}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/events/${votingDatum.eventId}`}>
                      <span>{votingDatum.body_name}</span>
                    </Link>
                    <div>{moment.utc(votingDatum.eventDate).format("LLL")}</div>
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
