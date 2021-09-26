import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-levantamamiento-admin',
  templateUrl: './lista-levantamamiento-admin.page.html',
  styleUrls: ['./lista-levantamamiento-admin.page.scss'],
})
export class ListaLevantamamientoAdminPage implements OnInit {

  public solicitudes = []
  public solicitudesAux = []  

  constructor(public alertController: AlertController,private router: Router) { }

  ngOnInit() {
    this.solicitudes = 
    [{ sede: 'San Jose',solicitud: '920',curso: 'IC7602 Rede',nombre: 'Juan Perez',carnet: '20181132105', isChecked: false },
    { sede: 'Cartago',solicitud: '921',curso: 'IC7602 Rede',nombre: 'Marcelo',carnet: '2019846251', isChecked: false },
    { sede: 'San Carlos',solicitud: '922',curso: 'IC7602 Rede',nombre: 'Cristiano Ronaldo',carnet: '07', isChecked: false },]
    this.solicitudesAux = this.solicitudes
    
    if (this.solicitudes.length == 0){
      this.presentAlert()
    }
  }

  public siguiente(){
    var aceptadas = this.solicitudes.filter(item => {
        return (item.isChecked == true);
    });
    this.router.navigateByUrl('resumen-levantamiento-admin', { state: aceptadas });
  }

  public async presentAlert() {
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No hay solicitudes',
      message: 'Ningún estudiante ha realizado una solicitud de levantamiendo de requisitos para el siguiente periodo',
      buttons: ['Entendido']
    });

    await alert.present();
    this.router.navigateByUrl('home-admin');
  }


  async filterList(evt) {
    this.solicitudes = this.solicitudesAux;
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.solicitudes = this.solicitudes.filter(item => {
      if (item.nombre && searchTerm) {
        return (item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 
        || item.curso.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || item.carnet.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || item.solicitud.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        || item.sede.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

}
