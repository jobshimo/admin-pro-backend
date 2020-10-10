require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// UrFFtj9y23Iivz1w
// mean_user

// Rutas
app.get("/", (req, res) => {
    res.json({
        ok: true,
        msg: "hola mundo",
    });
});

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en puerto " + process.env.PORT);
});