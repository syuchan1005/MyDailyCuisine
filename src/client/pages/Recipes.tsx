import React, { FC, useState } from 'react';
import {
  AppBar,
  createStyles,
  Fab, IconButton,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Refresh,
  CalendarToday as CalendarIcon,
  FastfoodOutlined,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { commonTheme } from '@client/App';
import RecipeAddDialog from '@client/component/RecipeAddDialog';
import RecipeCard from '@client/component/RecipeCard';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { RecipesQuery as RecipesQueryData, RecipesQueryVariables } from '@common/GQLTypes.ts';
import RecipesQuery from '@queries/common/recipes.gql';

import HeaderAuthButton from '@client/component/HeaderAuthButton';

const useStyles = makeStyles((theme: Theme) => createStyles({
  recipes: {
    ...commonTheme.appbar(theme, 'paddingTop'),
  },
  grid: {
    marginTop: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 280px)',
    gridGap: theme.spacing(1),
    justifyContent: 'center',
  },
  addIcon: {
    color: theme.palette.primary.contrastText,
  },
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  centering: {
    marginTop: theme.spacing(1),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Recipes: FC = (props) => {
  const classes = useStyles(props);
  const history = useHistory();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const {
    data,
    refetch,
  } = useQuery<RecipesQueryData, RecipesQueryVariables>(RecipesQuery);

  return (
    <>
      <Helmet>
        <title>Recipes - My Daily Cuisine</title>
        <meta name="description" content="my daily cuisine" />
        <meta property="og:title" content="Recipes - My Daily Cuisine" />
        <meta property="og:site_name" content="My Daily Cuisine" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Recipes - My Daily Cuisine" />
      </Helmet>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Recipes
          </Typography>
          <HeaderAuthButton>
            <>
              <IconButton
                className={classes.addIcon}
                onClick={() => history.push('/calendar')}
              >
                <CalendarIcon />
              </IconButton>
              <IconButton
                className={classes.addIcon}
                onClick={() => setOpenAddDialog(true)}
              >
                <AddIcon />
              </IconButton>
            </>
          </HeaderAuthButton>
        </Toolbar>
      </AppBar>
      <main className={classes.recipes}>
        {(!data || data.recipes.length === 0) ? (
          <div className={classes.centering}>
            <FastfoodOutlined style={{ fontSize: '40vw' }} />
            <Typography variant="subtitle1">You must be sign in to add</Typography>
          </div>
        ) : (
          <div className={classes.grid}>
            {data.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                onClick={() => history.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        )}

        <Fab className={classes.fab} color="secondary" onClick={() => refetch()}>
          <Refresh />
        </Fab>
      </main>

      <RecipeAddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </>
  );
};

export default Recipes;
