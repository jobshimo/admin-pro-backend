/*
    Medicos
    ruta: 'api/medico'
*/

const { Router, response } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarADMIN_ROLE_o_MismoUsuario, validarADMIN_ROLE } = require("../middlewares/validar-jwt");

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
} = require("../controllers/medico");

const router = Router();

router.get("/", validarJWT, getMedicos);
router.post(
    "/", [
        validarJWT,
        check("nombre", "El nombre del medico es necesario").not().isEmpty(),
        check("hospital", "El hospital id debe ser válido").isMongoId(),
        validarCampos,
    ],
    crearMedico
);

router.put("/:id", [
    validarJWT,
    check("nombre", "El nombre del medico es necesario").not().isEmpty(),
    check("hospital", "El hospital id debe ser válido").isMongoId(),
    validarCampos,
    validarADMIN_ROLE_o_MismoUsuario
], actualizarMedico);
router.delete("/:id", validarJWT, validarADMIN_ROLE, borrarMedico);
router.get("/:id", validarJWT, getMedicoById);

module.exports = router;