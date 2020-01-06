import React from "react";
import { Button, Divider, Header, Icon } from "semantic-ui-react";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptItem = styled.div(props => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  // Make vertical spacing between transcript items of timestamped-speaker-turns format a little
  // bit smaller than other transcript formats.
  margin: props.isSpeakerTurnFormat ? "2.5em 0.2em" : "3em 0.2em"
}));

const TranscriptItemText = styled.div({
  width: "100%",
  fontSize: "16px",
  lineHeight: "1.5em",
  "@media(min-width:1000px)": {
    // For screen width >= 1000px
    // Decrease text's width
    width: "85%",
    // Make it appear after TimeStamp
    order: "1"
  }
});

const TimeStamp = styled.div({
  width: "100%",
  // Increase the vertical spacing between TranscriptItemText and Timestamp
  marginTop: "10px",
  "@media(min-width:1000px)": {
    // For screen width >= 1000px
    // Decrease timestamp's width
    width: "15%",
    // Make it appear before TranscriptItemText
    order: "0",
    marginTop: "0"
  }
});

/**
 * 
 * @param {Object} transcriptItem The transcript item.
 * @param {String} transcriptItem.text
 * @param {Number} transcriptItem.start_time
 * @param {Number} transcriptItem.end_time
 * @param {String} [transcriptItem.speaker]
 * @param {Boolean} isSpeakerTurnFormat Whether transcriptItem is from timestamped-speaker-turns format.
 * @param {Function} handleSeek Callback to change the event video's current time to the start_time.
 * @return The JSX of the transcript item.
 */
const transcriptItemRenderer = (transcriptItem, isSpeakerTurnFormat, handleSeek) => {
  return (
    <div key={transcriptItem.start_time}>
      {(!!transcriptItem.speaker) &&
        <Divider horizontal>
          <Header as='h3'>
            {transcriptItem.speaker}
          </Header>
        </Divider>}
      <TranscriptItem isSpeakerTurnFormat={isSpeakerTurnFormat}>
        <TranscriptItemText>
          {transcriptItem.text}
        </TranscriptItemText>
        <TimeStamp>
          <Button size="tiny" onClick={() => handleSeek(transcriptItem.start_time)}>
            <Icon name="play" />
            {hhmmss(transcriptItem.start_time)}
          </Button>
        </TimeStamp>
      </TranscriptItem>
    </div>
  );
};

const EventTranscript = ({
  handleSeek,
  transcript
}) => {
  // List of timestamped texts
  let transcriptItems = [];
  const isSpeakerTurnFormat = transcript.format.includes("speaker-turns");
  if (isSpeakerTurnFormat) {
    transcript.data.forEach(speakerTurn => {
      // Add speaker field for first timestamped sentence
      speakerTurn.data[0].speaker = speakerTurn.speaker || "New Speaker";
      transcriptItems.push(...speakerTurn.data);
    });
  } else {
    transcriptItems = transcript.data;
  }

  return (
    <div>
      {
        transcriptItems.map(transcriptItem => {
          return transcriptItemRenderer(
            transcriptItem,
            transcript.format.includes("speaker-turns"),
            handleSeek
          );
        })
      }
    </div>
  );
};

export default React.memo(EventTranscript);
