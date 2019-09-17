import React from "react";
import { Menu, Sticky } from "semantic-ui-react";
import EventMinutes from "./EventMinutes";
import EventTranscript from "./EventTranscript";
import VotingTable from "./VotingTable";
import styled from "@emotion/styled";

const StyledEventTabs = styled.div({
  margin: "1em 0",
  width: "100%",
  fontSize: "16px",
  lineHeight: "1.5",
  "a.item": {
    fontSize: "1.3em !important"
  }
});

const StyledEventMenu = styled(Menu)({
  borderBottom: "0 !important",
  marginBottom: "1em !important",
  paddingTop: "1em !important",
  backgroundColor: "white !important",
  zIndex: "0 !important",
  width: "100vw"
});

const EventTabs = ({
  minutes,
  scPageUrl,
  transcript,
  votes,
  handleSeek,
  topOffset,
  mediaQueriesMatches
}) => {
  const [activeItem, setActiveItem] = React.useState("details");
  const contextRef = React.useRef(null);

  React.useEffect(() => {
    const domRect = contextRef.current.getBoundingClientRect();
    if (domRect.top < 0) {
      contextRef.current.scrollIntoView(true);
      if (!mediaQueriesMatches) {
        window.scrollBy(0, -topOffset);
      }
    }
  }, [activeItem, mediaQueriesMatches, topOffset]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <StyledEventTabs ref={contextRef}>
      <Sticky
        context={contextRef}
        offset={topOffset}
        styleElement={{ zIndex: "1" }}
      >
        <StyledEventMenu secondary pointing>
          <Menu.Item active={activeItem === "details"} name="details" onClick={handleItemClick} />
          <Menu.Item active={activeItem === "transcript"} name="transcript" onClick={handleItemClick} />
          <Menu.Item active={activeItem === "votes"} name="votes" onClick={handleItemClick} />
        </StyledEventMenu>
      </Sticky>
      {{
        details: <EventMinutes minutes={minutes} scPageUrl={scPageUrl} />,
        transcript: <EventTranscript
          searchText={""}
          transcript={transcript}
          handleSeek={handleSeek}
          isSearch={false}
        />,
        votes: votes.length ? <VotingTable votingData={votes} /> : <div>No votes found for this event.</div>
      }[activeItem]}
    </StyledEventTabs>
  );
};

export default React.memo(EventTabs);
