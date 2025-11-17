# Frontend - Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Build the React app
RUN yarn build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Copy custom nginx config (create this file)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create simple nginx config if file doesn't exist
RUN if [ ! -f /etc/nginx/conf.d/default.conf ]; then \
    echo 'server { \
        listen 80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files \$uri \$uri/ /index.html; \
        } \
        location /api { \
            proxy_pass http://backend:3030; \
            proxy_set_header Host \$host; \
            proxy_set_header X-Real-IP \$remote_addr; \
        } \
    }' > /etc/nginx/conf.d/default.conf; \
    fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
