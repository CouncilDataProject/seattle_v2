import React from "react";
import { Grid, Input, Button, Tab, List, Icon } from "semantic-ui-react";
import EventVotingPane from "../containers/EventVotingPane";
import ReactPlayer from "react-player";
import Highlighter from "react-highlight-words";
import moment from "moment";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const Title = styled.h1({ width: "100%", marginBottom: "5px !important" });
const Date = styled.span({
  display: "block",
  color: "grey",
  fontWeight: "400"
});
const Subheader = styled.h2({ width: "100%" });
const SearchInput = styled(Input)({
  width: "100%",
  fontSize: "16px !important",
  lineHeight: "1.5 !important"
});
const SearchResultCount = styled.span({
  display: "block",
  marginTop: "1em",
  color: "grey",
  paddingLeft: "15px"
});
const TranscriptItem = styled.div({
  width: "100%",
  margin: "1em 0",
  padding: "14px"
});
const TranscriptItemText = styled(Highlighter)({
  fontSize: "16px !important",
  lineHeight: "1.5 !important"
});
const TranscriptSearchHelpMessage = styled.span({
  display: "block",
  marginTop: "1em",
  fontSize: "16px !important",
  lineHeight: "1.5 !important",
  paddingLeft: "15px"
});
const ScrollDiv = styled.div({
  overflowY: "scroll",
  maxHeight: "228px",
  marginTop: "1em",
  border: "1px solid lightgrey",
  borderRadius: "0.28rem"
});
const Timestamp = styled(Button)({
  padding: "5px 8px !important",
  marginBottom: "8px !important",
  marginTop: "8px !important",
  display: "block"
});
const StyledTab = styled(Tab)({
  "a.item": {
    fontSize: "20px !important"
  }
});
const Pane = styled(Tab.Pane)({
  border: "none !important",
  boxShadow: "none !important",
  WebkitBoxShadow: "none !important",
  fontSize: "16px !important",
  lineHeight: "1.5 !important"
});

const Event = ({
  id,
  title,
  date,
  minutes,
  scPageUrl,
  videoUrl,
  transcript
}) => {
  const videoPlayerRef = React.useRef(null);
  const [transcriptItems, setTranscriptItems] = React.useState(transcript);
  const [transcriptSearchText, setTranscriptSearchText] = React.useState("");

  const isSubstring = (string, substring) =>
    string.toLowerCase().indexOf(substring.toLowerCase()) !== -1;

  const handleTranscriptSearch = (e, { value }) => {
    setTranscriptSearchText(value);
    setTranscriptItems(
      transcript.filter(({ text }) => isSubstring(text, value))
    );
  };

  const handleSeek = seconds => {
    videoPlayerRef.current.seekTo(parseFloat(seconds));
  };

  const panes = [
    {
      menuItem: "Details",
      render: () => (
        <Pane attached={false}>
          <Grid.Row>
            <h3>Minutes</h3>
            <List ordered>
              {minutes.map(({ minutes_item }, i) => (
                <List.Item>{minutes_item.name}</List.Item>
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
          {transcript.map(({ text, start_time }, i) => (
            <Grid>
              <Grid.Row>
                <Grid.Column width="2">
                  <Timestamp size="tiny" onClick={() => handleSeek(start_time)}>
                    <Icon name="play" />
                    {hhmmss(start_time)}
                  </Timestamp>
                </Grid.Column>
                <Grid.Column width="14">
                  <span style={{ display: "inline-block", paddingTop: "8px" }}>
                    {text}
                  </span>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ))}
          <Grid.Row />
        </Pane>
      )
    },
    {
      menuItem: "Votes",
      render: () => {
        return (
          <Pane attached={false}>
            <Grid.Row>
              <EventVotingPane eventId={id} />
            </Grid.Row>
          </Pane>
        );
      }
    }
  ];

  return (
    <Grid stackable>
      {/* TODO: move this inline styling */}
      <Grid.Row style={{ padding: "0 14px" }}>
        <Title>{title}</Title>
        <Date>Meeting Date: {moment(date).format("LLL")}</Date>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width="10">
          <ReactPlayer ref={videoPlayerRef} url={videoUrl} controls />
        </Grid.Column>
        <Grid.Column width="6">
          <Subheader>Search Transcript</Subheader>
          <SearchInput
            onChange={handleTranscriptSearch}
            value={transcriptSearchText}
            placeholder="Search transcript"
          />
          {transcriptSearchText !== "" && (
            <SearchResultCount>
              {transcriptItems.length} results
            </SearchResultCount>
          )}
          {transcriptSearchText !== "" && (
            <ScrollDiv>
              {transcriptItems.map(({ text, start_time }) => (
                <TranscriptItem>
                  <TranscriptItemText
                    searchWords={[transcriptSearchText]}
                    autoEscape={true}
                    textToHighlight={text}
                  />
                  <Timestamp size="tiny" onClick={() => handleSeek(start_time)}>
                    <Icon name="play" />
                    {hhmmss(start_time)}
                  </Timestamp>
                </TranscriptItem>
              ))}
            </ScrollDiv>
          )}

          {transcriptSearchText === "" && (
            <TranscriptSearchHelpMessage>
              Enter a search term to get results.
            </TranscriptSearchHelpMessage>
          )}
        </Grid.Column>
      </Grid.Row>
      <StyledTab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Grid>
  );
};

export default Event;
