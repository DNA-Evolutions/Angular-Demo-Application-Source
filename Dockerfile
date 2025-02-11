FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
# To install legacy deps
RUN npm install
COPY . .
RUN npm run build --omit=dev
FROM nginx:1.27.4-alpine
COPY --from=builder /usr/src/app/dist/touroptimizer-angular-demo/browser/ /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]