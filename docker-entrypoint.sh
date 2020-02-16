#!/bin/sh

npm run db:migrate -- --env production

/usr/bin/supervisord
