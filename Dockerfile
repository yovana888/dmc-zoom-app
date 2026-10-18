FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Usar npm ci o npm install con banderas no interactivas
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/dmc-zoom-app/browser /usr/share/nginx/html
EXPOSE 80