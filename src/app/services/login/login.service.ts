import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly URL_API = 'http://localhost:8090/api';

  constructor(private http: HttpClient) { }

  postLogin(user) {
    return this.http.post(this.URL_API+'/loginUser', user);
  }

  checkLogIn() {
    return this.http.get(this.URL_API+'/checkLogIn');
  }

  getUser() {
    return this.http.get(this.URL_API+'/getUser');
  }

  logout() {
    return this.http.get(this.URL_API+'/logout');
  }

  sendToken(formulario) {
    return this.http.post(this.URL_API+'/sendMail', formulario);
  }

  verifyMail(mail: string) {
    return this.http.get(this.URL_API+'/recovery'+ `/${mail}`);
  }

  checkCode(code: string) {
    return this.http.get(this.URL_API+'/checkCode'+ `/${code}`);
  }

  updatePass(password: string) {
    return this.http.get(this.URL_API+'/updatePass'+ `/${password}`);
  }
}
