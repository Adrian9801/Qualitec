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
  private opened: boolean = false;
  private openRegister: number  = 0;
  private subTitle: string = "Matrícula cerrada";
  private colorSubtitle: string = "danger";
  private register: boolean = true;
  private showSpinner: boolean = false;
  private textButton: string = "Matricular";

  constructor(public menu:AppComponent, private courseService: CourseService, private groupService: GroupService, private loginService: LoginService, private router: Router) { 
    menu.setStudent(true);
  }

  ngOnInit() {
    //this.checkLogIn();
    this.getCourses();
  }

  getCourses(){
    this.groupService.groups = [];
    this.courseService.courses = [];
    this.courseService.getCourses()
    .subscribe(res => {
      let coursesTemp: Course[] = res[0] as Course[];
      for (let course of coursesTemp){
        let courseAux: Course = new Course(course.id,course.name,course.credits);
        this.groupService.getGroupsCourse(course.id)
        .subscribe(res => {
          let groupsTemp: Group[] = res as Group[];
          for (let group of groupsTemp){
            let groupAux: Group = new Group(group.idCourse,group.id,group.teacher,group.places)
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
        this.groupService.groups.push(new Group(group.idCourse,group.id,group.teacher,group.places));
      }
    });
  }

  registeredGroup(group: Group, course: Course){
    if(group.registered){
      if(group.places > 0){
        group.places--;
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
        group.places++;
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

  changePage(page: string){
    if(page == 'enrollment')
      window.location.reload();
    this.router.navigateByUrl(page);
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

  checkLogIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(!res)
        this.router.navigateByUrl('login');
    });
  }

  logout(){
    this.loginService.logout().subscribe(res => {
      this.changePage('login');
    });
  }
}
