import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';
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
  textButton: string = "Enviar token";
  title: string = "Recuperar cuenta";
  step: string = 'first';
  showError: boolean = false;

  constructor(private router: Router, private loginService: LoginService, private fb: FormBuilder) { }

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

  onUpdatePassword(){
    if(this.step == 'first') {
      if(this.accountRecoverForm.valid) {
        this.loginService.verifyMail(this.accountRecoverForm.value.correo)
        .subscribe(res => {
          let list = res as JSON[];
          if(list.length > 0){
            this.loginService.sendToken({Correo: this.accountRecoverForm.value.correo, Code: res[0].code}).subscribe(result =>{
              this.step = 'second';
              this.textButton = 'Verificar token';
              this.accountRecoverForm.reset();
            });
          }
          else{
            console.log("no existe");
            //Correo no existe.
          }
        });
      }
    }
    else if(this.step == 'second') {
      if(this.accountRecoverForm.value.token != null) {
        this.loginService.checkCode(this.accountRecoverForm.value.token)
        .subscribe(res => {
          if(res){
            this.step = 'third';
            this.textButton = 'Cambiar contraseña';
            this.accountRecoverForm.reset();
          }
          else{
            console.log("El token no es correcto");
          }
        });
      }
      else {
        this.showError = true;
      }
    }
    else {
      if(this.changePasswordForm.valid) {
        this.loginService.updatePass(this.changePasswordForm.value.newPass)
        .subscribe(res => {
          if(res){
            this.changePasswordForm.reset();
            this.router.navigateByUrl('login')
          }
          else{
            console.log("No se actualizo");
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