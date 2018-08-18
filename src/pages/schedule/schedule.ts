import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController,AlertController,Platform } from 'ionic-angular';
import { Datelist } from '../datelist/datelist';
import { Geolocation } from '@ionic-native/geolocation';

import { CalendarComponentOptions,CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
import { CalendarController} from "ion2-calendar/dist";

import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePipe} from '@angular/common';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { FilterPage } from '../filter/filter';
import moment from 'moment';
import { HomePage } from '../home/home';
import { CalenderPage } from '../calender/calender';

@Component({
  template: `
  <ion-header>
    <ion-navbar hideBackButton>
        <ion-title class="dateinTitle">
          <span class="headerCancelTxt" (click)="closeModal();"><i class="fa fa-angle-left" aria-hidden="true"></i>Back</span>
          <span class="alignMainHead2">{{PageTitle}}</span> 
        </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content class="modalScroll">
    <ion-list class="modalLists scrollContntMain">

    <ion-item class="modalRecent" *ngIf="!isCardsLoading">
      Select location
    </ion-item>

      <div *ngIf="isCardsLoading" style="display: table; width: 100%; height: calc(100vh - 80px);">
        <div class="norecordsfoundMain2 ">
          <div class="norecordsfoundSub2">
            <div class="noAnimate ">
              <img class="cardLoading" style="width: 120px; height: 120px;" src="assets/imgs/loading_2.gif">
            </div>
          </div>
        </div>
      </div>

      </ion-list>
      <ion-list class="scrollContnt">
      <ion-item class="contentPading">
       <div class="dateListMain" *ngFor="let item of recentLoactionList;" (click)="setLocation(item);">
          <div class="contentInfo2">
              <h3><b>{{item.location_name}}</b></h3>
              <h5>{{item.location_name}}, {{item.location_country}}</h5>
          </div>
       </div>
    </ion-item>
  </ion-list>
</ion-content>`})

export class ModalLocation {

   locationList:any[]=[];
   recentLoactionList:any[]=[];
   showList:any="";
   showClearIcon:any="";
   inputtext:any="";

   isFrom:any="";
   PageTitle:any="New Availability";
   isCardsLoading:any=true;

    constructor(public platform: Platform,
      public http:Http,
      public navCtrl: NavController,
      public viewCtrl: ViewController,
      private geolocation: Geolocation,
      private nativeGeocoder: NativeGeocoder,
      public appdetailsProvider:AppdetailsProvider, 
      private diagnostic: Diagnostic,
      private params: NavParams,
      private alertCtrl: AlertController) {

      this.isFrom=params.get('deviceNum');
      this.getRecentLocations();

      if(this.isFrom==='FTUE'){
       this.PageTitle="Plan Now";
      }
    }
    
      closeModal() {
        this.viewCtrl.dismiss();
      }

      setLocation(location) {
         let methodinstance=this;
         //localStorage.setItem('selectedLocation',location.state+", "+location.contry);
         //localStorage.setItem('selectedCity',location.city);
         methodinstance.viewCtrl.dismiss({ location_name: location.location_name,
                                           location_country: location.location_country,
                                           location_geo:location.location_geo
                                         });
      }

      getRecentLocations(){
          
          let methodinstance=this;
            methodinstance.http.get(methodinstance.appdetailsProvider.getRecentLocations).subscribe(
              //success part
            function(response) {
             console.log("Recent location Resp : ->"+JSON.stringify(response));
             
                let responceBody=JSON.parse(response['_body']);
                methodinstance.isCardsLoading=false;
                if(responceBody.length > 0) {
                 methodinstance.recentLoactionList=responceBody;
                }
            },
            function(error) { 
            }
           );
      }

      /*getRecentLocationList() {
          
          let methodinstance=this;
          

        this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM recentLoactionTb ORDER BY priority DESC", []).then((data) => {
        
         if(data.rows.length > 0) {
           for(var i = 0; i < data.rows.length; i++) {
              methodinstance.recentLoactionList.push({city: data.rows.item(i).city, state: data.rows.item(i).state, contry: data.rows.item(i).contry});
          }
         }
        }, (error) => {
        
          console.log("Error block");
          console.log("ERROR: " + JSON.stringify(error));
        });
      }*/

      /*myLocation(){
    if (this.platform.is('ios')) {
       this.diagnostic.isLocationEnabled() .then((state) => {
              if (state==false) { 
                    let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                        } }, 
                         { text: 'Ok', handler: () => { 
                                    this.diagnostic.switchToLocationSettings(); 
                         } }] });
                        alt.present(); 
               } else {
                  this.getMycurrentLocation();
               }
        }) .catch(e => console.error(e)); 
     } else {
       this.diagnostic.isGpsLocationEnabled() .then((state) => {
              if (state==false) { 
                    let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                        } }, 
                         { text: 'Ok', handler: () => { 
                                    this.diagnostic.switchToLocationSettings(); 
                         } }] });
                        alt.present(); 
               } else {
                  this.getMycurrentLocation();
               }
        }) .catch(e => console.error(e)); 
     }
      }

      getMycurrentLocation(){
       var options = {
                 enableHighAccuracy: false,
                 timeout: 20000,
                 maximumAge: 10000
                };
                debugger;

                
                 this.appdetailsProvider.ShowLoading();
                

                              this.geolocation.getCurrentPosition(options).then((resp) => {
                                 let latitude= resp.coords.latitude;
                                 let longitude= resp.coords.longitude;

                                        this.nativeGeocoder.reverseGeocode(latitude, longitude)
                                        .then((result: NativeGeocoderReverseResult) =>
                                             {
                                                    let country=result.countryName;
                                                    let city=result.subAdministrativeArea;
                                                    let state=result.administrativeArea;
                                                    //this.appdetailsProvider.location=state+", "+country;

                                                    
                                                    
                                                    localStorage.setItem('currentLocation',state+", "+country);
                                                    localStorage.setItem('currentCity',city);
                                                    localStorage.setItem('current_geo_value',latitude+","+longitude);

                                                    //this.appdetailsProvider.city=city;
                                                    this.appdetailsProvider. HideLoading();
                                                    //this.viewCtrl.dismiss();
                                                    this.viewCtrl.dismiss({ currentLocation: state+", "+country , currentCity: city});
                                            })
                                  .catch((error: any) =>{ console.log(error);         
                                   this.appdetailsProvider. HideLoading();});
                        }).catch((error) => {
                          console.log('Error getting location', error);
                                    this.appdetailsProvider. HideLoading();
                        });
      }*/

      /*getItems(event) {
      
      if(this.appdetailsProvider.CheckConnection()){
        var val = event.value;
         if(val.length > 0) {
           this.showClearIcon="true";
           this.locationList=[];

           this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+val+'&key='+this.appdetailsProvider.mapKey).map(res => res.json()).subscribe(data => { 
             
             if(data.predictions.length>0) {
                 this.locationList=data.predictions;
                 this.showList="true";
              } else {
                this.showList="false";
              }
             /* for (var i =0; i < data.predictions.length; i++) {
                var city=data.predictions[i].structured_formatting.main_text;
                console.log('City names :-->', city);
             }

          }); 
         } else {
            this.showList="false";
            this.showClearIcon="false";
         }
       }
      }*/

      clearEditText(){
        this.inputtext="";
        this.showList="false";
        this.showClearIcon="false";
      }


      /*addToLocation(location){
          
          let methodinstance=this;
          if(location.terms.length > 0) {
             let city=location.structured_formatting.main_text
             let state=location.terms[location.terms.length-2].value;
             let country=location.terms[location.terms.length-1].value;

             this.getLatAndLong(city);


             methodinstance.appdetailsProvider.getDbInstance().executeSql("INSERT INTO recentLoactionTb( city, state, contry) VALUES (?,?,?)", [city, state, country]).then((data) => {        
                  
                  console.log("INSERTED: " + JSON.stringify(data));
                  console.log("INSERTED-ID: " + JSON.stringify(data.insertId));
                  if(data.insertId > 10){
                            
                      methodinstance.appdetailsProvider.getDbInstance().executeSql("DELETE FROM recentLoactionTb WHERE id IN (SELECT id FROM recentLoactionTb ORDER BY priority,id ASC LIMIT 1)").then((data) => {
                         
                         console.log("Delete success: " + JSON.stringify(data));    
                    }, (error) => {
                         
                         console.log("ERROR Delete: " + JSON.stringify(error.err));
                    });
                  }
             
              }, (error) => {
                  
                   console.log("ERROR: " + JSON.stringify(error.err));
                   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE recentLoactionTb set priority = priority + 1 where city='"+city+"'").then((data) => {
                        console.log("Update: " + JSON.stringify(data)); 
                    }, (error) => {
                         
                         console.log("ERROR : " + JSON.stringify(error.err));
                    });

              });



             //localStorage.setItem('currentLocation',state+", "+country);
             //localStorage.setItem('currentCity',city);

             //methodinstance.viewCtrl.dismiss();
             methodinstance.viewCtrl.dismiss({ currentLocation: state+", "+country , currentCity: city});
          }
      }*/

      /*getLatAndLong(location){
        //this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+val+'&key=AIzaSyAc_Vl10W5DZt5g8hkgYPCfXe6CnjmZ9dI').map(res => res.json()).subscribe(data => { 
        this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&sensor=true&key='+this.appdetailsProvider.mapKey).map(res => res.json()).subscribe(data => { 
           
           if(data.results.length>0){
             let latitude=data.results[0].geometry.location.lat;
             let longtude=data.results[0].geometry.location.lng;
             console.log("Lat & Long"+latitude+" ,"+longtude);

             //localStorage.setItem('geo_value',latitude+","+longtude);
             localStorage.setItem('current_geo_value',latitude+","+longtude);
            } 
        });
      }*/
}
 
 
 

@IonicPage()
@Component({
  selector: 'schedule',
  templateUrl: 'schedule.html',
})

export class SchedulePage {
    
    
    
    /* first time user exp */
    public firstTimeUserExp = "firstTimeUserExp firstTimeUserExpHide";
    firstTimeUserExpClick(){
        this.firstTimeUserExp= "firstTimeUserExp firstTimeUserExpHide";
    }
    /* first time user exp */



   isFrom:any="";

   dateMulti: any[];
   inputDates: any[];
   scheduleArry:any[]=[];
   scheduleDatesArry:any[]=[];
   city:any="";
   location:any="";
   schedule_geo:any="";
   personId:any="";
   schedule_dates_list:any="";
   PageTitle:any="New Availability";

  constructor(public platform: Platform,
              public calendarCtrl: CalendarController,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController, 
              public viewCtrl: ViewController, 
              public datePipe: DatePipe,
              public http:Http,
              public appdetailsProvider:AppdetailsProvider,
              public geolocation : Geolocation,
              public nativeGeocoder: NativeGeocoder,
              private diagnostic: Diagnostic,
              private alertCtrl: AlertController) {

   this.isFrom = navParams.get('isFrom');
   this.dateMulti = navParams.get('dateMulti');

   try{
     if(!this.isFrom){
      this.isFrom='';
     }

     if(this.isFrom==='FTUE'){
       this.firstTimeUserExp = "firstTimeUserExp";
       this.PageTitle="Plan Now";
     }
     
     if(localStorage.getItem('isPlanNowFirstTime')=='true'){
        localStorage.setItem('isPlanNowFirstTime','false');
     }

   }catch(Exception){

   }

   this.personId = localStorage.getItem("person_id");

   /*this.location=localStorage.getItem('selectedLocation');
   this.city=localStorage.getItem('selectedCity');
   this.schedule_geo=localStorage.getItem('geo_value');*/

   //this.location=localStorage.getItem('currentLocation');
   //this.city=localStorage.getItem('currentCity');
   //this.schedule_geo=localStorage.getItem('current_geo_value');

    /*if(!this.schedule_geo){
      this.myLocation();
    }*/

   //-----Set the dotes in calender from getting the Schedul list in localStorage------
   this.schedule_dates_list=localStorage.getItem('schedule_dates_list');
   
     if(this.schedule_dates_list){
       let scheduleDatesTempArry=this.schedule_dates_list.split(",");
        if (this.platform.is('ios')) {
             for (var i = 0; i < scheduleDatesTempArry.length; i++) {
                if(new Date(moment(scheduleDatesTempArry[i]).toDate()) >= new Date()){
                   this.scheduleDatesArry.push({
                     date: new Date(moment(scheduleDatesTempArry[i]).toDate()),
                     cssClass:"selectedDateClass",
                     disable:false,
                     marked:false
                   });
                 } else {
                   this.scheduleDatesArry.push({
                     date: new Date(moment(scheduleDatesTempArry[i]).toDate()),
                     cssClass:"unselectedDateClass",
                     disable:true,
                     marked:false
                   });
                 }
             }
        } else {
             for (var i = 0; i < scheduleDatesTempArry.length; i++) {
               
               if(new Date(datePipe.transform( scheduleDatesTempArry[i],'yyyy, MM, dd')) >= new Date()){
                 this.scheduleDatesArry.push({
                   date: new Date(datePipe.transform( scheduleDatesTempArry[i],'yyyy, MM, dd')),
                   cssClass:"selectedDateClass",
                   disable:false,
                   marked:false
                 });
               } else {
                 this.scheduleDatesArry.push({
                   date: new Date(datePipe.transform( scheduleDatesTempArry[i],'yyyy, MM, dd')),
                   cssClass:"unselectedDateClass",
                   disable:true,
                   marked:false
                 });
               }
               
             }
        }

     }
   //------------------------------------------------------------------
  }  

    myLocation(withMsg?){
      if (this.platform.is('ios')) {
         this.diagnostic.isLocationEnabled() .then((state) => {
                if (state==false) { 
                      let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                          } }, 
                           { text: 'Ok', handler: () => { 
                                      this.diagnostic.switchToLocationSettings(); 
                           } }] });
                          alt.present(); 
                 } else {
                    this.getMycurrentLocation(withMsg);
                 }
          }) .catch(e => console.error(e)); 
       } else {
         this.diagnostic.isGpsLocationEnabled() .then((state) => {
                if (state==false) { 
                      let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                          } }, 
                           { text: 'Ok', handler: () => { 
                                      this.diagnostic.switchToLocationSettings(); 
                           } }] });
                          alt.present(); 
                 } else {
                    this.getMycurrentLocation(withMsg);
                 }
          }) .catch(e => console.error(e)); 
       }
      }
    
    getMycurrentLocation(withMsg?){
       var options = {
                 enableHighAccuracy: false,
                 timeout: Infinity,
                 maximumAge: 10000
                };
                if(withMsg){
                 this.appdetailsProvider.ShowLoadingMeg('Fetching current location.');
                }else{
                 this.appdetailsProvider.ShowLoading();
                }

                              this.geolocation.getCurrentPosition(options).then((resp) => {
                                 let latitude= resp.coords.latitude;
                                 let longitude= resp.coords.longitude;

                                        this.nativeGeocoder.reverseGeocode(latitude, longitude)
                                        .then((result: NativeGeocoderReverseResult) =>
                                             { this.appdetailsProvider. HideLoading();
                                                    let country=result.countryName;
                                                    let city=result.subAdministrativeArea;
                                                    let state=result.administrativeArea;
                                                    //this.appdetailsProvider.location=state+", "+country;

                                                    /*localStorage.setItem('selectedLocation',state+", "+country);
                                                    localStorage.setItem('selectedCity',city);
                                                    localStorage.setItem('geo_value',latitude+","+longitude);*/

                                                    localStorage.setItem('currentLocation',state+", "+country);
                                                    localStorage.setItem('currentCity',city);
                                                    localStorage.setItem('current_geo_value',latitude+","+longitude);

                                                       this.location=state+", "+country;
                                                       this.city=city;
                                                       this.schedule_geo=latitude+","+longitude;

                                                    //this.appdetailsProvider.city=city;
                                              
                                            })
                                  .catch((error: any) =>{ console.log(error);         
                                   this.appdetailsProvider. HideLoading();
                                   this.appdetailsProvider. HideLoading();
                                 });
                        }).catch((error) => {
                          console.log('Error getting location', error);
                          this.appdetailsProvider. HideLoading();
                          this.appdetailsProvider. HideLoading();
                        });
      }

  openModalLocation() {
        let modal = this.modalCtrl.create(ModalLocation,{isFrom:this.isFrom});
        modal.onDidDismiss(data => {
                console.log(data);
                /*     location_name: location.location_name,
                       location_country: location.location_country,
                       location_geo:location.location_geo
                */
                
                this.city=data.location_name;
                this.location=data.location_country;
                this.schedule_geo=data.location_geo;

                /*if(localStorage.getItem('current_geo_value')){
                  this.schedule_geo=localStorage.getItem('current_geo_value');
                }else{
                  localStorage.setItem('current_geo_value',this.schedule_geo);
                }*/
         });
        modal.present();
  }

  cancel(){
      const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
  }

  goToCalender(){
    debugger;
    if(this.city!=='' && this.location!=='' && this.schedule_geo!=='') {
      this.navCtrl.push(CalenderPage,{isFrom:this.isFrom,
                                    city:this.city,
                                    location:this.location,
                                    schedule_geo:this.schedule_geo
                                  });
    } else {
      this.appdetailsProvider.ShowToast("Please select the location",3000);
    }
  }


        
  /*AddSchedule(){

    if(this.isFrom == 'FTUE'){
      this.navCtrl.push(CalenderPage,{isFrom:this.isFrom,city:this.city,location:this.location,schedule_geo:this.schedule_geo});
      return;
    }

    let methodinstance=this;
    if(this.appdetailsProvider.CheckConnection()){
      if(this.dateMulti) {


        this.appdetailsProvider.ShowLoading();
        
              for(var i=0;i<this.dateMulti.length;i++) {

                  let date = this.datePipe.transform(this.dateMulti[i]._d+"",'yyyy-MM-dd');
                  this.scheduleArry.push({schedule_startdate:date,
                                          schedule_enddate:date,
                                          schedule_location_city:this.city,
                                          schedule_location_country:this.location,
                                          schedule_geo:this.schedule_geo,
                                          schedule_radius:"10",
                                          schedule_isoutnow:false});
              }
               let finalarry={
                 person_id:this.personId,
                 schedule:this.scheduleArry
               };
        const header = {'x-access-token': localStorage.getItem("authoKey")}
        const requestOptions = {headers: new Headers(header)};

        console.log("AddSchedule-Req :"+JSON.stringify(finalarry));
               this.http.post(this.appdetailsProvider.addschedule,finalarry,requestOptions)
                .subscribe(
                          function(response) {
                             let temp=JSON.parse(response['_body']);
                             try {
                                let newScheduleId=temp.schedules[0];
                                let oldScheduleId=localStorage.getItem('schedule_ids_list');
                                let latestList= !oldScheduleId || oldScheduleId==''? newScheduleId:oldScheduleId+","+newScheduleId;

                                localStorage.setItem('schedule_ids_list',latestList);

                             }catch(Exception){
                               console.log("Exception");
                             }
                             
                             debugger;
                             methodinstance.appdetailsProvider.HideLoading();
                             if(methodinstance.isFrom==="Filter"){
                                 methodinstance.navCtrl.setRoot(HomePage);
                             }else{
                                 methodinstance.navCtrl.setRoot(HomePage);
                           }
                },
                function(error) {
                   methodinstance.appdetailsProvider.HideLoading();
                   methodinstance.navCtrl.setRoot(HomePage);
                }
          );
      } else {
      this.appdetailsProvider.ShowToast("Please select date",3000);
      }
    }      
  }*/
       
    
}

