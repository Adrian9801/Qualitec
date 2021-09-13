import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  providers : [LoginService]
})
export class HomeAdminPage implements OnInit {

  public listaCursos = [];

  constructor(private cookieService: CookieService, public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == '/home-admin') {
        this.checkIfLoggedIn();
      }
    });
  }

  ngOnInit() {
  }

  public async presentAlert() {
    if (this.listaCursos.length == 0){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'No se puede iniciar periodo',
        message: 'No hay cursos abiertos para este periodo de matricula.',
        buttons: ['Entendido']
      });
  
      await alert.present();
    }
    
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
            this.router.navigateByUrl('home-student');
          else
            this.menu.setStudent(false);
        }
        else
          this.router.navigateByUrl('login');
      });
    }
  }
}
