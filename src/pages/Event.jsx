import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const EventPage = ({ match }) => {
  return (
    <Layout>
      <Event id={match.params.id} />
    </Layout>
  );
};

export default EventPage;
