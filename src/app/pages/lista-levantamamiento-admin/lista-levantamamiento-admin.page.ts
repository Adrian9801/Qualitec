import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RequestCourse } from 'src/app/models/requestCourse';
import { CookieService } from 'ngx-cookie-service'; 
import { LoginService } from 'src/app/services/login/login.service';
import { RequestService } from 'src/app/services/request/request.service'
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-lista-levantamamiento-admin',
  templateUrl: './lista-levantamamiento-admin.page.html',
  styleUrls: ['./lista-levantamamiento-admin.page.scss'],
  providers: [LoginService, RequestService]
})
export class ListaLevantamamientoAdminPage implements OnInit {

  private solicitudes: RequestCourse[] = [];
  private solicitudesAux: RequestCourse[] = [];

  constructor(private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService, private requestService: RequestService) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/lista-levantamamiento-admin') {
        this.checkIfLoggedIn();
      }
    });
  }

  ngOnInit() {

  }

  compareFn(e1: number, e2: number): boolean {
    return e1 && e2 ? e1 == e2 : e1 == e2;
  }

  public siguiente(){
    var aceptadas = this.solicitudes.filter(item => {
        return (item.estado == 2);
    });
    var rechazadas = this.solicitudes.filter(item => {
      return (item.estado == 0);
    });
    this.router.navigateByUrl('resumen-levantamiento-admin', { state: {soliAceptadas: aceptadas, soliRechazadas: rechazadas}});
  }

  loadRequest(){
    this.solicitudesAux = this.solicitudes = [];
    this.requestService.getRequests({token: this.cookieService.get('tokenAuth')}).subscribe(res => {
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 15);
      this.cookieService.set('tokenAuth', res[1].token, dateNow);

      let requestList: RequestCourse[] = res[0] as RequestCourse[];
      requestList.forEach(element => {
        this.solicitudes.push(new RequestCourse(element.nombre_estudiante, element.carnet_estudiante, element.nombre_curso, element.codigo_curso, element.sede, element.estado, element.numero_solicitud));
      });
      this.solicitudesAux = this.solicitudes;
      if (this.solicitudes.length == 0)
        this.presentAlert();
      this.load();
    });
  }

  load(){
    var recibido = history.state
    if(recibido.solicitudes != undefined && recibido.navigationId != 1){
      for (var elem of recibido.solicitudes){
        for(var soli of this.solicitudes){
          if(soli.numero_solicitud = elem.numero_solicitud) {
            soli.estado = elem.estado;
            soli.loadColor();
          }
        }
      }
    }
  }

  public async presentAlert() {
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No hay solicitudes',
      message: 'Ningún estudiante ha realizado una solicitud de levantamiendo de requisitos para el siguiente periodo',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  SetBackground(e, solicitud: RequestCourse) {
    solicitud.estado = +e.target.value;
    solicitud.loadColor();
  }

  async filterList(evt) {
    this.solicitudes = this.solicitudesAux;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.solicitudes = this.solicitudes.filter(item => {
      if (item.nombre_estudiante && searchTerm) {
        return (item.nombre_estudiante.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
        || item.codigo_curso.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || item.nombre_curso.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || (item.carnet_estudiante+'').indexOf(searchTerm.toLowerCase()) > -1
        || (item.numero_solicitud+'').indexOf(searchTerm.toLowerCase()) > -1
        || item.sede.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  checkIfLoggedIn(){
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
          if(res[0].student)
            this.router.navigateByUrl('home-student');
          else{
            this.menu.setStudent(false);
            this.loadRequest();
          }
          this.menu.setEnable(true);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}
