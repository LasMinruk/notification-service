FROM node:18-alpine

LABEL maintainer="LasMinruk"
LABEL service="notification-service"
LABEL version="1.0.0"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV MONGO_URI=""

EXPOSE 3004

USER node

CMD ["node", "server.js"]