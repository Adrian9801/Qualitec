import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlMatriculaAdminPage } from './control-matricula-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ControlMatriculaAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlMatriculaAdminPageRoutingModule {}
