import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groups: Group[] = [];
  readonly URL_API = 'http://localhost:8090/api/groups';

  constructor(private http: HttpClient) { }

  getGroups(){
    return this.http.get(this.URL_API);
  }

  getGroup(courseId: String, groupId: number){
    return this.http.get(this.URL_API + `/${courseId}` + `/${groupId}`);
  }

  getGroupsCourse(courseId: String){
    console.log(this.URL_API + `/${courseId}`);
    return this.http.get(this.URL_API + `/${courseId}`);
  }

  postGroup(group: Group) {
    return this.http.post(this.URL_API, group);
  }

  putGroup(group: Group, courseId: String){
    return this.http.put(this.URL_API + `/${courseId}` + `/${group.id}`, group);
  }

  deleteGroup(_id: string){
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
