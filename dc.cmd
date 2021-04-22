@echo off

set command=%1
set container=%2

CALL :docker_%command%_%container%
GOTO :Koniec

:DOCKER_RUN_all
    call :DOCKER_RUN_postgres
    call :DOCKER_RUN_redis
    call :DOCKER_RUN_backend
    GOTO :EOF

:DOCKER_STOP_all
    call :DOCKER_STOP_postgres
    call :DOCKER_STOP_redis
    call :DOCKER_STOP_backend
    GOTO :EOF


:DOCKER_RUN_postgres
    call :GetDockerPath

    docker run ^
        --name mypostgres ^
        --network=mymulticont ^
        --rm ^
        --detach ^
        --env POSTGRES_PASSWORD=1qaz2wsx ^
        --volume %dockerPath%postgresdata:/var/lib/postgresql/data ^
        @REM --volume %dockerPath%postgresdata:/var/lib/postgresql/data ^
        --publish 5432:5432 ^
        postgres:alpine
    GOTO :EOF

:DOCKER_STOP_postgres
    docker stop mypostgres
    GOTO :EOF

:DOCKER_EXEC_postgres
    docker exec -it mypostgres sh
    GOTO :EOF

:DOCKER_RUN_backend
    echo ^> STOPPING mybackend
    docker stop mybackend
    echo ^> BUILDING mybackend
    docker build .\myBackend -t msiemaszko/mybackend
    echo ^> RUNING mybackend
    
    docker run ^
        --name mybackend ^
        --network mymulticont ^
        --rm  ^
        --publish 5000:5000 ^
        msiemaszko/mybackend
    GOTO :EOF

:DOCKER_STOP_backend
    docker stop mybackend
    GOTO :EOF

:DOCKER_RUN_redis
    docker run ^
        --name myredis ^
        --network mymulticont ^
        --rm ^
        --detach ^
        --publish 6379:6379 ^
        redis:alpine
    GOTO :EOF

:DOCKER_STOP_redis
    docker stop myredis
    GOTO :EOF

:DOCKER_EXEC_redis
    docker exec -it myredis sh
    GOTO :EOF

:GetDockerPath
    set dockerPath=%~dp0
    set dockerPath=%dockerPath:\=/%
    set dockerPath=%dockerPath::=%
    set dockerPath=/%dockerPath::=%
    GOTO :EOF
    

:Koniec