import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { CookieService } from 'ngx-cookie-service'; 
import { CourseAdmin } from 'src/app/models/courseAdmin';
import { GroupStudent } from 'src/app/models/groupStudent';
import { RequestCourse } from 'src/app/models/requestCourse';
import { RequestService } from 'src/app/services/request/request.service';
import { Subscription } from 'rxjs-compat/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.page.html',
  styleUrls: ['./home-student.page.scss'],
  providers : [LoginService, CourseService, GroupService, RequestService]
})
export class HomeStudentPage implements OnInit {
  private listaCursos: CourseAdmin[] = [];
  private ver = false;
  private creditosMatriculados: number = 0;
  private totalPagar: number = 15000;
  private totalPagarInclusion: number = 0;

  private listaCursosInclusion: CourseAdmin[] = [];
  private verCursos = false;
  private creditosMatriculadosInclusion: number = 0;
  private estadoMatricula: boolean = false;

  private listaSolicitudes: RequestCourse[] = [];
  private aprobadas: number = 0;
  private _routerSub = Subscription.EMPTY;

  constructor(private requestService: RequestService, private groupService: GroupService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService, private courseService: CourseService) { 
  }

  ngOnInit() {
    this._routerSub = this.router.events
      .filter(event => event instanceof NavigationEnd && event.url == '/home-student')
      .subscribe((value) => {
        this.checkIfLoggedIn();
    });
  }

  ngOnDestroy(){
    this._routerSub.unsubscribe();
  }

  public async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No está en su periodo de matrícula',
      message: 'El administrador le notificará cuando se vaya a abrir la matrícula.',
      buttons: ['Entendido']
  });

    await alert.present();
  }

  loadCourses(){
    this.verificarMatricula();
    this.listaCursos = [];
    this.creditosMatriculados = 0;
    this.listaCursosInclusion = [];
    this.totalPagar = 15000;
    this.totalPagarInclusion = 0;
    this.creditosMatriculadosInclusion = 0;
    this.courseService.getCoursesResumen({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {

        let listaCursosAux = res[0] as CourseAdmin[];
        for (let course of listaCursosAux){
          let courseAdd: CourseAdmin = new CourseAdmin(course.codigo, course.nombre, course.creditos);
          this.creditosMatriculados += course.creditos;
          this.listaCursos.push(courseAdd);

        this.groupService.getGroupMatriculado({courseId: course.codigo, token: this.cookieService.get('tokenAuth')})
          .subscribe(res2 => {
            let group = res2[0] as GroupStudent;
            courseAdd.group = new GroupStudent(group.codigo, group.nombre, group.sede, group.numero, group.aula);
          });
        }
        this.totalPagar += this.creditosMatriculados*16000;
        if(this.totalPagar > 207000)
          this.totalPagar = 207000;
        this.courseService.getCoursesInclusion({token: this.cookieService.get('tokenAuth')})
          .subscribe(res2 => {

            let listaCursosAuxI = res2[0] as CourseAdmin[];
            for (let course of listaCursosAuxI){
              let courseAdd: CourseAdmin = new CourseAdmin(course.codigo, course.nombre, course.creditos);
              this.creditosMatriculadosInclusion += course.creditos;
              this.listaCursosInclusion.push(courseAdd);

              this.groupService.getGroupMatriculado({courseId: course.codigo, token: this.cookieService.get('tokenAuth')})
              .subscribe(res2 => {
                let group = res2[0] as GroupStudent;
                courseAdd.group = new GroupStudent(group.codigo, group.nombre, group.sede, group.numero, group.aula);
              });
            }
            if((207000 -this.totalPagar) > this.creditosMatriculadosInclusion*16000)
              this.totalPagarInclusion = this.creditosMatriculadosInclusion*16000
            else
              this.totalPagarInclusion = (207000 -this.totalPagar);
          });
      });
  }

  verificarMatricula(){
    this.courseService.getMatricula().subscribe(res => {
      let list: Object[] = res as Object[];
      if(list.length > 0){
        if(res[0].estado == 1){
          this.estadoMatricula = true;
        }
        else{
          this.estadoMatricula = false;
          this.aprobadas = 0;
          this.listaSolicitudes = [];
          this.requestService.getRequests({token: this.cookieService.get('tokenAuth')}).subscribe(res => {
            const dateNow = new Date();
            dateNow.setMinutes(dateNow.getMinutes() + 15);
            this.cookieService.set('tokenAuth', res[1].token, dateNow);
      
            let requestList: RequestCourse[] = res[0] as RequestCourse[];
            requestList.forEach(element => {
              if(element.estado == 2)
                this.aprobadas++;
              this.listaSolicitudes.push(new RequestCourse(element.nombre_estudiante, element.carnet_estudiante, element.nombre_curso, element.codigo_curso, element.sede, element.estado, element.numero_solicitud));
            });
          });
        }
      }
    });
  }

  showCourses(){
    this.ver = !this.ver;
  }

  verPrecio(){
    return this.totalPagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  verPrecioI(){
    return this.totalPagarInclusion.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  showCoursesStudent(){
    this.verCursos = !this.verCursos;
  }

  showGroup(course: CourseAdmin){
    course.ver = !course.ver;
  }

  go(ref: string){
    this.router.navigateByUrl(ref);
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
          if(res[0].student){
            this.menu.setStudent(true);
            this.loadCourses();
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
