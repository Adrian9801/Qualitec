export class Group {
    idCourse: string;
    id: number;
    teacher: string;
    places: number;

    constructor(_idCourse:string, _id: number, _teacher: string, _places: number){
        this.idCourse = _idCourse;
        this.id = _id;
        this.teacher = _teacher;
        this.places = _places;
    }
}