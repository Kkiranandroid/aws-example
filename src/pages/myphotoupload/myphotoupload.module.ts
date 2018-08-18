import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Myphotoupload } from './myphotoupload';

@NgModule({
  declarations: [
    Myphotoupload,
  ],
  imports: [
    IonicPageModule.forChild(Myphotoupload),
  ],
})
export class MyphotouploadModule {}
