FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY / ./





COPY . .

EXPOSE 8080:8080
ENV HOST 0.0.0.0

RUN npm -g install npm@latest

#RUN npm i dotenv
ENV PORT=8080


CMD [ "npm", "run", "start-dev" ]

