FROM node:22.13-slim

RUN apt-get update && apt-get install -y wget gnupg \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update && apt-get install -y postgresql-client

WORKDIR /app

RUN mkdir -p /app/postgres-data /app/uploads /app/dist \
    && chown -R node:node /app/postgres-data \
    && chmod 777 /app/uploads

COPY package.json yarn.lock ./
RUN yarn

COPY tsconfig.json ./
COPY . .

# Install frontend dependencies
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn

WORKDIR /app

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]