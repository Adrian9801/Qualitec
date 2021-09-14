import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataVerificationPageRoutingModule } from './data-verification-routing.module';

import { DataVerificationPage } from './data-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataVerificationPageRoutingModule
  ],
  declarations: [DataVerificationPage]
})
export class DataVerificationPageModule {}
