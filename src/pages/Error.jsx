import React from "react";
import { Container, Header } from "semantic-ui-react";
import styled from "@emotion/styled";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const ErrorPage = ({ location }) => {
  return (
    <Layout>
      <ContentContainer>
        <Header as='h2'>
          Something went wrong.
        </Header>
        {location.state && <details>
          {`Page: ${location.state.referrer}`}
          <br/>
          {location.state.error.toString()}
        </details>}
      </ContentContainer>
    </Layout>
  );
};

export default ErrorPage;
