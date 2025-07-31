FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Copiar variables de entorno si necesitas usarlas dentro del contenedor
# (recomendado: pasar desde docker-compose)
EXPOSE 10000
CMD ["node", "src/index.js"]
