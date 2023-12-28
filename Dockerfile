FROM node:18.0.0-alpine3.15 AS base
# DEV BUILD STEP
FROM base AS devBuild

RUN apk add --update --no-cache python3

#RUN apk update && apk add --upgrade apk-tools && apk upgrade --available
RUN npm install -g pnpm@7.29.1

WORKDIR /app

# Log the settings for NPM and Environment variables
#ENV NODE_ENV=production

# Copy the project files so docker caches dependencies
COPY package.json pnpm-lock.yaml /app/
# Copy the internal packages
COPY internal-package/*.tgz /app/internal-package/

RUN pnpm i --frozen-lockfile --ignore-scripts
#RUN pnpm i
# Copy the source code and build
COPY . .

RUN pnpm run build

# PROD BUILD STEP
# Using latest LTS release of Node
FROM base as runner

RUN npm install -g pnpm@7.29.1

#RUN apk update && apk add --upgrade apk-tools && apk upgrade --available

# Create an app directory on the container
WORKDIR /app

# Project copy build, install only prod dependencies
COPY --from=devBuild /app/dist ./dist
#COPY --from=devBuild /app/dist/src/staticAsset/ /app/src/staticAsset/

#COPY env_*.properties ./
#COPY package.json pnpm-lock.yaml healthcheck.js .env ./
COPY package.json pnpm-lock.yaml healthcheck.js ./

# Copy the internal packages
COPY internal-package/*.tgz /app/internal-package/

RUN pnpm install --only=prod --ignore-scripts

COPY .env /app/.env

# Expose the container port to the OS
# docker run takes -p argument to forward this port to network
EXPOSE 3000

EXPOSE 3001

# Start the application
CMD pnpm run start:prod

HEALTHCHECK --interval=30s --timeout=12s --start-period=30s \
  CMD node /healthcheck.js
