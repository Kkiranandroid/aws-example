import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ViewController, ModalController , Platform} from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { DatePipe} from '@angular/common';

import { Outnow } from '../outnow/outnow';
import { HomePage } from '../home/home';

import {Http, Headers, RequestOptions } from '@angular/http';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Diagnostic } from '@ionic-native/diagnostic';

import moment from 'moment';

/**
 * Generated class for the OutNowMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 //---------------------Modele Start------------------
@Component({
  template: `
<ion-header class="modalHeader searchSecion">
  <ion-toolbar>
  <ion-searchbar (ionChange)="getItems($event)" placeholder="Enter Location"></ion-searchbar>
    <ion-buttons start class="modalBackButtonMain">
      <button ion-button (click)="closeModal()">
        Cancel
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="modalScroll">

    <ion-list class="modalLists scrollContntMain">

    <span class="modalinputClose" style="display:none">
      <ion-item>
        <ion-input (ionChange)='getItems($event)' [(ngModel)]="inputtext" type="text" autocorrect="on" autocomplete="on" placeholder="Where would you like to meet?"></ion-input>
      </ion-item>
      <ion-icon *ngIf="showClearIcon =='true'" (click)="clearEditText();" name="close" class="modalinputCloseIcon"></ion-icon>
      </span>

      <ion-item  *ngIf="showList =='true'">
        <ion-list>
          <ion-item *ngFor="let item of locationList;" (click)="addToLocation(item);">
        
                {{item.description}}
          </ion-item>
        </ion-list>
      </ion-item>

      <ion-item (click)="myLocation();">
      <ion-label class="bliClr"><ion-icon class="fa fa-location-arrow modalLocationIcon"></ion-icon>Current Location</ion-label>
    </ion-item>

    <ion-item class="modalRecent">
      Recents
    </ion-item>

      </ion-list>
      <ion-list class="scrollContnt">
      <ion-item class="contentPading">
       <div class="dateListMain" *ngFor="let item of recentLoactionList;" (click)="setLocation(item);">
          <div class="contentInfo2">
              <h3><b>{{item.city}}</b></h3>
              <h5>{{item.state}}, {{item.contry}}</h5>
          </div>
       </div>
    </ion-item>
  </ion-list>
</ion-content>`})
  /*  {{item.structured_formatting.main_text}}*/

export class ModalLocationOutNow {

   locationList:any[]=[];
   recentLoactionList:any[]=[];
   showList:any="";
   showClearIcon:any="";
   inputtext:any="";

    constructor(public platform: Platform,
    	public http:Http,
    	public navCtrl: NavController,
    	public viewCtrl: ViewController,
    	private geolocation: Geolocation,
    	private nativeGeocoder: NativeGeocoder,
    	public appdetailsProvider:AppdetailsProvider, 
    	private diagnostic: Diagnostic,
    	private alertCtrl: AlertController){
      this.getRecentLocationList();
    }
    
      closeModal() {
        this.viewCtrl.dismiss();
      }

      myLocation(){
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
                 timeout: Infinity,
                 maximumAge: 10000
                };
                
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
                                                    debugger;
                                                    localStorage.setItem('current_geo_value',latitude+","+longitude);
                                                    //this.appdetailsProvider.city=city;
                                                    this.appdetailsProvider. HideLoading();
                                                    
                                                    this.viewCtrl.dismiss({ currentLocation: state+", "+country , currentCity: city});
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

      getItems(event) {
      
      if(this.appdetailsProvider.CheckConnection()){
        var val = event.value;
         if(val.length > 0) {
           this.showClearIcon="true";
           this.locationList=[];

           this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+val+'&key='+this.appdetailsProvider.mapKey).map(res => res.json()).subscribe(data => { 
             
             if(data.predictions.length>0) {
               debugger;
                 this.locationList=data.predictions;
                 this.showList="true";
              } else {
                this.showList="false";
              }
             /*for (var i =0; i < data.predictions.length; i++) {
               var city=data.predictions[i].structured_formatting.main_text;
                console.log('City names :-->', city);
             }*/

          }); 
         } else {
            this.showList="false";
            this.showClearIcon="false";
         }
       }
      }

      clearEditText(){
        this.inputtext="";
        this.showList="false";
        this.showClearIcon="false";
      }

      addToLocation(location){
          
          let methodinstance=this;
          if(location.terms.length > 0) {
             let city=location.structured_formatting.main_text
             let state=location.terms[location.terms.length-2].value;
             let country=location.terms[location.terms.length-1].value;

             this.getLatAndLong(city);


             methodinstance.appdetailsProvider.getDbInstance().executeSql("INSERT INTO outNowRecentLoactionTb( city, state, contry) VALUES (?,?,?)", [city, state, country]).then((data) => {        
                  
                  console.log("INSERTED: " + JSON.stringify(data));
                  console.log("INSERTED-ID: " + JSON.stringify(data.insertId));
                  if(data.insertId > 10){
                            
                      methodinstance.appdetailsProvider.getDbInstance().executeSql("DELETE FROM outNowRecentLoactionTb WHERE id IN (SELECT id FROM outNowRecentLoactionTb ORDER BY priority,id ASC LIMIT 1)").then((data) => {
                         
                         console.log("Delete success: " + JSON.stringify(data));    
                    }, (error) => {
                         
                         console.log("ERROR Delete: " + JSON.stringify(error.err));
                    });
                  }
             
              }, (error) => {
                  
                   console.log("ERROR: " + JSON.stringify(error.err));
                   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE outNowRecentLoactionTb set priority = priority + 1 where city='"+city+"'").then((data) => {
                        console.log("Update: " + JSON.stringify(data)); 
                    }, (error) => {
                         
                         console.log("ERROR : " + JSON.stringify(error.err));
                    });

              });


             //localStorage.setItem('currentLocation',state+", "+country);
             //localStorage.setItem('currentCity',city);
             methodinstance.viewCtrl.dismiss({ currentLocation: state+", "+country , currentCity: city});
             //methodinstance.viewCtrl.dismiss({ currentLocation: location.state+", "+location.contry,currentCity: location.city});
          }
      }

      getLatAndLong(location){
        //this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+val+'&key=AIzaSyAc_Vl10W5DZt5g8hkgYPCfXe6CnjmZ9dI').map(res => res.json()).subscribe(data => { 
        this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&sensor=true&key='+this.appdetailsProvider.mapKey).map(res => res.json()).subscribe(data => { 
           
           if(data.results.length>0){
             let latitude=data.results[0].geometry.location.lat;
             let longtude=data.results[0].geometry.location.lng;
             console.log("Lat : "+latitude+"\nLong : "+longtude);
             debugger;
             localStorage.setItem('current_geo_value',latitude+","+longtude);
            } 
        });
      }

      setLocation(location) {
         let methodinstance=this;
         debugger;
         /*localStorage.setItem('currentLocation',location.state+", "+location.contry);
         localStorage.setItem('currentCity',location.city);*/
         this.getLatAndLong(location.city);
         methodinstance.viewCtrl.dismiss({ currentLocation: location.state+", "+location.contry,currentCity: location.city});
      }

      getRecentLocationList(){
          
          let methodinstance=this;
          

        this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM outNowRecentLoactionTb ORDER BY priority DESC", []).then((data) => {
        
         if(data.rows.length > 0) {
           for(var i = 0; i < data.rows.length; i++) {
              methodinstance.recentLoactionList.push({city: data.rows.item(i).city, state: data.rows.item(i).state, contry: data.rows.item(i).contry});
          }
         }
        }, (error) => {
        
          console.log("Error block");
          console.log("ERROR: " + JSON.stringify(error));
        });
      }
}
//---------------------Modele End--------------------

@Component({
  selector: 'page-out-now-main',
  templateUrl: 'out-now-main.html',
})
export class OutNowMainPage {

    /* first time user exp */
    firstTimeFab:boolean = false;
    public firstTimeUserExp = "firstTimeUserExp firstTimeUserExpHide";

    firstTimeUserExpClick(){
        this.firstTimeUserExp= "firstTimeUserExp firstTimeUserExpHide";
    }
/* first time user exp */

   city:any="Portsmouth";
   location:any="England, United Kingdom";
   schedule_geo:any="";

   personId:any="";
   isFrom:any="";

   recentLoc:any="Karnataka, India";

   //myDate:any="";
   finalCurrentDate:any="";
   minimumDate:any="2018-02-16T17:33:33.384";
   maximumDate:any="";

   finalEndDate:any="";
   currentDate:any="";

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
    public http:Http) {

	  	this.personId = localStorage.getItem("person_id");

		  this.isFrom=navParams.get("isFrom");
		  if(!this.isFrom){
			this.isFrom='';
		  }

      if(localStorage.getItem('isOutNowFirstTime')=='true'){
        localStorage.setItem('isOutNowFirstTime','false');
      }

      if(this.isFrom==='FTUE'){
        this.firstTimeUserExp = "firstTimeUserExp";

      }
      this.setDatesValue();

      debugger;

	    this.city=localStorage.getItem('currentCity')==null?"":localStorage.getItem('currentCity');
	    this.location=localStorage.getItem('currentLocation')==null?"":localStorage.getItem('currentLocation');
	    debugger;
	    if(this.location.length == 0 && this.city.length == 0) {
	      this.getCurrentLocation();
	    }
	    this.getRecentLocation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OutNowMainPage');
  }

  openModalLocation() {
        let modal = this.modalCtrl.create(ModalLocationOutNow);
        modal.onDidDismiss(data => {
        	
                console.log(data);
                //this.location=this.appdetailsProvider.location;
                debugger;
                /*this.location=localStorage.getItem('currentLocation');
                this.city=localStorage.getItem('currentCity');*/

                this.location=data.currentLocation;
                this.city=data.currentCity;

                if(localStorage.getItem('current_geo_value')){
                  this.schedule_geo=localStorage.getItem('current_geo_value');
                }else{
                  localStorage.setItem('current_geo_value',this.schedule_geo);
                }
                
                //this.city=this.appdetailsProvider.city;
         });
        modal.present();
  }

  getCurrentLocation(withMsg?) {
    if (this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled() .then((state) => { 
      console.log("state: "+state); 
          if (state==false){ 
          let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
          } }, 
            { text: 'Ok', handler: () => { 
              
              this.diagnostic.switchToLocationSettings(); 
            } 
          }] 
          });
          alt.present(); 
       } else { 
          this.getlocation(withMsg);
       } 
       }) .catch(e => console.error(e)); 

    } else {
      this.diagnostic.isGpsLocationEnabled() .then((state) => { 
      console.log("state: "+state); 
          if (state==false){ 
          let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
          } }, 
            { text: 'Ok', handler: () => { 
              
              this.diagnostic.switchToLocationSettings(); 
            } 
          }] 
          });
          alt.present(); 
       } else { 
          this.getlocation(withMsg);
       } 
       }) .catch(e => console.error(e)); 
    }

  }

  getRecentLocation() {
        let methodinstance = this;

        this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM outNowRecentLoactionTb ORDER BY priority DESC LIMIT 1", []).then((data) => {
         
         if(data.rows.length > 0) {
            methodinstance.recentLoc = data.rows.item(0).city;
         } else {
            methodinstance.recentLoc = localStorage.getItem('currentCity');
         }

        }, (error) => {
          console.log("Error block");
          console.log("ERROR: " + JSON.stringify(error));
      });
  }

  getlocation(withMsg?) {
       
        debugger;
        let methodinstance=this;

        var options = {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000
      };

       if(withMsg){
        methodinstance.appdetailsProvider.ShowLoadingMeg('Fetching current location.');
       }else{
        methodinstance.appdetailsProvider.ShowLoading();
       }

        try{

            methodinstance.geolocation.getCurrentPosition(options).then((resp) => {
               let latitude= resp.coords.latitude;
               let longitude= resp.coords.longitude;
               debugger;

               methodinstance.nativeGeocoder.reverseGeocode(latitude, longitude)
                .then((result: NativeGeocoderReverseResult) => {

                      methodinstance.appdetailsProvider. HideLoading();
               debugger;

                      let country=result.countryName;
                      let city=result.subAdministrativeArea;
                      let state=result.administrativeArea;

                      if(localStorage.getItem('currentCity') == city) {
                          console.log('current city is SAME as previous city');
                      } else {
                          console.log('current city is NOT same as previous city');
                          //send the current location to API here
                      }

                      methodinstance.city=city;
                      methodinstance.location=state+", "+country;
                      methodinstance.schedule_geo=latitude+","+longitude
                      
                      localStorage.setItem('currentLocation',state+", "+country);
                      localStorage.setItem('currentCity',city);
                      localStorage.setItem('current_geo_value',latitude+","+longitude);

                      if(methodinstance.recentLoc == "" || methodinstance.recentLoc == null) {
                        setTimeout(() => {
                          methodinstance.recentLoc=city;
                        },1000*2);   //5 sec
                      }
                      
                  }).catch((error: any) => { 
                      console.log(error);
                      methodinstance.appdetailsProvider. HideLoading();
                  });
            }).catch((error) => {
              if(error.message ==='Timeout expired'){
                this.appdetailsProvider.ShowToast('Current location not fount please select manually',1000);
              }
              console.log('Error getting location', error);
              methodinstance.appdetailsProvider. HideLoading();
            });
        }catch(Exception){
              console.log("Got exception while getting loaction");
            }
  }

  goToOutNow(){

  	this.navCtrl.push(Outnow);
  }

  goBack(){
      const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
  }

  addOutNow() {
    let methodinstance=this;
    if(this.appdetailsProvider.CheckConnection()){
       let scheduleArry=[];
       this.appdetailsProvider.ShowLoading();
              scheduleArry.push({ schedule_startdate:methodinstance.currentDate, 
                                      schedule_enddate:methodinstance.finalEndDate, 
                                      schedule_location_city:methodinstance.city,
                                      schedule_location_country:methodinstance.location,
                                      schedule_geo:methodinstance.schedule_geo==null?'0,0':methodinstance.schedule_geo,
                                      schedule_radius:"10",
                                      schedule_isoutnow:true});
              
              let finalarry = {
                       person_id:this.personId,
                       schedule:scheduleArry
               };               
               
               let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
               let requestOptions = new RequestOptions({headers: headers});

               debugger;
               console.log("AddOutNowSchedule-FTUE-Req :"+JSON.stringify(finalarry));
               
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
                   methodinstance.appdetailsProvider.SomethingWentWrongAlert();
                   methodinstance.appdetailsProvider.HideLoading();
                }
          );
    }
 
}

  setDatesValue(){
    let context=this;
    let endDate;
    try {
      debugger;
      let date: Date = new Date();

      debugger;
      //endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),parseInt("23"),parseInt("59") ,parseInt("59") ,parseInt("59") );
      endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()+1,parseInt("02"),parseInt("00") ,parseInt("00") ,parseInt("00") );

      this.finalEndDate = context.datepipe.transform(endDate.toString()+"",'yyyy-MM-dd hh:mm a');
      this.currentDate = this.datepipe.transform(new Date().toString()+"",'yyyy-MM-dd hh:mm a');

      debugger;

      this.city=localStorage.getItem('currentCity')==null?"":localStorage.getItem('currentCity');
      this.location=localStorage.getItem('currentLocation')==null?"":localStorage.getItem('currentLocation');
      this.schedule_geo =  localStorage.getItem('current_geo_value');

    } catch(Exception) {

    }
  }

}
