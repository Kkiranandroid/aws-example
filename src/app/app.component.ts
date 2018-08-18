import { Component , ViewChild} from '@angular/core';
import { Nav,NavController, Platform, IonicApp, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SettingsmainPage } from '../pages/settingsmain/settingsmain';

import { HomePage } from '../pages/home/home';
import { Datelist } from '../pages/datelist/datelist';
import { LoginPage } from '../pages/login/login';
import { Messages } from '../pages/messages/messages';
import { ConversationPage } from '../pages/conversation/conversation';

import { Occupation } from '../pages/occupation/occupation';
import { AppdetailsProvider } from '../providers/appdetails/appdetails';
import { ProfilescreenPage } from '../pages/profilescreen/profilescreen';
import { Keyboard } from '@ionic-native/keyboard';
import { Firebase } from '@ionic-native/firebase';
import { Broadcaster } from '@ionic-native/broadcaster';
//import { FlurryAnalytics, FlurryAnalyticsObject, FlurryAnalyticsOptions } from '@ionic-native/flurry-analytics';



declare let cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  backPressed=false;
  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public appdetailsProvider:AppdetailsProvider,
    public ionicApp: IonicApp,
    public firebase: Firebase,
    public alertCtrl: AlertController,
    public broadcaster: Broadcaster,
    public keyboard: Keyboard) {

    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('ios')) {
        this.firebase.grantPermission();
      }
      
      debugger;
      let msgIconColr=localStorage.getItem("messageIconColor");
      
      if(msgIconColr) {
        localStorage.setItem("messageIconColor",msgIconColr);
      } else {
        localStorage.setItem("messageIconColor","0");
      }

      let name= localStorage.getItem('name');
      
      if(name && name != null) {

        if(this.appdetailsProvider.notificationType=="message"){
           this.appdetailsProvider.notificationType='';
              this.rootPage = Messages;
          
        }else{

        this.appdetailsProvider.notificationType='';
        this.rootPage = HomePage;
        }
          //this.rootPage = ConversationPage;
          
      } else {
          this.rootPage = LoginPage;
          //this.rootPage = HomePage;
          //this.rootPage = ConversationPage;

           /*setTimeout(()=>{
            this.initFlurry();
          },2000);*/

      }
      
      


      //--- initialize the com.instabug.cordova.plugin SDK ----
      /*cordova.plugins.instabug.activate(
       {
           ios: "17da4d6ce853a9362a86982001d00956"
       },
        "shake",
       {
          commentRequired: true,
          colorTheme: "dark"
       },
        function () {
          console.log("Instabug initialized.");
        },
        function (error) {
          console.log("Instabug could not be initialized - " + error);
        }
      );*/
      //-------------------------------------------------------


      //------- Push notificatipon configration code -----------
      
          this.firebase.onNotificationOpen().subscribe(data=> {
            
            debugger;
            let context=this;

            if(data.messagetype=="message") {
              localStorage.setItem("messageIconColor","1");
            }

            if(data.tap){
              this.appdetailsProvider.notificationType=data.messagetype;
              if(data.messagetype=="swipe"){
                //Here setRoot  is not required bcoz default page home page.
                 /*setTimeout(() => {
                    this.nav.setRoot(HomePage,{isFromPage:""});
                 },2000);*/
              } else {
                this.nav.setRoot(Messages);
              }

            } else {
              let title='';
              if (this.platform.is('ios')) {
                title=data.aps.alert;
              } else {
                title=data.body;
              }

                // Send event to Native
              this.broadcaster.fireNativeEvent('pushNotification', {messagetype : data.messagetype}).then(() => console.log('success'));
          

              let alt = this.alertCtrl.create({
                              title: 'WooWoo',
                              subTitle: title,
                              buttons: [{
                                          text: 'Ok',
                                          handler: () => {
                                              setTimeout(()=>{
                                                  debugger;
                                                if(data.messagetype=="swipe"){
                                                  setTimeout(()=>{
                                                    this.nav.setRoot(HomePage);
                                                  },500);
                                                }else{
                                                  setTimeout(()=>{
                                                  this.nav.push(Messages);
                                                  },500);
                                                }

                                            }, 200);              
                                          }
                                        }]
              });
              alt.present();
            }
            console.log(JSON.stringify(data));
          });

      //---- Push notificatipon using local notification ------
     
      
      //---------------------------------------------------------

      statusBar.styleDefault();
      splashScreen.hide();
    });


    //Press again to exit
      this.platform.registerBackButtonAction(() => {
          
        if (this.nav.canGoBack() || this.appdetailsProvider.modalpresent==true) {

            
            let activePortal = ionicApp._modalPortal.getActive() ||
               ionicApp._toastPortal.getActive() ||
               ionicApp._overlayPortal.getActive();

            if (activePortal) {
              
               activePortal.dismiss();
               
               console.log("handled with portal");
               return;
            }
            
            this.nav.pop()
          return;
        } else {
            
            if(!this.backPressed) {
              this.backPressed = true;
              this.appdetailsProvider.ShowToast("Press again to exit",1000);
              setTimeout(() => this.backPressed = false, 2000);
              return;
            }
            //localStorage.removeItem("guestuserdidlogin");
            this.platform.exitApp();
        }
      });
      //Press again to exit end
  }

  /*initFlurry(){

   const options: FlurryAnalyticsOptions = {
     appKey: 'WBQF2MC6QNSGW66RFHNZ',
     reportSessionsOnClose: true,
     enableLogging: true,
     enableEventLogging:true,
     enableBackgroundSessions:true,
     reportSessionsOnPause:true
    };
    debugger;

  let fa: FlurryAnalyticsObject = this.flurryAnalytics.create(options);

  debugger;
  this.appdetailsProvider.flurryAnalyticsObject=fa;

  debugger;

  let resp=fa.logEvent('App Lunched')
  .then(() => console.log('Logged an event! in AppComponent'))
  .catch(e => console.log('Error logging the event', e));

  if(!resp){
    console.log("Flurry is not sent successfully.");
    setTimeout(()=>{
        this.initFlurry();
      },2000);
  }
  }*/

}