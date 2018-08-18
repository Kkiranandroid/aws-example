import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsmainPage } from './settingsmain';

@NgModule({
  declarations: [
    SettingsmainPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsmainPage),
  ],
})
export class SettingsmainPageModule {}
