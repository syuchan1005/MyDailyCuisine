FROM node:12.13.0-alpine as build

COPY . /build

WORKDIR /build

RUN npm ci && npm run build \
    && mkdir /MyDailyCuisine \
    && mkdir /MyDailyCuisine/src \
    && mv dist/ /MyDailyCuisine/ \
    && cp -r /MyDailyCuisine/dist/client /MyDailyCuisine/public/ \
    && mv src/server/ /MyDailyCuisine/src/server/ \
    && mv .sequelizerc /MyDailyCuisine/ \
    && mv package.json /MyDailyCuisine/ \
    && mv package-lock.json /MyDailyCuisine/

FROM node:12.13.0-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="BookReader"

EXPOSE 80

ENV DEBUG=""

RUN apk add --no-cache supervisor nginx imagemagick libwebp-tools \
    && mkdir /MyDailyCuisine

COPY --from=build ["/MyDailyCuisine/package.json", "/MyDailyCuisine/package-lock.json", "/MyDailyCuisine/"]

WORKDIR /MyDailyCuisine

RUN npm ci

COPY nginx.conf /etc/nginx/
COPY supervisord.conf /etc/

COPY --from=build /MyDailyCuisine /MyDailyCuisine

COPY docker-entrypoint.sh /MyDailyCuisine/

RUN chmod +x docker-entrypoint.sh

# "/MyDailyCuisine/production.sqlite" is file
VOLUME ["/MyDailyCuisine/storage"]

ENTRYPOINT ["/MyDailyCuisine/docker-entrypoint.sh"]