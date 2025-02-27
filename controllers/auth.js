const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");


const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Correo o contraseña no validos",
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Correo o contraseña no validos",
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token

    try {

        const { name, email, picture } = await googleVerify(googleToken);


        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })

        } else {
            // Existe el usuario

            usuario = usuarioDB
            usuario.google = true;

        }
        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);
        res.json({

            ok: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        })
    } catch (error) {

        res.status(401).json({

            ok: false,
            msg: 'Token no es correcto',

        })

    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por UID

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            msg: "No existe un usuario con ese id",
        });
    }


    res.json({

        ok: true,
        token,
        usuarioDB,
        menu: getMenuFrontEnd(usuarioDB.role)
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
};