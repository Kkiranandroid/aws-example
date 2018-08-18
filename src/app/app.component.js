var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Messages } from '../pages/messages/messages';
import { AppdetailsProvider } from '../providers/appdetails/appdetails';
import { Keyboard } from '@ionic-native/keyboard';
import { Firebase } from '@ionic-native/firebase';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, appdetailsProvider, ionicApp, firebase, alertCtrl, keyboard) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.appdetailsProvider = appdetailsProvider;
        this.ionicApp = ionicApp;
        this.firebase = firebase;
        this.alertCtrl = alertCtrl;
        this.keyboard = keyboard;
        this.backPressed = false;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            if (_this.platform.is('ios')) {
                _this.firebase.grantPermission();
            }
            debugger;
            var msgIconColr = localStorage.getItem("messageIconColor");
            if (msgIconColr) {
                localStorage.setItem("messageIconColor", msgIconColr);
            }
            else {
                localStorage.setItem("messageIconColor", "0");
            }
            //localStorage.setItem("messageIconColor","1");
            var name = localStorage.getItem('name');
            if (name && name != null) {
                if (_this.appdetailsProvider.notificationType == "message") {
                    _this.appdetailsProvider.notificationType = '';
                    _this.rootPage = Messages;
                }
                else {
                    _this.appdetailsProvider.notificationType = '';
                    _this.rootPage = HomePage;
                }
                //this.rootPage = ConversationPage;
            }
            else {
                _this.rootPage = LoginPage;
                //this.rootPage = HomePage;
                //this.rootPage = ConversationPage;
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
            _this.firebase.onNotificationOpen().subscribe(function (data) {
                debugger;
                var context = _this;
                if (data.messagetype == "message") {
                    localStorage.setItem("messageIconColor", "1");
                }
                if (data.tap) {
                    _this.appdetailsProvider.notificationType = data.messagetype;
                    if (data.messagetype == "swipe") {
                        //Here setRoot  is not required bcoz default page home page.
                        /*setTimeout(() => {
                           this.nav.setRoot(HomePage,{isFromPage:""});
                        },2000);*/
                    }
                    else {
                        _this.nav.setRoot(Messages);
                    }
                }
                else {
                    var title = '';
                    if (_this.platform.is('ios')) {
                        title = data.aps.alert;
                    }
                    else {
                        title = data.body;
                    }
                    //display code is in progress.
                    //context.nav.push(NotificationPopupPage);
                    var alt = _this.alertCtrl.create({
                        title: 'WooWoo',
                        subTitle: title,
                        buttons: [{
                                text: 'Ok',
                                handler: function () {
                                    setTimeout(function () {
                                        debugger;
                                        if (data.messagetype == "swipe") {
                                            setTimeout(function () {
                                                _this.nav.setRoot(HomePage);
                                            }, 500);
                                        }
                                        else {
                                            setTimeout(function () {
                                                _this.nav.push(Messages);
                                            }, 500);
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
        this.platform.registerBackButtonAction(function () {
            if (_this.nav.canGoBack() || _this.appdetailsProvider.modalpresent == true) {
                var activePortal = ionicApp._modalPortal.getActive() ||
                    ionicApp._toastPortal.getActive() ||
                    ionicApp._overlayPortal.getActive();
                if (activePortal) {
                    activePortal.dismiss();
                    console.log("handled with portal");
                    return;
                }
                _this.nav.pop();
                return;
            }
            else {
                if (!_this.backPressed) {
                    _this.backPressed = true;
                    _this.appdetailsProvider.ShowToast("Press again to exit", 1000);
                    setTimeout(function () { return _this.backPressed = false; }, 2000);
                    return;
                }
                //localStorage.removeItem("guestuserdidlogin");
                _this.platform.exitApp();
            }
        });
        //Press again to exit end
    }
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            AppdetailsProvider,
            IonicApp,
            Firebase,
            AlertController,
            Keyboard])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map