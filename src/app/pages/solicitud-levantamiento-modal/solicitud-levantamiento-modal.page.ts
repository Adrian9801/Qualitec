
import { Course } from 'src/app/models/course';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { CourseService } from 'src/app/services/course/course.service';
import { RequestService } from 'src/app/services/request/request.service';
import { CourseAdd } from 'src/app/models/courseAdd';
import { AppComponent } from '../../app.component'; 

@Component({
  selector: 'app-solicitud-levantamiento-modal',
  templateUrl: './solicitud-levantamiento-modal.page.html',
  styleUrls: ['./solicitud-levantamiento-modal.page.scss'],
  providers: [LoginService, CourseService, RequestService]
})
export class SolicitudLevantamientoModalPage implements OnInit {

  cursos: CourseAdd[] = [];
  private estadoMatricula: number;

  constructor(public menu:AppComponent, private requestService: RequestService, private cookieService: CookieService, private router: Router, private loginService: LoginService, private courseService: CourseService, private alertCtrl: AlertController) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/solicitud-levantamiento-modal') {
        this.checkIfLoggedIn();
      }
    });
  }

  ngOnInit() {

  }

  onSubmit(codigo: string, nombre: string) {
    if(this.estadoMatricula == 1)
      this.presentAlert();
    else {
      let datosSolicitud = {codigo: '', nombre: ''};

      datosSolicitud.codigo = codigo;
      datosSolicitud.nombre = nombre;

      this.alertCtrl.create({
        header: 'Solicitar levantamiento',
        message: `¿Está seguro que desea solicitar levantamiento de requisitos para ${codigo}-${nombre}?`,
        cssClass: 'buttonCss',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'cancel-button',
          },
          {
            text: 'Aceptar',
            handler: () => {
              this.requestService.addRequestStudent({codCurso: codigo, token: this.cookieService.get('tokenAuth')}).subscribe(res => {
                const dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() + 15);
                this.cookieService.set('tokenAuth', res[1].token, dateNow);
          
                this.loadCourses();
              });
            } 
          }
        ]
      }).then(alertEl => alertEl.present());
    }
  }

  loadCourses(){
    this.requestService.getRequestStudent({token: this.cookieService.get('tokenAuth')}).subscribe(res => {
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 15);
      this.cookieService.set('tokenAuth', res[1].token, dateNow);

      this.cursos = res[0] as CourseAdd[];
    });
  }

  ionViewDidEnter(): void {
    this.menu.setEnable(false);
   }
   
    ionViewDidLeave(): void {
     this.menu.setEnable(true);
    }

  goHome() {
    this.router.navigateByUrl('home-student');
  }

  public async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'No se puede realizar solicitudes',
      message: 'El periodo de matrícula está iniciado, no se puede realizar solicitudes.',
      buttons: ['Entendido']
  });

    await alert.present();
  }

  verificarMatricula(){
    this.courseService.getMatricula().subscribe(res => {
      let list: Object[] = res as Object[];
      if(list.length > 0){
        this.estadoMatricula = res[0].estado;
        if(this.estadoMatricula == 1)
          this.presentAlert();
      }
    })
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
          if(!res[0].student)
            this.router.navigateByUrl('home-admin');
          else {
            this.loadCourses();
            this.verificarMatricula();
          }
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}
