import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Gender } from './gender';

@NgModule({
  declarations: [
    Gender,
  ],
  imports: [
    IonicPageModule.forChild(Gender),
  ],
})
export class GenderModule {}
