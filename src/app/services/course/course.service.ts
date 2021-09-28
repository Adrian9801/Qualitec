import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'
import { Course } from 'src/app/models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  readonly URL_API = 'http://localhost:8090/api';

  courses: Course[] = [];

  constructor(private http: HttpClient) { }

  getCourses(token){ 
    return this.http.post(this.URL_API + '/courses', token);
  }

  getSchedule(token){
    return this.http.post(this.URL_API +'/schedule', token);
  }
}
