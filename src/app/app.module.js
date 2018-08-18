var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ErrorHandler, NgModule, Pipe } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { SwipeCardsModule } from 'ng2-swipe-cards';
import { FormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilescreenPage } from '../pages/profilescreen/profilescreen';
import { EditprofilephotoPage } from '../pages/editprofilephoto/editprofilephoto';
import { NotificationPopupPage } from '../pages/notification-popup/notification-popup';
import { OutNowMainPage } from '../pages/out-now-main/out-now-main';
import { CalenderPage } from '../pages/calender/calender';
import { SchedulePage } from '../pages/schedule/schedule';
import { SettingsmainPage } from '../pages/settingsmain/settingsmain';
import { SettingsubPage } from '../pages/settingsub/settingsub';
import { ViewprofilePage } from '../pages/viewprofile/viewprofile';
import { Occupation } from '../pages/occupation/occupation';
import { Education } from '../pages/education/education';
import { Gender } from '../pages/gender/gender';
import { Messages } from '../pages/messages/messages';
import { FilterPage } from '../pages/filter/filter';
import { Fbphotoupload } from '../pages/fbphotoupload/fbphotoupload';
import { Fbtimeline } from '../pages/fbtimeline/fbtimeline';
import { Datelist } from '../pages/datelist/datelist';
import { Myphotoupload } from '../pages/myphotoupload/myphotoupload';
import { Myphotoall } from '../pages/myphotoall/myphotoall';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Outnow } from '../pages/outnow/outnow';
import { ConversationPage } from '../pages/conversation/conversation';
import { MorePopoverPage } from '../pages/conversation/conversation';
import { MatchmultiavailabilityPage } from '../pages/matchmultiavailability/matchmultiavailability';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
//import { DatePicker } from '@ionic-native/date-picker';
/*calender*/
/* import { NgCalendarModule } from 'ionic2-calendar';*/
import { CalendarModule } from "ion2-calendar";
/*calender*/
/*modal*/
import { ModalLocation } from '../pages/schedule/schedule';
import { ModalLocationOutNow } from '../pages/out-now-main/out-now-main';
import { ModalOpenLink } from '../pages/settingsub/settingsub';
import { ModalOpenPrivacyLinks } from '../pages/login/login';
import { HttpModule } from '@angular/http';
import { AppdetailsProvider } from '../providers/appdetails/appdetails';
import { Facebook } from '@ionic-native/facebook';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { DatePicker } from 'ionic2-date-picker';
import { CameraPreview } from '@ionic-native/camera-preview';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';
import { DatePipe } from '@angular/common';
import { IonicImageLoader } from 'ionic-image-loader'; //https://github.com/zyra/ionic-image-loader
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';
import { DndModule } from 'ng2-dnd';
import { DragulaModule } from 'ng2-dragula';
import { SortablejsModule } from 'angular-sortablejs';
import { LazyLoadImageModule } from 'ng2-lazyload-image';
import { BrowserModule } from '@angular/platform-browser';
var SafePipe = /** @class */ (function () {
    function SafePipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafePipe.prototype.transform = function (shiva) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(shiva);
    };
    SafePipe = __decorate([
        Pipe({ name: 'safe' }),
        __metadata("design:paramtypes", [DomSanitizer])
    ], SafePipe);
    return SafePipe;
}());
export { SafePipe };
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                HomePage,
                SafePipe,
                ProfilescreenPage,
                EditprofilephotoPage,
                LoginPage,
                CalenderPage,
                SchedulePage,
                OutNowMainPage,
                SettingsmainPage,
                SettingsubPage,
                ViewprofilePage,
                DatePicker,
                Occupation,
                Education,
                Gender,
                Messages,
                Fbphotoupload,
                Fbtimeline,
                Fbphotoupload,
                Fbtimeline,
                ModalLocation,
                ModalLocationOutNow,
                ModalOpenLink,
                ModalOpenPrivacyLinks,
                Datelist,
                Myphotoupload,
                Myphotoall,
                Outnow,
                FilterPage,
                ConversationPage,
                MorePopoverPage,
                MatchmultiavailabilityPage,
                NotificationPopupPage
            ],
            imports: [
                CalendarModule,
                DragulaModule,
                /* NgCalendarModule, */
                BrowserModule,
                LazyLoadImageModule,
                FormsModule,
                SwipeCardsModule,
                HttpModule,
                SortablejsModule,
                SortablejsModule.forRoot({ animation: 800 }),
                IonicModule.forRoot(MyApp, {
                    backButtonText: '',
                    backButtonIcon: 'ios-arrow-back',
                    iconMode: 'ios',
                    /*mode: 'ios',*/
                    modalEnter: 'modal-slide-in',
                    modalLeave: 'modal-slide-out',
                    tabsPlacement: 'bottom',
                    pageTransition: 'ios-transition',
                    scrollAssist: true,
                    autoFocusAssist: true,
                }),
                IonicStorageModule.forRoot(),
                IonicImageLoader.forRoot(),
                DndModule.forRoot()
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                HomePage,
                ProfilescreenPage,
                EditprofilephotoPage,
                LoginPage,
                NotificationPopupPage,
                CalenderPage,
                SchedulePage,
                OutNowMainPage,
                SettingsmainPage,
                SettingsubPage,
                ViewprofilePage,
                Occupation,
                Education,
                Gender,
                Messages,
                Fbphotoupload,
                Fbtimeline,
                Fbphotoupload,
                Fbtimeline,
                ModalLocation,
                ModalLocationOutNow,
                ModalOpenLink,
                ModalOpenPrivacyLinks,
                Datelist,
                Myphotoupload,
                Myphotoall,
                Outnow,
                FilterPage,
                ConversationPage,
                MorePopoverPage,
                MatchmultiavailabilityPage
            ],
            providers: [
                Facebook,
                StatusBar,
                SplashScreen,
                SQLite,
                Camera,
                Crop,
                CameraPreview,
                Keyboard,
                File,
                DatePipe,
                AndroidPermissions,
                NativeGeocoder,
                Geolocation,
                Diagnostic,
                Firebase,
                Device,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                AppdetailsProvider
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map