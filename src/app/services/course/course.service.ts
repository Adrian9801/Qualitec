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

  getCoursesAdmin(token){
    return this.http.post(this.URL_API +'/coursesAdmin', token);
  }

  getMatricula(){
    return this.http.get(this.URL_API +'/obtenerMatricula');
  }

  abrirMatricula(token){
    return this.http.post(this.URL_API +'/abrirMatricula', token);
  }

  cerrarMatricula(token){
    return this.http.post(this.URL_API +'/cerrarMatricula', token);
  }

  getCoursesAdd(token){
    return this.http.post(this.URL_API +'/getCoursesAdd', token);
  }

  getCoursesResumen(token){
    return this.http.post(this.URL_API +'/getCoursesResumen', token);
  }

  getCoursesInclusion(token){
    return this.http.post(this.URL_API +'/getCoursesInclusion', token);
  }
}
