import React, { FC, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  AppBar,
  Backdrop, Button,
  Card,
  CardContent,
  CircularProgress,
  createStyles, Fab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBack, Refresh } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { commonTheme } from '@client/App';
import { useQuery } from '@apollo/react-hooks';
import { RecipeQuery as RecipeQueryData, RecipeQueryVariables } from '@common/GQLTypes';
import RecipeQuery from '@queries/pages_recipe_recipe.gql';
import { common } from '@material-ui/core/colors';
import HeaderAuthButton from '@client/component/HeaderAuthButton';

const useStyles = makeStyles((theme: Theme) => createStyles({
  recipe: commonTheme.appbar(theme, 'paddingTop'),
  backdrop: {
    color: common.white,
  },
  data: {
    margin: theme.spacing(2, 1, 1, 1),
    display: 'grid',
    gridTemplateColumns: `calc(50% - ${theme.spacing(0.5)}px) calc(50% - ${theme.spacing(0.5)}px)`,
    gridGap: theme.spacing(1),
    [theme.breakpoints.down(650)]: {
      gridTemplateColumns: 'auto',
    },
  },
  image: {
    width: 280,
    height: 487,
    objectFit: 'cover',
  },
  noImage: {
    /* 16:9 */
    width: 280,
    height: 157.5,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridRow: '1 / 4',
  },
  stepImage: {
    width: 160,
    objectFit: 'cover',
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 160px)',
    gridGap: theme.spacing(1),
    justifyContent: 'center',
    gridColumn: '1 / 3',
    [theme.breakpoints.down(650)]: {
      gridColumn: '1',
    },
  },
  ingredientHeader: {
    display: 'flex',
    alignItems: 'baseline',
  },
  howMany: {
    marginLeft: theme.spacing(1),
  },
  userWrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  userLabel: {
    flexGrow: 1,
    textAlign: 'end',
  },
  fab: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

const Recipe: FC = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const { id }: { id?: string } = useParams();

  const {
    data,
    loading,
    refetch,
  } = useQuery<RecipeQueryData, RecipeQueryVariables>(RecipeQuery, {
    variables: { id },
  });

  const ingredients = useMemo(() => {
    if (!data?.recipe.ingredients) return {};
    return data.recipe.ingredients.reduce((obj, ing) => {
      const g = ing.groupName ?? '';
      // eslint-disable-next-line no-param-reassign
      if (!obj[g]) obj[g] = [];
      obj[g].push(ing);
      return obj;
    }, {});
  }, [data]);

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading} timeout={-1}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar>
        <Toolbar>
          <IconButton onClick={() => history.push('/recipes')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Recipe
          </Typography>
          <HeaderAuthButton />
        </Toolbar>
      </AppBar>
      <main className={classes.recipe}>
        {(data) && (
          <div className={classes.data}>
            <div className={classes.imageWrapper}>
              {(data.recipe.image) ? (
                <img
                  className={classes.image}
                  src={`/recipe/${data.recipe.id}_280x487^c.jpg`}
                  alt="recipe"
                />
              ) : (
                <Card className={classes.noImage} elevation={3}>
                  <div>No Image</div>
                </Card>
              )}
            </div>
            <div>
              <Typography variant="h4">{data.recipe.name}</Typography>
              <Typography variant="subtitle1">{data.recipe.nameHiragana}</Typography>
              <Typography variant="subtitle2" className={classes.userWrapper}>
                {/* onClick={() => history.push(`/user/${data.recipe.user.id}`)} */}
                <span className={classes.userLabel}>User:</span>
                <Button>
                  {data.recipe.user.name}
                </Button>
              </Typography>
            </div>
            <TextField
              multiline
              label="Description"
              value={data.recipe.description}
            />
            <div>
              <div className={classes.ingredientHeader}>
                <Typography variant="h6">
                  Ingredients
                </Typography>
                <div className={classes.howMany}>{data.recipe.howMany}</div>
              </div>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(ingredients).map((k) => [
                      (k && k.length > 0) ? (
                        <TableRow key={k}>
                          <TableCell colSpan={2}>
                            <Typography>{k}</Typography>
                          </TableCell>
                        </TableRow>
                      ) : undefined,
                      ...ingredients[k].map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          {/* <TableCell>{ingredient.groupName ?? ''}</TableCell> */}
                          <TableCell>{ingredient.ingredient.name}</TableCell>
                          <TableCell align="right">{ingredient.amount}</TableCell>
                        </TableRow>
                      )),
                    ])}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Typography variant="h6">
              How to
            </Typography>
            <div className={classes.stepGrid}>
              {data.recipe.steps.sort((a, b) => a.step - b.step).map((step) => (
                <Card key={step.id}>
                  {(step.image) && (
                    <img
                      className={classes.stepImage}
                      src={`/step/${step.id}_160x.jpg`}
                      alt="step"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{step.step}</Typography>
                    <Typography variant="body2">{step.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <TextField
              multiline
              label="Trick"
              value={data.recipe.trick}
            />
            <TextField
              multiline
              label="Background of this recipe"
              value={data.recipe.background}
            />
          </div>
        )}

        <Fab className={classes.fab} color="secondary" onClick={() => refetch()}>
          <Refresh />
        </Fab>
      </main>
    </>
  );
};

export default Recipe;
