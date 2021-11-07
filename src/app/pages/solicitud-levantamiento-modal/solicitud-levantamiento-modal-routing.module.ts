import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudLevantamientoModalPage } from './solicitud-levantamiento-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudLevantamientoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudLevantamientoModalPageRoutingModule {}
