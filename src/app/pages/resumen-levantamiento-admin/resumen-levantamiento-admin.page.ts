import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-resumen-levantamiento-admin',
  templateUrl: './resumen-levantamiento-admin.page.html',
  styleUrls: ['./resumen-levantamiento-admin.page.scss'],
})
export class ResumenLevantamientoAdminPage implements OnInit {

  public aceptadas = []
  public tamano = 0
  public ver = false

  constructor(public alertController: AlertController,private router: Router) {

  }

  ngOnInit() {
    var recibido = history.state
    for (var elem in recibido){
      this.aceptadas.push(recibido[elem])
    }
    this.aceptadas.pop()
    console.log(this.aceptadas)
    this.tamano = this.aceptadas.length
  }

  acordion(){
    this.ver = !this.ver
  }

  public async presentAlert() {
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aceptar solicitudes',
      message: 'Se aceptarán todas las solicitudes seleccionadas, las demas quedarán en pendiente.',
      buttons: [
        {
          text: 'Volver',
          role: 'cancel',
          cssClass: 'Danger'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('home-admin');
          }
        }
      ]
    });

    await alert.present();
    
  }

}
