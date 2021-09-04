import { Group } from "./group";

export class Course {
    id: string;
    name: string;
    groups: Group[];
    credits: number;
    showGroups: boolean;
    state: string;
    color: string;

    constructor (_id: string, _name: string, _credits: number){
        this.id = _id;
        this.name = _name;
        this.credits = _credits;
        this.groups = [];
        this.showGroups = false;
        this.state = "Sin matricular";
        this.color = "danger";
    }

    addGroup(_group: Group){
        this.groups.push(_group);
    }
}