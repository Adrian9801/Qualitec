import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataVerificationPage } from './data-verification.page';

const routes: Routes = [
  {
    path: '',
    component: DataVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataVerificationPageRoutingModule {}
