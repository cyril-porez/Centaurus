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
EXPOSE 3000
CMD ["npm", "start"]

#------------------- Step 3 Build for production ------------------#
FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST=$REACT_APP_API_HOST
RUN npm run build

#-------------------- Step 4 Serve with nginx ----------------------#
FROM nginx:stable-alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# ARG api_url
# ENV API_HOST=$api_url
# ENV NEXT_PUBLIC_API_HOST=$api_url
# # ENV API_URL "https://site-atelier-back-deployment.dev.atelier.ovh/"

# #Installer le dependances
# RUN npm install

# #Copier le reste des fichiers
# COPY . .

# # 🔥 Ajoute cette ligne pour voir le contenu avant build
# RUN ls -la /usr/src/app

# #Construire l'application
# RUN npm run build

# # 🔥 Vérifie si le build a bien été créé
# RUN ls -la /usr/src/app/build

# #etape de configuration du serveur nginx
# FROM nginx:stable-alpine

# #Supprimer la configuration par défaut Nginx
# RUN rm -rf /etc/nginx/conf.d/default.conf

# #Copier les fichier de l'application vers le dossier de Nginx
# COPY --from=build /usr/src/app/build /usr/share/nginx/html

# #Copier la configuration Nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# #Exposer le port 80
# EXPOSE 80

# #lancer Nginx
# CMD ["nginx", "-g", "daemon off;"]
