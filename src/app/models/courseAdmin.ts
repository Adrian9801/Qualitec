import { GroupAdmin } from "./groupAdmin";

export class CourseAdmin {
    codigo: string;
    nombre: string;
    ver: boolean;
    groups: GroupAdmin[];

    constructor (_codigo: string, _nombre: string){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.groups = [];
        this.ver = false;
    }

    addGroup(_group: GroupAdmin){
        this.groups.push(_group);
    }
}