import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers : [LoginService]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit() {
    this.checkIfLoggedIn();

    this.loginForm = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      pass: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  onClickLogin(){
    console.log(this.loginForm.value);

    this.loginService.postLogin(this.loginForm.value)
    .subscribe(res => {
      if(res)
        this.router.navigateByUrl('enrollment');
    });
  }

  checkIfLoggedIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(res)
        this.router.navigateByUrl('enrollment');
    });
  }

}