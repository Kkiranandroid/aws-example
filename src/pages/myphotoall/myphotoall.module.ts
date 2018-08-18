import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Myphotoall } from './myphotoall';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    Myphotoall,
  ],
  imports: [
  IonicImageLoader,
    IonicPageModule.forChild(Myphotoall),
  ],
})
export class MyphotoallModule {}
