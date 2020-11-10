/*
tura: api/uploads/
*/

const { Router } = require("express");
const expressFileUpload = require("express-fileupload");
const { validarJWT, validarADMIN_ROLE_o_MismoUsuario } = require("../middlewares/validar-jwt");

const { fileUploads, retornaImagen } = require("../controllers/uploads");
const router = Router();

router.use(expressFileUpload());

router.put("/:tipo/:id", validarJWT, validarADMIN_ROLE_o_MismoUsuario, fileUploads);
router.get("/:tipo/:foto", retornaImagen);

module.exports = router;