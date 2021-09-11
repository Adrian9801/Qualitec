import { Group } from "./group";

export class Course {
    codigo: string;
    nombre: string;
    groups: Group[];
    groupsAux: Group[];
    creditos: number;
    showGroups: boolean;
    state: string;
    color: string;
    pos: number;

    constructor (_codigo: string, _nombre: string, _creditos: number, _pos: number){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.creditos = _creditos;
        this.groups = [];
        this.groupsAux = [];
        this.showGroups = false;
        this.pos = _pos;
        this.state = "Sin matricular";
        this.color = "danger";
    }

    addGroup(_group: Group){
        this.groups.push(_group);
        this.groupsAux.push(_group);
    }
}