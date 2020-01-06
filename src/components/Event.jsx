import React from "react";
import EventSearch from "./EventSearch";
import EventShareVideo from "./EventShareVideo";
import EventTabs from "./EventTabs";
import { Segment, Visibility } from "semantic-ui-react";
import {
  Player,
  BigPlayButton,
  ControlBar,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from "video-react";
import useMatchMedia from "../hooks/useMatchMedia";
import styled from "@emotion/styled";
import getDateTime from "../utils/getDateTime";
import "video-react/dist/video-react.css";

const StyledEvent = styled.div({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between"
});

const Header = styled.div({
  width: "100%",
  margin: "1em 0"
});

const EventDate = styled.span({
  margin: "0.1em 0",
  color: "grey",
  fontWeight: "400"
});

const InfoSegment = styled(Segment.Inline)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    width: "59%"
  }
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
  position: "sticky",
  top: "0",
  zIndex: "2",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    position: props.isFixed ? "fixed" : "relative",
    width: props.isFixed ? "20vw" : "59%",
    right: "0"
  }
}));

const PlayerWrapper = styled.div({
  position: "relative",
  paddingTop: "56.25%"
});

const Event = ({
  id,
  title,
  date,
  minutes,
  scPageUrl,
  videoUrl,
  transcript,
  votes,
  query,
  videoTimePoint
}) => {
  const videoPlayerRef = React.useRef(null);
  //isFixed is a boolean, whether the video is fixed to the top-right
  const [isFixed, setIsFixed] = React.useState(false);
  //mediaQueriesMatches is a boolean, whether the video can be fixed to the top-right
  const mediaQueriesMatches = useMatchMedia("(min-aspect-ratio:5/4), (min-width:1200px)");
  //videoOffSetHeight is used to determine vertical position of event tabs menu when it is sticky
  const [videoOffSetHeight, setVideoOffsetHeight] = React.useState(0);

  React.useEffect(() => {
    //html5 video element
    const video = videoPlayerRef.current.video.video;
    //disable pip button for chrome, can't disable for firefox.
    video.disablePictureInPicture = true;
    setVideoOffsetHeight(video.offsetHeight);
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      const video = videoPlayerRef.current.video.video;
      setVideoOffsetHeight(video.offsetHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSeek = seconds => {
    videoPlayerRef.current.seek(parseFloat(seconds));
    const { player } = videoPlayerRef.current.getState();
    // if video is paused or has not started, then play video
    if (player.paused || !player.hasStarted) {
      videoPlayerRef.current.play();
    }
  };

  const onBottomPassed = () => {
    //bottom of FixedSentinel is not visible within viewport.
    //and video can be fixed to top-right
    if (mediaQueriesMatches) {
      setIsFixed(true); //video is fixed to top-right
    }
  };

  const onBottomPassedReverse = () => {
    //bottom of FixedSentinel is visible within viewport
    //and video can be fixed to top-right
    if (mediaQueriesMatches) {
      setIsFixed(false); //video is not fixed to top-right
    }
  };

  const getTranscriptTimestampedText = () => {
    if (transcript.format.includes("speaker-turns")) {
      // Flatten speaker turn blocks to timestamped sentences
      let timestampedSentences = [];
      transcript.data.forEach(speakerTurnBlock => {
        timestampedSentences.push(...speakerTurnBlock.data);
      });
      return timestampedSentences;
    }
    // Return timestamped texts if transcript format is not `timestamped-speaker-turns`
    return transcript.data;
  }

  return (
    <StyledEvent>
      <Header>
        <h1>{title}</h1>
      </Header>
      <InfoSegment>
        <EventDate>{getDateTime(date)}</EventDate>
        <Segment.Inline>
          <EventShareVideo videoPlayerRef={videoPlayerRef} />
        </Segment.Inline>
      </InfoSegment>
      <Visibility
        once={false}
        onBottomPassed={onBottomPassed}
        onBottomPassedReverse={onBottomPassedReverse}
      >
        <FixedSentinel />
      </Visibility>
      <DummyContainer isFixed={isFixed}>
        <PlayerWrapper>
          <DummyDiv />
        </PlayerWrapper>
      </DummyContainer>
      <PlayerContainer isFixed={isFixed}>
        <Player
          fluid
          aspectRatio='16:9'
          preload={videoTimePoint ? 'auto' : 'metadata'}
          ref={videoPlayerRef}
          src={videoUrl}
          startTime={videoTimePoint}>
          <BigPlayButton position='center' />
          <ControlBar autoHide={true}>
            <VolumeMenuButton vertical />
            <PlaybackRateMenuButton rates={[2, 1.5, 1, 0.75]} order={6.1} />
          </ControlBar>
        </Player>
      </PlayerContainer>
      <EventSearch
        transcript={getTranscriptTimestampedText()}
        handleSeek={handleSeek}
        query={query}
      />
      <EventTabs
        minutes={minutes}
        scPageUrl={scPageUrl}
        transcript={transcript}
        votes={votes}
        handleSeek={handleSeek}
        topOffset={mediaQueriesMatches ? 0 : videoOffSetHeight} //vertical position of event tabs menu when it is sticky
        mediaQueriesMatches={mediaQueriesMatches}
        videoTimePoint={videoTimePoint}
      />
    </StyledEvent>
  );
};

export default Event;
