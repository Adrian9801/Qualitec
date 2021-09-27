import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenLevantamientoAdminPageRoutingModule } from './resumen-levantamiento-admin-routing.module';

import { ResumenLevantamientoAdminPage } from './resumen-levantamiento-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenLevantamientoAdminPageRoutingModule
  ],
  declarations: [ResumenLevantamientoAdminPage]
})
export class ResumenLevantamientoAdminPageModule {}
