import React, { useState } from "react";
import { Card, Pagination, Grid } from "semantic-ui-react";

import EventCard from "./EventCard";

const NUMBER_OF_EVENTS_PER_PAGE = 20;

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
    <Grid stackable columns="equal">
      <Grid.Row>
        <Grid.Column>{`${events.length} ${events.length > 1 ? "results" : "result"}`}</Grid.Column>
        <Grid.Column>
          <Pagination
            activePage={activePage}
            boundaryRange={0}
            siblingRange={1}
            ellipsisItem={null}
            size="small"
            onPageChange={onPageChange}
            totalPages={Math.ceil(events.length / NUMBER_OF_EVENTS_PER_PAGE)}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Card.Group stackable itemsPerRow={2}>
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
      </Grid.Row>

    </Grid>
  );
};

export default React.memo(EventCardGroup);