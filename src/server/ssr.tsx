import Router from 'koa-router';
import Recipe from './database/models/Recipe';
/*
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import App from '../client/App';

ssrRouter.get('/*', (ctx) => {
  const s = ctx.request.url.split('/');
  s.shift();
  s[0] = '';

  renderToString((
    <StaticRouter location={s.join('/')}>
      <App />
    </StaticRouter>
  ));
  const helmet = Helmet.renderStatic();
  ctx.body = `<html><head>${helmet.title.toString()}${helmet.meta.toString()}</head></html>`
    .replace(/data-react-helmet="true" ?/g, '');
  ctx.status = 200;
});
*/

const ssrRouter = new Router();

ssrRouter.get('*', async (ctx) => {
  const s = ctx.request.url.split('/').slice(2);
  let prefix = 'Error';
  if (['', 'recipes'].includes(s[0])) {
    prefix = 'Recipes';
  } else if (s[0] === 'calendar') {
    prefix = 'Calendar';
  } else if (s[0] === 'recipe') {
    prefix = 'Recipe';
  }
  if (prefix === 'Recipe') {
    if (s[1]) {
      const recipe = await Recipe.findOne({ where: { id: s[1] } });
      if (recipe) {
        ctx.body = `<html><head>
<title>${recipe.name} Recipe - My Daily Cuisine</title>
<meta name="description" content="${recipe.name} recipe page" />
<meta property="og:title" content="${recipe.name} Recipe - My Daily Cuisine" />
${recipe.image ? `<meta property="og:image" content="${process.env.HOST || ''}/recipe/${recipe.id}_300x300^c.jpg" />` : ''}
<meta property="og:site_name" content="My Daily Cuisine" />
<meta property="twitter:card" content="summary" />
<meta property="twitter:title" content="${recipe.name} Recipe - My Daily Cuisine" />
</head></html>`.replace(/\n/g, '');
        return;
      }
    }
    prefix = 'Error';
  }
  ctx.body = `<html><head>
<title>${prefix} - My Daily Cuisine</title>
<meta name="description" content="my daily cuisine" />
<meta property="og:title" content="${prefix} - My Daily Cuisine" />
<meta property="og:site_name" content="My Daily Cuisine" />
<meta property="twitter:card" content="summary" />
<meta property="twitter:title" content="${prefix} - My Daily Cuisine" />
</head></html>`.replace(/\n/g, '');
});

export default ssrRouter;
