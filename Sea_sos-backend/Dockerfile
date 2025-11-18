FROM node:20-alpine as build

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./
RUN yarn

# Copy app source code
COPY . .

# Exports
EXPOSE 3030

CMD ["yarn","start"]
