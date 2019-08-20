import React from "react";
import { Container } from "semantic-ui-react";
import PersonContainer from "../containers/PersonContainer";
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

const Person = () => {
    return (
        <Layout>
            <ContentContainer>
                <PersonContainer />
            </ContentContainer>
        </Layout>
    );
}

export default Person;
