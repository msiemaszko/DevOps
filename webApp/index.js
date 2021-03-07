const express = require("express"); // ładujemy moduł expressa

const app = express() // tworzymy aplikację

// definiowanie endPointu
app.get('/hello', (req, res) => {
    res.send("Hello World from express server")
});

const PORT = 9090;

app.listen(PORT, () => {
    console.log("Serwer uruchomiony!")
});