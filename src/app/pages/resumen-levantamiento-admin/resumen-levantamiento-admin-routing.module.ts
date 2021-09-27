import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenLevantamientoAdminPage } from './resumen-levantamiento-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ResumenLevantamientoAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenLevantamientoAdminPageRoutingModule {}
