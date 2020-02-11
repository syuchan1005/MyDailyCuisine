import React, { FC } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';
import {
  createMuiTheme,
  Theme,
  ThemeProvider,
} from '@material-ui/core';
import { hot } from 'react-hot-loader/root';

import Recipes from '@client/pages/Recipes';
import { orange, red } from '@material-ui/core/colors';
import Recipe from '@client/pages/Recipe';

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
      <BrowserRouter>
        <Switch>
          <Route exact path={['/recipes', '/']} component={Recipes} />
          <Route exact path="/recipe/:id" component={Recipe} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default hot(App);
