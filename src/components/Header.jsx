import React from "react";
import { Segment, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Brand = styled.h1({});

const HeadingTab = styled("span")({
  transition: ".8s all",
  borderRadius: "5px",
  padding: "1rem .5rem",
  ":hover": {
    backgroundColor: "#F5F5F5",
    color: "black"

  }
});

const Header = () => (
  <React.Fragment>
    <Segment vertical>
      <Container>
        <Link to="/">
          <Brand>Council Data Project</Brand>
        </Link>
      </Container>
    </Segment>
    <Segment vertical>
      <Container>
        <Link to="/events">
          <HeadingTab>Events</HeadingTab>
        </Link>
        <Link to="/people">
          <HeadingTab style={{ marginLeft: "10px" }}>People</HeadingTab>
        </Link>
      </Container>
    </Segment>
  </React.Fragment>
);

export default Header;
