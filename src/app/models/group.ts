export class Group {
    codigo_curso: string;
    codigo: number;
    numero: number;
    cupos: number;
    sede: string;
    codigo_matricula: string;
    nombre: string;
    id_horario: number;
    registered: boolean;
    inclusion: boolean;

    constructor(_codigo_curso:string, _codigo: number, _numero: number, _cupos: number, _sede: string, _codigo_matricula: string, _nombre: string){
        this.codigo_curso = _codigo_curso;
        this.codigo = _codigo;
        this.numero = _numero;
        this.cupos = _cupos;
        this.sede = _sede;
        this.codigo_matricula = _codigo_matricula;
        this.nombre = _nombre;
        this.registered = false;
        this.inclusion = false;
    }
}