import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';  

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

  constructor(private cookieService: CookieService, private router: Router, private loginService: LoginService, private fb: FormBuilder, public loadingController: LoadingController) { 
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/login') {
        this.checkIfLoggedIn();
        this.cookieService.delete('tokenRecovery');
      }
    });
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

  async onClickLogin(){
    this.validUser = true;
    if(this.loginForm.valid) {
      await this.presentLoading();
      this.loginService.postLogin(this.loginForm.value)
      .subscribe(res => {
        this.loading.dismiss();
        let list = res as JSON[];
        if(list.length > 0){
          const dateNow = new Date();
          dateNow.setMinutes(dateNow.getMinutes() + 15);
          this.cookieService.set('tokenAuth', res[2].tokenAuth, dateNow);
          this.loginForm.reset();
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
    if(this.cookieService.check('tokenAuth')) {
      this.loginService.checkLogIn({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        let list = res as JSON[];
        if(list.length > 0){
          const dateNow = new Date();
          dateNow.setMinutes(dateNow.getMinutes() + 15);
          this.cookieService.set('tokenAuth', res[0].token, dateNow);
          if(res[0].student)
            this.router.navigateByUrl('home-student');
          else
            this.router.navigateByUrl('home-admin');
        }
      });
    }
  }
}