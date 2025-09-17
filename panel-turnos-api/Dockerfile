# Etapa 1: dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Etapa 2: build
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build
RUN npx prisma generate

# Etapa 3: runtime
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY .env.docker .env

EXPOSE 3000
CMD ["node", "dist/main.js"]
