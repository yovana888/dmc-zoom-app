# 1. Declarar la variable de entorno de compilación (dev, cert, production, etc.)
ARG BUILD_ENV=production

# Stage 1: Build de la aplicación Angular
FROM node:20-alpine AS build
WORKDIR /app

# Re-declarar ARG para que esté disponible en esta etapa
ARG BUILD_ENV

COPY package*.json ./
RUN npm install
COPY . .

# Compila usando la configuración que le pases por parámetro (desde JenkisFile)
RUN npx ng build --configuration=${BUILD_ENV}

# Stage 2: Servidor Web NGINX
FROM nginx:alpine
COPY --from=build /app/dist/dmc-zoom-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]