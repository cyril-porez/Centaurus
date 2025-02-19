FROM --platform=linux/x86-64 node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

ARG api_url
ENV API_HOST=$api_url
ENV NEXT_PUBLIC_API_HOST=$api_url
# ENV API_URL "https://site-atelier-back-deployment.dev.atelier.ovh/"

#Installer le dependances
RUN npm install

#Copier le reste des fichiers
COPY . .

#Construire l'application
RUN npm run build

#etape de configuration du serveur nginx
FROM --platform=linux/x86-64 nginx:stable-alpine

#Supprimer la configuration par défaut Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

#Copier les fichier de l'application vers le dossier de Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

#Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

#Exposer le port 80
EXPOSE 80

#lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
