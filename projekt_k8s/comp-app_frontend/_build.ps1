docker build `
    --tag marekprezes/comp-app_frontend:latest `
    --file $PSScriptRoot\Dockerfile.prod `
    $PSScriptRoot\..\..

# docker run --rm --publish 80:80 marekprezes/comp-app_frontend:latest
docker push marekprezes/comp-app_frontend:latest