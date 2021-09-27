import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaLevantamamientoAdminPageRoutingModule } from './lista-levantamamiento-admin-routing.module';

import { ListaLevantamamientoAdminPage } from './lista-levantamamiento-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaLevantamamientoAdminPageRoutingModule
  ],
  declarations: [ListaLevantamamientoAdminPage]
})
export class ListaLevantamamientoAdminPageModule {}
