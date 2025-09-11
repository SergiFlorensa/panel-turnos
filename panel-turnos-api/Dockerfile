# Etapa 1: dependencias
FROM node:22-alpine AS deps
WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci 

# Prisma: generar cliente
COPY prisma ./prisma
RUN npx prisma generate

# Etapa 2: build
FROM deps AS build
COPY . .
RUN npm run build

# Etapa 3: imagen final
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copiamos sólo lo necesario
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY .env .env

EXPOSE 3000
CMD ["node", "dist/main.js"]
