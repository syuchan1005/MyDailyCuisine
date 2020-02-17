import React, { FC } from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  Backdrop,
  CircularProgress,
  createMuiTheme,
  Theme,
  ThemeProvider,
} from '@material-ui/core';
import { orange, red } from '@material-ui/core/colors';
import { hot } from 'react-hot-loader/root';
import loadable from '@loadable/component';
import { Helmet } from 'react-helmet';

const fallback = (
  <Backdrop open timeout={-1}>
    <CircularProgress style={{ color: 'white' }} />
  </Backdrop>
);

const Recipes = loadable(() => import(/* webpackChunkName: "Recipes" */'@client/pages/Recipes'), { fallback });
const Recipe = loadable(() => import(/* webpackChunkName: "Recipe" */'@client/pages/Recipe'), { fallback });
const Calendar = loadable(() => import(/* webpackChunkName: "Calendar" */'@client/pages/Calendar'), { fallback });
const Error = loadable(() => import(/* webpackChunkName: "Error" */'@client/pages/Error'), { fallback });

export const commonTheme = {
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    right: 'env(safe-area-inset-right)',
    left: 'env(safe-area-inset-left)',
  },
  appbar: (
    theme: Theme,
    styleName: string,
    calcOption?: string,
  ) => Object.keys(theme.mixins.toolbar)
    .map((key) => {
      const val = theme.mixins.toolbar[key];
      if (key === 'minHeight') {
        return [
          [styleName, `calc(${commonTheme.safeArea.top} + ${val}px${calcOption || ''})`],
          ['fallbacks', {
            [styleName]: (calcOption) ? `calc(${val}px${calcOption})` : val,
          }],
        ];
      }
      return [
        [key, {
          // @ts-ignore
          [styleName]: `calc(${commonTheme.safeArea.top} + ${val.minHeight}px${calcOption || ''})`,
          fallbacks: {
            // @ts-ignore
            [styleName]: (calcOption) ? `calc(${val.minHeight}px${calcOption})` : val.minHeight,
          },
        }],
      ];
    })
    .reduce((o, props) => {
      props.forEach(([k, v]) => {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        o[k] = v;
      });
      return o;
    }, {}),
};

const App: FC = () => {
  const theme = createMuiTheme({
    palette: {
      primary: orange,
      secondary: {
        main: red.A700,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>My Daily Cuisine</title>
        <meta name="description" content="my daily cuisine" />
      </Helmet>
      <Switch>
        <Route exact path="/">
          <Redirect to="/recipes" />
        </Route>
        <Route exact path="/recipes" component={Recipes} />
        <Route exact path="/recipe/:id" component={Recipe} />
        <Route exact path="/calendar" component={Calendar} />
        <Route component={Error} />
      </Switch>
    </ThemeProvider>
  );
};

export default hot(App);
