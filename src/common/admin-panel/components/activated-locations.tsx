import React from 'react';
import { H1 } from 'react-router-dom';

const Dashboard = (props) => {
  const location = props.record.params;
  return (
    <div>
      <h1>ID: {location.id.toString()}</h1>
      <h1>Creator Email: {location.creator_email.toString()}</h1>
      <h1>Name: {location.name.toString()}</h1>
      <h1>Is Active: {Boolean(location.isActive.data[0]).toString()}</h1>
    </div>
  )
}
export default Dashboard