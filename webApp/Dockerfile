FROM node:alpine

# wybór katalogu
WORKDIR /opt/myApp

# rozwiązanie nieoptymalne:
# COPY ./ ./ # kopiowanie z bierzacego do opt
# RUN npm install
# CMD [ "npm", "start" ]

# to rozwiazanie nie będzie przebudowywało całości image przy zmianie jakiegoś kodu w index.js
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD [ "npm", "start" ]

