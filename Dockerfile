# --- Etapa 1: Build de Angular ---
FROM node:20-alpine AS build
WORKDIR /app

# Asignar límite estricto de memoria RAM a Node (1.5 GB)
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Copiar solo archivos de dependencias primero (aprovecha la caché de Docker)
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copiar el código fuente y compilar
COPY . .
RUN npx ng build --configuration=production --output-hashing=none

# --- Etapa 2: Servidor Web Nginx ---
FROM nginx:alpine
COPY --from=build /app/dist/dmc-zoom-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]