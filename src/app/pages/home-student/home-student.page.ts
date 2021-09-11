import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.page.html',
  styleUrls: ['./home-student.page.scss'],
  providers : [LoginService]
})
export class HomeStudentPage implements OnInit {

  constructor(public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService) { 
  }

  ngOnInit() {
    this.checkIfLoggedIn();
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
