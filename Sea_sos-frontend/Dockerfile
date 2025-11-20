FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./

# Use legacy peer deps to ignore version conflicts
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
