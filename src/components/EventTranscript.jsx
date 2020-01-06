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
 * @param {Object} transcriptItemRef A React reference to the transcript item in the DOM
 * @param {Boolean} isSpeakerTurnFormat Whether transcriptItem is from timestamped-speaker-turns format.
 * @param {Function} handleSeek Callback to change the event video's current time to the start_time.
 * @return The JSX of the transcript item.
 */
const transcriptItemRenderer = (transcriptItem, transcriptItemRef, isSpeakerTurnFormat, handleSeek) => {
  return (
    <div key={transcriptItem.start_time} ref={transcriptItemRef}>
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

/**
 * Use binary search to find transcriptItem's index from videoTimePoint
 * @param {Number} videoTimePoint The video time point
 * @param {Array} transcriptItems List of transcript items
 * @return {Number} The index of a transcript item that is close in time to videoTimePoint.
 */
const findTranscriptItemIndex = (videoTimePoint, transcriptItems) => {
  if (videoTimePoint < transcriptItems[0].start_time) {
    return 0;
  }
  if (videoTimePoint > transcriptItems[transcriptItems.length - 1].end_time) {
    return transcriptItems.length - 1;
  }
  let left = 0;
  let right = transcriptItems.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    let transcriptItem = transcriptItems[mid];
    if (videoTimePoint >= transcriptItem.start_time && videoTimePoint <= transcriptItem.end_time) {
      // videoTimePoint is between mid transcript item's timestamp
      return mid;
    } else if (videoTimePoint >= transcriptItems[mid - 1].end_time && videoTimePoint <= transcriptItem.start_time) {
      // videoTimePoint is within the timestamped gap that is between mid and mid-1 transcript items
      // e.g. mid-1.end_time,videoTimePoint,mid.start_time
      return mid;
    } else if (videoTimePoint >= transcriptItem.end_time && videoTimePoint <= transcriptItems[mid + 1].start_time) {
      // videoTimePoint is within the timestamped gap that is between mid and m+1 transcript items
      // e.g. mid.end_time,videoTimePoint,mid+1.start_time
      return mid + 1;
    } else if (videoTimePoint > transcriptItem.end_time) {
      // videoTimePoint greater than mid.end_time
      left = mid + 1;
    } else {
      // videoTimePoint is less than mid.start_time
      right = mid - 1;
    }
  }
  return -1;
};

const EventTranscript = ({
  transcriptHasScrolledToVideoTimePointRef,
  handleSeek,
  transcript,
  videoTimePoint
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

  // List of transcript item React references.
  const transcriptItemRefs = transcriptItems.map(() => React.createRef());


  React.useEffect(() => {
    let transcriptItemIndex = findTranscriptItemIndex(videoTimePoint, transcriptItems);
    if (transcriptItemIndex >= 0 && !transcriptHasScrolledToVideoTimePointRef.current) {
      const transcriptItemRef = transcriptItemRefs[transcriptItemIndex];
      transcriptItemRef.current.scrollIntoView(true);
      // transcript item may be covered by menu and/or video
      // scroll upward by half of window's height
      window.scrollBy(0, -window.innerHeight / 2);
      transcriptHasScrolledToVideoTimePointRef.current = true;
    }
  }, [transcriptHasScrolledToVideoTimePointRef, transcriptItems, transcriptItemRefs, videoTimePoint]);

  return (
    <div>
      {
        transcriptItems.map((transcriptItem, i) => {
          return transcriptItemRenderer(
            transcriptItem,
            transcriptItemRefs[i],
            transcript.format.includes("speaker-turns"),
            handleSeek
          );
        })
      }
    </div>
  );
};

export default React.memo(EventTranscript);
