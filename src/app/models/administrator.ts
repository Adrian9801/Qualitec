import { User } from "./user";

export class Administrator extends User {

    constructor(_nombre: string, _cedula: string, _correo: string, _student: boolean, _telefono: string){
        super(_nombre, _cedula, _correo, _telefono);
    }
}