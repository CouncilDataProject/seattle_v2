import React from "react";
import { Container, Input, Button, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import GeneralErrorBoundary from "../components/GeneralErrorBoundary";

const Layout = styled(Container)({
  minHeight: "55vh"
});

const ContentContainer = styled(Container)({
  marginTop: "2em !important",
  marginBottom: "5em !important"
});

const SearchBar = styled(Input)({
  width: "50% !important"
});

const StyledGrid = styled(Grid)({
  display: "block",
  marginTop: "150px !important"
});

const HomePage = props => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      props.history.push({
        pathname: '/search',
        search: `?q=${searchQuery.trim().replace(/\s+/g, '+')}`,
        state: { query: searchQuery }
      });
    }
  };
  const handleSearch = async (e, { value }) => {
    setSearchQuery(value);
  };

  return (
    <Layout>
      <ContentContainer>
        <GeneralErrorBoundary>
          <StyledGrid verticalAlign="middle" centered>
            <Grid.Row>
              <h1>Search City Council Transcripts</h1>
            </Grid.Row>
            <Grid.Row>
              <SearchBar
                placeholder="Enter a keyword to search meeting transcripts"
                value={searchQuery}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
              />
              <Button
                attached="right"
                primary
                as={Link}
                to={{
                  pathname: '/search',
                  search: `?q=${searchQuery.trim().replace(/\s+/g, '+')}`,
                  state: { query: searchQuery }
                }}
              >
                Search
            </Button>
            </Grid.Row>
          </StyledGrid>
        </GeneralErrorBoundary>
      </ContentContainer>
    </Layout>
  );
};

export default HomePage;
