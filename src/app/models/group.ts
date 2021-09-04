export class Group {
    idCourse: string;
    id: number;
    teacher: string;
    places: number;
    registered: boolean;
    inclusion: boolean;

    constructor(_idCourse:string, _id: number, _teacher: string, _places: number){
        this.idCourse = _idCourse;
        this.id = _id;
        this.teacher = _teacher;
        this.places = _places;
        this.registered = false;
        this.inclusion = false;
    }
}