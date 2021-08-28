import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'
import { Course } from 'src/app/models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  readonly URL_API = 'http://localhost:8090/api/courses';

  courses: Course[] = [];

  constructor(private http: HttpClient) { }

  getCourses(){ 
    return this.http.get(this.URL_API);
  }


}
