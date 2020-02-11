import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';

import {
  RefreshTokenMutation as RefreshTokenMutationData,
  RefreshTokenMutationVariables,
} from '@common/GQLTypes';
import RefreshTokenMutation from '@queries/index_refreshToken.gql';
import store from '@client/store';
import getClient from '@client/apollo/index';
import authModule from '@client/store/modules/authModule';
import regSW from './registerServiceWorker';
import App from './App';

regSW();

(async () => {
  const [client] = await getClient(
    async (c) => {
      const { auth } = store.getState();
      if (!auth || !auth.accessToken) return undefined;
      const sub = auth.expires - Date.now();
      if (sub > 0) {
        if (sub < /* 5minutes */ 5 * 60 * 1000) {
          const { data } = await c.mutate<RefreshTokenMutationData,
            RefreshTokenMutationVariables>({
              mutation: RefreshTokenMutation,
              variables: { token: auth.refreshToken },
            });
          if (data && data.refreshToken.success) {
            store.dispatch(authModule.actions.set(data.refreshToken.token));
            return data.refreshToken.token.accessToken;
          }
        }
        return auth.accessToken;
      }
      return undefined;
    },
  );

  ReactDOM.render(
    (
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ReduxProvider>
    ),
    document.getElementById('app'),
  );
})();
