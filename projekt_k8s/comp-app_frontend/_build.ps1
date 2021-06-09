# build react app:
cd ..\..\projekt_docker\myfrontend\
yarn build
Copy-Item -Path .\build\* -Destination ..\projekt_k8s\comp-app_frontend\frontapp\ -Recurse -Force
cd ..\..\projekt_k8s\comp-app_frontend

# build docker image
docker build --tag marekprezes/comp-app_frontend:latest .
# docker run --rm --publish 80:80 marekprezes/comp-app_frontend:latest
docker push marekprezes/comp-app_frontend:latest