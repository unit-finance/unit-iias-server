FROM node:16.4.2-alpine3.11 as builder

WORKDIR /opt/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build

FROM node:16.4.2-alpine3.11 as release

WORKDIR /opt/app

ENV NODE_ENV production
ENV PORT 80

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY --from=builder /opt/app/dist /opt/app/dist/

EXPOSE 80

CMD [ "node", "dist/index.js" ]