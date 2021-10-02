export class GroupAdmin {
    codigo: number;
    codigo_curso: string;
    nombre: string;
    sede: string;
    numero: number;
    cupos: number;
    ver: boolean;
    cantidad_matriculados: number;

    constructor (_codigo: number, _nombre: string, _codigo_curso: string, _sede: string, _numero: number, _cupos: number, _cantidad_matriculados: number){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.codigo_curso = _codigo_curso;
        this.numero = _numero;
        this.cupos = _cupos;
        this.cantidad_matriculados = _cantidad_matriculados;
        this.sede = _sede;
        this.ver = false;
    }
}