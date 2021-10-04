
import { Course } from 'src/app/models/course';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-solicitud-levantamiento-modal',
  templateUrl: './solicitud-levantamiento-modal.page.html',
  styleUrls: ['./solicitud-levantamiento-modal.page.scss'],
})
export class SolicitudLevantamientoModalPage implements OnInit {

  @Input() cursos: Course[];


  cursosTemp = [{codigo: 'IC8291', nombre: 'Aseg calidad'}, {codigo: 'IC3293', nombre: 'Diseño de software'}, {codigo: 'IC7392', nombre: 'Practica'}, {codigo: 'IC732', nombre: 'Algebra'}];

  constructor(
    private alertCtrl: AlertController) { }

  ngOnInit() {

  }

  onDeleteGroup(idGrupo: string) {

  }


  onSubmit(codigo: string, nombre: string) {
    let datosSolicitud = {codigo: '', nombre: ''};

    datosSolicitud.codigo = codigo;
    datosSolicitud.nombre = nombre;

    this.alertCtrl.create({
      header: 'Solicitar levantamiento',
      message: `¿Está seguro que desea solicitar levantamiento de requisitos para ${codigo}-${nombre}?`,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button',
        },
        {
          text: 'Aceptar',
/*           handler: () => {
            this.dataService.guardarSolicitud()
              .then(() => {

                // Lo que pasa si se crea exitosamente la solicitud de levantamiento
                //this.showToast('Se eliminó el grupo exitosamente.', 'success');
              }).catch(e => {
                // Lo que pasa si no se crea exitosamente la solicitud de levantamiento
                //this.showToast('Error eliminando el grupo.', 'warning');
              });
          } */
        }
      ]
    }).then(alertEl => alertEl.present());



  }

}
