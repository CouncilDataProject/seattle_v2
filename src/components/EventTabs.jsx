import React from "react";
import { Grid, Tab, List } from "semantic-ui-react";
import EventTranscript from "./EventTranscript";
import EventVotingPane from "../containers/EventVotingPane";
import styled from "@emotion/styled";

const StyledTab = styled(Tab)({
  order: "3",
  width: "100%",
  "a.item": {
    fontSize: "1.3em !important"
  }
});

const Pane = styled(Tab.Pane)({
  padding: "0 !important",
  border: "none !important",
  boxShadow: "none !important",
  WebkitBoxShadow: "none !important",
  fontSize: "16px !important",
  lineHeight: "1.5 !important"
});

const EventTabs = ({
  eventId,
  minutes,
  scPageUrl,
  transcript,
  handleSeek
}) => {
  const panes = [
    {
      menuItem: "Details",
      render: () => (
        <Pane attached={false}>
          <Grid.Row>
            <h3>Minutes</h3>
            <List ordered>
              {minutes.map(({ minutes_item }, i) => (
                <List.Item key={minutes_item.id}>{minutes_item.name}</List.Item>
              ))}
            </List>
          </Grid.Row>
          <Grid.Row style={{ marginTop: "1em" }}>
            <h3>Links</h3>
            <List>
              <List.Item>
                <a href={scPageUrl}>Seattle Channel Event Page</a>
              </List.Item>
            </List>
          </Grid.Row>
        </Pane>
      )
    },
    {
      menuItem: "Transcript",
      render: () => (
        <Pane attached={false}>
          <EventTranscript
            searchText={""}
            transcript={transcript}
            handleSeek={handleSeek}
            isSearch={false}
          />
        </Pane>
      )
    },
    {
      menuItem: "Votes",
      render: () => {
        return (
          <Pane attached={false}>
            <Grid.Row>
              <EventVotingPane eventId={eventId} />
            </Grid.Row>
          </Pane>
        );
      }
    }
  ];

  return (
    <StyledTab menu={{ secondary: true, pointing: true }} panes={panes} />
  );
};

export default React.memo(EventTabs);