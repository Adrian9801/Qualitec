import { User } from './../../models/user';
import { Student } from './../../models/student';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { CookieService } from 'ngx-cookie-service'; 
import {AppComponent} from '../../app.component';
import { GroupService } from 'src/app/services/group/group.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers : [LoginService, GroupService]
})
export class ProfilePage implements OnInit {
  infoContacto: FormGroup;

  previewImage: string = 'assets/avatar.svg';
  profilePicture: File = null;

  private student: {nombre, cedula, correo, telefono, contacto_emergencia, sede, fecha_nacimiento, nombre_carrera} = {nombre: '', cedula: '', correo: '', telefono: '', contacto_emergencia: '', sede: '', fecha_nacimiento: '', nombre_carrera: ''};

  constructor(public alertController: AlertController, private groupService: GroupService, private fb: FormBuilder, private toastCtrl: ToastController, private cookieService: CookieService, public menu:AppComponent, private router: Router, private loginService: LoginService, ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/profile') {
        this.checkIfLoggedIn(true);
      }
    });
  }

  ngOnInit() {
    this.infoContacto = this.fb.group({
      contactoEmergencia: [null, [Validators.minLength(6), Validators.maxLength(15)]],
      telefonoPersonal: [null, [Validators.minLength(6), Validators.maxLength(15)]],
      correo: [null, Validators.email]
    });
  }

  loadInfo(){
    this.groupService.getStudentInfo({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        let info: {nombre, cedula, correo, telefono, contacto_emergencia, sede, fecha_nacimiento, nombre_carrera} = res[0] as {nombre, cedula, correo, telefono, contacto_emergencia, sede, fecha_nacimiento, nombre_carrera};
        info.fecha_nacimiento = info.fecha_nacimiento.substring(0, info.fecha_nacimiento.indexOf("T"));
        this.infoContacto.get('correo').setValue(info.correo);
        this.infoContacto.get('contactoEmergencia').setValue(info.contacto_emergencia);
        this.infoContacto.get('telefonoPersonal').setValue(info.telefono);
        this.student = info;
    });
  }

  onProfilePictureSelected(event){
    if (event.target.files){
      this.profilePicture = (event.target.files[0] as File);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
    }
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

  guardarCambios() {
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else {
      if(this.infoContacto.get('correo').value != null && this.infoContacto.get('telefonoPersonal').value != null && this.infoContacto.get('contactoEmergencia').value != null &&
      this.infoContacto.valid) {
        this.groupService.updateStudentInfo({correo: this.infoContacto.get('correo').value, telefono: this.infoContacto.get('telefonoPersonal').value, contacto_emergencia: this.infoContacto.get('contactoEmergencia').value, token: this.cookieService.get('tokenAuth')})
          .subscribe(res => {
            console.log(res)
            let result: {Resultado} = res[0] as {Resultado}
            if(result.Resultado == 1)
              this.checkIfLoggedIn(true);
            else {
              this.presentAlert('El correo ingresado ya existe', 'Ingrese un correo nuevo.');
              this.checkIfLoggedIn(false);
            }
        });
      }
      else
        this.presentAlert('Verifique los datos ingresados', 'Ningún campo puede quedar vacío o con datos inválidos.');
    }
  }

  checkIfLoggedIn(reload: boolean){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else {
      this.loginService.checkLogIn({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        let list = res as JSON[];
        if(list.length > 0){
          const dateNow = new Date();
          dateNow.setMinutes(dateNow.getMinutes() + 15);
          this.cookieService.set('tokenAuth', res[0].token, dateNow);
          if(res[0].student){
            this.menu.setStudent(true);
            if(reload)
              this.loadInfo();
          }
          else
            this.router.navigateByUrl('home-admin');
          this.menu.setEnable(true);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}