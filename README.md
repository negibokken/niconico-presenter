# niconico presenter

## Required

* Node.js (v10.17.0)
* yarn (1.19.1)

## Run service with docker-compose

1. Run below commands

    ```sh
    yarn docker:build
    yarn docker:up
    ```

2. Access `http://localhost:3000`

## Run service locally

For development you can do like below:

```sh
docker run --name my-mysql -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mysql:5.7
mysql -u root --password=password -h 127.0.0.1 < db_init/1_create_table.sql
yarn dev:start
```

NOTE: configure your DB more securely in production environment.

