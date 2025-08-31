#---------------- Step 1 Install dependencies ----------------#
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

#----------------- Step 2 DEV environement -------------------#
FROM node:18-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV PATH /app/node_modules/.bin:$PATH
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=3001
EXPOSE 3000
CMD ["npm", "start"]

#------------------- Step 3 Build for production ------------------#
FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

#-------------------- Step 4 Serve with nginx ----------------------#
FROM nginx:stable-alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


