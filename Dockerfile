# Etapa de construcción
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build:prod

# Etapa de producción
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json del servidor e instalar dependencias
COPY server-package.json package.json
RUN npm install --only=production

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist/mybank-web/browser ./public

# Copiar servidor
COPY server.js ./

# Exponer puerto (Cloud Run maneja esto automáticamente)
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["node", "server.js"] 