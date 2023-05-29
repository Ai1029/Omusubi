FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ポートを公開
EXPOSE 4000

# コンテナ起動時に実行するコマンドを指定
CMD ["npm", "start"]