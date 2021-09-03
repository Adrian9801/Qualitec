import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeStudentPageRoutingModule } from './home-student-routing.module';

import { HomeStudentPage } from './home-student.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeStudentPageRoutingModule
  ],
  declarations: [HomeStudentPage]
})
export class HomeStudentPageModule {}
