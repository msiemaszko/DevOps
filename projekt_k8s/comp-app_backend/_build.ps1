# build docker image
docker build --tag marekprezes/comp-app_backend:latest ..\projekt_docker\mybackend
# docker run --rm --publish 5000:5000 marekprezes/comp-app_backend:latest
docker push marekprezes/comp-app_backend:latest