import { promises as fs } from 'fs';

import Koa from 'koa';
import Serve from 'koa-static';
import Router from 'koa-router';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import gm from 'gm';
import prerender from 'prerender-node';

import GraphQL from './graphql';
import initDB from './database/models';
import ssrRouter from './ssr';

const app = new Koa();
const graphql = new GraphQL();
const router = new Router();

app.use(async (ctx, next) => {
  const ua = ctx.request.headers['user-agent'].toLowerCase();
  if ((<string[]>(prerender.crawlerUserAgents)).includes(ua)) {
    ctx.request.url = `/ogp${ctx.request.url}`;
  }
  await next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(Serve('dist/client'));
}

app.use(Serve('storage'));

app.use(async (ctx, next) => {
  const { url } = ctx;
  const match = decodeURI(url).match(/^\/(recipe|step)\/([a-f0-9-]{36})_(\d+)?x(\d+)?([%@!^<>])?(c)?.jpg$/);
  if (match) {
    try {
      const origImage = `storage/${match[1]}/${match[2]}.jpg`;
      const width = match[3] ? Number(match[3]) : undefined;
      const height = match[4] ? Number(match[4]) : undefined;
      if (!width && !height) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error();
      }
      ctx.body = await new Promise((resolve, reject) => {
        let state = gm(origImage)
          .resize(width, height, <gm.ResizeOption>match[5])
          .gravity('Center');
        if (match[6]) state = state.crop(width, height, 0, 0);
        state
          .quality(90)
          .interlace('Line')
          .stream('jpg', (err, stdout, stderr) => {
            if (err) reject(err);
            const chunks = [];
            stdout.once('error', (e) => reject(e));
            stdout.once('end', () => resolve(Buffer.concat(chunks)));
            stdout.on('data', (c) => chunks.push(c));
            stderr.once('data', (d) => reject(String(d)));
          });
      });
      ctx.type = 'image/jpeg';
      if (!ctx.response.get('Last-Modified')) {
        const stats = await fs.stat(origImage);
        ctx.set('Last-Modified', stats.mtime.toUTCString());
      }
    } catch (e) {
      ctx.body = e;
      ctx.status = 503;
    }
    return;
  }
  await next();
});

router.use('/ogp', ssrRouter.routes(), ssrRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  await initDB();
  await graphql.middleware(app);

  app.use(historyApiFallback({}));

  const port = process.env.PORT || 8081;
  const server = app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`👔 listen  at: http://localhost:${port}`);
    console.log(`🚀 graphql at: http://localhost:${port}${graphql.server.graphqlPath}`);
  });

  graphql.useSubscription(server);
})();
