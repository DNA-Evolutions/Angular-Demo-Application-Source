FROM node:lts-slim As builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --prod
FROM nginx:1.25.3-alpine
COPY --from=builder /usr/src/app/dist/touroptimizer-angular-demo/ /usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
