import React, { FC, useMemo, useState } from 'react';
import {
  AppBar, Avatar,
  Button, Card, CardActionArea, CardHeader,
  createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography, useMediaQuery, useTheme,
} from '@material-ui/core';
import {
  Add as AddIcon, ArrowBack,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Refresh, Today,
  ViewModule as ModuleIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enLocale from 'date-fns/locale/en-US';

import { useSelector } from 'react-redux';
import { getAuth } from '@client/store/modules/authModule';

import HeaderAuthButton from '@client/component/HeaderAuthButton';
import { useQuery } from '@apollo/react-hooks';

import { Meal, MealsQuery as MealsQueryData, MealsQueryVariables } from '@common/GQLTypes';
import MealsQuery from '@queries/pages_calendar_meals.gql';
import MealAddDialog from '@client/component/MealAddDialog';
import SignDialog from '@client/component/SignDialog';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enLocale,
  },
});

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Partial<Meal>;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  arrowButtonWrapper: {
    margin: theme.spacing(0, 1),
  },
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  addIcon: {
    color: theme.palette.primary.contrastText,
  },
  signBackdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
}));

const Calendar: FC = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [signUp, setSignUp] = useState(false);
  const auth = useSelector(getAuth);

  const [openAddMealDialog, setOpenAddMealDialog] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<CalendarEvent>(undefined);

  const {
    data,
    refetch,
  } = useQuery<MealsQueryData, MealsQueryVariables>(MealsQuery);

  const events: CalendarEvent[] = useMemo(() => {
    if (!data) return [];
    return data.meals.map((meal) => ({
      title: meal.name,
      start: meal.time,
      end: meal.time,
      resource: meal,
    }));
  }, [data]);

  return (
    <>
      <SignDialog
        open={!auth.expires || auth.expires < Date.now()}
        signUp={signUp}
        onChange={setSignUp}
      >
        <div>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        </div>
        <DialogContent>
          <DialogContentText>
            Sign in required to use Calendar
          </DialogContentText>
        </DialogContent>
      </SignDialog>
      <BigCalendar
        localizer={localizer}
        events={events}
        onSelectEvent={setClickedEvent}
        components={{
          toolbar: (toolbar) => (
            <AppBar position="relative" elevation={0}>
              <Toolbar>
                {(!upSm) ? (
                  <IconButton
                    size="small"
                    onClick={() => toolbar.onNavigate('TODAY')}
                  >
                    <Today />
                  </IconButton>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => toolbar.onNavigate('TODAY')}
                  >
                    Today
                  </Button>
                )}
                <div className={classes.arrowButtonWrapper}>
                  <IconButton
                    size="small"
                    onClick={() => toolbar.onNavigate('NEXT')}
                  >
                    <KeyboardArrowLeft />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => toolbar.onNavigate('PREV')}
                  >
                    <KeyboardArrowRight />
                  </IconButton>
                </div>
                <Typography
                  variant="h6"
                  style={{
                    flexGrow: 1,
                    fontSize: (!upSm ? '0.8rem' : '1.25rem'),
                  }}
                >
                  {toolbar.label}
                </Typography>
                <HeaderAuthButton>
                  <>
                    <IconButton
                      size={!upSm ? 'small' : 'medium'}
                      className={classes.addIcon}
                      onClick={() => history.push('/recipes')}
                    >
                      <ModuleIcon />
                    </IconButton>
                    <IconButton
                      size={!upSm ? 'small' : 'medium'}
                      className={classes.addIcon}
                      onClick={() => setOpenAddMealDialog(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  </>
                </HeaderAuthButton>
              </Toolbar>
            </AppBar>
          ),
        }}
      />
      <Fab
        className={classes.fab}
        color="secondary"
        onClick={() => refetch()}
      >
        <Refresh />
      </Fab>
      <MealAddDialog
        open={openAddMealDialog}
        onClose={() => setOpenAddMealDialog(false)}
        onAdded={() => refetch()}
      />
      <Dialog
        open={!!clickedEvent}
        onClose={() => setClickedEvent(undefined)}
        fullWidth
        maxWidth="xs"
      >
        {(clickedEvent) && (
          <>
            <DialogTitle>
              {clickedEvent.resource.name}
              <Typography variant="subtitle1" component="div">
                {format(new Date(clickedEvent.resource.time), 'yyyy/MM/dd HH:mm')}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {clickedEvent.resource.description}
              </DialogContentText>

              {(clickedEvent.resource.recipe) && (
                <Card>
                  <CardActionArea
                    onClick={() => history.push(`/recipe/${clickedEvent.resource.recipe.id}`)}
                  >
                    <CardHeader
                      avatar={(
                        <Avatar
                          alt={clickedEvent.resource.recipe.name}
                          src={clickedEvent.resource.recipe.image
                            ? `/recipe/${clickedEvent.resource.recipe.id}_40x40^c.jpg`
                            : undefined}
                        >
                          {clickedEvent.resource.recipe.name[0]}
                        </Avatar>
                      )}
                      title={clickedEvent.resource.recipe.name}
                      subheader={clickedEvent.resource.recipe.description}
                    />
                  </CardActionArea>
                </Card>
              )}
            </DialogContent>
          </>
        )}
        <DialogActions>
          <Button onClick={() => setClickedEvent(undefined)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Calendar;
