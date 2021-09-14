import { User } from "./user";

export class Student extends User {

    carnet: number;
    fecha_nacimiento: string;
    contacto_emergencia: string;
    codigo_plan: string;
    sede: string;

    constructor(_nombre: string, _cedula: string, _correo: string, _student: boolean, _telefono: string, _carnet: number, _fecha_nacimiento: string, _contacto_emergencia: string, _codigo_plan: string, _sede: string){
        super(_nombre, _cedula, _correo, _telefono);
        this.carnet = _carnet;
        this.fecha_nacimiento = _fecha_nacimiento;
        this.contacto_emergencia = _contacto_emergencia;
        this.codigo_plan = _codigo_plan;
        this.sede = _sede;
    }
}