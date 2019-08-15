import React from "react";
import { Grid, Input, Button, Tab } from "semantic-ui-react";
import EventVotingPane from '../containers/EventVotingPane'
import ReactPlayer from "react-player";
import Highlighter from "react-highlight-words";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const Title = styled.h1({ width: "100%" });
const Date = styled.span({
  display: "block",
  color: "grey",
  fontWeight: "400"
});
const Subheader = styled.h2({ width: "100%" });
const Description = styled.p({});
const SearchInput = styled(Input)({ width: "100%" });
const SearchResultCount = styled.span({
  display: "block",
  marginTop: "1em",
  color: "grey"
});
const TranscriptItem = styled.div({
  width: "100%",
  margin: "1em 0"
});
const TranscriptItemText = styled(Highlighter)({});
const TranscriptSearchHelpMessage = styled.span({
  display: "block",
  marginTop: "1em"
});
const SeekVideoButton = styled(Button)({
  display: "block !important",
  marginTop: "1em !important"
});
const ScrollGridRow = styled(Grid.Row)({
  overflowY: "scroll",
  maxHeight: "500px"
});
const ScrollDiv = styled.div({
  overflowY: "scroll",
  maxHeight: "275px",
  marginTop: "1em"
});
const Timestamp = styled.span({
  display: "block",
  color: "grey",
  fontWeight: "700"
});

const Pane = styled(Tab.Pane)({
  border: "none !important",
  boxShadow: "none !important",
  WebkitBoxShadow: "none !important"
});

const Event = ({
  id,
  title,
  date,
  description,
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
            <Description>{description}</Description>
            <a href={scPageUrl}>Seattle Channel Event Page</a>
          </Grid.Row>
        </Pane>
      )
    },
    {
      menuItem: "Full Transcript",
      render: () => (
        <Pane attached={false}>
          <ScrollGridRow>
            {/* TODO: add start_time and endTime */}
            {transcript.map(({ text, start_time }) => (
              <React.Fragment>
                <Timestamp>{hhmmss(start_time)}</Timestamp>
                <p>{text}</p>
              </React.Fragment>
            ))}
          </ScrollGridRow>
        </Pane>
      )
    },
    {
      menuItem: "Votes",
      render: () => {
        return (
        <Pane attached={false}>
          <Grid.Row>
            <EventVotingPane eventId={id}/>
          </Grid.Row>
        </Pane>
      )}
    }
  ];

  return (
    <Grid stackable>
      {/* TODO: move this inline styling */}
      <Grid.Row style={{ padding: "0 14px" }}>
        <Title>{title}</Title>
        <Date>{date}</Date>
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
                  <Timestamp>{hhmmss(start_time)}</Timestamp>
                  <TranscriptItemText
                    searchWords={[transcriptSearchText]}
                    autoEscape={true}
                    textToHighlight={text}
                  />
                  <SeekVideoButton
                    primary
                    onClick={() => handleSeek(start_time)}
                  >
                    Jump to this point in video
                  </SeekVideoButton>
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
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Grid>
  );
};

export default Event;
