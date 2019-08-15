import React from "react";
import { Segment, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Brand = styled.h1({});

const Header = () => (
  <Segment vertical>
    <Container>
      <Link to="/">
        <Brand>Council Data Project</Brand>
      </Link>
    </Container>
  </Segment>
);

export default Header;
