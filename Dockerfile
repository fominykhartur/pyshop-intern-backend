FROM node:16.20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:16.20-alpine

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV DATABASE_URL=file:./dev.db
ENV JWT_SECRET=PYSHOP
 
EXPOSE 80

CMD [  "npm", "run", "start:migrate:prod" ]

