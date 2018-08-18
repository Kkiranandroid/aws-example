import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Myphotoall } from '../myphotoall/myphotoall';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';


@Component({
  selector: 'page-myphotoupload',
  templateUrl: 'myphotoupload.html',
})
export class Myphotoupload {
fbPics: Array<{name: string, img: string, details: string }>;
    positionList:any= [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public appdetailsProvider:AppdetailsProvider) {
      
      this.positionList = navParams.get('picpos');

      this.fbPics = [];

    this.getAllImages();
      
  }
  goToMyPhotosList(dirName){
    this.navCtrl.push(Myphotoall,{dirName:dirName,position:this.positionList});
  }

  getAllImages(){

      let methodinstance=this;
        methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT count(*) as count,directory,imageurl FROM localImagesTb group by directory", []).then((data) => {
                 if(data.rows.length > 0) {
                 
                debugger;
                 for(var i = 0; i < data.rows.length; i++) {
                 debugger;
              methodinstance.fbPics.push({name:data.rows.item(i).directory, img:data.rows.item(i).imageurl, details:data.rows.item(i).count});
                  }
                 
                } 

              }, (error) => {
                  console.log("ERROR: " + JSON.stringify(error));
              });

   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Myphotoupload');
  }

}
