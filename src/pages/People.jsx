import React from "react";
import { Container } from "semantic-ui-react";
import styled from "@emotion/styled";

// TODO: duplicate from Home, move to utils
const Layout = styled(Container)({
    minHeight: "100vh"
  });

// TODO: duplicate from Home, move to utils
const ContentContainer = styled(Container)({
    marginTop: "2em !important",
    marginBottom: "5em !important"
  });

const People = () => {
    return (
        <Layout>
        <ContentContainer>
            <div>people container here</div>
        </ContentContainer>
        </Layout>
    );
}

export default People