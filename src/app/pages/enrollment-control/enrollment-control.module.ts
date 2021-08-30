import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnrollmentControlPageRoutingModule } from './enrollment-control-routing.module';

import { EnrollmentControlPage } from './enrollment-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnrollmentControlPageRoutingModule
  ],
  declarations: [EnrollmentControlPage]
})
export class EnrollmentControlPageModule {}
