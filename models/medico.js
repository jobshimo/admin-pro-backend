const { Schema, model } = require("mongoose");

const MedicoSchema = Schema({
    nombre: {
        type: String,
        requiere: true,
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
});

MedicoSchema.method("toJSON", function() {
    const { __V, ...object } = this.toObject();

    return object;
});

module.exports = model("Medico", MedicoSchema);