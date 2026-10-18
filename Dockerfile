FROM node:20-alpine AS build
WORKDIR /app

# Desactiva avisos interactivos y asigna un límite seguro de memoria RAM (1.5 GB)
ENV CI=true
ENV NODE_OPTIONS="--max-old-space-size=1536"

# Copia dependencias primero para usar la caché de Docker
COPY package*.json ./
RUN npm ci --quiet --no-audit --no-fund

# Copia el código fuente y compila rápido sin mapas de origen pesados
COPY . .
RUN npx ng build --configuration=production --source-map=false

# Servidor Nginx para la entrega final
FROM nginx:alpine
COPY --from=build /app/dist/dmc-zoom-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]