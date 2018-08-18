import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController,Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { SchedulePage } from '../schedule/schedule';
import { CalenderPage } from '../calender/calender';
import {Http, Headers, RequestOptions } from '@angular/http';
import {DatePipe} from '@angular/common';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
    isFromPage:any = "";
    isOutNowFlag:any = "";
    personId:any="";
    schedule_id:any="";
    filterCheckBoxNew:any="filterCheckBoxNew";
    noItemFound=false;

     public outNowFlagDiv = 'filterHeads marginTp';

    isCheckedAnyTime:any = false;
    isCheckedOutNow:any = true;
    avalibilityList:any[]=[];
    mainAvalibilityList:any[]=[];

    scheduleIdsArray:any[]=[];

  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public appdetailsProvider:AppdetailsProvider,private diagnostic: Diagnostic, public alertCtrl: AlertController,private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder,public http:Http,private datePipe: DatePipe) {

      this.isFromPage = navParams.get('isFromPage');
      this.schedule_id = navParams.get('schedule_id');

      this.personId = localStorage.getItem("person_id");

      this.filterCheckBoxNew=platform.is('ios')?'filterCheckBoxNewIos':'filterCheckBoxNew';
      
      debugger;
      if(localStorage.getItem('OutNow_end_dateTime')){
          this.isOutNowFlag = localStorage.getItem('OutNow_end_dateTime').length > 0 ? true : false;
      } else {
        localStorage.setItem('OutNow_end_dateTime','');
        this.isOutNowFlag = false;
      }
      if(!this.isOutNowFlag){
        this.outNowFlagDiv='filterHeads marginTp marginTop50';
      }else{
        this.outNowFlagDiv='filterHeads marginTp';
      }
    
      debugger;
      if(!this.schedule_id) {
        this.schedule_id="";
      }
      debugger;

      if(this.isFromPage === "OutNow") {
        this.isCheckedAnyTime = false;
        this.isCheckedOutNow = true;
      } else if(this.isFromPage === "DateValue") {
        this.isCheckedAnyTime = false;
        this.isCheckedOutNow = false;
      } else {
        this.isCheckedAnyTime = true;
        this.isCheckedOutNow = false;
      }

      this.getAvalibilityList();

  }

  getAvalibilityList() {
    debugger;
    if(this.schedule_id) {
      for (var i = 0; i < this.schedule_id.split(",").length; i++) {
        this.scheduleIdsArray.push(this.schedule_id.split(",")[i]);
      }
    }


    this.appdetailsProvider.ShowLoading();
      debugger;
         let headers = new Headers({
                                     
                                            'x-access-token': localStorage.getItem("authoKey")
                                       });
                                         
                                       let requestOptions = new RequestOptions({
                                        headers: headers
                                        });
     let methodinstance=this;
     this.http.get(this.appdetailsProvider.scheduledlisturl+this.personId,requestOptions).subscribe(
       //success part
       function(response) {
          debugger;
          let temp=JSON.parse(response['_body']);

          debugger;
        if(temp){
            debugger;

            //Stored the schedule_ids in localStorage.
              let tempScheduleIdsList="";
              let tempScheduleDateList="";

              for(var i=0;i<temp.length;i++) {
                  let isChecked=methodinstance.scheduleIdsArray.indexOf(temp[i].schedule_id) < 0 ? false : true;
                  methodinstance.avalibilityList.push({"schedule_id":temp[i].schedule_id,"isChecked": isChecked ,"fulldate":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEEE, MMMM dd'), "city":temp[i].schedule_location_city, "locations":temp[i].schedule_location_country, "date":methodinstance.datePipe.transform( temp[i].schedule_startdate,'dd'), "month":methodinstance.datePipe.transform( temp[i].schedule_startdate,'MMM'), "day":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEE'),"schedule_startdate":temp[i].schedule_startdate});
                  methodinstance.mainAvalibilityList.push({"schedule_id":temp[i].schedule_id,"isChecked": false ,"fulldate":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEEE, MMMM dd'), "city":temp[i].schedule_location_city, "locations":temp[i].schedule_location_country, "date":methodinstance.datePipe.transform( temp[i].schedule_startdate,'dd'), "month":methodinstance.datePipe.transform( temp[i].schedule_startdate,'MMM'), "day":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEE'),"schedule_startdate":temp[i].schedule_startdate});

                  tempScheduleIdsList = tempScheduleIdsList===""?temp[i].schedule_id : tempScheduleIdsList+","+temp[i].schedule_id;
                  tempScheduleDateList = tempScheduleDateList===""?temp[i].schedule_startdate : tempScheduleDateList+","+temp[i].schedule_startdate;
          
              }
            
              if(methodinstance.avalibilityList.length==0) {
                   methodinstance.noItemFound=true;
              } else {
                   methodinstance.noItemFound=false;
              }

              if(methodinstance.mainAvalibilityList.length>0){
                localStorage.setItem('schedule_ids_list',"");
                localStorage.setItem('schedule_dates_list',"");
                 setTimeout(() => {
                 localStorage.setItem('schedule_ids_list',tempScheduleIdsList);
                 localStorage.setItem('schedule_dates_list',tempScheduleDateList);
                 }, 1000);
              }


        }else{
          methodinstance.noItemFound=true;
          methodinstance.appdetailsProvider.SomethingWentWrongAlert();
        }
        methodinstance.appdetailsProvider.HideLoading();
       },
            function(error) {
            debugger;
               methodinstance.appdetailsProvider.SomethingWentWrongAlert();
               methodinstance.appdetailsProvider.HideLoading();
               if(methodinstance.avalibilityList.length==0){
                  methodinstance.noItemFound=true;
                 } else {
                   methodinstance.noItemFound=false;
                 }
            }
        );
    
  }

  goCancel() {
  	const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }

  goDone() {
    if(this.isCheckedAnyTime){
        this.navCtrl.setRoot(HomePage,{isFromPage:""});
      }else if(this.isCheckedOutNow) {
        debugger;
        let scheduleIdsList="";
        for (var i = 0; i < this.avalibilityList.length; i++) {
          scheduleIdsList=scheduleIdsList===''?this.avalibilityList[i].schedule_id : scheduleIdsList+","+this.avalibilityList[i].schedule_id;
        }

        scheduleIdsList=scheduleIdsList===''?localStorage.getItem('OutNow_scheduleIdsList') : scheduleIdsList+","+localStorage.getItem('OutNow_scheduleIdsList');

        this.navCtrl.setRoot(HomePage,{isFromPage:"OutNow",schedule_id:scheduleIdsList});
        //this.navCtrl.setRoot(HomePage,{isFromPage:"OutNow",schedule_id:localStorage.getItem('OutNow_scheduleIdsList')});
      }else{
        debugger;
        let scheduleIdsList="";
        let count=0;
        let fulldateValue=0;
        for (var i = 0; i < this.avalibilityList.length; i++) {
          if(this.avalibilityList[i].isChecked) {
            count++;
            fulldateValue=this.avalibilityList[i].fulldate
            scheduleIdsList=scheduleIdsList===''?this.avalibilityList[i].schedule_id : scheduleIdsList+","+this.avalibilityList[i].schedule_id;
          }
        }

        debugger;
        if(count===1) {
            this.appdetailsProvider.cardListArray=[];
            this.navCtrl.setRoot(HomePage,{isFromPage:"",dateValue:fulldateValue,schedule_id: scheduleIdsList});
        } else if(count>1) {
            this.appdetailsProvider.cardListArray=[];
            this.navCtrl.setRoot(HomePage,{isFromPage:"",dateValue:"Multiple dates selected",schedule_id: scheduleIdsList});
        } else {
            this.appdetailsProvider.ShowToast("Please select the date",2000);
        }
      }
  }

  clickOnOutNow() {
    debugger;
    this.isCheckedAnyTime = false;
    this.isCheckedOutNow = true;
    let methodinstance=this;

    let tempdatelists:any[]=[];
    //this.navCtrl.setRoot(HomePage,{isFromPage:"OutNow"});

    /*debugger;
    for (var i = 0; i < methodinstance.avalibilityList.length; i++) {
      tempdatelists.push({"schedule_id":methodinstance.avalibilityList[i].schedule_id,"isChecked":false ,"fulldate":methodinstance.avalibilityList[i].fulldate, "city":methodinstance.avalibilityList[i].city, "locations":methodinstance.avalibilityList[i].locations, "date":methodinstance.avalibilityList[i].date, "month":methodinstance.avalibilityList[i].month, "day":methodinstance.avalibilityList[i].day});
    }
    
    debugger;
    setTimeout(() => {
        methodinstance.avalibilityList=[];
        methodinstance.avalibilityList=tempdatelists;
    },200);*/
   
  }

  clickOnAnyTime() {
    debugger;
    this.isCheckedAnyTime = true;
    this.isCheckedOutNow = false;
    let methodinstance=this;

    let tempdatelists:any[]=[];
    //this.navCtrl.setRoot(HomePage,{isFromPage:""});

    debugger;

    for (var i = 0; i < methodinstance.avalibilityList.length; i++) {
      tempdatelists.push({"schedule_id":methodinstance.avalibilityList[i].schedule_id,"isChecked":false ,"fulldate":methodinstance.avalibilityList[i].fulldate, "city":methodinstance.avalibilityList[i].city, "locations":methodinstance.avalibilityList[i].locations, "date":methodinstance.avalibilityList[i].date, "month":methodinstance.avalibilityList[i].month, "day":methodinstance.avalibilityList[i].day});
    }
    
    debugger;
    setTimeout(() => {
        methodinstance.avalibilityList=[];
        methodinstance.avalibilityList=tempdatelists;
    },200);
  }

  onClickItem(avalibilityItem) {
    debugger;
    
    this.isCheckedAnyTime = false;
    //this.isCheckedOutNow = false;

    avalibilityItem.isChecked=!avalibilityItem.isChecked
    debugger
    console.log("checkd List : "+JSON.stringify(this.avalibilityList.length));

    debugger;
    
  }

  deleteAvalibility(avalibilityItem) {
    if(this.appdetailsProvider.CheckConnection()){

        let methodinstance=this;
        methodinstance.appdetailsProvider.ShowLoading();
        let checkedList:any[]=[];
        let index = this.avalibilityList.indexOf(avalibilityItem);

        if(index > -1) {
          
           checkedList.push({"schedule_id":avalibilityItem.schedule_id});
           let body={person_id: this.personId, schedule:checkedList}


              let headers= new Headers();
              let options= new RequestOptions({headers:headers});

              headers.append('Content-Type', 'application/json');
              headers.append('x-access-token', localStorage.getItem("authoKey"));

              console.log('Delete-Schedule '+JSON.stringify(body));
                 debugger;
              this.http.delete(this.appdetailsProvider.addschedule, new RequestOptions({
                   headers: headers,
                   body: body
                })).subscribe( function(response) {
                      debugger;
                      methodinstance.appdetailsProvider.HideLoading();
                      let message=JSON.parse(response['_body']).schedules;
                      methodinstance.avalibilityList.splice(index, 1);
                      methodinstance.appdetailsProvider.ShowToast(message,3000);

                      //Stored the schedule_ids in localStorage.
                      let tempScheduleIdsList="";
                      let tempScheduleDateList="";
                      debugger;


                      for(var i=0;i<methodinstance.avalibilityList.length;i++) {
                          tempScheduleIdsList = tempScheduleIdsList===""?methodinstance.avalibilityList[i].schedule_id : tempScheduleIdsList+","+methodinstance.avalibilityList[i].schedule_id;
                          tempScheduleDateList = tempScheduleDateList===""?methodinstance.avalibilityList[i].schedule_startdate : tempScheduleDateList+","+methodinstance.avalibilityList[i].schedule_startdate;
                      }
                      setTimeout(() => {
                          if(methodinstance.avalibilityList.length>0){
                              localStorage.setItem('schedule_ids_list',"");
                              localStorage.setItem('schedule_dates_list',"");

                             localStorage.setItem('schedule_ids_list',tempScheduleIdsList);
                             localStorage.setItem('schedule_dates_list',tempScheduleDateList);
                           }
                      }, 300);


                 }, function(error) {
                     debugger;
                     methodinstance.appdetailsProvider.HideLoading();
                     methodinstance.appdetailsProvider.SomethingWentWrongAlert();
                 });
        }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }


  goToCalenderPage(){
      let currentLocation=localStorage.getItem('currentLocation');
      let currentCity=localStorage.getItem('currentCity');
      let current_geo_value=localStorage.getItem('current_geo_value');
      debugger;
      if(currentLocation && currentCity && current_geo_value){
        this.navCtrl.push(CalenderPage,{isFrom:"Filter"});
      }else{
        this.myLocation();
      }
    }

  //--------------------- get current location code-----------------------------------
    myLocation() {
     if(this.appdetailsProvider.CheckConnection()){
        if (this.platform.is('ios')) {
           this.diagnostic.isLocationEnabled() .then((state) => {

                  if (state==false){ 
                        this.appdetailsProvider. HideLoading();
                        let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                        this.diagnostic.switchToLocationSettings(); 
                             } }] });
                            alt.present(); 
                   } else { 
                      this.appdetailsProvider. ShowLoading();
                      this.getMycurrentLocation();
                   } 
            }) .catch(e => console.error(e)); 
         } else {
           this.diagnostic.isGpsLocationEnabled() .then((state) => {

                  if (state==false){ 
                        this.appdetailsProvider. HideLoading();
                        let alt = this.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                 this.diagnostic.switchToLocationSettings(); 
                               } 
                             }]
                           });
                            alt.present(); 
                   } else { 
                      this.appdetailsProvider. ShowLoading();
                      this.getMycurrentLocation();
                   } 
            }) .catch(e => console.error(e));
         }
     }
    }

      getMycurrentLocation() {
       var options = {
                 enableHighAccuracy: false,
                 timeout: Infinity,
                 maximumAge: 10000
                };
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

                                                    // localStorage.setItem('selectedLocation',state+", "+country);
                                                    //localStorage.setItem('selectedCity',city);
                                                    //this.appdetailsProvider.city=city;
                                                    this.appdetailsProvider. HideLoading();
                                                    //this.viewCtrl.dismiss();

                                                    //this.navCtrl.push(SchedulePage,{isFrom:"Filter"});
                                                    this.navCtrl.push(CalenderPage,{isFrom:"Filter"});

                                                    /*if(this.isCheckedAnyTime){
                                                        debugger;
                                                        this.navCtrl.push(SchedulePage,{isFrom:"DateList"});
                                                    } else if(this.isCheckedOutNow){
                                                        debugger;
                                                        this.navCtrl.push(SchedulePage,{isFrom:"Filter"});
                                                    }*/
                                            })
                                  .catch((error: any) =>{
                                    console.log(error);
                                   this.appdetailsProvider. HideLoading();
                                 });
                        }).catch((error) => {
                          console.log('Error getting location', error);
                          this.appdetailsProvider. HideLoading();
                        });
      }
    //--------------------------------------------------------------------------------- 

}
