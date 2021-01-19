FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY /app/ ./


RUN npm install


COPY . .

# Expose API port to the outside
EXPOSE 2000


#RUN npm i dotenv


CMD [ "npm", "run", "start-dev"]