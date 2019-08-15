import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  margin: "2em !important"
});

const EventPage = ({ match }) => {
  return (
    <Layout>
      <ContentContainer>
        <Event id={match.params.id} />
      </ContentContainer>
    </Layout>
  );
};

export default EventPage;
