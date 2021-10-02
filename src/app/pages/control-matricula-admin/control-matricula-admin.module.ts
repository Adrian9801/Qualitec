import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlMatriculaAdminPageRoutingModule } from './control-matricula-admin-routing.module';

import { ControlMatriculaAdminPage } from './control-matricula-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlMatriculaAdminPageRoutingModule
  ],
  declarations: [ControlMatriculaAdminPage]
})
export class ControlMatriculaAdminPageModule {}
