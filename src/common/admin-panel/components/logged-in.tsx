import React from 'react';
import { Box, CurrentUserNav, CurrentUserNavProps } from '@adminjs/design-system';
import { CurrentAdmin, useTranslation } from 'adminjs';

type LoggedInProps = {
  session: CurrentAdmin;
  paths: {
    logoutPath: string;
  };
}

const LoggedIn: React.FC<LoggedInProps> = (props) => {
  const { session, paths } = props;
  const { translateButton } = useTranslation();

  const dropActions: CurrentUserNavProps['dropActions'] = [{
    label: translateButton('logout'),
    onClick: (event: Event): void => {
      event.preventDefault()
      window.location.href = paths.logoutPath
    },
    icon: 'Logout',
  }]
  return (
    <Box flexShrink={0}>
      <CurrentUserNav
        name={session.email}
        title={session.location ? `Your location: ${session.location}` : 'No active location'}
        dropActions={dropActions}
      />
    </Box>
  )
};

export default LoggedIn;
