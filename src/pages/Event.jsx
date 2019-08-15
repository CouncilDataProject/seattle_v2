import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";

const EventPage = ({ match }) => {
  return (
    <Container>
      <Event id={match.params.id} />
    </Container>
  );
};

export default EventPage;
