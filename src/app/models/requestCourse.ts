export class RequestCourse {

    sede: string;
    codigo_curso: string;
    nombre_curso: string;
    nombre_estudiante: string;
    numero_solicitud: number;
    carnet_estudiante: number;
    estado: number;
    estado_solitud: string;
    styleSelect: {} = {};

    constructor(nombre_estudiante: string, _carnet_estudiante: number, nombre_curso: string, codigo_curso: string, _sede: string, _estado: number, _numero_solicitud: number){
        this.carnet_estudiante = _carnet_estudiante;
        this.nombre_estudiante = nombre_estudiante;
        this.nombre_curso = nombre_curso;
        this.codigo_curso = codigo_curso;
        this.sede = _sede;
        this.estado = _estado;
        this.numero_solicitud = _numero_solicitud;
        this.loadColor();
    }

    loadColor() {
        if(this.estado == 0){
            this.estado_solitud = 'Rechazar';
            this.styleSelect = {
                'color': '#EB445A',
            };
        }
        else if(this.estado == 1) {
            this.estado_solitud = 'Pendiente';
            this.styleSelect = {
                'color': '#0C1433',
            };
        }
        else {
            this.estado_solitud = 'Aceptar';
            this.styleSelect = {
                'color': '#3880FF',
            };
        }
    }
}