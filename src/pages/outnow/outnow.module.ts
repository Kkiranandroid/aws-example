import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Outnow } from './outnow';

@NgModule({
  declarations: [
    Outnow,
  ],
  imports: [
    IonicPageModule.forChild(Outnow),
  ],
})
export class OutnowModule {}
