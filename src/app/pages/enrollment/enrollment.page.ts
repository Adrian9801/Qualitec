import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { Group } from 'src/app/models/group';
import { CourseService } from 'src/app/services/course/course.service';
import { GroupService } from 'src/app/services/group/group.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.page.html',
  styleUrls: ['./enrollment.page.scss'],
  providers: [GroupService,CourseService,LoginService]
})
export class EnrollmentPage implements OnInit {

  private courses: Course[];

  constructor(private courseService: CourseService, private groupService: GroupService, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.checkLogIn();
    this.getCourses();
  }

  getCourses(){
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

  checkLogIn(){
    this.loginService.checkLogIn()
    .subscribe(res => {
      console.log(res);
      if(!res)
        this.router.navigateByUrl('login');
    });
  }
}
