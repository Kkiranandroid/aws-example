import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

import { ImageLoader,ImageLoaderConfig  } from 'ionic-image-loader';

@Component({
  selector: 'page-myphotoall',
  templateUrl: 'myphotoall.html',
})
export class Myphotoall {
fbtimelines: Array<{img: string}>;
    imagesList:any= [];
    positionList:any= [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public appdetailsProvider:AppdetailsProvider, public viewCtrl: ViewController,public imageLoader: ImageLoader,private imageLoaderConfig: ImageLoaderConfig) {


    imageLoader.preload('https://www.wallies.com/filebin/images/loading_apple.gif');
    imageLoaderConfig.setFallbackUrl('assets/imgs/imagecoming.png');
    imageLoaderConfig.setBackgroundSize('cover');
    imageLoaderConfig.enableFallbackAsPlaceholder(true);
    imageLoaderConfig.setCacheDirectoryName('my-custom-cache-directory-name');
    imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024);
    imageLoaderConfig.setMaximumCacheAge(60 * 60 * 1000);
    imageLoaderConfig.enableSpinner(false);
    imageLoaderConfig.enableFallbackAsPlaceholder(true);


    debugger;
    this.imagesList = navParams.get('dirName');
    this.positionList = navParams.get('position');
    debugger;

    this.fbtimelines = []
    setTimeout(() => {
    this.getAllImgInDir(this.imagesList);
    },500);
  }


  getAllImgInDir(imagesList){
    debugger;
    let methodinstance=this;
          methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM localImagesTb where directory='"+imagesList.name+"'", []).then((data) => {
                   if(data.rows.length > 0) {
                   
                  debugger;
                   for(var i = 0; i < data.rows.length; i++) {     //(data.rows.length > 10 ? 10 : data.rows.length)
                   debugger;
                      methodinstance.fbtimelines.push({img:data.rows.item(i).imageurl});
                    }
                  }
          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }

  ckickedImage(fbtimeline){
    let context=this;
    this.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+fbtimeline.img+"' WHERE position ='"+this.positionList.position+"'",[]).then((data) => {
              console.log("INSERTED: " + JSON.stringify(data));
              debugger;

               /*this.navCtrl .push(ProfilePage) .then(() => {
                  const index = this.viewCtrl.index;
                  for(let i = index; i > 1; i--){
                      this.navCtrl.remove(i);
                  }
                });*/
              
              debugger;
      }, (error) => {
              console.log("ERROR: " + JSON.stringify(error.err));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Myphotoall');
  }

}
