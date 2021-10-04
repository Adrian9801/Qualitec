import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudLevantamientoModalPageRoutingModule } from './solicitud-levantamiento-modal-routing.module';

import { SolicitudLevantamientoModalPage } from './solicitud-levantamiento-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudLevantamientoModalPageRoutingModule
  ],
  declarations: [SolicitudLevantamientoModalPage]
})
export class SolicitudLevantamientoModalPageModule {}
