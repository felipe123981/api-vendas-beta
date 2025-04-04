### Usage:
=======
### [+] Installing dependencies
```
yarn
```
### [+] creating docker containers
```
docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

docker run --name redis -p 6379:6379 -d -t redis:alpine

docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d -t redislabs:redisinsight:latest
```
### [+] creating database and plugin(look ormconfig.json)
```
docker exec -it postgres bash

psql -U postgres

CREATE DATABASE "apivendas";

\c api-vendas

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q

exit
```
### [+] running migrations
```
yarn typeorm migration:run
```
### [+] running aplication

```
yarn dev
```

