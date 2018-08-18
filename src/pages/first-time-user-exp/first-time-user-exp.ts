import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides  } from 'ionic-angular';
import { SettingsmainPage } from '../settingsmain/settingsmain';
import { ProfilescreenPage } from '../profilescreen/profilescreen';

@IonicPage()
@Component({
  selector: 'page-first-time-user-exp',
  templateUrl: 'first-time-user-exp.html',
})
export class FirstTimeUserExpPage {
    
    @ViewChild(Slides) slides: Slides;
    navigationSections:boolean = false;
    isNewUser:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.isNewUser = navParams.get('isNewUser');
  }

     slideChanged() {
         let currentIndex = this.slides.getActiveIndex();
         if(currentIndex >= 1){
             this.navigationSections = true;
         }else{
             this.navigationSections = false;
         }
     }
    slideNext(){
        debugger;
        let currentIndex = this.slides.getActiveIndex();
         if(currentIndex == 4){
             this.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:this.isNewUser});
         }else{
             this.slides.slideNext();
         }
    }
    slidePrev(){
        this.slides.slidePrev();
    }
     
     gotoSettingsmainPage(){
         //methodinstance.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:false});
         this.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:this.isNewUser});
     }

     goToProfilePage(){
         this.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:this.isNewUser});
     }
}
