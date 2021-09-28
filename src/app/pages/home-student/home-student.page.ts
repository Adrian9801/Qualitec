import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.page.html',
  styleUrls: ['./home-student.page.scss'],
  providers : [LoginService]
})
export class HomeStudentPage implements OnInit {

  constructor(private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService) { 
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
            this.router.navigateByUrl('home-admin');
          this.menu.setEnable(true);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }
}
