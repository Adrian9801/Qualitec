import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RequestCourse } from 'src/app/models/requestCourse';
import { CookieService } from 'ngx-cookie-service'; 
import { LoginService } from 'src/app/services/login/login.service';
import { RequestService } from 'src/app/services/request/request.service'
import { AppComponent } from '../../app.component';
import { Subscription } from 'rxjs-compat/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-resumen-levantamiento-admin',
  templateUrl: './resumen-levantamiento-admin.page.html',
  styleUrls: ['./resumen-levantamiento-admin.page.scss'],
  providers: [LoginService, RequestService]
})
export class ResumenLevantamientoAdminPage implements OnInit {

  public aceptadas: RequestCourse[] = [];
  public rechazadas: RequestCourse[] = [];
  public tamano = 0;
  public tamanoRechazadas = 0;
  public ver = false;
  public verRechazadas = false;
  private _routerSub = Subscription.EMPTY;

  constructor(private loginService: LoginService, private requestService: RequestService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router) {
    this._routerSub = this.router.events
      .filter(event => event instanceof NavigationEnd && event.url == '/resumen-levantamiento-admin')
      .subscribe((value) => {
        this.checkIfLoggedIn();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this._routerSub.unsubscribe();
  }

  load(){
    var recibido = history.state
    this.aceptadas = [];
    this.rechazadas = [];
    if(recibido.soliAceptadas != undefined){
      for (var elem of recibido.soliAceptadas){
        this.aceptadas.push(elem)
      }
      for (var elem of recibido.soliRechazadas){
        this.rechazadas.push(elem)
      }
    }
    else {
      this.router.navigateByUrl('lista-levantamamiento-admin');
    }
    this.tamano = this.aceptadas.length;
    this.tamanoRechazadas = this.rechazadas.length;
  }

  public atras(){
    this.aceptadas = this.aceptadas.concat(this.rechazadas);
    this.router.navigateByUrl('lista-levantamamiento-admin', { state: {solicitudes: this.aceptadas}});
  }

  acordion(){
    this.ver = !this.ver
  }

  acordionRechazadas(){
    this.verRechazadas = !this.verRechazadas
  }

  public async presentAlert() {
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Actualizar solicitudes',
        message: 'Se aceptarán y rechazarán todas las solicitudes seleccionadas, las demas quedarán en pendiente.',
        buttons: [
          {
            text: 'Volver',
            role: 'cancel',
            cssClass: 'Danger'
          }, {
            text: 'Aceptar',
            handler: () => {
              this.updateRequests();
            }
          }
        ]
      });

      await alert.present();
    }
  }

  updateRequests(){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else {
      this.aceptadas.forEach(element => {
        this.requestService.updateRequests({carnet: element.carnet_estudiante, codCurso: element.codigo_curso, estado: 2, token: this.cookieService.get('tokenAuth')}).subscribe(res => {
  
        });
      });
      this.rechazadas.forEach(element => {
        this.requestService.updateRequests({carnet: element.carnet_estudiante, codCurso: element.codigo_curso, estado: 0, token: this.cookieService.get('tokenAuth')}).subscribe(res2 => {

        });
      });
      this.router.navigateByUrl('home-admin');
    }
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
            this.load();
          }
          this.menu.setEnable(false);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}
