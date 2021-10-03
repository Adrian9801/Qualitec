export class GroupStudent {
    codigo: number;
    nombre: string;
    sede: string;
    numero: number;
    aula: string;

    constructor (_codigo: number, _nombre: string, _sede: string, _numero: number, _aula: string){
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.numero = _numero;
        this.sede = _sede;
        this.aula = _aula;
    }
}