import React from "react";
import EventSearch from "./EventSearch";
import EventTabs from "./EventTabs";
import ReactPlayer from "react-player";
import moment from "moment";
import styled from "@emotion/styled";

const StyledEvent = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between"
});

const Header = styled.div({
  order: "0",
  width: "100%",
  margin: "1em 0"
});

const EventDate = styled.h5({
  margin: "0.1em 0",
  color: "grey",
  fontWeight: "400"
});

const PlayerContainer = styled.div(props => ({
  width: "100%",
  order: "1",
  position: "relative",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    width: "59%"
  }
}));

const PlayerWrapper = styled.div({
  position: "relative",
  paddingTop: "56.25%"
});

const StyledReactPlayer = styled(ReactPlayer)({
  position: "absolute",
  top: "0",
  left: "0"
});

const Event = ({
  id,
  title,
  date,
  minutes,
  scPageUrl,
  videoUrl,
  transcript
}) => {
  const videoPlayerRef = React.useRef(null);

  const handleSeek =  seconds => {
    videoPlayerRef.current.seekTo(parseFloat(seconds));
    const video = videoPlayerRef.current.getInternalPlayer();

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (video.paused && videoPlayerRef.current.getCurrentTime() > 0) {
      video.play();
    }
  };

  return (
    <StyledEvent>
      <Header>
        <h1>{title}</h1>
        <EventDate>Meeting Date: {moment(date, "MM-DD-YYYY HH:mm:ss").format("LLL")}</EventDate>
      </Header>
      <PlayerContainer>
        <PlayerWrapper>
          <StyledReactPlayer
            ref={videoPlayerRef}
            url={videoUrl}
            controls
            height="100%"
            width="100%"
          />
        </PlayerWrapper>
      </PlayerContainer>
      <EventSearch
        transcript={transcript}
        handleSeek={handleSeek}
      />
      <EventTabs
        eventId={id}
        minutes={minutes}
        scPageUrl={scPageUrl}
        transcript={transcript}
        handleSeek={handleSeek}
      />
    </StyledEvent>
  );
};

export default Event;