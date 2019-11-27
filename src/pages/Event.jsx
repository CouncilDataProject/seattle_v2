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
    // This function parses the URL since we couldn't pass the query through state at this time
    // This solution has the potential to break if the URL changes shape in the future
    // A state management solution would be desirable
    const urlString = location.pathname;
    const pieces = urlString.split('/');
    let query;
    if (pieces.length === 4) {
      query = pieces[pieces.length - 1];
      query = query.trim().replace(/\+/g, ' ');
    } else {
      query = '';
    }
    return query;
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
