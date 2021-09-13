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

  checkLogIn(token) {
    return this.http.post(this.URL_API+'/checkLogIn', token);
  }

  sendToken(formulario) {
    return this.http.post(this.URL_API+'/sendMail', formulario);
  }

  verifyMail(mail: string) {
    return this.http.get(this.URL_API+'/recovery'+ `/${mail}`);
  }

  checkCode(tokenVerify) {
    return this.http.post(this.URL_API+'/checkCode', tokenVerify);
  }

  updatePass(tokenNewPass) {
    return this.http.post(this.URL_API+'/updatePass', tokenNewPass);
  }
}
