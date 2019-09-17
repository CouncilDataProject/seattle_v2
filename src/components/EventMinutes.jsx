import React from "react";
import styled from "@emotion/styled";

const MinuteList = styled.ol({
  listStylePosition: "outside",
  paddingLeft: "1.5em"
});

const MinuteTitle = styled.div({
  fontSize: "1em",
  fontWeight: "500"
});

const MinuteDescription = styled.div({
  fontSize: "0.95em"
});

const FileList = styled.ul({
  listStylePosition: "outside",
  listStyleType: "disc",
  paddingLeft: "2em"
});

const EventMinutes = ({
  minutes,
  scPageUrl
}) => {
  return (
    <React.Fragment>
      <h3>Minutes</h3>
      <MinuteList>
        {minutes.map(({ minutes_item }) => (
          <li key={minutes_item.id}>
            <MinuteTitle>{minutes_item.matter ? minutes_item.matter : minutes_item.name}</MinuteTitle>
            {minutes_item.matter && minutes_item.matter !== minutes_item.name && <MinuteDescription>{minutes_item.name}</MinuteDescription>}
            {minutes_item.file.length > 0 && <FileList>
              {minutes_item.file.map(({ id, name, uri }) => (
                <li key={id}>
                  <a target="_blank" rel="noopener noreferrer" href={uri}>{name}</a>
                </li>
              ))}
            </FileList>}
          </li>
        ))}
      </MinuteList>
      <h3>Links</h3>
      <a href={scPageUrl}>Seattle Channel Event Page</a>
    </React.Fragment>
  );
};

export default EventMinutes;