import React from "react";
import EventCardGroup from "../containers/EventCardGroup";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const HomePage = () => {
  return (
    <Layout>
      <EventCardGroup />
    </Layout>
  );
};

export default HomePage;
