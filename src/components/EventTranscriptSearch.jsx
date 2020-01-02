import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from "react-virtualized";
import Highlighter from "react-highlight-words";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const EventTranscriptSearch = ({
  searchText,
  transcript,
  handleSeek
}) => {
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const onResize = () => {
    cache.clearAll();
  };

  const Row = ({ index, parent, key, style }) => (
    <CellMeasurer
      key={key}
      cache={cache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      <div style={style}>
        <TranscriptItem>
          <TimeStamp isSearch={isSearch}>
            <Button size="tiny" onClick={() => handleSeek(transcript[index].start_time)}>
              <Icon name="play" />
              {hhmmss(transcript[index].start_time)}
            </Button>
          </TimeStamp>
          <TranscriptItemText isSearch={isSearch}>
            <Highlighter
              searchWords={[searchText]}
              autoEscape={true}
              textToHighlight={transcript[index].text}
            />
          </TranscriptItemText>
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
