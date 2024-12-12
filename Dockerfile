FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env
COPY --from=builder /app/node_modules ./

RUN npm install --production
CMD ["node", "dist/main.js"]

# 야 docker compose 만들고 써봐라
# 그리고 일단 proxy 연결 안되는 이유좀 알아봐라 -> 환경변수 반영 안되는게 문제였음

# 정 안되면 포워딩 쓰던가
