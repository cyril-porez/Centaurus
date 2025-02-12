FROM --platform=linux/x86-64 node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
ARG api_url
ENV API_HOST=$api_url
ENV NEXT_PUBLIC_API_HOST=$api_url
# ENV API_URL "https://site-atelier-back-deployment.dev.atelier.ovh/"
RUN npm install
COPY . .
RUN npm run build

FROM --platform=linux/x86-64 nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
