Usage:
=======
/home/api-vendas$ yarn
/home/api-vendas$ docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
/home/api-vendas$ docker run --name redis -p 6379:6379 -d -t redis:alpine
/home/api-vendas$ docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d -t redislabs:redisinsight:latest
/home/api-vendas$ yarn dev


