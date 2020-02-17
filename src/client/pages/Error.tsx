import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Button,
  makeStyles,
  createStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles(() => createStyles({
  main: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Error: FC = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  return (
    <>
      <Helmet>
        <title>Error - My Daily Cuisine</title>
        <meta name="description" content="my daily cuisine" />
        <meta property="og:title" content="Error - My Daily Cuisine" />
        <meta property="og:site_name" content="My Daily Cuisine" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Error - My Daily Cuisine" />
      </Helmet>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">
            Error
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <Button
          size="large"
          variant="outlined"
          onClick={() => history.push('/')}
        >
          Go Home
        </Button>
      </main>
    </>
  );
};

export default Error;
