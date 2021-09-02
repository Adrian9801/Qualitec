import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers : [LoginService]
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.checkLogIn();
  }

  login(form){
    this.loginService.postLogin(form.value)
    .subscribe(res => {
      if(res)
        this.router.navigateByUrl('enrollment');
    });
  }

  checkLogIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(res)
        this.router.navigateByUrl('enrollment');
    });
  }

}