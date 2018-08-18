import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the MatchmultiavailabilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-matchmultiavailability',
  templateUrl: 'matchmultiavailability.html',
})
export class MatchmultiavailabilityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchmultiavailabilityPage');
  }


  
  goBack(){
      const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
    }
}
