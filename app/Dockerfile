FROM node:15.5.1-alpine3.12
ENV NODE_VERSION 15.5.1


WORKDIR /blokkers/app

COPY / ./





COPY . .

EXPOSE 8080

RUN npm install

#RUN npm i dotenv
ENV PORT=8080


CMD [ "npm", "run", "start-dev" ]

FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY app/ /usr/share/nginx/html

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]