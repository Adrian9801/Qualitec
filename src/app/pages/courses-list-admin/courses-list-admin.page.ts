import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { CourseService } from 'src/app/services/course/course.service';
import { AppComponent } from '../../app.component'; 
import { CourseAdd } from 'src/app/models/courseAdd';
import { Subscription } from 'rxjs-compat/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-courses-list-admin',
  templateUrl: './courses-list-admin.page.html',
  styleUrls: ['./courses-list-admin.page.scss'],
  providers: [LoginService, CourseService]
})
export class CoursesListAdminPage implements OnInit {

  private cursos: CourseAdd[] = [];
  private cursosAux: CourseAdd[] = [];
  private _routerSub = Subscription.EMPTY;

  constructor(private loginService: LoginService, private courseService: CourseService, public menu:AppComponent, private cookieService: CookieService, private router: Router) { 
    this._routerSub = this.router.events
      .filter(event => event instanceof NavigationEnd && event.url == '/courses-list-admin')
      .subscribe((value) => {
        this.checkIfLoggedIn();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this._routerSub.unsubscribe();
  }

  async filterList(evt) {
    this.cursos = this.cursosAux;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.cursos = this.cursos.filter(item => {
      if (item.nombre && searchTerm) {
        return (item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
        || item.codigo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  seleccionado(curso){
    if(!this.cookieService.check('tokenAuth'))
      this.router.navigateByUrl('login');
    else
      this.router.navigateByUrl('agregar-grupo-admin', { state: curso });
  }

  goHome(){
    this.router.navigateByUrl('home-admin');
  }

  loadCourses(){
    this.courseService.getCoursesAdd({token: this.cookieService.get('tokenAuth')}).subscribe(res => {
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 15);
      this.cookieService.set('tokenAuth', res[1].token, dateNow);
      this.cursos = res[0];
      this.cursosAux = this.cursos;
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
            this.loadCourses();
          else
            this.router.navigateByUrl('home-admin');
          this.menu.setEnable(false);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }

}
