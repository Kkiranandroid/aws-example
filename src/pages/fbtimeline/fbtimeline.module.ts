import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Fbtimeline } from './fbtimeline';

@NgModule({
  declarations: [
    Fbtimeline,
  ],
  imports: [
    IonicPageModule.forChild(Fbtimeline),
  ],
})
export class FbtimelineModule {}
