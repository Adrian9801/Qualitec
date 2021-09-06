import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';
import { Router } from  "@angular/router";
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  providers : [LoginService]
})
export class HomeAdminPage implements OnInit {

  public listaCursos = [];

  constructor(public menu:AppComponent, public alertController: AlertController, private router: Router, private loginService: LoginService) { 
  }

  ngOnInit() {
    this.checkIfLoggedIn();
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
    this.loginService.checkLogIn()
    .subscribe(res => {
      if(res){
        this.loginService.getUser()
        .subscribe(result =>{
          let list = result as JSON[];
          if(list.length > 0){
            if(result[1].student)
              this.router.navigateByUrl('home-student');
            else
              this.menu.setStudent(false);
          }
        });
      }
      else
        this.router.navigateByUrl('login');
    });
  }

}
