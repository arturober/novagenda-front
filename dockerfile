FROM node:24-alpine
WORKDIR /novagenda-front
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev
CMD ["node", "dist/novagenda-front/server/server.mjs"]
