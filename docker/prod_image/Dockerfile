FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY / ./


RUN npm install


COPY . .

# Expose API port to the outside
EXPOSE 8080


#RUN npm i dotenv


CMD [ "npm", "run", "start-dev"]