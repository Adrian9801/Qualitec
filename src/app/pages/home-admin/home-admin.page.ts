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

  public async presentAlert() {
    if (this.listaCursos.length == 0){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'No se puede iniciar periodo',
        message: 'No hay cursos abiertos para este periodo de matricula.',
        buttons: ['Entendido']
      });
  
      await alert.present();
    }
    
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
          let courseAdd: CourseAdmin = new CourseAdmin(course.codigo, course.nombre);
          this.listaCursos.push(courseAdd);

         this.groupService.getGroupsCourseAdmin({courseId: course.codigo})
          .subscribe(res2 => {
            console.log(res2[0]);
            let listaGrupos = res2 as GroupAdmin[];

            for (let group of listaGrupos){
              courseAdd.addGroup(new GroupAdmin(group.codigo, group.nombre, group.codigo_curso, group.sede, group.numero, group.cupos, group.cantidad_matriculados));
            }
          });
        }
      });
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
    if(this.listaCursos.length > 0 || this.estadoMatricula == 1){

    }
    else
      this.presentAlert();
  }

  showCourses(){
    this.ver = !this.ver;
  }

  showGroup(group: GroupAdmin){
    group.ver = !group.ver;
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
