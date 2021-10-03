import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  readonly URL_API = 'http://localhost:8090/api';

  constructor(private http: HttpClient) { }

  getRequests(data){
    return this.http.post(this.URL_API+'/requestCourse', data);
  }

  updateRequests(data){
    return this.http.post(this.URL_API+'/updateRequestCourse', data);
  }

  addRequestStudent(data){
    return this.http.post(this.URL_API+'/addRequestStudent', data);
  }

  getRequestStudent(data){
    return this.http.post(this.URL_API+'/getRequestStudent', data);
  }
}
