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

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.page.html',
  styleUrls: ['./home-student.page.scss'],
  providers : [LoginService, CourseService, GroupService]
})
export class HomeStudentPage implements OnInit {
  private listaCursos: CourseAdmin[] = [];
  private ver = false;
  private creditosMatriculados: number = 0;
  private totalPagar: number = 15000;
  private totalPagarInclusion: number = 0;

  private listaCursosInclusion: CourseAdmin[] = [];
  private verInclusion = false;
  private creditosMatriculadosInclusion: number = 0;

  constructor(private groupService: GroupService, private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService, private courseService: CourseService) { 
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/home-student') {
        this.checkIfLoggedIn();
      }
    });
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
            console.log(res2);
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
                console.log(res2);
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

  showCourses(){
    this.ver = !this.ver;
  }

  verPrecio(){
    return this.totalPagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  verPrecioI(){
    return this.totalPagarInclusion.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  showCoursesInclusion(){
    this.verInclusion = !this.verInclusion;
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
