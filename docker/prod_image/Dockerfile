FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY /blokkers/app/ ./





COPY . .

EXPOSE 8080

RUN npm install

#RUN npm i dotenv
ENV PORT=8080


CMD [ "npm", "run", "start-dev" ]