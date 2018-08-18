import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { SettingsmainPage } from '../settingsmain/settingsmain';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { LoginPage } from '../login/login';
import {Http, Headers, RequestOptions } from '@angular/http';
import { Messages } from '../messages/messages';
import { HomePage } from '../home/home';

//---------------------Modele Start------------------
@Component({
  template: `
  <ion-header class="modalHeader searchSecion">
  <ion-toolbar>
        <ion-title class="dateinTitle"> 
        <span class="headerCancelTxt" (click)="closeModal();"><i class="fa fa-angle-left" aria-hidden="true"></i>Back</span> 
        <span class="alignMainHead2">{{pageName}}</span> 
        </ion-title>
        </ion-toolbar>
    </ion-header>
<ion-content>
  <iframe class="iframeLink" [src]="link | safe" frameborder="0"></iframe>
</ion-content>`})


export class ModalOpenLink {
    link:any;
    pageName:any;
    constructor(
      public navCtrl: NavController,
      public viewCtrl: ViewController,
      public appdetailsProvider:AppdetailsProvider, 
      public params: NavParams,
      private alertCtrl: AlertController){

      appdetailsProvider.ShowLoading();
       setTimeout(() => {
         appdetailsProvider.HideLoading();
    },2000);   

      this.pageName=this.params.get('pageName');

      if(this.pageName=="FAQ"){
      this.link="https://s3.amazonaws.com/woowoopolicies/faq.html";
      }else if(this.pageName=="Feedback"){
        this.link="https://s3.amazonaws.com/woowoopolicies/feedback.html";
      }
      else if(this.pageName=="Terms of Service"){
        this.link="https://s3.amazonaws.com/woowoopolicies/tos.html";
      }
      else if(this.pageName=="Privacy Policy"){
        this.link="https://s3.amazonaws.com/woowoopolicies/privacy.html";
      }
    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
}
//---------------------Modele End------------------

declare var navigator: any;

@IonicPage()
@Component({
  selector: 'settingsub',
  templateUrl: 'settingsub.html',
})
export class SettingsubPage {

  isEdit:any=false;
  /* Setting Page Veribles */
  profilevisible:any;
  pushnotification:any;
  sound:any;

  interestedin:any="";
  agerange: any = { lower: 27, upper: 43 };
  picturearray:any[]=[];

  isFromProfileTurnOff:any="Male";  

  gender:any="Male";  
  occupation:any="Software engineer"; 
  education:any="VTU univercity Belagavi";
  bio:any="Somthing about youself";
  name:any="";
  personId:any="";
  fb_Id:any="";
  biodata:any="";
  distancerange: any =20;
  outNowdistancerange: any =20;
  toolBarIconColorMsg:any = "";
  ispageopenage=true;
  ispageopendistance=true;
  ispageopenoutnowdistance=true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private appdetailsProvider: AppdetailsProvider, 
              public http:Http,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController, 
              public viewCtrl: ViewController) {

    if(localStorage.getItem("messageIconColor")==="0") {
       this.toolBarIconColorMsg="flotBlack";
     }else{
       this.toolBarIconColorMsg='';
     }

    setTimeout(() => {
      this.getsettingData();
      this.getprofileData();
      this.getBioeData();
    },100);     


    this.personId = localStorage.getItem("person_id");
    this.fb_Id = localStorage.getItem("facebookId");
    this.name = localStorage.getItem("name");
    this.gender= localStorage.getItem("gender")=="male"?"Man":"Woman";
    this.occupation=  localStorage.getItem("occupation");
    this.education=  localStorage.getItem("education");

    this.isFromProfileTurnOff=navParams.get("isFromProfileTurnOff");


    debugger;
    let speed = navigator.connection.downlink;
    let speedMax = navigator.connection.downlinkMax
    debugger;

  }

  getsettingData(){
             
    let methodinstance=this;
    methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM settingsTb", []).then((data) => {
      debugger;
      methodinstance.profilevisible=data.rows.item(0).profilevisible=='false'?false:true;
      methodinstance.pushnotification=data.rows.item(0).pushnotification;
      methodinstance.sound=data.rows.item(0).sound;
      methodinstance.distancerange=data.rows.item(0).distance;
      methodinstance.outNowdistancerange=data.rows.item(0).outnowdistance;

      methodinstance.interestedin=data.rows.item(0).interestedin;
      methodinstance.agerange = { lower:data.rows.item(0).age.split("-")[0] , upper: data.rows.item(0).age.split("-")[1] };
    }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
    });
  }

  profileVisible(){
    let methodInstance=this;
        let profilevisible=false;
        if(this.profilevisible){
                    profilevisible=true;
          }
      this.setsettingdata("profilevisible",profilevisible);
    }

    notificationChange(){
    
          let pushnotification=false;
        if(this.pushnotification){
                    pushnotification=true;
          }
      this.setsettingdata("pushnotification",pushnotification);

    }

    soundChange(){
          let sound=false;
        if(this.sound){
                    sound=true;
          }
      this.setsettingdata("sound",sound);

    }

    getprofileData() {
      
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb ORDER BY position ASC", []).then((data) => {
             
             if(data.rows.length > 0) {
             methodinstance.picturearray=[];
             for(var i = 0; i < data.rows.length; i++) {
                this.picturearray.push({image_id:data.rows.item(i).image_id,link:data.rows.item(i).imageurl, image_position:data.rows.item(i).position,primary_picture:i==0?true:false});
              }
             
            } 

          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }

  getBioeData(){
     let methodinstance=this;
       methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM userTb", []).then((data) => {
  
         if(data.rows.length > 0) {
              methodinstance.biodata=data.rows.item(0).bio;
          }
        }, (error) => {
            console.log("ERROR123 : " + JSON.stringify(error));
        });

  }

    set70PlusValue(value:any){
      let returnValue;
      if(value>69){
        returnValue="70+"
      }else{
        returnValue=value;
      }
      return returnValue;
    }

   agechange(ev: any){
      debugger;
      if(!this.ispageopenage){
 
      this.setsettingdata("age",this.agerange.lower+"-"+this.agerange.upper);
    }
    this.ispageopenage=false;
}
     distancechange(ev: any){
       if(!this.ispageopendistance){
      this.setsettingdata("distance",this.distancerange);
    }this.ispageopendistance=false;
    }  

     outNowdistancechange(ev: any){
       if(!this.ispageopenoutnowdistance){
      this.setsettingdata("outnowdistance",this.outNowdistancerange);
    }this.ispageopenoutnowdistance=false;
    }

  
  //---------------------------------------updating setting table-------------------------------
   setsettingdata(columnname,value){
     
       let methodinstance=this;
       methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE settingsTb set "+columnname+"='"+value+"'",[]).then((data) => {       
                console.log("updated education tb: " + JSON.stringify(data));                
                   methodinstance.isEdit=true;
                   methodinstance.isFromProfileTurnOff='isFromProfileTurnOff';
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
    }


    //----------Update the User details-----------
    updateUserDetails(isFromLogout) {
      if(this.appdetailsProvider.CheckConnection()){
        let methodcontext=this;

        methodcontext.appdetailsProvider.ShowLoading();

        let intrerestedValue="";
        if(this.interestedin==="Men" || this.interestedin==="men") {
          intrerestedValue="male";
        } else if(this.interestedin==="Women" || this.interestedin==="women") {
          intrerestedValue="female";
        } else {
          intrerestedValue="both";
        }        


        let body={
          personal_data:{
          person_id:this.personId,
          fb_id: this.fb_Id,
          person_name: localStorage.getItem("fullName"),
          person_age: localStorage.getItem("age"), 
          gender:this.gender=="Man"?"male":"female"
          },
          personal_attributes:{
          occupation:this.occupation,
          education:this.education,
          profile_pictures:this.picturearray,
          bio:this.biodata
          },
          match_settings: {
          match_gender_preference: intrerestedValue,
          match_minimum_age: this.agerange.lower,
          match_maximum_age: this.agerange.upper > 70 ? 100 : this.agerange.upper,
          match_maximum_distance: this.distancerange,
          outnow_match_maximum_distance:this.outNowdistancerange
          },
          profile_settings: {
          profile_visible: this.profilevisible,
          push_notifications: this.pushnotification,
          app_haptics: this.sound
          }
        }
        console.log(JSON.stringify(body));
        
        let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
        let requestOptions = new RequestOptions({headers: headers});
        
        this.http.post(this.appdetailsProvider.personUrl, body, requestOptions)
        .subscribe(
             //success part
              function(response) {
              
              methodcontext.appdetailsProvider.HideLoading();

              
              localStorage.setItem("person_id",JSON.parse(response['_body']).person_id);
             
              methodcontext.isEdit=false;

              if(isFromLogout) {
                  methodcontext.logoutAction();
              } else {
                  methodcontext.appdetailsProvider.ShowToast("Profile updated successfully",2000);
                  methodcontext.goBack(true);
              }
              
         },function(error) {
            methodcontext.appdetailsProvider.HideLoading();
            methodcontext.appdetailsProvider.SomethingWentWrongAlert();
         }
        );
      }
    }

//---------------logout and deleting user information----------------
logoutAlert(event) {
  var title="";
  var buttonValues="";
  var msg="";
    if(event == "logout"){
        title="Logout";
        msg="Are you sure you want to Logout of WooWoo?";
        buttonValues="Yes, Logout";
    } else {
        title="Delete Account";
        msg="Are you sure you want to delete your WooWoo account?";
        buttonValues="Yes, Delete";
    }

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: buttonValues,
          handler: data => {
          if(event == "logout"){
            this.updateUserDetails(true);
          } else {
            this.deletePerson();
          }
            console.log('Saved clicked');
          }
        },
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
        
      ]
    });
  alert.present();
}

deletePerson(){
  if(this.appdetailsProvider.CheckConnection()) {
     
    let methodinstance=this;
    methodinstance.appdetailsProvider.ShowLoading();
                       let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let requestOptions = new RequestOptions({
      headers: headers
      });
      
    this.http.delete(this.appdetailsProvider.uerdataUrl+this.personId, requestOptions).subscribe( function(response) {
            
            methodinstance.appdetailsProvider.HideLoading();

            /*try{
             setTimeout(() => {
                this.appdetailsProvider.initFlurry("Delete User",this.personId,localStorage.getItem("gender")=="Man"?"M":"F",localStorage.getItem("age"));
              },100);
           }catch(Exception){

           }*/
            methodinstance.logoutAction(true);
        }, function(error) {
             methodinstance.appdetailsProvider.HideLoading();
             methodinstance.appdetailsProvider.SomethingWentWrongAlert();
     });
  }
}

logoutAction(isFromDelete?) {
      if(this.appdetailsProvider.CheckConnection()){
        //trancating tables
           this.appdetailsProvider.deleteTable("settingsTb");
           this.appdetailsProvider.deleteTable("localImagesTb");
           this.appdetailsProvider.deleteTable("profilepicTb");
           this.appdetailsProvider.deleteTable("photosTb");
           this.appdetailsProvider.deleteTable("workTb");
           this.appdetailsProvider.deleteTable("educationTb");
           this.appdetailsProvider.deleteTable("userTb");
           this.appdetailsProvider.deleteTable("recentLoactionTb");
           this.appdetailsProvider.deleteTable("instagramImagesTb");

           this.appdetailsProvider.globleInstagramImages=[];

           //removing local storage 
           localStorage.clear();
           if(!isFromDelete){
             /*try{
               setTimeout(() => {
                  this.appdetailsProvider.initFlurry("Logout Success",this.personId,localStorage.getItem("gender")=="Man"?"M":"F",localStorage.getItem("age"));
                },100);
             }catch(Exception){

             }*/
           }

           this.navCtrl.setRoot(LoginPage);
      }
}

goBack(fromBack?){
  debugger;
  if(this.isFromProfileTurnOff=='isFromProfileTurnOff' && this.profilevisible){
      /*if(fromBack){
        const index = this.viewCtrl.index;
         // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      } else {*/
        this.navCtrl.setRoot(HomePage);
      //}
  }else{
    const index = this.viewCtrl.index;
     // then we remove it from the navigation stack
    this.navCtrl.remove(index);
  }
}

cancel(){
  this.isEdit=false;      
}
messagePage(){
    let methodcontext=this;
    //this.navCtrl.push(Messages); 
    methodcontext.navCtrl.push(Messages).then(() => {
      const index = methodcontext.viewCtrl.index;
      for(let i = index; i >0; i--){
          methodcontext.navCtrl.remove(i);
      }
    });
  }

  openModalLink(pageName:any) {
        let modal = this.modalCtrl.create(ModalOpenLink,{ pageName: pageName});
        modal.onDidDismiss(data => {
                console.log(data);
         });
        modal.present();
  }

  ionViewDidEnter() {
        if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        } else {
           this.toolBarIconColorMsg='';
        }
    }
  ionViewDidLoad() {
        if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        } else {
           this.toolBarIconColorMsg='';
        }
  }
    
}