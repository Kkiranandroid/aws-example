import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { NavController, NavParams, AlertController,ViewController, ModalController , Platform,IonicApp} from 'ionic-angular';
import { HomePage } from '../home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePipe} from '@angular/common';


import {Http, Headers, RequestOptions } from '@angular/http';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Diagnostic } from '@ionic-native/diagnostic';

//import { DatePicker } from '@ionic-native/date-picker';

import moment from 'moment';


@Component({
  selector: 'outnow',
  templateUrl: 'outnow.html',
})


export class Outnow {

   personId:any="";

   finalEndDate:any="";
   currentDate:any="";

   city:any="Portsmouth";
   location:any="England, United Kingdom";
   schedule_geo:any="";

   recentLoc:any="Karnataka, India";


  backPressed=false;
  flag:boolean=true;

   //@ViewChild('openTimePicker') openTimePicker: ElementRef;


   

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public appdetailsProvider:AppdetailsProvider,
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController, 
    public viewCtrl: ViewController, 
    public modalCtrl: ModalController, 
    public datepipe: DatePipe,
    private eleRef: ElementRef,
    private ionicApp: IonicApp,
    public http:Http) {
 // this.getCurrentLocation();

   
    if (!this.platform.is('ios')) {
      this.openTimePicker(1000);
    }
    
   this.personId = localStorage.getItem("person_id");

    this.city=localStorage.getItem('currentCity')==null?"":localStorage.getItem('currentCity');
    this.location=localStorage.getItem('currentLocation')==null?"":localStorage.getItem('currentLocation');
    //this.schedule_geo = navParams.get('schedule_geo');
    this.schedule_geo =  localStorage.getItem('current_geo_value');
    
            
    this.setCurrentTime();

    this.registerBackButton();   

  }

  timePicker:any;
  openTimePicker(timeoutvalue){
    if(timeoutvalue!==0){
      this.appdetailsProvider.ShowLoading();
    }
    try{
    setTimeout(() => {
         
         this.timePicker = this.eleRef.nativeElement.querySelector('#openTimePicker');
         if(this.timePicker) {
           if(timeoutvalue!==0){
             this.appdetailsProvider.HideLoading();
           }
           this.timePicker.dispatchEvent(new Event('click'));
         } else {
           debugger;
           this.openTimePicker(1000);
         }
         
    }, timeoutvalue);
  } catch(Exception){
    debugger;
    this.appdetailsProvider.SomethingWentWrongAlert();
    if(timeoutvalue!==0){
      this.appdetailsProvider.HideLoading();
    }
  }

  }


  customOptions: any = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Clear',
        handler: () => {
          //this.placeholderDate = null;
        }
      }]
    };

  ionViewDidLoad() {
    console.log('ionViewDidLoad Outnow');
  }

  public event = {
    timeStarts: '11:00'
  }


   ionViewWillEnter() {
    console.log('ionViewWillEnter Outnow');
   }

  ionViewDidEnter() {
    console.log('ionViewDidEnter Outnow');
    if (this.platform.is('ios')) {
      this.openTimePicker(2500);
    } 
  }

  AddSchedule(){
  if(this.appdetailsProvider.CheckConnection()){
    let methodinstance=this;
    if(this.appdetailsProvider.CheckConnection()){
       let scheduleArry=[];
       this.appdetailsProvider.ShowLoading();
                  scheduleArry.push({ schedule_startdate:methodinstance.currentDate, 
                                      schedule_enddate:methodinstance.finalEndDate, 
                                      schedule_location_city:methodinstance.city,
                                      schedule_location_country:methodinstance.location,
                                      schedule_geo:methodinstance.schedule_geo,
                                      schedule_radius:"10",
                                      schedule_isoutnow:true});
              
               let finalarry = {
                 person_id:this.personId,
                 schedule:scheduleArry
               };
               //debugger;
               
               let headers = new Headers({
                'x-access-token': localStorage.getItem("authoKey")
               });
                                         
               let requestOptions = new RequestOptions({
                  headers: headers
               });

               debugger;
               console.log("AddOutNowSchedule-Req :"+JSON.stringify(finalarry));
               
               this.http.post(this.appdetailsProvider.addschedule,finalarry,requestOptions).subscribe(
                          function(response) {
                             //debugger;
                             methodinstance.appdetailsProvider.HideLoading();
                             let temp=JSON.parse(response['_body']);
                             //"{"schedules":["a338751c-d6ef-f8c2-b368-07f0c721c04a"]}"
                             console.log("OutNow end Date : "+ methodinstance.finalEndDate);

                             localStorage.setItem('OutNow_end_dateTime',methodinstance.finalEndDate);
                             console.log("Starting OUTNOW Schedule list = " + localStorage.getItem('OutNow_scheduleIdsList'));
                             localStorage.setItem('OutNow_scheduleIdsList',"");
                             if(localStorage.getItem('OutNow_scheduleIdsList') !== null){
                               let OutNow_scheduleIdsList=localStorage.getItem('OutNow_scheduleIdsList').length > 0 ? localStorage.getItem('OutNow_scheduleIdsList')+","+temp.schedules[0] : temp.schedules[0];
                               localStorage.setItem('OutNow_scheduleIdsList',OutNow_scheduleIdsList);
                               console.log("OUTNOW Schedule list = " + localStorage.getItem('OutNow_scheduleIdsList'));
                               methodinstance.navCtrl.setRoot(HomePage,{isFromPage:"OutNow",schedule_id: OutNow_scheduleIdsList});
                             }else {
                               localStorage.setItem('OutNow_scheduleIdsList',temp.schedules[0]);

                               methodinstance.navCtrl.setRoot(HomePage,{isFromPage:"OutNow",schedule_id: temp.schedules[0]});
                             }
                             //methodinstance.navCtrl.push(Datelist);
                },
                function(error) {
                   debugger;
                   methodinstance.openTimePicker(1000);
                   methodinstance.appdetailsProvider.SomethingWentWrongAlert();
                   methodinstance.appdetailsProvider.HideLoading();
                }
          );
    }  else {
      debugger;
      this.openTimePicker(1000);
    }  
  }  
}

  goBack(){
    debugger;
      this.flag=false;

      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
  }


  ionCancelEvent(){
    debugger;
    setTimeout(() => {
      this.flag=false;
      const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
    },800);
  }

  myDate:any="";
  finalCurrentDate:any="";
  minimumDate:any="2018-02-16T17:33:33.384";
  maximumDate:any="";
  isTimerValueChanged:boolean=true;



  changeCheckOutStartTime() {
    debugger;
    if(this.isTimerValueChanged){

      this.isTimerValueChanged=false;
    
      let context=this;
      let endDate;

       debugger;
       //if(new Date(this.myDate) > new Date(this.finalCurrentDate+"Z")) {
       /**/
       if(1==1) {

         let date: Date = new Date(this.myDate.toString());

         let ionicDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
         
         if(ionicDate >= new Date()) {
            endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
         } else {
             endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
         }

       this.finalEndDate = context.datepipe.transform(endDate.toString()+"",'yyyy-MM-dd hh:mm a');
       this.currentDate = this.datepipe.transform(new Date().toString()+"",'yyyy-MM-dd hh:mm a');

       debugger;

       //this.openTimePicker(1000);


       setTimeout(() => {
          this.AddSchedule();
          this.isTimerValueChanged = true;
       },500);
       
     } else {
       

      //-------Reset the time when selecting wrong time-----
      if(this.myDate !== this.finalCurrentDate) {
       var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
       this.finalCurrentDate = moment((new Date(Date.now() - tzoffset))).add(1, 'hour')['_d'].toISOString().slice(0,-1);

       this.myDate = this.finalCurrentDate;
      }
      //----------------------------------------------------

       this.appdetailsProvider.ShowToast("Please select the proper time",2000);
       debugger;
      
         this.openTimePicker(1000);
     
       
       setTimeout(() => {
          this.isTimerValueChanged=true;
       },500);
     }
     
     console.log(" Start-Date "+this.currentDate+" End-Date "+this.finalEndDate);

     }
  }


  setCurrentTime() {
    //debugger;
    var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
    this.finalCurrentDate = moment((new Date(Date.now() - tzoffset))).add(1, 'hour')['_d'].toISOString().slice(0,-1);
    this.myDate = this.finalCurrentDate;

    if (this.platform.is('ios')) {
        let date: Date = new Date(this.finalCurrentDate);
        let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

        this.finalEndDate = this.datepipe.transform(endDate,'yyyy-MM-dd hh:mm a');
        this.currentDate = this.datepipe.transform(new Date().toString()+"",'yyyy-MM-dd hh:mm a');
    } else {

      let date: Date = new Date(this.finalCurrentDate);
      let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

      this.finalEndDate = this.datepipe.transform(endDate,'yyyy-MM-dd hh:mm a');
      this.currentDate = this.datepipe.transform(new Date().toString()+"",'yyyy-MM-dd hh:mm a');
    }
  }

  onBackPress() {
    //----------- Back press fuctinality -----------
    this.platform.registerBackButtonAction(() => {
      debugger;
      this.myDate;
      this.openTimePicker(1000);
    },10);
  }

  registerBackButton() {
    //Press again to exit
      this.platform.registerBackButtonAction(() => {
          debugger;
        if (this.navCtrl.canGoBack() || this.appdetailsProvider.modalpresent==true) {

            if(this.flag) {
                this.myDate;
                this.openTimePicker(0);
                return;
            }
            
            let activePortal = this.ionicApp._modalPortal.getActive() ||
               this.ionicApp._toastPortal.getActive() ||
               this.ionicApp._overlayPortal.getActive();

            if (activePortal) {
              
               activePortal.dismiss();
               
               console.log("handled with portal");
               return;
            }
            
            this.navCtrl.pop()
          return;
        } else {
            debugger
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


  
}
