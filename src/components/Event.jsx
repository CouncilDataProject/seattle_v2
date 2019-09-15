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
  width: "100%",
  margin: "1em 0"
});

const EventDate = styled.h5({
  margin: "0.1em 0",
  color: "grey",
  fontWeight: "400"
});

const FixedSentinel = styled.div({
  position: "absolute",
  left: "0",
  right: "0",
  visibility: "hidden",
  height: "90px",
  backgroundColor: "yellow"
});

const DummyContainer = styled.div(props => ({
  position: "relative",
  display: "none",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    display: props.isFixed ? "block" : "none",
    width: "59%"
  }
}));

const DummyDiv = styled.div({
  position: "absolute",
  top: "0",
  left: "0",
  backgroundColor: "black",
  height: "100%",
  width: "100%"
});

const PlayerContainer = styled.div(props => ({
  width: "100%",
  position: !props.isPip ? "sticky" : "relative",
  top: "0",
  zIndex: "2",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    position: props.isFixed && !props.isPip ? "fixed" : "relative",
    width: props.isFixed && !props.isPip ? "20vw" : "59%",
    right: "0"
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
  const fixedSentinelRef = React.useRef(null);
  const videoPlayerRef = React.useRef(null);
  const [isPip, setIsPip] = React.useState(false);
  const [isFixed, setIsFixed] = React.useState(false);
  const [mediaQueriesMatches, setMediaQueriesMatches] = React.useState(window.matchMedia("(min-aspect-ratio:5/4), (min-width:1200px)").matches);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      if (mediaQueriesMatches && !isPip) {
        if (entries[0].intersectionRatio >= 0.1 && entries[0].isIntersecting) {
          setIsFixed(false);
        } else {
          setIsFixed(true);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(fixedSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isPip, mediaQueriesMatches]);

  React.useEffect(() => {
    const video = videoPlayerRef.current.getInternalPlayer();

    const onEnterPip = () => {
      setIsFixed(false);
      setIsPip(true);
    };

    const onLeavePip = () => {
      setIsPip(false);
    };

    video.addEventListener("enterpictureinpicture", onEnterPip);
    video.addEventListener("leavepictureinpicture", onLeavePip);
    return () => {
      video.removeEventListener("enterpictureinpicture", onEnterPip);
      video.removeEventListener("leavepictureinpicture", onLeavePip);
    };
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      setMediaQueriesMatches(window.matchMedia("(min-aspect-ratio:5/4), (min-width:1200px)").matches);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSeek = seconds => {
    videoPlayerRef.current.seekTo(parseFloat(seconds));
    const video = videoPlayerRef.current.getInternalPlayer();

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
      <FixedSentinel ref={fixedSentinelRef} />
      <DummyContainer isFixed={isFixed}>
        <PlayerWrapper>
          <DummyDiv />
        </PlayerWrapper>
      </DummyContainer>
      <PlayerContainer isPip={isPip} isFixed={isFixed}>
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
        mediaQueriesMatches={mediaQueriesMatches}
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