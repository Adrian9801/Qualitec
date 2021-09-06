export class User {
    nombre: string;
    cedula: string;
    correo: string;
    student: boolean;
    telefono: string;

    constructor(_nombre: string, _cedula: string, _correo: string, _telefono: string){
        this.nombre = _nombre;
        this.cedula = _cedula;
        this.correo = _correo;
        this.telefono = _telefono;
    }

    setStudent(_student: boolean){
        this.student = _student;
    }
}