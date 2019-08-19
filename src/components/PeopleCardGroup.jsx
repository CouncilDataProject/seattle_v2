import React, { Fragment } from 'react'
import { withRouter } from "react-router-dom"
import styled from "@emotion/styled";

const FlexWrapContainer = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
})

const Card = styled('div')({
    width: '250px',
    border: '1px solid #d4d4d5',
    boxShadow: '0 1px 3px 0 #d4d4d5',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    borderRadius: '3px',
    marginRight: '2rem',
    cursor: 'pointer',
    transition: '.4s all',
    ":hover": {
        transform: 'scale(1.15)',
    }
})

const CardHeading = styled('h5')({
    fontWeight: 600,
    fontSize: '1.2rem'
})


const PeopleCardGroup = ({ people, history }) => {
    return (
        <Fragment>
            <h2>Voting History</h2>
            <FlexWrapContainer>
                {people.map(({ full_name, email, id }) => (
                    <Card
                        key={full_name}
                        onClick={() => history.push(`/people/${id}`)}>
                        <CardHeading>{full_name}</CardHeading>
                        <p>City Council Member</p>
                        <a href={`mailto:${email}`}>{email}</a>
                    </Card>
                    )
                )}
            </FlexWrapContainer>
        </Fragment>
    )
}

export default withRouter(PeopleCardGroup)
