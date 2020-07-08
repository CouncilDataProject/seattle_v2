import React from "react";
import { Container } from "semantic-ui-react";

const Banner = () => (
  <Container style={{ backgroundColor: "#ededf0", padding: "1em 1em", width: "100vw"}}>
      <p>
          Support this project by
          <a
            href="https://forms.gle/eGyjhPx4hU3UBidKA"
            style={{ textDecoration: "underline" }}
          >
             &nbsp;giving&nbsp;your&nbsp;feedback&nbsp;>
          </a>
      </p>
  </Container>
);

export default Banner;
