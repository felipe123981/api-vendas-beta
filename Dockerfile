FROM node:alpine

WORKDIR /user/app

COPY . .

RUN npm install

EXPOSE 3333

CMD npm run dev
