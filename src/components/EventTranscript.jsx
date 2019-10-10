import React from "react";
import { Button } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from 'react-virtualized';
import { Icon } from "semantic-ui-react";
import Highlighter from "react-highlight-words";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptItem = styled.div({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  margin: "1em 0",
  padding: "0.2em"
});

const TranscriptItemText = styled.div(props => ({
  width: props.isSearch ? "100%" : "85%",
  order: props.isSearch ? "0" : "1",
  boxSizing: "border-box",
  fontSize: "16px",
  lineHeight: "1.5em",
  "@media(max-width:720px)": {
    width: "100%",
    order: "0"
  }
}));

const TimeStamp = styled.div(props => ({
  width: props.isSearch ? "100%" : "15%",
  order: props.isSearch ? "1" : "0",
  boxSizing: "border-box",
  padding: props.isSearch ? "0" : "0.5em",
  "@media(max-width:720px)": {
    width: "100%",
    padding: "0",
    order: "1"
  }
}));

const EventTranscript = ({
  searchText,
  transcript,
  handleSeek,
  isSearch
}) => {
  const windowScrollerRef = React.useRef(null);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  React.useEffect(() => {
    const handleUpdateScrollPosition = () => {
      if (windowScrollerRef.current) {
        windowScrollerRef.current.updatePosition();
      }
    };
    document.addEventListener("update-scroll-position", handleUpdateScrollPosition);
    return () => {
      document.removeEventListener("update-scroll-position", handleUpdateScrollPosition);
    };
  }, []);

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

  if (isSearch) {
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
  } else {
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
                rowCount={transcript.length}
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
  }
};

export default React.memo(EventTranscript);