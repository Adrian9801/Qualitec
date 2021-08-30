import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnrollmentControlPage } from './enrollment-control.page';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentControlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnrollmentControlPageRoutingModule {}
