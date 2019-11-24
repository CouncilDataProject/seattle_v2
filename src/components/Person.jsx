import React, { useState }                       from 'react';
import { Checkbox, Form, Header, Grid, Segment } from 'semantic-ui-react';
import _                                         from 'lodash';
import VotingTable                               from './VotingTable';

const cssCheckbox = { marginRight: '0.5em' }

const Person = ({personHistory: {full_name, email, phone, website, votes}}) => {
  // == Get unique vote cast types from votes list.
  const votingOptions = _.uniq(votes.map(vote => vote.voteForPerson))
  // == Selected votes for checkboxes.
  const [selectedVoteFilters, setSelectedVoteFilters] = useState([])
  // == Votes filtered to be displayed in table.
  const [filteredVotes, setFilteredVotes] = useState(votes)
  
  // == Handler for checkboxes and refiltering table results.
  const onSelectedVoteFilterChange = (event, { label }) => {
    if (selectedVoteFilters.includes(label)) {
      setSelectedVoteFilters(_.without(selectedVoteFilters, label))
    } else {
      selectedVoteFilters.push(label)
      setSelectedVoteFilters(selectedVoteFilters)
    }

    setFilteredVotes(_.filter(votes, vote => selectedVoteFilters.includes(vote.voteForPerson)))
  }

  // == Make a checkbox for each vote cast type in the voting table.
  const filterVotingOptions = votingOptions.map((votingOption, index) => <Checkbox style={cssCheckbox} key={index} label={votingOption} onChange={onSelectedVoteFilterChange} />)

  return <React.Fragment>
    <Header as="h1">{full_name}</Header>
    <Grid columns={1} stackable>
      <Grid.Column>
        <Segment>
          <Header as="h2">Contact information</Header>
          <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
          <div><strong>Phone:</strong> {phone}</div>
          <div><strong>Website:</strong> <a target={'_blank'} rel="noopener noreferrer" href={website}>{website}</a></div>
        </Segment>
      </Grid.Column>
      <Grid.Column>
        <Segment>
          <Header as="h2">Voting record</Header>
          <Header as="h3">Filter by vote cast</Header>
          <Form>{ filterVotingOptions }</Form>
          <VotingTable votingData={filteredVotes} isPerson={true} />
         </Segment>
      </Grid.Column>
    </Grid>
  </React.Fragment>
}

export default Person;