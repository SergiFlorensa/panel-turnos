# -------- deps --------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# -------- build --------
FROM deps AS build
COPY . .
RUN npm run build            # usa tsconfig.build.json
RUN npx prisma generate

# -------- runtime --------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/dist          ./dist
COPY --from=build /app/prisma        ./prisma

# el .env se monta como volumen en docker-compose, no se copia aquí
EXPOSE 3000
CMD ["node", "dist/main.js"]
