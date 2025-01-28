FROM node:22.13-slim

RUN apt-get update && apt-get install -y wget gnupg

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

RUN mkdir -p /app/postgres-data
RUN chown -R node:node /app/postgres-data

# Ensure the uploads directory exists and has the correct permissions
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

COPY package.json yarn.lock ./

RUN yarn

COPY tsconfig.json ./

RUN mkdir -p /app/dist

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start"]