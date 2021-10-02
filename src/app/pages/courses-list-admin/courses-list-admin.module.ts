import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoursesListAdminPageRoutingModule } from './courses-list-admin-routing.module';

import { CoursesListAdminPage } from './courses-list-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoursesListAdminPageRoutingModule
  ],
  declarations: [CoursesListAdminPage]
})
export class CoursesListAdminPageModule {}
