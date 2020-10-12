const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        requiere: true,
    },
    email: {
        type: String,
        requiere: true,
        unique: true,
    },
    password: {
        type: String,
        requiere: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        requiere: true,
        default: "USER_ROLE",
    },
    google: {
        type: Boolean,
        default: false,
    },
});

UsuarioSchema.method("toJSON", function() {
    const { __V, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model("Usuario", UsuarioSchema);