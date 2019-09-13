import React from "react";
import { Input } from "semantic-ui-react";
import styled from "@emotion/styled";
import EventTranscript from "./EventTranscript";
import isSubstring from "../utils/isSubstring";

const StyledEventSearch = styled.div({
  margin: "1em 0",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    width: "40%",
    margin: "0"
  }
});

const Subheader = styled.h2({ width: "100%" });

const SearchInput = styled(Input)({
  width: "100%",
  fontSize: "16px !important",
  lineHeight: "1.5 !important"
});

const SearchResultCount = styled.span({
  display: "block",
  marginTop: "1em",
  color: "grey",
  paddingLeft: "15px"
});

const TranscriptSearchHelpMessage = styled.span({
  display: "block",
  marginTop: "1em",
  fontSize: "16px !important",
  lineHeight: "1.5 !important",
  paddingLeft: "15px"
});

const SearchResultsWrapper = styled.div({
  marginTop: "1em",
  border: "1px solid lightgray",
  borderRadius: "0.28rem",
  boxSizing: "border-box",
  minHeight: "calc(.5625 * 90vw)",
  "@media (min-aspect-ratio:5/4), (min-width:1200px)": {
    flex: "1 1 auto",
    minHeight: "0"
  }
});

const EventSearch = ({
  transcript,
  handleSeek,
  mediaQueriesMatches
}) => {
  const [transcriptSearchText, setTranscriptSearchText] = React.useState("");

  const handleTranscriptSearch = (e, { value }) => {
    setTranscriptSearchText(value);
    if(!mediaQueriesMatches) {
      document.dispatchEvent(new CustomEvent("update-scroll-position"));
    }
  };

  const transcriptItems = transcript.filter(({ text }) => isSubstring(text, transcriptSearchText));

  return (
    <StyledEventSearch>
      <Subheader>Search Transcript</Subheader>
      <SearchInput
        onChange={handleTranscriptSearch}
        value={transcriptSearchText}
        placeholder="Search transcript"
      />
      {transcriptSearchText !== "" && (
        <SearchResultCount>
          {transcriptItems.length} results
        </SearchResultCount>
      )}
      {transcriptSearchText !== "" && transcriptItems.length > 0 && (
        <SearchResultsWrapper>
          <EventTranscript
            searchText={transcriptSearchText}
            transcript={transcriptItems}
            handleSeek={handleSeek}
            isSearch={true}
          />
        </SearchResultsWrapper>
      )}
      {transcriptSearchText === "" && (
        <TranscriptSearchHelpMessage>
          Enter a search term to get results.
        </TranscriptSearchHelpMessage>
      )}
    </StyledEventSearch>
  );
};

export default EventSearch;