# Frontend - Multi-stage build
FROM node:20-alpine AS builder


# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN yarn

# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["yarn","start"]
