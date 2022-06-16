import React from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";

const Dashboard = (props) => {
  const { logoutPath } = props.record;
  const withRefresh = createBrowserHistory({ forceRefresh: true });
  withRefresh.push({
    pathname: logoutPath,
  });

  return (
    <Redirect to={{ pathname: logoutPath }} />
  );

};

export default withRouter(Dashboard);
