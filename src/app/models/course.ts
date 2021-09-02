import { Group } from "./group";

export class Course {
    id: string;
    name: string;
    groups: Group[];
    credits: number;
    showGroups: boolean;

    constructor (_id: string, _name: string, _credits: number){
        this.id = _id;
        this.name = _name;
        this.credits = _credits;
        this.groups = [];
        this.showGroups = false;
    }

    addGroup(_group: Group){
        this.groups.push(_group);
    }
}