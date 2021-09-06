import { Group } from "./group";

export class Course {
    codigo: string;
    nombre: string;
    groups: Group[];
    creditos: number;
    showGroups: boolean;
    state: string;
    color: string;

    constructor (_codigo: string, _nombre: string, _creditos: number){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.creditos = _creditos;
        this.groups = [];
        this.showGroups = false;
        this.state = "Sin matricular";
        this.color = "danger";
    }

    addGroup(_group: Group){
        this.groups.push(_group);
    }
}