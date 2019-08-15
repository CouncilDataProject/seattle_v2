import React from "react";
import EventCardGroup from "../containers/EventCardGroup";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const HomePage = () => {
  return (
    <Layout>
      <ContentContainer>
        <EventCardGroup />
      </ContentContainer>
    </Layout>
  );
};

export default HomePage;
