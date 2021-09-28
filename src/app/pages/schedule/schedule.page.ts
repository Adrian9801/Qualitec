import { EnrolledGroups } from './../../models/enrolledGroups';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { CourseService } from 'src/app/services/course/course.service';
import {AppComponent} from '../../app.component'; 

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  providers: [LoginService, CourseService]
})
export class SchedulePage implements OnInit {

  private enrolledCourses: EnrolledGroups[] = [];

  private days: { [key: string]: string; } = {
    "L" : "Lunes",
    "K" : "Martes",
    "M" : "Miércoles",
    "J" : "Jueves",
    "V" : "Viernes",
    "S" : "Sábado"
};

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(public menu:AppComponent, private cookieService: CookieService, private router: Router, private loginService: LoginService, private courseService: CourseService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/schedule') {
        this.checkIfLoggedIn();
      }
    });
   }

  ngOnInit() {

  }

  loadSchedule() {
    this.courseService.getSchedule({token: this.cookieService.get('tokenAuth')}).subscribe(res => {
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 15);
      this.cookieService.set('tokenAuth', res[1].token, dateNow);
      let enrolledCoursesTemp: EnrolledGroups[] = res[0] as EnrolledGroups[];
      
      for (let index = 0; index < enrolledCoursesTemp.length; index++) {
        let group = enrolledCoursesTemp[index];
        let listDays = group.dias.split(",");

        listDays.forEach(day => {
            this.enrolledCourses.push(new EnrolledGroups(group.numero, group.nombre, group.codigo_curso, group.profesor, group.dias, group.horaInicio, group.horaFin, group.aula, this.days[day]));
        });
      }

      this.enrolledCourses.sort(function(a, b) {
        let numDay: { [key: string]: number; } = {
          "Lunes" : 0,
          "Martes" : 1,
          "Miércoles" : 2,
          "Jueves" : 3,
          "Viernes" : 4,
          "Sábado" : 5
        };
        if (numDay[a.diaSemana] < numDay[b.diaSemana])
          return -1;
        else if (numDay[a.diaSemana] > numDay[b.diaSemana])
          return 1;
        else{
          if (+a.horaI < +b.horaI)
            return -1;
          else if (+a.horaI > +b.horaI)
            return 1;
        }
        return 0;
      });
    });
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
          else
            this.loadSchedule();
          this.menu.setEnable(false);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}
