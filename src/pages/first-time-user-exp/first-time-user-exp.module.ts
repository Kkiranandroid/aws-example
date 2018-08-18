import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstTimeUserExpPage } from './first-time-user-exp';

@NgModule({
  declarations: [
    FirstTimeUserExpPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstTimeUserExpPage),
  ],
})
export class FirstTimeUserExpPageModule {}
