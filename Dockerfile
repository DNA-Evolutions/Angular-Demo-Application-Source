# ---- Build stage ----
FROM node:22.12-alpine AS builder

WORKDIR /usr/src/app

# Install deps deterministically (best for CI)
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# Optional: reduce size of builder layer (final image doesn't include node_modules anyway)
RUN npm prune --omit=dev


# ---- Runtime stage ----
FROM nginx:1.27.4-alpine

# envsubst is provided by gettext on Alpine
RUN apk add --no-cache gettext

# Copy built Angular app into nginx html directory
COPY --from=builder /usr/src/app/dist/touroptimizer-angular-demo/browser/ /usr/share/nginx/html

# Generate runtime config file from template and start nginx
CMD ["/bin/sh","-c","envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]