import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilescreenPage } from './profilescreen';

@NgModule({
  declarations: [
    ProfilescreenPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilescreenPage),
  ],
})
export class ProfilescreenPageModule {}
