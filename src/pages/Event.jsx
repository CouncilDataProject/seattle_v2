import React from "react";
import Event from "../containers/Event";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";
import queryString from "query-string";

const Layout = styled(Container)({
  minHeight: "100vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const EventPage = ({ match, location }) => {
  // The query parameters in the URL
  const { q, t } = queryString.parse(location.search);

  const parseQuery = () => {
    // Get the search transcript query
    let query = q ? q.trim().replace(/\+/g, ' ') : '';
    if (location.state) {
      query = location.state.query || query;
    }
    return query;
  }

  const parseVideoTimePoint = () => {
    // Get the video's starting time point
    let videoTimePoint;
    if (!t || isNaN(t)) {
      videoTimePoint = 0;
    } else {
      videoTimePoint = Math.max(0, parseFloat(t));
    }
    return videoTimePoint;
  }

  return (
    <Layout>
      <ContentContainer>
        <Event
          id={match.params.id}
          query={parseQuery()}
          videoTimePoint={parseVideoTimePoint()} />
      </ContentContainer>
    </Layout>
  );
};

export default EventPage;
