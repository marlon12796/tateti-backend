
ARG NODE_VERSION=22.3.0
ARG PNPM_VERSION=9.7.0

FROM node:${NODE_VERSION}-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./

RUN  --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

FROM base AS build

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./

RUN  --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
# Run the build script.
RUN pnpm run build

FROM base AS final

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Use --chown on COPY commands to set file permissions
USER node


COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=node:node /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
COPY --from=build --chown=node:node /usr/src/app/dist ./dist


EXPOSE ${PORT}

CMD ["pnpm", "start:prod"]
