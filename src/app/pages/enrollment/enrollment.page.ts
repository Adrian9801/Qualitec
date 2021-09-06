import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { Group } from 'src/app/models/group';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { LoginService } from 'src/app/services/login/login.service';
import {AppComponent} from '../../app.component';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.page.html',
  styleUrls: ['./enrollment.page.scss'],
  providers: [GroupService,CourseService,LoginService]
})
export class EnrollmentPage implements OnInit {

  private courses: Course[];
  private title: string = "Lista de cursos";
  private openRegister: number = 0;
  private subTitle: string = "Matrícula cerrada";
  private colorSubtitle: string = "danger";
  private register: boolean = true;
  private showSpinner: boolean = false;
  private textButton: string = "Matricular";

  constructor(public menu:AppComponent, private courseService: CourseService, private groupService: GroupService, private loginService: LoginService, private router: Router) { 
  }

  ngOnInit() {
    this.checkIfLoggedIn();
    this.getCourses();
  }

  getCourses(){
    this.groupService.groups = [];
    this.courseService.courses = [];
    this.courseService.getCourses()
    .subscribe(res => {
      console.log(res[0]);
      let coursesTemp: Course[] = res[0] as Course[];
      for (let course of coursesTemp){
        let courseAux: Course = new Course(course.codigo,course.nombre,course.creditos);
        this.groupService.getGroupsCourse(course.codigo)
        .subscribe(res => {
          let groupsTemp: Group[] = res as Group[];
          for (let group of groupsTemp){
            let groupAux: Group = new Group(group.codigo_curso, group.codigo, group.numero, group.cupos, group.sede, group.codigo_matricula, group.nombre);
            this.groupService.groups.push(groupAux);
            courseAux.groups.push(groupAux);
          }
          this.courseService.courses.push(courseAux);
          this.courses = this.courseService.courses;
          this.showSpinner = false;
        });
      }
    });
  }
  
  getGroups(){
    this.groupService.getGroups()
    .subscribe(res => {
      let groupsTemp: Group[] = res[0] as Group[];
      for (let group of groupsTemp){
        this.groupService.groups.push(new Group(group.codigo_curso, group.codigo, group.numero, group.cupos, group.sede, group.codigo_matricula, group.nombre));
      }
    });
  }

  registeredGroup(group: Group, course: Course){
    if(group.registered){
      if(group.cupos > 0){
        group.cupos--;
        course.state = "Matriculado";
      }
      else{
        group.inclusion = true;
        course.state = "Inclusión";
      }
      course.color = "success";
      for(let groupTemp of course.groups){
        if(groupTemp != group && groupTemp.registered == true){
          groupTemp.registered = false;
          break;
        }
      }
    }
    else {
      if(!group.inclusion){
        group.cupos++;
      }
      group.inclusion = false;
      for(let groupTemp of course.groups){
        if(groupTemp.registered == true){
          return;
        }
      }
      course.state = "Sin matricular";
      course.color = "danger";
    }
  }

  reload(){
    this.showSpinner = true;
    if(this.openRegister == 0){
      this.openRegister = 1;
      this.subTitle = "Matrícula abierta";
      this.colorSubtitle = "success"
    }
    this.getCourses();
  }

  back(){
    this.openRegister = 1;
    this.register = true;
    this.title = "Lista de cursos";
    this.textButton = "Matricular";
    this.getCourses();
  }

  enroll(){
    this.openRegister = 2;
    this.title = "Mi matrícula";
    this.register = false;
    this.textButton = "Siguente";
    this.getCourses();
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
              this.menu.setStudent(true);
            else
              this.router.navigateByUrl('home-admin');
          }
        });
      }
      else
        this.router.navigateByUrl('login');
    });
  }
}
