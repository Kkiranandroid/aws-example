import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController,Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import {Http, Headers, RequestOptions } from '@angular/http';
import { ConversationPage } from '../conversation/conversation';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { ProfilescreenPage } from '../profilescreen/profilescreen';
import { SettingsmainPage } from '../settingsmain/settingsmain';

import { DatePipe} from '@angular/common';
import { FilterPage } from '../filter/filter';
import moment from 'moment';

declare var MQTTClient: any;


@IonicPage()
@Component({
  selector: 'messages',
  templateUrl: 'messages.html',
})
export class Messages {

  matcheslist:any[]=[];
  conversionlist:any[]=[];
  personId:any="";
  isMatchesFound:any=false;
  isFirstMatchesFound:any=false;
  isCovarsationFound:any=false;
  noRecordsFoundForMatches:any=false;
  noRecordsFoundForCovarsation:any=false;
  filterClick:any="filterClick";
  flotRit:any="flotRit";

  client:any = {};

  defaultImage:any= 'assets/imgs/imagecoming.png';
  offset:any  = 100;

  chatMatchsList:any;
  conversationPersonIds:any=""
  newMatchesCount:any=0;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    private http:Http,
    public appdetailsProvider:AppdetailsProvider,
    public viewCtrl: ViewController, 
    public datepipe: DatePipe) {

    if (this.platform.is('ios')) {
      this.filterClick="filterClickIos";
      this.flotRit="flotRitIos";
    } else {
      this.filterClick="filterClick";
      this.flotRit="flotRit";
    }

    //localStorage.setItem("person_id","990a38fd-19ba-8e51-dfeb-29116fecbd1c");//"Tia Carrere"
    //localStorage.setItem("person_id","6b9c0e7c-55e1-ed17-00ce-4717f8d7ff59");//"Jennifer Aniston"
    
    this.personId = localStorage.getItem("person_id");

    //this.personId = "6b9c0e7c-55e1-ed17-00ce-4717f8d7ff59"; //Jennifer Aniston

    //appdetailsProvider.ShowToast(this.personId,200000);

    this.loadJsonFile();

    debugger;
    localStorage.setItem("messageIconColor","0");
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.getConversionList(this.personId);
      setTimeout(() => {
        this.getmatches(this.personId);
      }, 1000);
    }, 1000);
  }


  getmatches(personId:any){
    let methodinstance=this;     
    const header = {'x-access-token': localStorage.getItem("authoKey")}
    const requestOptions = {headers: new Headers(header)};
            
    methodinstance.http.get(methodinstance.appdetailsProvider.getMatches+personId,requestOptions)
      .subscribe(
           //success part
            function(response) {
            
            let respBody=JSON.parse(response['_body']);
            console.log("GetMsgMatche_API_Resp :-> "+JSON.stringify(respBody));
            //respBody=methodinstance.chatMatchsList; // hard coded data from local Json file.
            debugger;
            if(respBody.length>0) {
              methodinstance.isMatchesFound=true;
              for (var i = 0; i < respBody.length; i++) {
                 methodinstance.matcheslist.push({ isActive : methodinstance.conversationPersonIds.split(",").indexOf(respBody[i].person_id) >= 0?"":" active",
                                                   jsonRespArray : respBody[i]});
                 if(methodinstance.conversationPersonIds.split(",").indexOf(respBody[i].person_id) < 0) {
                   methodinstance.newMatchesCount++;
                 }
              }
              setTimeout(()=>{
                if(methodinstance.matcheslist.length===1) {
                  if(methodinstance.matcheslist[0].isActive===' active'){
                     methodinstance.isFirstMatchesFound=true;
                  }
                } else {
                  methodinstance.isFirstMatchesFound=false;
                }

              },1000);
            } else {
              methodinstance.noRecordsFoundForMatches=true;
            }
            debugger;
       },function(error) {
        methodinstance.isMatchesFound=false;
        methodinstance.noRecordsFoundForMatches=true;
       });
   }

  getConversionList(personId:any) {
    debugger;
    let methodinstance=this;
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    methodinstance.http.get(methodinstance.appdetailsProvider.getConversionList+personId,requestOptions)
      .subscribe(
           //success part
            function(response) {
            debugger;
            
            let respBody=JSON.parse(response['_body']).conversations;
            console.log("GetConversion_API_Resp :-> "+JSON.stringify(respBody));
            methodinstance.conversionlist=respBody;

            for (var i = 0; i < methodinstance.conversionlist.length; i++) {
              methodinstance.conversationPersonIds=methodinstance.conversationPersonIds.length > 0 ?
                    methodinstance.conversationPersonIds+","+methodinstance.conversionlist[i].chat_person_id : 
                    methodinstance.conversionlist[i].chat_person_id;
            }

            if(methodinstance.conversionlist.length==0){
              methodinstance.noRecordsFoundForCovarsation=true;
            }else{
              methodinstance.isCovarsationFound=true;
            }


       },function(error) {
        methodinstance.isCovarsationFound=false;
        methodinstance.noRecordsFoundForCovarsation=true;
       });
  }

  createConversation(conversationPerson:any) {
    debugger;
    let methodinstance=this;
    if(!conversationPerson.jsonRespArray.matched_date){
      conversationPerson.jsonRespArray.matched_date=new Date();
    }
    let indexValue=methodinstance.conversationPersonIds.split(",").indexOf(conversationPerson.jsonRespArray.person_id);
    if(indexValue >= 0) {
      methodinstance.goToConversion(methodinstance.conversionlist[indexValue]);
    } else {

    methodinstance.appdetailsProvider.ShowLoading();

    let body = {
      person_a_id: methodinstance.personId,
      person_b_id: conversationPerson.jsonRespArray.person_id
    }
    debugger;
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    methodinstance.http.post(methodinstance.appdetailsProvider.createConversation,body,requestOptions)
      .subscribe(
           //success part
            function(response) {
            
            methodinstance.appdetailsProvider.HideLoading();

            let respBody=JSON.parse(response['_body']);
            let conversation_id=respBody.conversation_id;

            methodinstance.conversionlist.push({
              conversation_id: conversation_id,
              chat_person_id: conversationPerson.jsonRespArray.person_id,
              chat_channel: conversationPerson.jsonRespArray.person_chat_channel,
              person_name: conversationPerson.jsonRespArray.person_name,
              person_image: conversationPerson.jsonRespArray.person_image,
              last_chat_date: new Date().toISOString(),
              latest_text: null
            });
            debugger;
            methodinstance.navCtrl.push(ConversationPage,{conversation_id:conversation_id , 
                                                          matched_date:conversationPerson.jsonRespArray.matched_date,
                                                          person_name:conversationPerson.jsonRespArray.person_name,
                                                          person_image:conversationPerson.jsonRespArray.person_image,
                                                          chat_person_id:conversationPerson.jsonRespArray.person_id});
            conversationPerson.isActive="";
            methodinstance.newMatchesCount--;

            methodinstance.conversationPersonIds=methodinstance.conversationPersonIds.length > 0 ?
                    methodinstance.conversationPersonIds+","+conversationPerson.jsonRespArray.person_id : 
                    conversationPerson.jsonRespArray.person_id;

       },function(error) {
         methodinstance.appdetailsProvider.HideLoading();
       });
    }
  }//end of createConversation()



  getDatetime(lastDate:any) {
    let context=this;
    //---------------------------------------------------
      debugger;
      var creationon= '';
      let date: Date = new Date(lastDate);
      let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

      var pas;
      var now;
      if (this.platform.is('ios')) {
        now= new Date(moment(new Date().toString()).toDate());
        pas= new Date(moment(date).toDate());
      } else {
        now= new Date(this.datepipe.transform(new Date().toString(),'yyyy-MM-dd hh:mm a'));
        pas= new Date(this.datepipe.transform(date,'yyyy-MM-dd hh:mm a'));
      }

      let s=now.getTime() - pas.getTime();
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      if(hrs==0 && mins==0){
        creationon= 'moment ago';
      } else if(hrs==0){
         creationon= mins==1?mins+' min ago' : mins+' mins ago';
      } else if(hrs<24) {
         creationon= hrs==1?hrs+' hr ago':hrs+' hrs ago';
      } else{
         creationon= Math.floor(hrs/24)==1?Math.floor(hrs/24)+' day ago':Math.floor(hrs/24)+' days ago';
      }
    //---------------------------------------------------
    return creationon;
  }


    goToConversion(conversationPerson:any) {
          this.navCtrl.push(ConversationPage,{conversation_id:conversationPerson.conversation_id, matched_date:conversationPerson.last_chat_date,person_name:conversationPerson.person_name,person_image:conversationPerson.person_image,chat_person_id:conversationPerson.chat_person_id});
    }

    cancel() {

      const index = this.viewCtrl.index;
      debugger;
      if(index>0){
        this.navCtrl.remove(index);
      }else{
        this.navCtrl.setRoot(HomePage);
      }
    }

    profilePage() {
      let methodcontext=this;
      //this.navCtrl.push(ProfilescreenPage);
      methodcontext.navCtrl.push(SettingsmainPage).then(() => {
        const index = methodcontext.viewCtrl.index;
        for(let i = index; i >0; i--){
            methodcontext.navCtrl.remove(i);
        }
      });
    }

    goToFilter() {
      this.navCtrl.push(FilterPage);
    }

    loadJsonFile() {
        console.log('json called');
        let context=this;
        debugger;

            context.http.get('assets/data/chatMatchsList.json')
                   .map(res => res.json())
                   .subscribe(data => { 
                    debugger;
                    context.chatMatchsList = data;
                    console.log(data);
                   });
    }
       
}