FROM node:20-alpine

RUN mkdir -p /home/frontend

COPY . ./frontend

WORKDIR /frontend

RUN yarn

RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]
