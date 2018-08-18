import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content, Platform, AlertController, PopoverController } from 'ionic-angular';

import { MatchmultiavailabilityPage } from '../matchmultiavailability/matchmultiavailability'
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { Messages } from '../messages/messages';

import { DatePipe} from '@angular/common';
import moment from 'moment';

import { ViewOthersProfilePage } from '../view-others-profile/view-others-profile';

declare var MQTTClient: any;


@Component({
  template: `
    <ion-list>
        <ion-item (click)="close('Unmatch')">Unmatch</ion-item>
        <ion-item (click)="close('Report')">Report</ion-item>
        <ion-item (click)="close('Block')">Block</ion-item>
    </ion-list>
  `
})

export class MorePopoverPage { 

  constructor(public viewCtrl: ViewController) {}

  close(clickedOption:any) {
    this.viewCtrl.dismiss(clickedOption);
  }

}


/**
 * Generated class for the ConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  ramdomNumber:any="";
  personId:any="";
  conversation_id:any="";
  matched_date:any="";
  chat_person_id:any="";
  userImage:any="";
  userName:any="Unknown";
  locationInfo:any="England, UK";
  locationInfoColor:any="typingTextColorBlack";//typingTextColorBlue

  footerConversation:any="footerConversationAndroid";//typingTextColorBlue

  noChartFound:any=true;
  noConversationFound:any=false;
  flag:any=true;

  isEdit:any=false;

  ClearCancel:any="Cancel";

  conversionDetails:any[]=[];
  tempConversionDetails:any[]=[];

  sendmessage: string = "";
  client:any = {};

   @ViewChild(Content) content: Content;

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public appdetailsProvider:AppdetailsProvider,
    public http:Http,
    public viewCtrl: ViewController,
    public navParams: NavParams, 
    public datepipe: DatePipe,
    public alertCtrl: AlertController,
    public keyboard: Keyboard,
    public popoverCtrl: PopoverController) {

   
    this.footerConversation=this.platform.is('ios') ? "footerConversationIos" : "footerConversationAndroid";
    


    this.personId = localStorage.getItem("person_id");
    debugger;
    //this.personId = "6b9c0e7c-55e1-ed17-00ce-4717f8d7ff59"; //Jennifer Aniston

    this.conversation_id = navParams.get('conversation_id');
    this.userName = navParams.get('person_name');
    this.userImage = navParams.get('person_image');
    this.matched_date = navParams.get('matched_date');
    this.chat_person_id = navParams.get('chat_person_id');



    this.ramdomNumber = this.personId+"-"+Math.floor(10000 + Math.random() * 90000);
    

      if(this.platform.is('ios')) {
          //var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
          //currentDate = moment((new Date(Date.now() - tzoffset)))['_d'].toISOString().slice(0,-1);
        } else {

        }

      let date: Date = new Date(this.matched_date);
      let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      this.matched_date =this.datepipe.transform(endDate,'MMM dd');
    

    let respString = "";
      
    setTimeout(() => {
      setTimeout(() => {
        this.connect();
         }, 2000);
        this.getConversationDetails();
      }, 1000);
  }

    connect() {
      debugger;
      var endpoint = "a2kvhx39om8scf.iot.us-east-1.amazonaws.com";
      var region = "us-east-1";
      var clientid = this.personId;
      var accessKey = "AKIAIISLRVAZEFCUU5ZQ";
      var secretKey = "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";

      var options = {
        clientId: clientid,
        endpoint: endpoint,
        accessKey: accessKey,
        secretKey: secretKey,
        regionName: region
      };

      this.client = new MQTTClient(options);
      debugger;
      this.client.connect();

      console.log("Connected");

      setTimeout(() => {
        this.subscribe();
      }, 2000);
    }

    subscribe() {
        debugger;
        let context=this;
        if (this.client.connected) {
          this.flag=true;
          this.client.on("subscribeSuccess", () => {
            console.log("Success in subscribing");
          })

          this.client.subscribe(this.personId);
          //this.client.subscribe("catch_all_793841ce-7241-56b1-0670-b893c52030a9");

          this.client.on("messageArrived", function (msg: any) {
            console.log(msg);
            debugger;
              context.addConversion(msg.payloadString,"other");
           
          })
        } else {
          //this.appdetailsProvider.ShowToast("No connection",2000);
          /*setTimeout(() => {
            this.connect();
          }, 2000);*/
        }
    }

    publish(input:any) {
      debugger;
      if(!this.sendmessage){
        this.sendmessage = "";
      }

      if (this.sendmessage == "") {
        this.appdetailsProvider.ShowToast("Please enter the message",2000);
        return;
      } else if (this.client.connected) {
        console.log(this.sendmessage);

        //-------Getting the current date time--------------
        var currentDate;
        if(this.platform.is('ios')){
          var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
          currentDate = moment((new Date(Date.now() - tzoffset)))['_d'].toISOString().slice(0,-1);
        }else{
          let date: Date = new Date();
          let utcCurrentDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
          currentDate= new Date(this.datepipe.transform(utcCurrentDate,'yyyy-MM-dd hh:mm a'));
        }
        //----------------------------------------------------

        //-------Creating the Json formate message------------
        let messageBody={ message_type: "message",
               conversation_id: this.conversation_id,
               from_person_id: this.personId,
               to_person_id: this.chat_person_id,
               chat_entry_date: currentDate,
               message_detail: {
                message_detail_type: "text",
                message_entry: this.sendmessage
               }
             }
        //-----------------------------------------------------

        this.client.publish(this.chat_person_id,JSON.stringify(messageBody));
        this.client.publish("catch_all_793841ce-7241-56b1-0670-b893c52030a9",JSON.stringify(messageBody));

        //this.client.packetsend(this.conversation_id,JSON.stringify(messageBody));

        this.addConversion(JSON.stringify(messageBody),"me");

        this.sendmessage='';
        input.setFocus();  //setFocus is used for after send the msg keybord should not hide.
        this.content.scrollToBottom();

        setTimeout(() => {
          this.flag=true;
        }, 1500);
      } else {
        this.appdetailsProvider.ShowToast("Please try again",2000);
        this.connect();
      }
  }



  addConversion(receivedText:any,isFrom:any){
    let context=this;
    debugger;

    let respBody=JSON.parse(receivedText);
    let message_type=respBody.message_type;

    if(message_type==='message'){

        this.isEdit=true;

        let message_entry=respBody.message_detail.message_entry;

        let conId=context.conversionDetails.length>0?context.conversionDetails[0].conversation_id:1;
              
        let tempConversionDetails1= {conversation_id:conId,
          who_sent_it:isFrom,
          last_chat_date:new Date().toLocaleDateString,
          chat_text: message_entry,
          chat_object:null,
          chat_entry_type:"text",
          position : isFrom ==='other'? 'left':'right'
        };
        if(this.conversionDetails.length>0) {
          if(this.conversionDetails[this.conversionDetails.length-1].who_sent_it===isFrom){
              this.conversionDetails[this.conversionDetails.length-1].position = isFrom==='other'?'left lfRitAdd':'right lfRitAdd';
          }
        }
        this.conversionDetails.push(tempConversionDetails1);
        this.noConversationFound=false;
        setTimeout(() => {
              this.content.scrollToBottom();
            }, 100);
    } else {
      this.locationInfoColor="typingTextColorBlue"
      this.locationInfo="typing…"
       setTimeout(() => {
          this.locationInfoColor="typingTextColorBlack"
          this.locationInfo="England, UK"
        }, 1000);
    }
  }




  getConversationDetails(){
    let methodinstance=this;
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});
    //https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation/conversationdetail?person_id=793841ce-7241-56b1-0670-b893c52030a9&conversation_id=4
    methodinstance.http.get(methodinstance.appdetailsProvider.getConversationDetails+this.personId+"&conversation_id="+this.conversation_id, requestOptions)
      .subscribe(
           //success part
            function(response) {
            debugger;
            let respBody=JSON.parse(response['_body']).chat_entries;
            methodinstance.conversionDetails=respBody;

            methodinstance.tempConversionDetails=[];
            if(methodinstance.conversionDetails.length>0){

            methodinstance.tempConversionDetails.push({ conversation_id:"0",
                                        who_sent_it:"date",
                                        last_chat_date:methodinstance.getDateValue(methodinstance.conversionDetails[0].last_chat_date),
                                        chat_text:methodinstance.getDateValue(methodinstance.conversionDetails[0].last_chat_date),
                                        chat_object:"",
                                        chat_entry_type:"",
                                        position : 'center'
                           });

            for (var i = 0; i < methodinstance.conversionDetails.length; i++) {

                let lastItemIndex=1;
                 if(i!==0) {
                    let preMsg = methodinstance.getDateValue(methodinstance.conversionDetails[i-1].last_chat_date);
                    let currMsg = methodinstance.getDateValue(methodinstance.conversionDetails[i].last_chat_date);

                    if(preMsg!==currMsg){
                      methodinstance.tempConversionDetails.push({ conversation_id:"0",
                                        who_sent_it:"date",
                                        last_chat_date:currMsg,
                                        chat_text:currMsg,
                                        chat_object:"",
                                        chat_entry_type:"",
                                        position : 'center'
                           });
                      lastItemIndex=2;
                    }
                  }

                  methodinstance.tempConversionDetails.push({ conversation_id:methodinstance.conversionDetails[i].conversation_id,
                                    who_sent_it:methodinstance.conversionDetails[i].who_sent_it,
                                    last_chat_date:methodinstance.conversionDetails[i].last_chat_date,
                                    chat_text:methodinstance.conversionDetails[i].chat_text,
                                    chat_object:methodinstance.conversionDetails[i].chat_object,
                                    chat_entry_type:methodinstance.conversionDetails[i].chat_entry_type,
                                    position : methodinstance.conversionDetails[i].who_sent_it==='other'? 'left' : 'right'
                  });

              debugger;

              if(i!==0) {
                let lastIndex=methodinstance.tempConversionDetails.length-1;
                 if(methodinstance.tempConversionDetails[lastIndex-1].conversation_id!=="0") {
                  if(methodinstance.tempConversionDetails[lastIndex-1].who_sent_it===methodinstance.tempConversionDetails[lastIndex].who_sent_it){
                        methodinstance.tempConversionDetails[lastIndex-1].position = methodinstance.tempConversionDetails[lastIndex].who_sent_it==='other'?'left lfRitAdd':'right lfRitAdd';
                  }
                }
                //methodinstance.tempConversionDetails[i-1].position = methodinstance.tempConversionDetails[i-1].who_sent_it===methodinstance.tempConversionDetails[i].who_sent_it ? methodinstance.tempConversionDetails[i].who_sent_it==='other'?'left lfRitAdd':'right lfRitAdd'         : methodinstance.tempConversionDetails[i].who_sent_it === 'other' ? 'left' : 'right';                                  
              }
            }
            methodinstance.conversionDetails=[];
            methodinstance.conversionDetails=methodinstance.tempConversionDetails;
          }else{
            methodinstance.noConversationFound=true;
          }
            
            methodinstance.noChartFound=false;
            setTimeout(() => {
              methodinstance.content.scrollToBottom();
            }, 100);
            debugger;
       },function(error) {
        debugger;
        methodinstance.noChartFound=false;
        methodinstance.noConversationFound=true;
       });
  }
   
   getDateValue(inputDate:any){
    var returnValue;
    let date: Date = new Date(inputDate);
    let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

      if (this.platform.is('ios')) {
        debugger;
        returnValue = new Date(moment(endDate).toDate());

        var now = this.datepipe.transform(new Date().toString(),'dd-MM-yyyy');
        var yesterday = this.datepipe.transform(new Date().setDate(new Date().getDate() - 1).toString(),'dd-MM-yyyy');
        var pas = this.datepipe.transform(endDate,'dd-MM-yyyy');

        if(now===pas) {
          returnValue='Today';
        } else if(yesterday === pas) {
          returnValue='Yesterday';
        } else {
          returnValue=pas;
        }
        debugger;

      } else {

          returnValue =this.datepipe.transform(endDate,'yyyy-MM-dd');

          var now = this.datepipe.transform(new Date().toString(),'dd-MM-yyyy');
          var yesterday = this.datepipe.transform(new Date().setDate(new Date().getDate() - 1).toString(),'dd-MM-yyyy');
          var pas = this.datepipe.transform(endDate,'dd-MM-yyyy');

          if(now===pas) {
            returnValue='Today';
          } else if(yesterday === pas) {
            returnValue='Yesterday';
          }else{
            returnValue=pas;
          }
      }

     return returnValue;
  }

    
  gotoMatchmultiavailability(){
    this.navCtrl.push(MatchmultiavailabilityPage);
  }

  goBack(){

    if (this.client.connected) {
      this.client.disconnect();
    }
    if(this.isEdit){
      this.navCtrl.push(Messages).then(() => {
        const index = this.viewCtrl.index;
        for(let i = index; i >0; i--) {
          this.navCtrl.remove(i);
        }
     });
    }else{
      const index = this.viewCtrl.index;
      this.navCtrl.remove(index);
    }
  }

  sendTyping() {
    debugger;
    let messageBody={ message_type: "typing",
               conversation_id: this.conversation_id,
               from_person_id: this.personId,
               to_person_id: this.chat_person_id
             }

    if (this.client.connected) {
      this.client.publish(this.chat_person_id,JSON.stringify(messageBody));
    } else {
      if(this.flag){
        this.flag=false;
        this.connect();
      }
    }
  }

  


  blockEditTextListenear(event) {
    debugger;    
    let self=this;
    console.log("TextValue :->"+event.data);
    if(event.data){
      self.ClearCancel='Clear';
    }else{
      self.ClearCancel='Cancel';
    }
  }

  


  presentPrompt(isFrom:any) {
    let alert = this.alertCtrl.create({
      title: isFrom==='Block'?'Block '+this.userName:'Report '+this.userName,
      subTitle: 'Please provide detail on why you are '+(isFrom==='Block'?'blocking ':'reporting ')+this.userName,
      cssClass:'reportAlert',
      enableBackdropDismiss: true,
      inputs: [
        {
          type: 'textarea',
          name: 'report',
          id:'textid',
          placeholder: 'Please reporting here.'
        }
      ],
      buttons: [
        {
          text: isFrom==='Block'?'Block':'Report',
          handler: data => {
            if(data.report.length>0){
                this.reportPerson(isFrom==='Block' ? '#BLOCK## '+data.report : data.report,isFrom);
            }
        debugger;
          }
        },
        {
          text: 'X',
          cssClass:'reportAlertClose',
          handler: data => {
            data.textid='';
            this.presentPrompt(isFrom);
            debugger;
          }
        }
      ]
    });
    
    alert.present();
  }

  reportPerson(reportingDetails:any,isFrom:any){
    let context=this;
    context.appdetailsProvider.ShowLoading();
    debugger;
    let reportReq = {
                      person_id: this.personId,
                      reportedby_person_id: this.chat_person_id,
                      report_description: reportingDetails
                     };
    debugger;
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    this.http.post(this.appdetailsProvider.reportUser,reportReq,requestOptions)
    .subscribe(
        function(response) {
              debugger;
              context.appdetailsProvider.HideLoading();
              let temp=JSON.parse(response['_body']).result;
              if(temp === "success"){
                  //context.popupAlert();
                  let alert = context.alertCtrl.create({
                      subTitle: isFrom==='Block' ? 'User Blocked!':'User Reported!',
                      enableBackdropDismiss: true,
                      buttons: [
                      {text: 'ok',
                       handler: data => {
                          context.navCtrl.push(Messages).then(() => {
                            const index = context.viewCtrl.index;
                            for(let i = index; i > 0; i--) {
                              context.navCtrl.remove(i);
                            }
                          });
                        }
                      }]
                    });
                    alert.present();
              }

        },function(error) {
          debugger;   
          context.appdetailsProvider.HideLoading();
        });
  }


   ionViewDidLoad() {
    this.content.scrollToBottom();
  }

  onKeyPressed(){
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 500);
  }


  popover:any;
  presentPopover(ev) {


        this.popover = this.popoverCtrl.create(MorePopoverPage, {}, {cssClass: 'popoverContnt'});
        this.popover.present({
            ev: ev
        });

        this.popover.onDidDismiss(data => {
          debugger;
          if(data==='Report'){
            this.reportAbuseClick();
          } else if(data==='Unmatch'){
            this.unMatch();
          } else if(data==='Block'){
            //this.presentPrompt('Block');
            this.blockChartPersonPopup= "firstTimeUserExp";
          }
        });
    }

  unMatch() {
  debugger;
  let methodinstance=this;
  methodinstance.appdetailsProvider.ShowLoading();
  let body = {
                person_a_id: methodinstance.personId,
                person_b_id: methodinstance.chat_person_id
             }

  let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
                                         
  let requestOptions = new RequestOptions({headers: headers,body: body});

  methodinstance.http.delete(methodinstance.appdetailsProvider.matchesUrl,requestOptions).subscribe(
           //success part
            function(response) {
              debugger;
            methodinstance.appdetailsProvider.HideLoading();
            methodinstance.appdetailsProvider.ShowToast("Unmatch done successfuly",2000);

            methodinstance.navCtrl.push(Messages).then(() => {
               const index = methodinstance.viewCtrl.index;
                for(let i = index; i >0; i--) {
                  methodinstance.navCtrl.remove(i);
                }
               });

       },function(error) {
        debugger;
        methodinstance.appdetailsProvider.HideLoading();
        methodinstance.appdetailsProvider.SomethingWentWrongAlert();
       });
  }



  /*-----------Report User dialog code STRAT-------------*/
  reportNow:boolean = false;
  description:any;
  reportMessage:any = '';
  public reportAbuse = "firstTimeUserExp firstTimeUserExpHide";
  public blockChartPersonPopup = "firstTimeUserExp firstTimeUserExpHide";

  reportAbuseClick(){
    this.reportAbuse= "firstTimeUserExp";
  }

  reportAbuseClose(){
    this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide"; 
  }


 


  ionChange(selectedMessage) {
    let self=this;
    if(selectedMessage==='Other') {
      self.reportMessage=selectedMessage;
      self.reportNow = true;
      setTimeout(() => {
        var objDiv = document.getElementById("scrollDiv");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 200);
    } else {
      self.reportMessage=selectedMessage;
      self.reportNow = false;
      self.description='';
    }
    
  }

  
  reportUserButtonClicked(){
    if(this.reportMessage==='Other'){
      debugger;
      if(this.description && this.description !== ''){
        this.reportUser(this.description);
        this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide";
      } else {
        this.appdetailsProvider.ShowToast('Please enter the description',3000);
      }
    } else {
      if(this.reportMessage!==''){
        this.reportUser(this.reportMessage);
        this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide";
      }else{
        this.appdetailsProvider.ShowToast('Please select the report',3000);
      }
    }
  }

  reportUser(reportingDetails:any){
    let context=this;
    context.appdetailsProvider.ShowLoading();    
    
    let reportReq = {
                      person_id: this.personId,
                      reportedby_person_id: this.chat_person_id,
                      report_description: reportingDetails
                     };
    
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    this.http.post(this.appdetailsProvider.reportUser,reportReq,requestOptions)
    .subscribe(
        function(response) {
              
              context.appdetailsProvider.HideLoading();
              let temp=JSON.parse(response['_body']).result;
              if(temp === "success"){
                  //context.popupAlert();
                  let alert = context.alertCtrl.create({
                      subTitle:'User Reported!',
                      enableBackdropDismiss: true,
                      buttons: ['ok']
                    });
                    alert.present();
                    context.description='';
              }

        },function(error) {
          context.appdetailsProvider.HideLoading();
        });
  }


  /*-----------Report User dialog code END -------------*/

  /*-----------Block User dialog code END -------------*/
  blockdescription:any;
  blockUserClose(){
    if(this.ClearCancel==='Clear'){
      this.blockdescription='';
      this.ClearCancel='Cancel';
    }else{
      this.blockChartPersonPopup= "firstTimeUserExp firstTimeUserExpHide"; 
    }
  }
  
  BlockUserButtonClicked(){
    this.blockChartPersonPopup= "firstTimeUserExp firstTimeUserExpHide";
    this.appdetailsProvider.ShowToast(''+this.blockdescription,2000);
    this.reportPerson('#BLOCK## '+this.blockdescription,'Block');
  }
  /*-----------Block User dialog code END -------------*/


  viewProfile(){
    if(this.appdetailsProvider.CheckConnection()){
       this.navCtrl.push(ViewOthersProfilePage,{chat_person_id : this.chat_person_id});
    }
  }
  
}