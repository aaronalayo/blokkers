FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY / ./


RUN npm install


COPY . .

EXPOSE 8080

ENV PORT=8080


#RUN npm i dotenv


CMD [ "npm", "run", "start-dev"]