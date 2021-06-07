const express = require("express"); 

const PORT = 9090;
const app = express() 

// definiowanie endPointu
app.get('/hello', (req, res) => {
    res.send("Hello World from express server")
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`)
});