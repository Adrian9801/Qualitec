import { Component, OnInit, HostListener } from '@angular/core';
import { Course } from 'src/app/models/course';
import { Group } from 'src/app/models/group';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { LoginService } from 'src/app/services/login/login.service';
import {AppComponent} from '../../app.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Student } from 'src/app/models/student';
import { CookieService } from 'ngx-cookie-service'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.page.html',
  styleUrls: ['./enrollment.page.scss'],
  providers: [GroupService,CourseService,LoginService]
})
export class EnrollmentPage implements OnInit {

  private courses: Course[];
  private user: Student;
  private isClick: boolean = false;
  private waitOne: boolean = false;
  private waitTwo: boolean = false;
  private title: string = "Lista de cursos";
  private openRegister: number = 0;
  private subTitle: string = "Matrícula cerrada";
  private colorSubtitle: string = "danger";
  private register: boolean = true;
  private showSpinner: boolean = false;
  private textButton: string = "Matricular";

  constructor(public alertController: AlertController, private cookieService: CookieService, public menu:AppComponent, private courseService: CourseService, private groupService: GroupService, private loginService: LoginService, private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/enrollment') {
        this.checkIfLoggedIn();
        this.load();
      }
    });
  }

  ngOnInit() {
  }

  load(){
    this.isClick = false;
    this.waitOne = false;
    this.waitTwo = false;
    this.title = "Lista de cursos";
    this.openRegister = 0;
    this.subTitle = "Matrícula cerrada";
    this.colorSubtitle = "danger";
    this.register = true;
    this.showSpinner = false;
    this.textButton = "Matricular";
  }
  
  getCourses(){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else{
      this.groupService.groups = [];
      this.courseService.courses = [];
      this.courseService.getCourses({token: this.cookieService.get('tokenAuth')})
      .subscribe(res => {
        const dateNow = new Date();
        dateNow.setMinutes(dateNow.getMinutes() + 15);
        this.cookieService.set('tokenAuth', res[1].token, dateNow);
        let coursesTemp: Course[] = res[0] as Course[];
        if(coursesTemp.length == 0)
          this.presentAlertE('No hay cursos', 'No se ha agregado ningún grupo que puedas matricular.');
        let pos = 0;
        for (let course of coursesTemp){
          let courseAux: Course = new Course(course.codigo,course.nombre,course.creditos, pos);
          this.courseService.courses.push(courseAux);
          pos++;
         this.groupService.getGroupsCourse({codigo: course.codigo, carnet: this.user.carnet, token: this.cookieService.get('tokenAuth')})
          .subscribe(res => {
            let groupsTemp: Group[] = res as Group[];
            for (let group of groupsTemp){
              if(group.estado != 'Matricular') {
                courseAux.state = group.estado;
                courseAux.color = "success";
              }
              let groupAux: Group = new Group(group.codigo_curso, group.codigo, group.numero, group.cupos, group.sede, group.codigo_matricula, group.nombre, group.dias, group.estado, group.aula);
              groupAux.estado = 'Matricular';
              this.groupService.groups.push(groupAux);
              courseAux.addGroup(groupAux);
            }
            this.courses = this.courseService.courses;
          });
        }
        this.showSpinner = false;
      });
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async detectClick(){
    if(this.openRegister < 2 && !this.waitOne){
      this.waitOne = true;
      if(!this.isClick){
        let index = 0;
        let size = this.courses.length;
        for(;index < size; index++){
          let course = this.courses[index];
          this.courses.splice(course.pos,1);
          await this.delay(0);
          this.courses.splice(course.pos, 0, course);
          course.showGroups = false;
        }
      }
      this.isClick = false;
      this.waitOne = false;
    }
  }

  async showGroups(course: Course){
    if(!this.waitTwo){
      this.waitTwo = true;
      if(this.openRegister < 2){
        this.isClick = true;
        if(!course.showGroups){
          for(let courseTemp of this.courses){
            courseTemp.showGroups = false;
          }
          if(course.state != 'Sin matricular'){
            course.groups = course.groupsAux;
            this.courses.splice(course.pos,1);
            await this.delay(0);
            this.courses.splice(course.pos, 0, course);
          }
        }
        else if(course.state != 'Sin matricular'){
          course.groups = [];
          this.courses.splice(course.pos,1);
          await this.delay(0);
          this.courses.splice(course.pos, 0, course);
        }
      }
      course.showGroups = !course.showGroups;
      this.waitTwo = false;
    }
  }

  public async presentAlert(title: string, msg: string, group: Group) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      buttons: ['Entendido']
    });

    await alert.present();
    group.registered = false;
  }

  public async presentAlertE(title: string, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: msg,
      buttons: ['Entendido']
    });

    await alert.present();
  }


  checkHours(hour1: string, hour2: string){
    let hour1List: string[] = hour1.split("-");
    let hour2List: string[] = hour2.split("-");

    let hour1I: number = +(hour1List[0].replace(':',''));
    let hour1F: number = +(hour1List[1].replace(':',''));

    let hour2I: number = +(hour2List[0].replace(':',''));
    let hour2F: number = +(hour2List[1].replace(':',''));

    if((hour1I <= hour2I && hour1F >= hour2I) || (hour2I <= hour1I && hour2F >= hour1I) || (hour1F <= hour2F && hour1I >= hour2F) || (hour2F <= hour1F && hour2I >= hour1F))
      return true;
    return false;
  }

  checkScheduleClash(group: Group){
    let listGroups: Group[] = [];
    this.groupService.groups.forEach(element => {
      if(element.registered && element.codigo_curso != group.codigo_curso)
        listGroups.push(element);
    });
    
    let listSchedule: string[] = group.dias.split(" ");
    let Hours: string = listSchedule[1];

    for(let element of listGroups){
      let listScheduleElement: string[] = element.dias.split(" ");
      let hoursElement: string = listScheduleElement[1];
      for (let index = 0; index < listSchedule.length; index+=2) {
        for (let indexElement = 0; indexElement < listScheduleElement.length; indexElement+=2) {
          if(listSchedule[index] == listScheduleElement[indexElement])
            if(this.checkHours(Hours, hoursElement))
              return true;
        }
      }
    }
    return false;
  }

  registeredGroup(group: Group, course: Course, primary: boolean){
    if(this.cookieService.check('tokenAuth')){
      this.courseService.getMatricula().subscribe(res => {
        let list: Object[] = res as Object[];
        if(list.length > 0){
          if(res[0].estado == 1){
            if(group.registered){
              if(this.checkScheduleClash(group)){
                this.presentAlert('Choque de horario', 'Hay un conflicto con el horario de otro curso.', group);
                return;
              }
              this.register = true;
              this.groupService.UpdateGroupCourse({codigo: group.codigo, cupos: -1, carnet: this.user.carnet, token: this.cookieService.get('tokenAuth')})
              .subscribe(res => {
                const dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() + 15);
                this.cookieService.set('tokenAuth', res[1].token, dateNow);
                let groupA = res[0][0] as Group;
                group.update(groupA.codigo_curso, groupA.codigo, groupA.numero, groupA.cupos, groupA.sede, groupA.codigo_matricula, groupA.nombre, groupA.dias, groupA.estado, groupA.aula);
                course.state = group.estado;
                course.color = "success";
                for(let groupTemp of course.groups){
                  if(groupTemp != group && groupTemp.registered == true){
                    this.registeredGroup(groupTemp, course, false);
                    groupTemp.registered = false;
                    return;
                  }
                }
                this.register = false;
              });
            }
            else {
              this.groupService.UpdateGroupCourse({codigo: group.codigo, cupos: 1, carnet: this.user.carnet, token: this.cookieService.get('tokenAuth')})
              .subscribe(res => {
                const dateNow = new Date();
                dateNow.setMinutes(dateNow.getMinutes() + 15);
                this.cookieService.set('tokenAuth', res[1].token, dateNow);
                let groupA = res[0][0] as Group;
                group.update(groupA.codigo_curso, groupA.codigo, groupA.numero, groupA.cupos, groupA.sede, groupA.codigo_matricula, groupA.nombre, groupA.dias, groupA.estado, groupA.aula);
                this.register = false;
                if(!primary){
                  return;
                }
                course.state = "Sin matricular";
                course.color = "danger";
              });
            }
          }
          else{
            this.menu.setEnable(true);
            this.title = "Lista de cursos";
            this.openRegister = 0;
            this.subTitle = "Matrícula cerrada";
            this.colorSubtitle = "danger";
            this.register = true;
            this.textButton = "Matricular";
            this.getCourses();
          }
        }
      });
    }
    else
      this.checkIfLoggedIn();
  }

  verificarMatricula(){
    this.courseService.getMatricula().subscribe(res => {
      let list: Object[] = res as Object[];
      if(list.length > 0){
        if(res[0].estado == 1){
          if(this.openRegister <= 1){
            this.openRegister = 1;
            this.subTitle = "Matrícula abierta";
            this.colorSubtitle = "success"
            this.register = true;
            this.title = "Lista de cursos";
            this.textButton = "Matricular";
            this.menu.setEnable(true);
          }
          else{
            this.subTitle = "Matrícula abierta";
            this.colorSubtitle = "success"
            this.menu.setEnable(true);
            this.openRegister = 2;
            this.title = "Mi matrícula";
            this.register = false;
            this.textButton = "Ver Resumen";
          }
        }
        else{
          this.menu.setEnable(true);
          this.title = "Lista de cursos";
          this.openRegister = 0;
          this.subTitle = "Matrícula cerrada";
          this.colorSubtitle = "danger";
          this.register = true;
          this.textButton = "Matricular";
        }
        this.getCourses();
        this.showSpinner = false;
      }
    });
  }

  reload(){
    if(this.cookieService.check('tokenAuth')){
      this.showSpinner = true;
      this.verificarMatricula();
    }
    else
      this.router.navigateByUrl('login');
  }

  enroll(){
    this.openRegister = 2;
    this.verificarMatricula();
  }

  goHome(){
    this.router.navigateByUrl('home-student');
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
            this.user = res[0].user;
            this.verificarMatricula();
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
