FROM node:12.13.0-alpine as build

COPY . /build

WORKDIR /build

RUN apk add --no-cache python build-base \
    && npm ci && npm run build \
    && mkdir /MyDailyCuisine \
    && mkdir /MyDailyCuisine/src \
    && mv dist/ /MyDailyCuisine/ \
    && mv scripts/ /MyDailyCuisine/ \
    && mv node_modules/ /MyDailyCuisine/ \
    && cp -r /MyDailyCuisine/dist/client /MyDailyCuisine/public/ \
    && mv src/server/ /MyDailyCuisine/src/server/ \
    && mv .sequelizerc /MyDailyCuisine/ \
    && mv package.json /MyDailyCuisine/ \
    && mv package-lock.json /MyDailyCuisine/

FROM node:12.13.0-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="MyDailyCuisine"

EXPOSE 80

ENV DEBUG="", PORT=80, HOST=""

RUN apk add --no-cache graphicsmagick \
    && mkdir /MyDailyCuisine

WORKDIR /MyDailyCuisine

COPY --from=build /MyDailyCuisine /MyDailyCuisine

COPY docker-entrypoint.sh /MyDailyCuisine/

RUN chmod +x docker-entrypoint.sh

# "/MyDailyCuisine/production.sqlite" is file
VOLUME ["/MyDailyCuisine/storage"]

ENTRYPOINT ["/MyDailyCuisine/docker-entrypoint.sh"]
