import React from "react";
import { Button, Divider, Header, Icon } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from "react-virtualized";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptItem = styled.div(props => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  // Make vertical spacing between transcript items of timestamped-speaker-turns format a little
  // bit smaller than other transcript formats.
  margin: props.isSpeakerTurnFormat ? "0.8em 0.2em" : "1.2em 0.2em"
}));

const TranscriptItemText = styled.div({
  width: "100%",
  fontSize: "16px",
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
    <div>
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
  transcriptHasScrolledToVideoTimePoint,
  handleSeek,
  transcript,
  videoTimePoint
}) => {
  // A React reference to react-virtualized WindowScroller
  const windowScrollerRef = React.useRef(null);
  // A React reference to react-virtualized List
  const listRef = React.useRef(null);
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

  React.useEffect(() => {
    let transcriptItemIndex = findTranscriptItemIndex(videoTimePoint, transcriptItems);
    if (transcriptItemIndex > 0 && !transcriptHasScrolledToVideoTimePoint.current) {
      // Scroll to transcript item
      listRef.current.scrollToRow(transcriptItemIndex);
      transcriptHasScrolledToVideoTimePoint.current = true;
    }
  }, [transcriptHasScrolledToVideoTimePoint, transcriptItems, videoTimePoint]);

  React.useEffect(() => {
    const handleUpdateScrollPosition = () => {
      if (windowScrollerRef.current) {
        // Need to recalculate windowScroller's scroll position from the top of page on seeing a `update-scroll-position` event.
        windowScrollerRef.current.updatePosition();
      }
    };
    document.addEventListener("update-scroll-position", handleUpdateScrollPosition);
    return () => {
      document.removeEventListener("update-scroll-position", handleUpdateScrollPosition);
    };
  }, []);

  // Stores the CellMeasurer's measurements of all transcript items
  const cache = new CellMeasurerCache({
    // The width of transcript items are the same
    fixedWidth: true,
    // The height of transcript items are variable, with the default height being 100px
    defaultHeight: 100,
  });

  const onResize = () => {
    // Need to clear all transcript items' measurements on document resize
    cache.clearAll();
  };

  const Row = ({ index, parent, key, style }) => (
    // Row is responsible for rendering a transcript item
    // CellMeasurer will dynamically determine the height of a transcript item,
    // or use the cache to determine the height
    <CellMeasurer
      key={key}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      <div style={style}>
        {transcriptItemRenderer(transcriptItems[index], transcript.format.includes("speaker-turns"), handleSeek)}
      </div>
    </CellMeasurer>
  );

  return (
    <WindowScroller ref={windowScrollerRef}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight onResize={onResize}>
          {({ width }) => (
            <List
              autoHeight
              deferredMeasurementCache={cache}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              ref={listRef}
              rowCount={transcriptItems.length}
              rowHeight={cache.rowHeight}
              rowRenderer={Row}
              scrollToAlignment={"center"}
              scrollTop={scrollTop}
              style={{ willChange: "" }}
              width={width}
            />)}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export default React.memo(EventTranscript);
