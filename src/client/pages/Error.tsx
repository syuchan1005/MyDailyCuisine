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
