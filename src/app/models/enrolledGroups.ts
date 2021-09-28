export class EnrolledGroups {
    numero: number;
    nombre: string;
    codigo_curso: string;
    profesor: string;
    dias: string;
    horaInicio: string;
    horaFin: string;
    horaF: string;
    horaI: string;
    aula: string;
    diaSemana: string;

    constructor(_numero: number, _nombre: string, _codigo_curso: string, _profesor: string, _dias: string, _horaInicio: string, _horaFin: string, _aula: string, _diaSemana: string){
        this.codigo_curso = _codigo_curso;
        this.numero = _numero;
        this.nombre = _nombre;
        this.dias = _dias;
        this.aula = _aula;
        this.profesor = _profesor;
        this.horaInicio = _horaInicio;
        this.horaFin = _horaFin;
        this.diaSemana = _diaSemana;
        this.addData();
    }

    addData(){
        this.horaI = this.horaInicio.replace(':','');
        this.horaF = this.horaFin.replace(':','');
    }

}