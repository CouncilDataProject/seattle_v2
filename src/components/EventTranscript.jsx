import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller } from "react-virtualized";
import styled from "@emotion/styled";
import hhmmss from "../utils/hhmmss";

const TranscriptItem = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "1em 0.2em"
});

const TranscriptItemText = styled.div({
  width: "100%",
  fontSize: "16px",
  marginBottom: "0.1em",
  "@media(min-width:720px)": {
    width: "85%",
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
    width: "15%",
    order: "0"
  }
});

const EventTranscript = ({
  transcript,
  handleSeek
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
          <TranscriptItemText>
            {transcript[index].text}
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
};

export default React.memo(EventTranscript);
