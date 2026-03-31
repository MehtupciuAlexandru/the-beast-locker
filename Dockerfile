FROM node:20

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build && npm run build:dashboard

EXPOSE 3000

CMD ["npm", "run", "start"]