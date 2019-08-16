import React from 'react';

const Vote = ({matter, name, decision}) => (
    <div style={{display: 'flex', border: '1px solid grey'}}>
        <div>{matter}</div>
        <div>{name}</div>
        <div>{decision}</div>
    </div>
)

const Person = ({personHistory: {full_name, email, phone, website, votes}}) => {
    return (
        <div>
            <div>{full_name}</div>
            <div>{email}</div>
            <div>{phone}</div>
            <div>{website}</div>
            {votes.map(Vote)}
        </div>
    )
}

export default Person;