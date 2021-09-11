import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.page.html',
  styleUrls: ['./account-recovery.page.scss'],
  providers : [LoginService]
})
export class AccountRecoveryPage implements OnInit {
  accountRecoverForm: FormGroup;
  changePasswordForm: FormGroup;
  loading: HTMLIonLoadingElement;
  textButton: string = "Enviar código";
  title: string = "Recuperar cuenta";
  step: string = 'first';
  showError: boolean = false;

  constructor(public alertController: AlertController, public loadingController: LoadingController, private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit() {
    this.checkIfLoggedIn();

    this.accountRecoverForm = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
      token: [null, []]});

    this.changePasswordForm = this.fb.group({
      newPass: [null, [Validators.required, Validators.minLength(8)]],
      confirmPass: [null, [Validators.required, Validators.minLength(8)]]
    },
    {validator: this.matchPassword('newPass', 'confirmPass')});
  }

  async presentLoading() {
    let msg = 'Enviando correo...';
    if(this.step == 'second') 
      msg = 'Verificando el código...'
    else if(this.step == 'third')
      msg = 'Cambiando contraseña...'
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: msg
    });
    await this.loading.present();
  }

  public async presentAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      buttons: ['Entendido']
  });

    await alert.present();
  }

  onUpdatePassword(){
    if(this.step == 'first') {
      this.presentLoading();
      if(this.accountRecoverForm.valid) {
        this.loginService.verifyMail(this.accountRecoverForm.value.correo)
        .subscribe(res => {
          let list = res as JSON[];
          if(list.length > 0){
            this.loginService.sendToken({Correo: this.accountRecoverForm.value.correo, Code: res[0].code}).subscribe(result =>{
              this.loading.dismiss();
              this.step = 'second';
              this.textButton = 'Verificar código';
              this.accountRecoverForm.reset();
            });
          }
          else{
            this.loading.dismiss();
            this.presentAlert('Correo inválido', 'La dirección de correo electrónico ingresada no existe en nuestro sistema.');
          }
        });
      }
    }
    else if(this.step == 'second') {
      this.presentLoading();
      if(this.accountRecoverForm.value.token != null) {
        this.loginService.checkCode(this.accountRecoverForm.value.token)
        .subscribe(res => {
          if(res){
            this.loading.dismiss();
            this.step = 'third';
            this.textButton = 'Cambiar contraseña';
            this.accountRecoverForm.reset();
          }
          else{
            this.loading.dismiss();
            this.presentAlert('Código inválido', 'El código ingresado no es válido.');
          }
        });
      }
      else {
        this.showError = true;
      }
    }
    else {
      if(this.changePasswordForm.valid) {
        this.presentLoading();
        this.loginService.updatePass(this.changePasswordForm.value.newPass)
        .subscribe(res => {
          if(res){
            this.loading.dismiss();
            this.changePasswordForm.reset();
            this.router.navigateByUrl('login');
          }
          else{
            this.loading.dismiss();
            this.presentAlert('Error de actualización', 'La contraseña no se actualizó correctamente. El tiempo de espera ya expiro.');
          }
        });
      }
    }
  }

  matchPassword(newPass, confirmPass): ValidatorFn {
 
    return (control: AbstractControl): ValidationErrors | null => {
 
      const password = control.get(newPass).value;
      const confirm = control.get(confirmPass).value;
 
      if (password != confirm) { return { 'noMatch': true } }
 
      return null
 
    }
  }

  onBack(){
    if(this.step == 'first') {
      this.accountRecoverForm.reset();
      this.router.navigateByUrl('login');
    }
    else if(this.step == 'second') {
      this.accountRecoverForm.reset();
      this.textButton = "Enviar código";
      this.title = "Recuperar cuenta";
      this.step = 'first';
    }
    else {
      this.step = 'second';
      this.textButton = 'Verificar código';
      this.changePasswordForm.reset();
    }
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