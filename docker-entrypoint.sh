#!/bin/sh

npm run db:migrate -- --env production

npm run start

# /usr/bin/supervisord
