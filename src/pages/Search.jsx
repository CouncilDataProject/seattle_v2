import React from "react";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";
import queryString from "query-string";
import EventCardGroup from "../containers/EventCardGroup";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const Search = ({ location }) => {
  const { q } = queryString.parse(location.search);
  let query = q.trim().replace(/\+/g, ' ');
  let committeeFilterValue = {};
  let dateRangeFilterValue = { start: '', end: '' };
  let sortFilterValue = { by: '', order: '' };
  if (location.state) {
    query = location.state.query || query;
    committeeFilterValue = location.state.committeeFilterValue || committeeFilterValue;
    dateRangeFilterValue = location.state.dateRangeFilterValue || dateRangeFilterValue;
    sortFilterValue = location.state.sortFilterValue || sortFilterValue;
  }

  return (
    <Layout>
      <ContentContainer>
        <EventCardGroup
          query={query}
          filterValues={[committeeFilterValue, dateRangeFilterValue, sortFilterValue]}
        />
      </ContentContainer>
    </Layout>
  );
};

export default Search;
