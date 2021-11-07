export class Teacher {
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;

    constructor(_nombre: string, _cedula: string, _correo: string, _telefono: string){
        this.nombre = _nombre;
        this.cedula = _cedula;
        this.correo = _correo;
        this.telefono = _telefono;
    }
}