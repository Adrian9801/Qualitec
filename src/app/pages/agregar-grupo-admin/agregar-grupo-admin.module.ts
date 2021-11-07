import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarGrupoAdminPageRoutingModule } from './agregar-grupo-admin-routing.module';

import { AgregarGrupoAdminPage } from './agregar-grupo-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarGrupoAdminPageRoutingModule
  ],
  declarations: [AgregarGrupoAdminPage]
})
export class AgregarGrupoAdminPageModule {}
