import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { createBrowserHistory } from "history";
import { MessageBox } from '@adminjs/design-system';

const Dashboard = (props) => {
  const { logoutPath } = props.record;
  if (!logoutPath) {
    return null;
  }

  const [shouldRedirect, setShouldRedirect] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldRedirect(true);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  if (shouldRedirect) {
    const withRefresh = createBrowserHistory({ forceRefresh: true });
    withRefresh.push({
      pathname: logoutPath,
    });
    return (
      <Redirect to={{ pathname: logoutPath }} />
    )
  }
  return (
    <MessageBox message='Location is activated!' />
  );
};

export default Dashboard;
