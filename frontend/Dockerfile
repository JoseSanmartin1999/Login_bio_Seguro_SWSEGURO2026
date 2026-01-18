# Etapa 1: Construcción (Build)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción Seguro
FROM nginx:stable-alpine
# Copiar el build de React a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Exponer puerto estándar web
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]