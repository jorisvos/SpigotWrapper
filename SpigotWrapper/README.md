# SpigotWrapper backend

This is the C# project for the backend

## Production build (using Docker)

Run the command bellow from the root of SpigotWrapper repo to build the production docker image.

```bash
docker build -f SpigotWrapper/Dockerfile -t spigot-wrapper:prod .
```

---

Run the command bellow to start the docker image:

```bash
docker run -it --rm \
  -p 1443:443 \
  -v ${HOME}/.aspnet/https:/https/ \
  -e ASPNETCORE_Kestrel__Certificates__Default__Password=$PASSWORD \
  spigot-wrapper:prod
```

Replace $PASSWORD with the password used for your https certificates (if you don't know the password use the password of your computer).

---

Navigate to `https://localhost:1443/api/v1/status` to open the app.

### Docker compose

To build and run with docker compose run `docker-compose -f SpigotWrapper/compose.yml up -d --build` from the root of the repo.
