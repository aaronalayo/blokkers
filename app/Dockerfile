FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY / ./





COPY . .

EXPOSE 3000:3000
ENV HOST 0.0.0.0

RUN npm install

#RUN npm i dotenv
ENV PORT=3000


CMD [ "npm", "run", "start-dev" ]

