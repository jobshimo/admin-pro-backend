const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUploads = (req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipos
    const tiposValidos = ["hospitales", "medicos", "usuarios"];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: "No es un medio, usuario u hospital",
        });
    }
    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay nungún archivo",
        });
    }

    // console.log(req.fi)
    // Procesar la imagen...
    const file = req.files.imagen;

    const nombreCortado = file.name.split("."); //wolverine.1.3.jpg
    const extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extencion
    const extecionesValidas = ["png", "jpg", "jpeg", "gif"];

    if (!extecionesValidas.includes(extencionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: "No es una extencion permitida",
        });
    }
    // Generar la extencion del archivo
    const nombreArchivo = `${uuidv4()}.${extencionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                ok: false,
                msg: "Error al mover la imagen",
            });
        }

        // Actualizar la DB
        actualizarImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: " Archivo subido",
            nombreArchivo,
        });
    });
};

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg)
    }



}



module.exports = {
    fileUploads,
    retornaImagen
};