import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

import { CalendarComponentOptions,CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
import { CalendarController} from "ion2-calendar/dist";
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { SchedulePage } from '../schedule/schedule';
import { DatePipe} from '@angular/common';
import moment from 'moment';
import { HomePage } from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the CalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calender',
  templateUrl: 'calender.html',
})
export class CalenderPage {

    
    /* first time user exp */
    public firstTimeUserExp = "firstTimeUserExp firstTimeUserExpHide";
    firstTimeUserExpClick(){
        this.firstTimeUserExp= "firstTimeUserExp firstTimeUserExpHide";
    }
    /* first time user exp */


   dateMulti: any[];
   scheduleDatesArry:any[]=[];
   schedule_dates_list:any="";
   isFrom:any="";
   PageTitle:any="New Availability";
   FTUEDoneButtonValue:any="Done";


   city:any="Portsmouth";
   location:any="England, United Kingdom";
   schedule_geo:any="";
   scheduleArry:any[]=[];
   personId:any="";

  constructor(public platform: Platform,
              public calendarCtrl: CalendarController,
              public navCtrl: NavController, 
  			      public navParams: NavParams,
              public appdetailsProvider:AppdetailsProvider,
              private datePipe: DatePipe,
              public http:Http,
              public viewCtrl: ViewController) {


   this.personId = localStorage.getItem("person_id");
   this.isFrom = navParams.get('isFrom');

   this.city=navParams.get('city');
   this.location=navParams.get('location');
   this.schedule_geo=navParams.get('schedule_geo');

   if(!this.isFrom){
    this.isFrom='';
   }

   if(this.isFrom==='FTUE'){
     //{isFrom:this.isFrom,city:this.city,location:this.location,schedule_geo:this.schedule_geo});
     this.firstTimeUserExp = "firstTimeUserExp";
     this.PageTitle="Plan Now";
   }

   this.FTUEDoneButtonValue="Skip, I'm always available";

//-----Set the dotes in calender from getting the Schedul list in localStorage------
   this.schedule_dates_list=localStorage.getItem('schedule_dates_list');
   //this.schedule_dates_list=localStorage.getItem('schedule_ids_list');
   
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
                 date: new Date(datePipe.transform(scheduleDatesTempArry[i],'yyyy, MM, dd')),
                 cssClass:"selectedDateClass",
                 disable:false,
                 marked:false
               });
             } else {
               this.scheduleDatesArry.push({
                 date: new Date(datePipe.transform(scheduleDatesTempArry[i],'yyyy, MM, dd')),
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


  goToSchedule(){
    debugger;
  	if(this.appdetailsProvider.CheckConnection()){
     if(this.dateMulti) {
	    if(this.dateMulti.length>0) {
          this.AddSchedule();
  		} else {
        //if(this.isFrom === 'FTUE'){
          this.navCtrl.setRoot(HomePage);        
        /*}else{
  	    	this.appdetailsProvider.ShowToast("Please select date",3000);
        }*/
            
	    }
     }else{
        //if(this.isFrom === 'FTUE'){
          this.navCtrl.setRoot(HomePage);        
        /*}else{
          this.appdetailsProvider.ShowToast("Please select date",3000);
        }*/
     }
    }
  }

  //---------Calender options----------------
  type: 'string';
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi',
    daysConfig : this.scheduleDatesArry
  };


  onChange(event){
    try{
      this.dateMulti=[];
      this.dateMulti=event;
      //if(this.isFrom==='FTUE'){
        if(event.length>0) {
          this.FTUEDoneButtonValue="Done";
        }else{
          this.FTUEDoneButtonValue="Skip, I'm always available";
        }
      //}

    }catch(Exception){

    }
  }
  //-----------------------------------------

  cancel(){
    if(this.isFrom=="profileScreen"){
      this.navCtrl.setRoot(HomePage);
    }else{
      const index = this.viewCtrl.index;
          // then we remove it from the navigation stack
          this.navCtrl.remove(index); 
    }
	     
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalenderPage');
  }

  //-----------Adding Schedule on FTUE page START----------
  AddSchedule(){

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
                                          schedule_geo:this.schedule_geo==null?'0,0':this.schedule_geo,
                                          schedule_radius:"10",
                                          schedule_isoutnow:false});
              }
               let finalarry={
                 person_id:this.personId,
                 schedule:this.scheduleArry
               };
                             const header = {
                  'x-access-token': localStorage.getItem("authoKey"),
            }

        const requestOptions = {                                                                                                                                                                                 
          headers: new Headers(header), 
        };

        console.log("AddSchedule-Req :"+JSON.stringify(finalarry));
               this.http.post(this.appdetailsProvider.addschedule,finalarry,requestOptions)
                .subscribe(
                          function(response) {
                             
                             let temp=JSON.parse(response['_body']);
                             methodinstance.appdetailsProvider.HideLoading();
                             //methodinstance.navCtrl.push(Datelist);

                             try {
                                let newScheduleId=temp.schedules[0];
                                let oldScheduleId=localStorage.getItem('schedule_ids_list');
                                let latestList= !oldScheduleId || oldScheduleId==''? newScheduleId:oldScheduleId+","+newScheduleId;

                                localStorage.setItem('schedule_ids_list',latestList);

                             } catch(Exception){
                               console.log("Exception");
                             }

                             if(methodinstance.isFrom==="Filter"){
                            /*     methodinstance.navCtrl.push(FilterPage).then(() => {
                                 const index = methodinstance.viewCtrl.index;
                                  for(let i = index; i >0; i--){
                                    methodinstance.navCtrl.remove(i);
                                  }
                                 });*/
                                 methodinstance.navCtrl.setRoot(HomePage);
                             }else{
                               /*  methodinstance.navCtrl.push(Datelist).then(() => {
                                 const index = methodinstance.viewCtrl.index;
                                  for(let i = index; i >0; i--){
                                    methodinstance.navCtrl.remove(i);
                                  }
                                 });*/
                                 methodinstance.navCtrl.setRoot(HomePage);
                           }
                             
                },
                function(error) {
                   
                   methodinstance.appdetailsProvider.HideLoading();
                   //methodinstance.navCtrl.push(Datelist);
               /*    methodinstance.navCtrl.push(Datelist).then(() => {
                      const index = methodinstance.viewCtrl.index;
                      for(let i = index; i >0; i--){
                        methodinstance.navCtrl.remove(i);
                      }
                   });*/
                   methodinstance.navCtrl.setRoot(HomePage);
                }
          );
      } else {
      this.appdetailsProvider.ShowToast("Please select date",3000);
      }
    }      
  }
  //-----------Adding Schedule on FTUE page END----------

}
