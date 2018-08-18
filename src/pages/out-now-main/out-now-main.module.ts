import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutNowMainPage } from './out-now-main';

@NgModule({
  declarations: [
    OutNowMainPage,
  ],
  imports: [
    IonicPageModule.forChild(OutNowMainPage),
  ],
})
export class OutNowMainPageModule {}
