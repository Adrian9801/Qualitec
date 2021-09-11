import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers : [LoginService]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  validUser: boolean = true;
  loading: HTMLIonLoadingElement;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder, public loadingController: LoadingController) { }

  ngOnInit() {
    this.checkIfLoggedIn();

    this.loginForm = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      pass: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  async presentLoading() {
    let msg = 'Verificando datos...';
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg
    });
    await this.loading.present();
  }

  onClickLogin(){
    this.validUser = true;
    if(this.loginForm.valid) {
      this.presentLoading();
      this.loginService.postLogin(this.loginForm.value)
      .subscribe(res => {
        let list = res as JSON[];
        if(list.length > 0){
          this.loginForm.reset();
          this.loading.dismiss();
          if(res[1].student)
            this.router.navigateByUrl('home-student');
          else
            this.router.navigateByUrl('home-admin');
        }
        else{
          this.validUser = false;
          this.loading.dismiss();
        }
      });
    }
  }

  onClickAccountRecovery() {
    this.loginForm.reset();
    this.router.navigateByUrl('account-recovery');
  }

  checkIfLoggedIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(res){
        this.loginService.getUser()
        .subscribe(result =>{
          let list = result as JSON[];
          if(list.length > 0){
            if(result[1].student)
              this.router.navigateByUrl('home-student');
            else
              this.router.navigateByUrl('home-admin');
          }
        });
      }
    });
  }

}