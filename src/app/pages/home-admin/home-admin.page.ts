import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  public listaCursos = [];

  constructor(menu:AppComponent,public alertController: AlertController) { 
    menu.setStudent(false);
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

  ngOnInit() {
  }

}
