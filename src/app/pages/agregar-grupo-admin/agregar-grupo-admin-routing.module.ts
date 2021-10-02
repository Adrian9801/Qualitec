import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarGrupoAdminPage } from './agregar-grupo-admin.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarGrupoAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarGrupoAdminPageRoutingModule {}
