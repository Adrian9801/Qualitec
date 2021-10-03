export class CourseAdd {
    codigo: string;
    nombre: string;
    creditos: number;

    constructor (_codigo: string, _nombre: string, _creditos: number){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.creditos = _creditos;
    }
}