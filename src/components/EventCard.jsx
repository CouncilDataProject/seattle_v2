import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "semantic-ui-react";

const EventCard = ({ title, date, description, link }) => (
  <Card>
    <Card.Content>
      <Card.Header>
        <Link to={link}>{title}</Link>
      </Card.Header>
      <Card.Meta>{date}</Card.Meta>
      <Card.Description>{description}</Card.Description>
    </Card.Content>
  </Card>
);

export default EventCard;
