import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const EventPage = ({ match }) => {
  const location = useLocation();

  const parseQuery = () => {
    const urlString = location.pathname;
    const pieces = urlString.split('/');
    let query;
    if (pieces.length === 4) {
      query = pieces[pieces.length - 1];
    } else {
      query = '';
    }
    return query;
  }
  
  return (
    <Layout>
      <ContentContainer>
        <Event id={match.params.id} query={parseQuery()}/>
      </ContentContainer>
    </Layout>
  );
};

export default EventPage;
