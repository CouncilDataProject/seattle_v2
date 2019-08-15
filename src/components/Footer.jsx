import React from "react";
import { Container, Segment, Grid, Header, List } from "semantic-ui-react";

const Footer = () => (
  <Segment inverted vertical style={{ padding: "5em 0em" }}>
    <Container>
      <Grid inverted stackable>
        <Grid.Row columns="equal">
          <Grid.Column>
            <Header inverted as="h4" content="About" />
            <List link inverted>
              <List.Item as="a">The Project</List.Item>
              <List.Item as="a">The Team</List.Item>
              <List.Item as="a">Other Work</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <Header inverted as="h4" content="Seattle" />
            <List link inverted>
              <List.Item as="a">City of Seattle</List.Item>
              <List.Item as="a">Seattle Open Data</List.Item>
              <List.Item as="a">Seattle Channel</List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <Header inverted as="h4" content="Developers" />
            <List link inverted>
              <List.Item as="a">Council Data Project</List.Item>
              <List.Item as="a">Seattle Specific</List.Item>
              <List.Item as="a">Transcription Runner</List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <p>
            This web application is not funded by, nor associated with the
            Seattle City Council. This is a prototype web application to show
            the viability of an automated and collaborativly sourced city
            council transcription service. The transcripts are roughly
            ninty-percent accurate, and therefore may not represent what was
            actually said.
          </p>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;
