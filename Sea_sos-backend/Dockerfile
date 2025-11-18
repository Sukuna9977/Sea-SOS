# Dockerfile for Node Express Backend
FROM node:16.17.0-alpine

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Create App Directory
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Change ownership to non-root user
RUN chown -R nodeuser:nodejs /usr/src/app
USER nodeuser

# Exports
EXPOSE 3030

CMD ["npm", "start"]
