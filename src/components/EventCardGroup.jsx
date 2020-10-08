import React, { useState } from "react";
import { Card, Pagination, Grid } from "semantic-ui-react";

import EventCard from "./EventCard";

const NUMBER_OF_EVENTS_PER_PAGE = 10;

const EventCardGroup = ({ events, query }) => {
  // the current page in the pagination navigation
  const [activePage, setActivePage] = useState(1);
  const onPageChange = (e, { activePage }) => {
    setActivePage(activePage);
  }
  // get the visible events of the current page
  const activeEvents = events.slice(
    NUMBER_OF_EVENTS_PER_PAGE * (activePage - 1),
    NUMBER_OF_EVENTS_PER_PAGE * (activePage - 1) + NUMBER_OF_EVENTS_PER_PAGE
  )

  return (
    <Grid>
      <Grid.Column width={16}>{`${events.length} ${events.length > 1 ? "results" : "result"}`}</Grid.Column>
      <Grid.Column width={16}>
        <Card.Group>
          {activeEvents.map(({ name, date, description, id }) => (
            <EventCard
              key={id}
              name={name}
              date={date}
              description={description}
              link={`/events/${id}`}
              query={query}
            />
          ))}
        </Card.Group>
      </Grid.Column>
      <Grid.Column width={16}>
        <Pagination
          pointing
          secondary
          activePage={activePage}
          boundaryRange={0}
          siblingRange={1}
          ellipsisItem={null}
          onPageChange={onPageChange}
          totalPages={Math.ceil(events.length / NUMBER_OF_EVENTS_PER_PAGE)}
        />
      </Grid.Column>
    </Grid>
  );
};

export default React.memo(EventCardGroup);