import React from "react";
import { Grid, List } from "semantic-ui-react";

const EventMinutes = ({
  minutes,
  scPageUrl
}) => {
  return (
    <React.Fragment>
      <Grid.Row>
        <h3>Minutes</h3>
        <List ordered>
          {minutes.map(({ minutes_item }, i) => (
            <List.Item key={minutes_item.id}>{minutes_item.name}</List.Item>
          ))}
        </List>
      </Grid.Row>
      <Grid.Row style={{ marginTop: "1em" }}>
        <h3>Links</h3>
        <List>
          <List.Item>
            <a href={scPageUrl}>Seattle Channel Event Page</a>
          </List.Item>
        </List>
      </Grid.Row>
    </React.Fragment>
  );
};

export default EventMinutes;