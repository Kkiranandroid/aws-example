import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Education } from './education';

@NgModule({
  declarations: [
    Education,
  ],
  imports: [
    IonicPageModule.forChild(Education),
  ],
})
export class EducationModule {}
