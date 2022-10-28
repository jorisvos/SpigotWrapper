# spigot-wrapper-gui

This is the frontend for the SpigotWrapper

## Production build (using Docker)

Replace <repo> with the path to your repo (~/code/SpigotWrapper/spigot-wrapper-gui)
Run `docker build -a REACT_APP_BACKEND_BASE_URL=https://localhost:1443/api/v1/ -v <repo>/certs:/etc/nginx/certs -t spigot-wrapper-gui:prod .` to build production docker image.
Run `docker run -it --rm -p 443:443 spigot-wrapper-gui:prod` to start the docker image.
Edit your hosts file (with `sudo nano /etc/hosts`) and add `127.0.0.1 spigot-wrapper.local`
Navigate to `https://spigot-wrapper.local/` to open the app.

### Docker compose

To build and run with docker compose run `docker-compose up -d --build`

## Setup SSL for Nginx Docker container

Replace <repo> with the path to your repo (~/code/SpigotWrapper/spigot-wrapper-gui)

Past the following lines one for one (because you have to add input) [\*](https://msol.io/blog/tech/create-a-self-signed-ssl-certificate-with-openssl/)

```bash
openssl genrsa -out <repo>/certs/key.pem 2048
openssl req -new -sha256 -key <repo>/certs/key.pem -out <repo>/certs/csr.csr
openssl req -x509 -sha256 -days 365 -key <repo>/certs/key.pem -in <repo>/certs/csr.csr -out <repo>/certs/certificate.pem
openssl req -in <repo>/certs/csr.csr -text -noout | grep -i "Signature.*SHA256" && echo "All is well" || echo "This certificate will stop working in 2017! You must update OpenSSL to generate a widely-compatible certificate"
```

## Learn More about create-react-app

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
