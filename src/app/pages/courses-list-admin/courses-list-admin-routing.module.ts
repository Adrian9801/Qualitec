import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesListAdminPage } from './courses-list-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CoursesListAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesListAdminPageRoutingModule {}
