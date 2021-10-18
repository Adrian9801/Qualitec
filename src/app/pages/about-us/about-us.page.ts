import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { LoginService } from 'src/app/services/login/login.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
import { Subscription } from 'rxjs-compat/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  providers: [LoginService]
})
export class AboutUsPage implements OnInit {
  private title: string = "Acerca de nosotros";
  private opened: boolean = false;
  private _routerSub = Subscription.EMPTY;

  constructor(private cookieService: CookieService, public menu:AppComponent, private router: Router, private loginService: LoginService) { 
    this._routerSub = this.router.events
    .filter(event => event instanceof NavigationEnd && event.url == '/about-us')
    .subscribe((value) => {
        this.checkIfLoggedIn();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this._routerSub.unsubscribe();
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
            this.menu.setStudent(true);
          else
            this.menu.setStudent(false);
          this.menu.setEnable(true);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }
}
