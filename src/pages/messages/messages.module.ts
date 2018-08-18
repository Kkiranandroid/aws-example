import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Messages } from './messages';

@NgModule({
  declarations: [
    Messages,
  ],
  imports: [
    IonicPageModule.forChild(Messages),
  ],
})
export class MessagesModule {}
