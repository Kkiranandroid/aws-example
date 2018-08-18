import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Occupation } from './occupation';

@NgModule({
  declarations: [
    Occupation,
  ],
  imports: [
    IonicPageModule.forChild(Occupation),
  ],
})
export class OccupationModule {}
