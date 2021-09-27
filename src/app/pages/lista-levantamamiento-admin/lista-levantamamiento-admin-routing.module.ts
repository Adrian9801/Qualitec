import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLevantamamientoAdminPage } from './lista-levantamamiento-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLevantamamientoAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaLevantamamientoAdminPageRoutingModule {}
