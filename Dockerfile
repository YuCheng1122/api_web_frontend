FROM node:18-alpine

WORKDIR /app

# 首先只複製package文件
COPY package*.json ./
# 複製環境變數文件
COPY .env.local ./.env

# 安裝依賴
RUN npm install

# 然後複製所有源代碼
COPY . .

# 構建應用
RUN npm run build

EXPOSE 3000

# 使用生產模式啟動
CMD ["npm", "start"]