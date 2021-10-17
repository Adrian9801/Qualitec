export class Schedule {
    dias: string;
    horaInicio: string;
    horaFin: string;

    constructor (_dias: string, _horaInicio: string, _horaFin: string){
        this.dias = _dias;
        this.horaInicio = _horaInicio;
        this.horaFin = _horaFin;
    }
}