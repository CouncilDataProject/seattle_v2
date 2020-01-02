import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from "react-virtualized";
import Highlighter from "react-highlight-words";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptItem = styled.div({
  // Increase spacing around each transcript item
  margin: "1em 0.2em"
});

const TranscriptItemText = styled.div({
  fontSize: "16px",
  // Increase spacing between TranscriptItemText and TimeStamp button
  marginBottom: "0.1em"
});

const TimeStamp = styled.div({
  ".ui.button": {
    // Make timestamp button's padding smaller
    padding: "0.5em !important"
  }
});

const EventTranscriptSearch = ({
  // The search transcript query
  searchText,
  // The list of timestamped text that contains the searchText
  transcript,
  // Callback to change the event video's current time to the start_time of a timestamped text
  handleSeek
}) => {
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
        <TranscriptItem>
          <TranscriptItemText>
            <Highlighter
              searchWords={[searchText]}
              autoEscape={true}
              textToHighlight={transcript[index].text}
            />
          </TranscriptItemText>
          <TimeStamp>
            <Button size="small" onClick={() => handleSeek(transcript[index].start_time)}>
              <Icon name="play" />
              {hhmmss(transcript[index].start_time)}
            </Button>
          </TimeStamp>
        </TranscriptItem>
      </div>
    </CellMeasurer>
  );

  return (
    <AutoSizer onResize={onResize}>
      {({ width, height }) => (
        <List
          deferredMeasurementCache={cache}
          height={height}
          rowCount={transcript.length}
          rowHeight={cache.rowHeight}
          rowRenderer={Row}
          scrollToIndex={0}
          style={{ willChange: "" }}
          width={width}
        />
      )}
    </AutoSizer>
  );
}

export default React.memo(EventTranscriptSearch);
