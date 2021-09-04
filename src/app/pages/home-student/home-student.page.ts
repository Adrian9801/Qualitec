import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.page.html',
  styleUrls: ['./home-student.page.scss'],
})
export class HomeStudentPage implements OnInit {

  constructor(public menu:AppComponent, public alertController: AlertController) { 
    menu.setStudent(true);
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

  ngOnInit() {
  }

}
