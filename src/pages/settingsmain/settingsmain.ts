import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,AlertController, ModalController,Platform } from 'ionic-angular';
import { SettingsubPage } from '../settingsub/settingsub';

import { HomePage } from '../home/home';
import { ProfilescreenPage } from '../profilescreen/profilescreen';
import { Messages } from '../messages/messages';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { DragulaService } from 'ng2-dragula';

import { ViewprofilePage } from '../viewprofile/viewprofile';

import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

@IonicPage()
@Component({
  selector: 'settingsmain',
  templateUrl: 'settingsmain.html',
})
export class SettingsmainPage {
profilepic:any;  
myFullName:any;  
myAge:any;  
toolBarIconColorMsg:any = "";

//defaultImage:any= 'assets/imgs/defoult_profile_pic.jpg';
defaultImage:any= 'assets/imgs/imagecoming.jpg';
offset:any  = 100;

  constructor(public navCtrl: NavController, 
              public platform: Platform,
              private diagnostic: Diagnostic,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              public appdetailsProvider:AppdetailsProvider,
              public modalCtrl: ModalController,
              private dragulaService: DragulaService,
              private imageResizer: ImageResizer,
              public viewCtrl: ViewController) {

        if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        } else {
           this.toolBarIconColorMsg='';
        }
        
        debugger;
        this.profilepic=localStorage.getItem("profilepic");
        this.myFullName=localStorage.getItem("fullName");
        this.myAge=localStorage.getItem("age");

        //this.createThumbnail(this.profilepic);
        /*if(appdetailsProvider.globleProfileImages.length>0) {
          for (var i = 0; i < appdetailsProvider.globleProfileImages.length; i++) {
           if(+(appdetailsProvider.globleProfileImages[i].position)==1) {
             this.profilepic=appdetailsProvider.globleProfileImages[i].profilepic;
             break;
           }
          }
        }*/

        
   
        setTimeout(() => {
          this.getprofileData();
          try{
            if(localStorage.getItem('selectedCity').length == 0) {
             setTimeout(() => {
                this.myLocation();
             },500);
          }
          }catch(Exception){
            localStorage.setItem('selectedCity','');
          }
          
        },1000);
  }

 
  
  getprofileData() {
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb WHERE position='1'", []).then((data) => {
             if(data.rows.length > 0) {
               this.profilepic = data.rows.item(0).imageurl;   
               localStorage.setItem("profilepic",this.profilepic); 
               this.myFullName=localStorage.getItem("fullName");
               this.myAge=localStorage.getItem("age");         
            }
          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }

  goToSetting(){
  this.navCtrl.push(SettingsubPage);
  }
 profilePage(){
      this.navCtrl.push(ProfilescreenPage);
  }
  goBack(){
    //const index = this.viewCtrl.index;
    // then we remove it from the navigation stack
    //this.navCtrl.remove(index);
    this.navCtrl.pop({animate: true, direction:'forward'});
  }
  messagePage() {
     let methodcontext=this;
    
     methodcontext.navCtrl.push(Messages).then(() => {
       const index = methodcontext.viewCtrl.index;
       for(let i = index; i >0; i--) {
           methodcontext.navCtrl.remove(i);
       }
     });

  }
  goToHome(){
     let methodcontext=this;
     const index = methodcontext.viewCtrl.index;
     for(let i = index; i >0; i--){
         methodcontext.navCtrl.remove(i);
     }
  }
  ionViewDidEnter(){
        if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        }else{
           this.toolBarIconColorMsg='';
        }
      setTimeout(() => {
          this.getprofileData();
      },100);
    }

    ionViewDidLoad() {
        if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        } else {
           this.toolBarIconColorMsg='';
        }
    }
    goToViewProfileCard(){
      if(this.profilepic.length>0){
        //if(localStorage.getItem('selectedCity').length>0){
        if(1==1){
            this.navCtrl.push(ViewprofilePage);
        } else {
          this.myLocation("profileImage");
        }
      }
    }




    //--------------------- get current location code-----------------------------------
    myLocation(from?) {
        if (this.platform.is('ios')) {
           this.diagnostic.isLocationEnabled() .then((state) => {

                  if (state==false){ 
                        let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                        this.diagnostic.switchToLocationSettings(); 
                             } }] });
                            alt.present(); 
                   } else { 

                      if(from ==='profileImage'){
                          this.appdetailsProvider.ShowLoading();
                      }
                      this.getMycurrentLocation();
                   } 
            }) .catch(e => console.error(e)); 
         } else {
           this.diagnostic.isGpsLocationEnabled() .then((state) => {

                  if (state==false){ 
                        let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                        this.diagnostic.switchToLocationSettings(); 
                             } }] });
                            alt.present(); 
                   } else { 
                       if(from ==='profileImage'){
                          this.appdetailsProvider.ShowLoading();
                       }
                      this.getMycurrentLocation(from);
                   } 
            }) .catch(e => console.error(e)); 
         }
    }

      getMycurrentLocation(from?) {
         let context=this;
         this.platform.ready().then(() => {
        debugger;
       var options = {
                 enableHighAccuracy: false,
                 timeout: Infinity,
                 maximumAge: 10000
                };
                              this.geolocation.getCurrentPosition(options).then((resp) => {
                                 let latitude= resp.coords.latitude;
                                 let longitude= resp.coords.longitude;
                                  debugger;

                                        this.nativeGeocoder.reverseGeocode(latitude, longitude)
                                        .then((result: NativeGeocoderReverseResult) =>
                                             {
                                                debugger;
                                                    let country=result.countryName;
                                                    let city=result.subAdministrativeArea;
                                                    let state=result.administrativeArea;
                                                    localStorage.setItem('selectedLocation',state+", "+country);
                                                    localStorage.setItem('selectedCity',city);
                                                    localStorage.setItem('geo_value',latitude+","+longitude);
                                                    if(from ==='profileImage'){
                                                        context.appdetailsProvider.HideLoading();
                                                        context.navCtrl.push(ViewprofilePage);
                                                    }
                                            })
                                  .catch((error: any) =>{ 
                                     debugger;
                                     if(from ==='profileImage'){
                                        context.appdetailsProvider.HideLoading();
                                     }
                                    console.log(error);         
                                 });
                        }).catch((error) => {
                          if(from ==='profileImage'){
                           context.appdetailsProvider.HideLoading();
                          }
                          console.log('Error getting location', error);
                        });
                      });
      }
    //--------------------------------------------------------------------------------- 


    //-------------- Lezy loading start-----------------

 
  smallImg = null;

  createThumbnail(bigImg:any) {
  debugger;
    
    this.generateFromImage(bigImg, 10, 10, 0.2, data => {
      debugger;
      this.smallImg = data;
    });
  }

 generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
   debugger
    var canvas: any = document.createElement("canvas");
    var image = new Image();
 
    image.onload = () => {
      var width = image.width;
      var height = image.height;
 
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
 
      callback(dataUrl)
    }
    image.src = img;
  }
 
  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return ((data_url.length - head.length) * 3 / 4 / (1024*1024)).toFixed(4);
  }
 //-------------- Lezy loading end-------------------


 //------------- Get current internet speed of the devices ------------
  connectionSpeed:any="Click here";

  clickSpeed() {
    this.connectionSpeed="Please wait....";
    this.getSpeed();
  }

  getSpeed() {
    debugger;
    let methodInstance=this;

    //reference link : https://stackoverflow.com/questions/4583395/calculate-speed-using-javascript
    //let imageAddr = 'http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg'
    let imageAddr = 'https://www.kenrockwell.com/contax/images/g2/examples/31120037-600.jpg'
    let startTime = 0, endTime = 0;
    let downloadSize = 151842;
    let download = new Image();

    startTime = (new Date()).getTime();

    download.onload = function () {
        debugger;
        endTime = (new Date()).getTime();
        download.src="";
        setTimeout(() => {
          //methodInstance.showResults(startTime,endTime,downloadSize);
          debugger;
          let speedBps = 0;
          let speedKbps = 0;
          let speedMbps = 0;
          let duration = 0;
          let bitsLoaded = 0;

          //duration = Math.round((endTime - startTime) / 1000);
          duration = (endTime - startTime)/1000;
          //duration = duration==0 ? 1 : duration;
          bitsLoaded = downloadSize * 8;
          speedBps = bitsLoaded / duration;
          speedKbps = parseInt((speedBps / 1024).toFixed(2));
          speedMbps = parseInt(((speedKbps / 1024)/100).toFixed(4));
          debugger;
          methodInstance.connectionSpeed ='';
          methodInstance.connectionSpeed = "Your connection speed is: \n" + speedMbps + " Mbps";
          //this.getSpeed();
        },500);
    }
    download.src = imageAddr;
  }

  showResults(startTime,endTime,downloadSize) {
       let methodInstance=this;
        debugger;
        let speedBps = 0;
        let speedKbps = 0;
        let speedMbps = 0;
        let duration = 0;
        let bitsLoaded = 0;

         //duration = Math.round((endTime - startTime) / 1000);
         duration = (endTime - startTime)/1000;
         //duration = duration==0 ? 1 : duration;
         bitsLoaded = downloadSize * 8;
         speedBps = bitsLoaded / duration;
         speedKbps = parseInt((speedBps / 1024).toFixed(2));
         speedMbps = parseInt(((speedKbps / 1024)/100).toFixed(4));
        debugger;
        methodInstance.connectionSpeed ='';
        methodInstance.connectionSpeed = "Your connection speed is: \n" + speedMbps + " Mbps";
        this.getSpeed();
  }

  //-----------------------------------------------------
    
}
