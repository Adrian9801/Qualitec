export class Group {
    codigo_curso: string;
    codigo: number;
    numero: number;
    cupos: number;
    sede: string;
    estado: string;
    codigo_matricula: string;
    nombre: string;
    dias: string;
    aula: string;
    id_horario: number;
    registered: boolean;
    inclusion: boolean;

    constructor(_codigo_curso:string, _codigo: number, _numero: number, _cupos: number, _sede: string, _codigo_matricula: string, _nombre: string, _dias: string, _estado: string, _aula: string){
        this.update(_codigo_curso, _codigo, _numero, _cupos, _sede, _codigo_matricula, _nombre, _dias, _estado, _aula);
    }

    update(_codigo_curso:string, _codigo: number, _numero: number, _cupos: number, _sede: string, _codigo_matricula: string, _nombre: string, _dias: string, _estado: string, _aula: string) {
        this.codigo_curso = _codigo_curso;
        this.codigo = _codigo;
        this.numero = _numero;
        this.cupos = _cupos;
        this.sede = _sede;
        this.codigo_matricula = _codigo_matricula;
        this.nombre = _nombre;
        this.dias = _dias;
        this.estado = _estado;
        this.aula = _aula;
        this.modifyState(); 
    }

    modifyState(){
        if(this.estado == 'Matricular') {
            this.registered = false;
            this.inclusion = false;
        }
        else if(this.estado == 'Matriculado') {
            this.registered = true;
            this.inclusion = false;
        }
        else {
            this.registered = true;
            this.inclusion = true;
        }
    }
}