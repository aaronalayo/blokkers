FROM node:16.6.0-alpine3.13
ENV NODE_VERSION 16.6.0


WORKDIR /blokkers/app

COPY / ./





COPY . .

EXPOSE 8080:8080
ENV HOST 0.0.0.0

RUN npm install
RUN npm install -g npm@7.20.3

#RUN npm i dotenv
ENV PORT=8080


CMD [ "npm", "run", "start-dev" ]

