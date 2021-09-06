User = require("./user");

class Administrator extends User {

    constructor(_nombre, _cedula, _correo, _student, _telefono){
        super(_nombre, _cedula, _correo, _telefono);
    }
}

module.exports = Administrator;