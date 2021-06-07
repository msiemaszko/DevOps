# 1. Wybieramy obraz bazowy
FROM alpine:latest

# 2. Instalujemy w nim zależności niezbędne do uruchomienia procesu głównego (Dependences)
RUN apk add --update redis
# ... 

# dla celów edukacyjnych - nie robimy tego.
RUN apk add --update nginx

RUN echo "Hello World"

# 3. Ustawienie "procesu głównego"
CMD redis-server