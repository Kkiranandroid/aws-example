import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Datelist } from './datelist';

@NgModule({
  declarations: [
    Datelist,
  ],
  imports: [
    IonicPageModule.forChild(Datelist),
  ],
})
export class DatelistModule {}
