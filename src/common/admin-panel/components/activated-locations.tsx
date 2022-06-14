import React from 'react';

const Dashboard = (props) => {
  const location = props.record.params
  return (
    <div>
      <h1>{JSON.stringify(location)}</h1>
    </div>
  )
}

export default Dashboard