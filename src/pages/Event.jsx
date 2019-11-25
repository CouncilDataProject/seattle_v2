import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const EventPage = ({ match, location }) => {

  const parseQuery = () => {
    // This function gets the query, if there is one, from react-router-dom location.state
    // A state management solution would be desirable
    if (location.state && location.state.query) {
      return location.state.query;
    } else {
      return '';
    }
  }

  return (
    <Layout>
      <ContentContainer>
        <Event id={match.params.id} query={parseQuery()} />
      </ContentContainer>
    </Layout>
  );
};

export default EventPage;
