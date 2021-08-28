import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groups: Group[];
  readonly URL_API = 'http://localhost:8090/api/groups';

  constructor(private http: HttpClient) { }

  getCourses(){
    return this.http.get(this.URL_API);
  }

  postGroup(group: Group) {
    return this.http.post(this.URL_API, group);
  }

  putGroup(group: Group){
    return this.http.put(this.URL_API + `/${group._id}`, group);
  }

  deleteGroup(_id: string){
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
