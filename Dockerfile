# This stage is used as a target in Lotic's global docker-compose at https://github.com/Lotic-ai/lotic-configs/blob/main/docker-compose.yml
FROM node:20.18.0-alpine AS dev
WORKDIR /app

# add necessary packages for building
RUN apk add --no-cache --upgrade alpine-sdk

# copy configuration files
COPY \
  .env* \
  .eslintrc.js \
  .prettierignore \
  .prettierrc \
  nest-cli.json \
  package.json \
  tsconfig.build.json \
  tsconfig.json \
  tsconfig.scripts.json \
  yarn.lock \
  ./

# copy source code
COPY src/ src/

FROM dev AS build
ARG NPM_TOKEN

# install dependencies
RUN yarn --frozen-lockfile

# Generate graphql typings
RUN yarn generate:typings

# run unit tests
RUN yarn test:unit

# build from source
RUN yarn build

# copy common graphql file
COPY src/modules/common/*.graphql /app/dist/graphql/

# copy graphql files from other modules
COPY src/modules/*/*/*.graphql /app/dist/graphql/

# prune dev dependencies, keep production dependencies
RUN yarn --frozen-lockfile --production --ignore-scripts --prefer-offline


FROM node:18.13.0-alpine AS prod
WORKDIR /app

ARG GIT_COMMIT
ENV GIT_COMMIT=${GIT_COMMIT}

# copy production-relevant configuration files
COPY package.json ./

# copy all dependencies
COPY --from=build /app/node_modules/ node_modules/

# copy compiled source
COPY --from=build /app/dist dist/

# CMD should prefer to call node directly, not through a yarn script
CMD ["node", "dist/main.js"]
