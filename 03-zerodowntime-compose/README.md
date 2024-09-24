# Zero downtime with Docker Compose

## The process

To have a zero-downtime deployment with docker compose, we need to

### Setup

Run this first to build and run the first version.

```shell
docker compose build
docker compose up -d
```

Go to `localhost:8090` and you'll see `Hello World`.

#### Change to new version 
Edit the [docker-compose.yml](docker-compose.yml) file change the lines to use the `version2` folder
```diff
-dockerfile: version1/Dockerfile
+dockerfile: version2/Dockerfile
```

_This can be done with image versions as well_

Get the current container ID by running
```shell
docker compose ps demo -q
> cdc3ccb401b2527801e...
```

#### Rebuild 
Rebuild the docker compose 
```shell
docker compose build
```

#### Scale the service to 2 
```shell
docker compose up -d --no-deps --scale demo=2 --no-recreate demo
```

#### Reload the nginx 
```shell
docker compose exec nginx /usr/sbin/nginx -s reload
```
Now accessing `localhost:8090` will give random results between `Hello world` and `Bye Universe`

#### Remove the old container
Using the above-fetched ID stop & remove the old container version
```shell
docker stop cdc3ccb401b2527801ea0fd6c16.... 
docker rm cdc3ccb401b2527801ea0fd6c16.... 
```

#### Scale back to 1 and reload nginx 
```shell
docker compose up -d --no-deps --scale demo=1 --no-recreate demo
docker compose exec nginx /usr/sbin/nginx -s reload
```

## All the commands together
1. Have a docker compose running with a previous version of our image
2. Changing to the new version
3. Rebuild or `pull` the new version
4. Scale the service to `2`
5. Reload the nginx
6. Remove the old container
7. Scale the service back to `1`
8. Reload the nginx

```shell
docker compose build
docker compose up -d
# Edit the file
docker compose ps demo -q
> cdc3ccb401b2527801e...
docker compose build
docker compose up -d --no-deps --scale demo=2 --no-recreate demo
docker compose exec nginx /usr/sbin/nginx -s reload
docker stop cdc3ccb401b2527801e.... 
docker rm cdc3ccb401b2527801e.... 
docker compose up -d --no-deps --scale demo=1 --no-recreate demo
docker compose exec nginx /usr/sbin/nginx -s reload
```
