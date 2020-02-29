import React from "react";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";
import queryString from "query-string";
import EventCardGroup from "../containers/EventCardGroup";
import GeneralErrorBoundary from "../components/GeneralErrorBoundary";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const Search = ({ location }) => {
  const { q } = queryString.parse(location.search);
  let query = q ? q.trim().replace(/\+/g, ' ') : '';

  return (
    <Layout>
      <ContentContainer>
        <GeneralErrorBoundary>
          <EventCardGroup
            query={query}
          />
        </GeneralErrorBoundary>
      </ContentContainer>
    </Layout>
  );
};

export default Search;
