import { GroupAdmin } from "./groupAdmin";
import { GroupStudent } from "./groupStudent";

export class CourseAdmin {
    codigo: string;
    nombre: string;
    creditos: number;
    ver: boolean;
    groups: GroupAdmin[];
    group: GroupStudent;

    constructor (_codigo: string, _nombre: string, _creditos: number){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.creditos = _creditos;
        this.groups = [];
        this.ver = false;
    }

    addGroup(_group: GroupAdmin){
        this.groups.push(_group);
    }
}