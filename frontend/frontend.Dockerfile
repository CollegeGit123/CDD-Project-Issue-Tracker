FROM node:20-alpine AS build

WORKDIR /app

RUN apk update && apk upgrade

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk update && apk upgrade

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]