import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { SchedulePage } from '../schedule/schedule';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { HomePage } from '../home/home';
import { CalenderPage } from '../calender/calender';
//import { FlurryAnalytics, FlurryAnalyticsObject, FlurryAnalyticsOptions,FlurryAnalyticsLocation } from '@ionic-native/flurry-analytics';

@IonicPage()
@Component({
  selector: 'datelist',
  templateUrl: 'datelist.html',
})
export class Datelist {
    noItemFound=false;
    datelists:any[]=[];
    isFrom:any="";
    isrecordDeleted:any=false;
    personId:any="";
    isEditOrDone:any="Edit";
    selectAll:any="Select All";
    selectAllTextColor:any="#8E8E93";
    deleteTextColor:any="#8E8E93";//#595BD2

    public datelistLine = 'style1';

  constructor(public platform: Platform,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public appdetailsProvider:AppdetailsProvider,
              public http:Http,
              private datePipe: DatePipe, 
              private diagnostic: Diagnostic,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              public viewCtrl: ViewController) { 
      localStorage.getItem('selectedCity');
      this.isFrom = navParams.get('isFrom');
      this.personId = localStorage.getItem("person_id");

      console.log('Person_Id :--> '+this.personId);
      debugger;

      if(this.appdetailsProvider.CheckConnection()) {
        debugger;
        this.getScheduledData();
      }
  }
  cancelButton(){
    let methodcontext=this;
    if(this.isrecordDeleted){

      methodcontext.navCtrl.setRoot(HomePage).then(() => {
        const index = methodcontext.viewCtrl.index;
        for(let i = index; i >0; i--){
            methodcontext.navCtrl.remove(i);
        }
      });
    } else if(this.isFrom == "profileScreen") {
          this.navCtrl.setRoot(HomePage);
      } else {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
      }
  }

  isEditOrDoneMethod() {
    let methodinstance=this;
    let tempdatelists:any[]=[];

    if (this.isEditOrDone=="Edit") {
      this.selectAll="Select All";
      this.isEditOrDone="Done";
      this.selectAllTextColor="#595BD2";//blue
      this.deleteTextColor="#8E8E93";
      this.datelistLine = "addLine";

      for (var i = 0; i < methodinstance.datelists.length; i++) {
          tempdatelists.push({"schedule_id":methodinstance.datelists[i].schedule_id,"isChecked":false ,"fulldate":methodinstance.datelists[i].fulldate, "city":methodinstance.datelists[i].city, "locations":methodinstance.datelists[i].locations, "date":methodinstance.datelists[i].date, "month":methodinstance.datelists[i].month, "day":methodinstance.datelists[i].day,"schedule_startdate":methodinstance.datelists[i].schedule_startdate});
        }

        setTimeout(() => {
          methodinstance.datelists=[];
          methodinstance.datelists=tempdatelists;
        }, 300);

    } else {
      this.isEditOrDone="Edit";
      this.deleteTextColor="#8E8E93";//Gray
      this.selectAllTextColor="#8E8E93";
      this.datelistLine = "removeLine";
    }

  }

  selectedCheckBox(checkedItem){
    debugger;
    let methodinstance=this;
 
    
    checkedItem.isChecked=!checkedItem.isChecked;
    for (var i = 0; i < methodinstance.datelists.length; i++) {
        if(methodinstance.datelists[i].isChecked){
             methodinstance.deleteTextColor="#595BD2";
             break;
        }else{
              methodinstance.deleteTextColor="#8E8E93";
        }
    
    }
  }

  selectAllButton(){

    let tempdatelists:any[]=[];
    let methodinstance=this;
    if (this.isEditOrDone=="Done") {

        if(this.selectAll==="Select All"){
        methodinstance.selectAll="Unselect All";
        for (var i = 0; i < methodinstance.datelists.length; i++) {
          tempdatelists.push({"schedule_id":methodinstance.datelists[i].schedule_id,"isChecked":true ,"fulldate":methodinstance.datelists[i].fulldate, "city":methodinstance.datelists[i].city, "locations":methodinstance.datelists[i].locations, "date":methodinstance.datelists[i].date, "month":methodinstance.datelists[i].month, "day":methodinstance.datelists[i].day, "schedule_startdate":methodinstance.datelists[i].schedule_startdate});
        }

        setTimeout(() => {
          methodinstance.deleteTextColor="#595BD2";
          methodinstance.datelists=[];
          methodinstance.datelists=tempdatelists;
        }, 300);

      } else {
        methodinstance.selectAll="Select All";
        for (var i = 0; i < methodinstance.datelists.length; i++) {
          tempdatelists.push({"schedule_id":methodinstance.datelists[i].schedule_id,"isChecked":false ,"fulldate":methodinstance.datelists[i].fulldate, "city":methodinstance.datelists[i].city, "locations":methodinstance.datelists[i].locations, "date":methodinstance.datelists[i].date, "month":methodinstance.datelists[i].month, "day":methodinstance.datelists[i].day,"schedule_startdate":methodinstance.datelists[i].schedule_startdate});
        }

        setTimeout(() => {
          methodinstance.deleteTextColor="#8E8E93";
          methodinstance.datelists=[];
          methodinstance.datelists=tempdatelists;
        }, 300);

      }
    }
  }

  deleteSelectedItem(datelist?){
    debugger;
    if(this.deleteTextColor==="#595BD2" || datelist){          //it means delete button is enable.
        let alert = this.alertCtrl.create({
          subTitle: 'Are you sure you want to delete these date?',
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'OK',
              handler: data => {
                console.log('Saved clicked');
                if(this.appdetailsProvider.CheckConnection()){
                  this.deleteCheckedRecords(datelist);
                }
              }
            }
          ]
        });
        alert.present();
      }
  }

  deleteCheckedRecords(datelist?){

    if(datelist){
      datelist.isChecked=true;
    }
    debugger;
    let methodinstance=this;
    let checkedList:any[]=[];
    let unCheckedList:any[]=[];


    methodinstance.appdetailsProvider.ShowLoading();

    //Stored the schedule_ids in localStorage.
    let tempScheduleIdsList="";
    let tempScheduleDateList="";

    for (var i = 0; i < methodinstance.datelists.length; i++) {
      if(methodinstance.datelists[i].isChecked){
          checkedList.push({"schedule_id":methodinstance.datelists[i].schedule_id});
       } else {
          unCheckedList.push(methodinstance.datelists[i]);
          tempScheduleIdsList = tempScheduleIdsList===""?methodinstance.datelists[i].schedule_id : tempScheduleIdsList+","+methodinstance.datelists[i].schedule_id;
          tempScheduleDateList = tempScheduleDateList===""?methodinstance.datelists[i].schedule_startdate : tempScheduleDateList+","+methodinstance.datelists[i].schedule_startdate;
          debugger;//"schedule_startdate":methodinstance.datelists[i].schedule_startdate
       }
    }


     setTimeout(() => {
          this.isEditOrDone="Edit";
          this.deleteTextColor="#8E8E93";//Gray
          this.selectAllTextColor="#8E8E93";
          this.datelistLine = "removeLine";
          methodinstance.datelists=[];
          methodinstance.datelists=unCheckedList;

          //Stored again the schedule_ids and dateList in localStorage after deleted some item
          //if(methodinstance.datelists.length>0){
              localStorage.setItem('schedule_ids_list',"");
              localStorage.setItem('schedule_dates_list',"");
              setTimeout(() => {
                 localStorage.setItem('schedule_ids_list',tempScheduleIdsList);
                 localStorage.setItem('schedule_dates_list',tempScheduleDateList);
              }, 300);
          //}

          let body={person_id: this.personId, schedule:checkedList}

          let headers= new Headers();
          let options= new RequestOptions({headers:headers});

 
          headers.append('Content-Type', 'application/json');
          headers.append( 'x-access-token', localStorage.getItem("authoKey"));

          console.log('Delete-Schedule '+JSON.stringify(body));
             debugger;
          this.http.delete(this.appdetailsProvider.addschedule, new RequestOptions({
               headers: headers,
               body: body
            })).subscribe( function(response) {
                  debugger;
                  methodinstance.appdetailsProvider.HideLoading();
                  let message=JSON.parse(response['_body']).schedules;
                  methodinstance.appdetailsProvider.ShowToast(message,3000);
                  methodinstance.isrecordDeleted=true;
             }, function(error) {
                 debugger;
                 methodinstance.appdetailsProvider.HideLoading();
                 methodinstance.appdetailsProvider.SomethingWentWrongAlert();
             }
        );

        }, 300);

    debugger;

  }
    
    gotoHomePage() {
      if(this.isFrom == "profileScreen"){
          this.navCtrl.setRoot(HomePage);
      } else {
        if(this.appdetailsProvider.CheckConnection()) { 
        debugger;
          this.appdetailsProvider.ShowLoading();

          /*var city=localStorage.getItem('selectedCity')==null?"":localStorage.getItem('selectedCity');
          var location=localStorage.getItem('selectedLocation')==null?"":localStorage.getItem('selectedLocation');*/



          var city=localStorage.getItem('currentCity')==null?"":localStorage.getItem('currentCity');
          var location=localStorage.getItem('currentLocation')==null?"":localStorage.getItem('currentLocation');

          debugger;
          /*
          if(location.length == 0 && city.length == 0) {
            this.myLocation();
          } else {
            this.appdetailsProvider.HideLoading();
            this.navCtrl.push(SchedulePage);
          }
          */
        }
      }
    }

    OnItemClickForScheduld(clickedItem) {
      debugger;
      if (this.isEditOrDone=="Edit") {
        this.appdetailsProvider.cardListArray=[];
        this.navCtrl.setRoot(HomePage,{schedule_id:clickedItem.schedule_id,dateValue:clickedItem.fulldate});   
      }
    }

    getScheduledData() {
    this.appdetailsProvider.ShowLoading();
      debugger;
       let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
       let requestOptions = new RequestOptions({headers: headers});
       let methodinstance=this;
     this.http.get(this.appdetailsProvider.scheduledlisturl+this.personId, requestOptions).subscribe(
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

              if(temp.length>0){

              for(var i=0;i<temp.length;i++) {
                  methodinstance.datelists.push({"schedule_id":temp[i].schedule_id,"isChecked":false ,"fulldate":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEEE, MMMM dd'), "city":temp[i].schedule_location_city, "locations":temp[i].schedule_location_country, "date":methodinstance.datePipe.transform( temp[i].schedule_startdate,'dd'), "month":methodinstance.datePipe.transform( temp[i].schedule_startdate,'MMM'), "day":methodinstance.datePipe.transform( temp[i].schedule_startdate,'EEE'),"schedule_startdate":temp[i].schedule_startdate});
                  tempScheduleIdsList = tempScheduleIdsList===""?temp[i].schedule_id : tempScheduleIdsList+","+temp[i].schedule_id;
                  tempScheduleDateList = tempScheduleDateList===""?temp[i].schedule_startdate : tempScheduleDateList+","+temp[i].schedule_startdate;
              }
            
              if(methodinstance.datelists.length==0) {
                   methodinstance.noItemFound=true;
              } else {
                   methodinstance.noItemFound=false;
              }

              if(methodinstance.datelists.length>0) {
                localStorage.setItem('schedule_ids_list',"");
                localStorage.setItem('schedule_dates_list',"");
                 setTimeout(() => {
                 localStorage.setItem('schedule_ids_list',tempScheduleIdsList);
                 localStorage.setItem('schedule_dates_list',tempScheduleDateList);

                 methodinstance.appdetailsProvider.HideLoading();

                 }, 1000);
              }
            } else {
              methodinstance.appdetailsProvider.HideLoading();
            }

        }else{
          methodinstance.appdetailsProvider.HideLoading();
          methodinstance.noItemFound=true;
          methodinstance.appdetailsProvider.SomethingWentWrongAlert();
        }
       },
            function(error) {
            debugger;
               methodinstance.appdetailsProvider.SomethingWentWrongAlert();
               methodinstance.appdetailsProvider.HideLoading();
               if(methodinstance.datelists.length==0){
                  methodinstance.noItemFound=true;
                 } else {
                   methodinstance.noItemFound=false;
                 }
            }
        );
    }

    goToCalenderPage(){
      let currentLocation=localStorage.getItem('currentLocation');
      let currentCity=localStorage.getItem('currentCity');
      let current_geo_value=localStorage.getItem('current_geo_value');
      debugger;
      if(currentLocation && currentCity && current_geo_value){
        //this.navCtrl.push(CalenderPage,{isFrom:"DateList"});
        this.navCtrl.push(SchedulePage,{isFrom:"DateList"});
      }else{
        this.myLocation();
      }
    }


    //--------------------- get current location code-----------------------------------
    myLocation() {
        let self=this;
        if (self.platform.is('ios')) {
           self.diagnostic.isLocationEnabled() .then((state) => {

                  if (state==false){ 
                        self.appdetailsProvider. HideLoading();
                        let alt = self.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                        self.diagnostic.switchToLocationSettings(); 
                             } }] });
                            alt.present(); 
                   } else { 
                      self.appdetailsProvider.ShowLoading();
                      self.getMycurrentLocation();
                   } 
            }) .catch(e => console.error(e)); 
         } else {
           self.diagnostic.isGpsLocationEnabled() .then((state) => {

                  if (state==false){ 
                        self.appdetailsProvider. HideLoading();
                        let alt = self.alertCtrl.create({ title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [ { text: 'Cancel', role: 'cancel', handler: () => { 
                            } }, 
                             { text: 'Ok', handler: () => { 
                                        self.diagnostic.switchToLocationSettings(); 
                             } }] });
                            alt.present(); 
                   } else { 
                      self.appdetailsProvider.ShowLoading();
                      self.getMycurrentLocation();
                   } 
            }) .catch(e => console.error(e)); 
         }
    }

      getMycurrentLocation() {
        let self=this;
         this.platform.ready().then(() => {
        debugger;
       var options = {
                 enableHighAccuracy: false,
                 timeout: 20000,
                 maximumAge: 10000
                };
                              this.geolocation.getCurrentPosition(options).then((resp) => {
                                 let latitude= resp.coords.latitude;
                                 let longitude= resp.coords.longitude;
                                  debugger;

                                  /*try{
                                        const location: FlurryAnalyticsLocation = {
                                           latitude: latitude,
                                           longitude: longitude
                                        };

                                        this.appdetailsProvider.flurryAnalyticsObject.setLocation(location, "current city location")
                                  }catch(Exception){
                                    console.log("Loaction is not sent to Flurry");
                                  }*/

                                        self.nativeGeocoder.reverseGeocode(latitude, longitude)
                                        .then((result: NativeGeocoderReverseResult) =>
                                             {
                                                debugger;
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

                                                    //this.appdetailsProvider.city=city;
                                                    self.appdetailsProvider.HideLoading();
                                                    //this.viewCtrl.dismiss();

                                                    self.navCtrl.push(SchedulePage,{isFrom:"DateList"});
                                                    //this.navCtrl.push(CalenderPage,{isFrom:"DateList"});
                                            })
                                  .catch((error: any) =>{ 
                                     debugger;
                                    console.log(error);         
                                   self.appdetailsProvider.HideLoading();
                                 });
                        }).catch((error) => {
                          self.appdetailsProvider.HideLoading();
                          self.appdetailsProvider.HideLoading();
                          if(error.message ==='Timeout expired') {
                            //this.navCtrl.push(CalenderPage,{isFrom:"DateList"});
                            self.navCtrl.push(SchedulePage,{isFrom:"DateList"});
                            self.appdetailsProvider.ShowToast('Current location not fount please select manually',3000);
                          }
                          console.log('Error getting location', error);
                        });
                      });
      }
    //--------------------------------------------------------------------------------- 
}