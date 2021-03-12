FROM node:alpine

# wybór katalogu w kontenerze
WORKDIR /opt/myApp

# 1. rozwiązanie nieoptymalne:
# COPY ./ ./ # kopiowanie z bierzącego do opt
# RUN npm install
# CMD [ "npm", "start" ]


# 2. to rozwiązanie nie będzie przebudowywało całości image przy zmianie jakiegoś kodu w index.js
COPY ./package.json ./
RUN npm install
# od package.json zależy co będzie instalowane w npm
# instalowanie pakietów zajmie najdłużej, dlatego staramy się jak najrzadziej przebudowywać tą warstwę

# kopiujemy pozostałe pliki aplikacji.
COPY ./ ./
CMD [ "npm", "start" ]