import React from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from "react-virtualized";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptBlock = styled(Segment)({
  // Increase the vertical spacing between each transcript block
  margin: "0.5em 0 !important"
});

const TranscriptItem = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  // Increase the spacing around each timestamped text
  margin: "1em 0.2em",
});

const TranscriptItemText = styled.div({
  width: "100%",
  fontSize: "16px",
  marginBottom: "0.1em",
  "@media(min-width:720px)": {
    // For screen width >= 720px
    // Decrease width
    width: "85%",
    // Make it appear timestamp button
    order: "1",
    marginBottom: "0"
  }
});

const TimeStamp = styled.div({
  width: "100%",
  ".ui.button": {
    // Make timestamp button's padding smaller
    padding: "0.5em !important"
  },
  "@media(min-width:720px)": {
    // For screen width >= 720px
    // Decrease width
    width: "15%",
    // Make it appear before timestamped text
    order: "0"
  }
});

/**
 * 
 * @param {Object} transcriptBlock The transcript block. It could be a timestamped text with fields: text, start_time, end_time. 
 * Or it could be a speaker turn block with fields speaker and data. With data being a list of timestamped text.
 * @param {String} transcriptFormat The transcript's format.
 * @param {Function} handleSeek Callback to change the event video's current time to the start_time of a timestamped text
 * @return The JSX of the transcript block.
 */
const transcriptBlockRenderer = (transcriptBlock, transcriptFormat, handleSeek) => {
  const isSpeakerTurnBlock = transcriptFormat.includes("speaker-turns");
  const timestamptedTexts = isSpeakerTurnBlock ?
    transcriptBlock.data :
    [transcriptBlock];

  return (
    <TranscriptBlock>
      {(isSpeakerTurnBlock && transcriptBlock.speaker) && <Header as="h4">{transcriptBlock.speaker}</Header>}
      {timestamptedTexts.map((timestampedText) => (
        <TranscriptItem key={timestampedText.start_time}>
          <TranscriptItemText>
            {timestampedText.text}
          </TranscriptItemText>
          <TimeStamp>
            <Button size="small" onClick={() => handleSeek(timestampedText.start_time)}>
              <Icon name="play" />
              {hhmmss(timestampedText.start_time)}
            </Button>
          </TimeStamp>
        </TranscriptItem>))}
    </TranscriptBlock>
  );
};

const EventTranscript = ({
  transcript,
  handleSeek
}) => {
  // A React reference to the WindowScroller
  const windowScrollerRef = React.useRef(null);

  // Stores the CellMeasurer's measurements of all transcript blocks
  const cache = new CellMeasurerCache({
    // The width of transcript blocks are the same
    fixedWidth: true,
    // The height of transcript blocks are variable, with the default height being 100px
    defaultHeight: 100,
  });

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

  const onResize = () => {
    // Need to clear all transcript blocks' measurements on document resize
    cache.clearAll();
  };

  const Row = ({ index, parent, key, style }) => (
    // Row is responsible for rendering a transcript block
    // CellMeasurer will dynamically determine the height of a transcript block,
    // or use the cache to determine the height
    <CellMeasurer
      key={key}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      <div style={style}>
        {transcriptBlockRenderer(transcript.data[index], transcript.format, handleSeek)}
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
              rowCount={transcript.data.length}
              rowHeight={cache.rowHeight}
              rowRenderer={Row}
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
