import React from "react";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";
import AllEvents from "../containers/AllEvents";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const AllEventsPage = () => {
  return (
    <Layout>
      <ContentContainer>
        <h2>All Events</h2>
        <AllEvents />
      </ContentContainer>
    </Layout>
  );
};

export default AllEventsPage;
