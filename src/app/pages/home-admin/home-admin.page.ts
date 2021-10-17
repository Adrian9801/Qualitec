import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { CookieService } from 'ngx-cookie-service'; 
import { CourseAdmin } from 'src/app/models/courseAdmin';
import { GroupAdmin } from 'src/app/models/groupAdmin';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  providers : [LoginService, CourseService, GroupService]
})
export class HomeAdminPage implements OnInit {

  private listaCursos: CourseAdmin[] = [];
  private ver = false;
  private textButton1: string = "Iniciar periodo";
  private textHeader: string = "Matrícula cerrada";
  private colorSubtitle = "danger";
  private estadoMatricula: number;

  constructor(private groupService: GroupService, private courseService: CourseService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/home-admin') {
        this.checkIfLoggedIn();
      }
    });
  }

  ngOnInit() {
  }

  public async presentAlert(titulo: string, msg: string) {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: titulo,
        message: msg,
        buttons: ['Entendido']
      });
  
      await alert.present();
  }

  loadCourses(){
    this.listaCursos = [];

    this.courseService.getCoursesAdmin({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        const dateNow = new Date();
        dateNow.setMinutes(dateNow.getMinutes() + 15);
        this.cookieService.set('tokenAuth', res[1].token, dateNow);
        this.verificarMatricula();
        let listaCursosAux = res[0] as CourseAdmin[];
        for (let course of listaCursosAux){
          let courseAdd: CourseAdmin = new CourseAdmin(course.codigo, course.nombre, course.creditos);
          this.listaCursos.push(courseAdd);

         this.groupService.getGroupsCourseAdmin({courseId: course.codigo})
          .subscribe(res2 => {
            let listaGrupos = res2 as GroupAdmin[];

            for (let group of listaGrupos){
              courseAdd.addGroup(new GroupAdmin(group.codigo, group.nombre, group.codigo_curso, group.sede, group.numero, group.cupos, group.cantidad_matriculados));
            }
          });
        }
      });
  }

  async presentAlertMatricula(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: titulo,
      message: msg,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Aceptar',
          cssClass: 'buttonAlertDelete',
          handler: () => {
            if(this.estadoMatricula == 0){
              this.courseService.abrirMatricula({token: this.cookieService.get('tokenAuth')})
              .subscribe(res => {
                const dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() + 15);
                this.cookieService.set('tokenAuth', res[0].token, dateNow);
      
                this.estadoMatricula = 1;
                this.textButton1 = "Cerrar periodo";
                this.textHeader = "Matrícula abierta";
                this.colorSubtitle = "success";
                
              });
            }
            else{
              this.courseService.cerrarMatricula({token: this.cookieService.get('tokenAuth')})
              .subscribe(res => {
                const dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() + 15);
                this.cookieService.set('tokenAuth', res[0].token, dateNow);
      
                this.estadoMatricula = 0;
                this.textButton1 = "Abrir periodo";
                this.textHeader = "Matrícula cerrada";
                this.colorSubtitle = "danger";
                this.loadCourses();
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlertCupos(group: GroupAdmin) {
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else{
      const alert = await this.alertController.create({
        cssClass: 'alertCustom',
        header: 'Aumentar cupos',
        message: 'Total de cupos: ' + (group.cupos+group.cantidad_matriculados)+ '<br>Cupos restantes: '+ group.cupos,
        inputs: [
          {
            placeholder: "Número de cupos ha aumentar.",
            name: 'cupos',
            type: 'number'
          }], 
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {}
          }, {
            text: 'Aceptar',
            cssClass: 'buttonAlertDelete',
            handler: (alertData) => {
              let numCupos;
              try {
                numCupos = +alertData.cupos;
              } catch (error) {
                numCupos = null;
              }
              if(Number.isInteger(numCupos) && (numCupos > 0)){
                if(!this.cookieService.check('tokenAuth'))
                  this.router.navigateByUrl('login');
                else {
                  this.groupService.aumentarCupos({codeGroup: group.codigo, cant: numCupos, token: this.cookieService.get('tokenAuth')})
                  .subscribe(res => {
                    let groupA: GroupAdmin = res[0][0];
                    const dateNow = new Date();
                    dateNow.setMinutes(dateNow.getMinutes() + 15);
                    this.cookieService.set('tokenAuth', res[1].token, dateNow);

                    group.cupos = groupA.cupos;
                    group.cantidad_matriculados = groupA.cantidad_matriculados;
                  });
                }

              }
              else{
                this.presentAlert('Error', 'El número de cupos de ser un entero positivo');
              }
            }
          }
        ]
      });

      await alert.present();
    }
  }

  verificarMatricula(){
    this.courseService.getMatricula().subscribe(res => {
      let list: Object[] = res as Object[];
      if(list.length > 0){
        this.estadoMatricula = res[0].estado;
        if(res[0].estado == 1){
          this.textButton1 = "Cerrar periodo";
          this.textHeader = "Matrícula abierta";
          this.colorSubtitle = "success";
        }
      }
    })
  }

  modificarEstadoMatricula(){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else if(this.listaCursos.length > 0 || this.estadoMatricula == 1){
      if(this.estadoMatricula == 0){
        if(this.listaCursos.length <= 0)
          this.presentAlert('No se puede iniciar periodo', 'No hay cursos abiertos para este periodo de matricula.');
        else
          this.presentAlertMatricula('Abrir periodo de matrícula', '¿Está seguro que quieres abrir el periodo de matrícula?');
      }
      else{
        this.presentAlertMatricula('Cerrar periodo de matrícula', '¿Está seguro que quieres cerrar el periodo de matrícula?');
      }
    }
    else
      this.presentAlert('No se puede iniciar periodo', 'No hay cursos abiertos para este periodo de matrícula.');
  }

  showCourses(){
    this.ver = !this.ver;
  }

  showGroup(group: GroupAdmin){
    group.ver = !group.ver;
  }

  addCourse(){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else
      this.router.navigateByUrl('courses-list-admin');
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
            this.loadCourses();
          }
          this.menu.setEnable(true);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }
}
