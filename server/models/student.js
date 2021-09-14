User = require("./user");

class Student extends User {

    carnet;
    fecha_nacimiento;
    contacto_emergencia;
    codigo_plan;
    sede;

    constructor(_nombre, _cedula, _correo, _student, _telefono, _carnet, _fecha_nacimiento, _contacto_emergenci, _codigo_plan, _sede){
        super(_nombre, _cedula, _correo, _telefono);
        this.carnet = _carnet;
        this.fecha_nacimiento = _fecha_nacimiento;
        this.contacto_emergencia = _contacto_emergencia;
        this.codigo_plan = _codigo_plan;
        this.sede = _sede;
    }
}

module.exports = Student;