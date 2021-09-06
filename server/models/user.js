class User {
    nombre;
    cedula;
    correo;
    student;
    telefono;

    constructor(_nombre, _cedula, _correo, _telefono){
        this.nombre = _nombre;
        this.cedula = _cedula;
        this.correo = _correo;
        this.telefono = _telefono;
    }

    setStudent(_student){
        this.student = _student;
    }
}
  
module.exports = User;