import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ModalController,Platform,IonicApp, AlertController } from 'ionic-angular';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import {Http, Headers, RequestOptions } from '@angular/http';
import { HomePage } from '../home/home';
import { Occupation } from '../occupation/occupation';
 import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ProfilescreenPage } from '../profilescreen/profilescreen';
import { DatePipe} from '@angular/common';
//import { FlurryAnalytics, FlurryAnalyticsObject, FlurryAnalyticsOptions,FlurryAnalyticsLocation } from '@ionic-native/flurry-analytics';


import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';


import { FirstTimeUserExpPage } from '../first-time-user-exp/first-time-user-exp';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


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


export class ModalOpenPrivacyLinks {
    link:any;
    pageName:any;
    constructor(
      public navCtrl: NavController,
      public viewCtrl: ViewController,
      public appdetailsProvider:AppdetailsProvider,
      public params: NavParams){

      appdetailsProvider.ShowLoading();
       setTimeout(() => {
         appdetailsProvider.HideLoading();
    },1000);   

      this.pageName=this.params.get('pageName');

      if(this.pageName=="EULA"){
      this.link="https://s3.amazonaws.com/woowoopolicies/tos.html";
      }else if(this.pageName=="Privacy Policy"){
        this.link="https://s3.amazonaws.com/woowoopolicies/privacy.html";
      }
    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
}
//---------------------Modele End------------------



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  educationArray:any= [];
  worksArray:any= [];
  photosArray:any= [];
  profileImages:any[]= [];

  picturearray:any[]=[];
  personalattributeArray:any[]=[];
  persondataArray:any[]=[];
  personmaindataArray:any[]=[];
  jsonData:any;


  backPressed=false;

  modal:any;
  isModalVisible:any=false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: Facebook,
              public appdetailsProvider:AppdetailsProvider,
              public modalCtrl: ModalController,
              public http:Http,
              public ionicApp: IonicApp,
              public platform:Platform,
              //private flurryAnalytics: FlurryAnalytics,
              private androidPermissions: AndroidPermissions, 
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private diagnostic: Diagnostic,
              public alertCtrl: AlertController,
              public datepipe: DatePipe) {

      var list_permissions = [
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS        
      ];

      this.androidPermissions.requestPermissions(list_permissions) .then (
      success =>{ 
        console.log('LOCATION Permission granted');
        this.myLocation();
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      });

    if(!appdetailsProvider.getDbInstance()){
      appdetailsProvider.createTable();
    }

    //this.loadJsonFile();

    localStorage.setItem("messageIconColor","0");
    localStorage.setItem('selectedLocation','');
    localStorage.setItem('selectedCity','');
    localStorage.setItem('geo_value','');

    localStorage.setItem('homePageRefreshCount','0');

    localStorage.setItem('isChatNowFirstTime','true');
    localStorage.setItem('isOutNowFirstTime','true');
    localStorage.setItem('isPlanNowFirstTime','true');

    /*setTimeout(()=>{     
       debugger;
       appdetailsProvider.flurryAnalyticsObject.logEvent('App Lunched')
      .then(() => console.log('Logged an event! in LoginPage'))
      .catch(e => console.log('Error logging the event', e));
     },2500);*/

    this.onBackPress();    

    this.getRecentLocations();

  }
 

	  /* facebook */
  	loginFacebook(count){

      if(this.appdetailsProvider.CheckConnection()){
        this.appdetailsProvider.ShowLoading();
        //this.fb.login(['public_profile', 'user_location','user_birthday','user_friends','user_photos','user_education_history','user_events','email','user_work_history','user_about_me']) .then((res: FacebookLoginResponse) =>{
        this.fb.login(['public_profile','email']) .then((res: FacebookLoginResponse) =>{
          console.log('Logged into Facebook!', res);
        
            this.onsuccessfb(res)}) .catch((e) => {
	          console.log('Error logging into Facebook', e);
            this.appdetailsProvider.HideLoading();
            /*if(count < 3){
              this.loginFacebook(count+1);
            }*/
            
            //this.appdetailsProvider.SomethingWentWrongAlert();
        });
       } else {

       }
    }

    public onsuccessfb(res) {
    let btn=this;

    let response = res;
    let Acces_token = response.authResponse.accessToken;    

    //api request to get the fb user details
    this.getUserDetails(Acces_token);

    }


    getAuthenticationToken(detail, Acces_token,btn){
   

      btn.http.get(btn.appdetailsProvider.authenticationUrl+detail.id).subscribe(
             //success part
          function(response) {
           
           localStorage.setItem("authoKey",response['_body']);
           btn.getUserDataFromApi(detail,Acces_token);
              },
              function(error) { 
              }
          );
    }

    /* facebook login ends */

    getUserDetails(Acces_token) {
    let btn=this;

    //-------------------------Facebook Profile, Location, Work, Education details-----------------------------------

        btn.http.get("https://graph.facebook.com/v2.11/me", {
            params: {
                access_token: Acces_token,
                fields: "name,gender,location,about,age_range,birthday,picture,work,education,link",
                format: "json"
            }
        }).subscribe(function (result) {
          
           let detail = JSON.parse(result['_body']);
           
                    
           localStorage.setItem("fullName",detail.name);
           localStorage.setItem("facebook_ID",detail.id);

          console.log(JSON.stringify(btn.jsonData));
           
        btn.getAuthenticationToken(detail,Acces_token,btn);
         
         

         },function (error) {

           btn.appdetailsProvider.HideLoading();
           btn.appdetailsProvider.ShowToast("Verify that the application is installed in the device",3000);
           return false;
         });
    //------------------------------------------------------------------------------------------------------------------
    }


    getUserDataFromApi(detail,access_token){
      /*
        "person_id": ""4930a6ca-89fc-774e-65af-f77934e2f779",
        "fb_id": "10156237092740692""
      */
      
      let methodinstance=this;
      let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
      let requestOptions = new RequestOptions({headers: headers});

      //this.http.get(methodinstance.appdetailsProvider.fbUerdataUrl+'10156237092740692'/*detail.id*/, requestOptions).subscribe(
      this.http.get(methodinstance.appdetailsProvider.fbUerdataUrl+detail.id, requestOptions).subscribe(
        //success part
        function(response) {
          if(response['_body'].length  > 5) {
                  let temp=JSON.parse(response['_body']);
                  let temp1=JSON.stringify(response['_body']);
                  
                  localStorage.setItem('OutNow_end_dateTime',"");
                  console.log("Existing User Details : "+temp1);

                  if(temp1.length  < 5) {
                       methodinstance.registerSocialmedia(detail,access_token);
                  } else {
                      methodinstance.loginfromApidata(temp,access_token);
                  }
                 } else {
                      methodinstance.registerSocialmedia(detail,access_token);
                 }
              },
              function(error) { 
               
               methodinstance.registerSocialmedia(detail,access_token);
              }
          );
      }


      loadJsonFile() {
        console.log('json called');
        let context=this;
        

            context.http.get('assets/data/fbDemoData.json')
                   .map(res => res.json())
                     .subscribe(data => { 
                    
                      context.jsonData = data;
                      console.log(data);
                     });
        }
   

	registerSocialmedia(jsonResponce,Acces_token) {
    debugger;
   	 let methodinstance=this;
 		 localStorage.setItem("name",jsonResponce.name);//methodinstance.jsonData
 		 localStorage.setItem("gender",jsonResponce.gender);
 		 localStorage.setItem("facebookId",jsonResponce.id);

      let profilePhoto= "https://graph.facebook.com/"+jsonResponce.id+"/picture?type=large"
      //let profilePhoto= jsonResponce.picture.data.url;

 		 localStorage.setItem("profilepic", profilePhoto);

   		//this.appdetailsProvider.HideLoading();
  		 //methodinstance.navCtrl.setRoot(HomePage);
   
   	 this.profileImages = [
      {
        profilepic: profilePhoto,
        isfacebook:'1',
        position:'1',
        feverate:'1'
      },
      {
       profilepic: '',
       isfacebook:'0',
        position:'2',
        feverate:'0'
      },
      {
       profilepic: '',
       isfacebook:'0',
        position:'3',
        feverate:'0'
      },
      {
       profilepic: '',
       isfacebook:'0',
        position:'4',
        feverate:'0'
      },
      {
       profilepic: '',
       isfacebook:'0',
        position:'5',
        feverate:'0'
      },
      {
      profilepic: '',
      isfacebook:'0',
       position:'6',
        feverate:'0'
      }
      ];   


     
       for(var i=0; i<6;i++ ){

      this.appdetailsProvider.getDbInstance().executeSql("INSERT INTO profilepicTb( imageurl, image_id, isfacebook, position, feverate) VALUES (?,?,?,?,?)", [this.profileImages[i].profilepic, this.profileImages[i].image_id, this.profileImages[i].isfacebook, this.profileImages[i].position, this.profileImages[i].feverate]).then((data) => {        
                  console.log("INSERTED: " + JSON.stringify(data));
              }, (error) => {
                   console.log("ERROR: " + JSON.stringify(error.err));
      
              });
      }

      //--------------------------------add record to setting table-----------------------------------------------------

      this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO settingsTb(profilevisible, interestedin, age, pushnotification,sound,distance,outnowdistance) VALUES (?,?,?,?,?,?,?)', ['true',jsonResponce.gender=='male'?'Women':'Men','18-71','true','true',100,100],)
          .then((data) => {
           
              console.log('Add settingsTb to DB '+data);
              
          }) .catch(e => {

              console.log(e)
          });



			//-------------------------------Adding records into User Table----------------------------------------------------------
  
		  let userName=jsonResponce.name.length>0 ? jsonResponce.name : localStorage.getItem("fullName");
		  let gender=jsonResponce.gender;
     // let picture=this.jsonData.picture.data.url;
		  let picture=profilePhoto;
		  let facebookId=jsonResponce.id;
      //let location=this.jsonData.location.name;
		  let location="";
     // let bio=this.jsonData.about;
		  let bio="";
      //let age=this.jsonData.age_range.max;
		  let age="20";
      //let birthday=this.jsonData.birthday;
		  let birthday="03/15/2000";

      localStorage.setItem("bio",bio);
      localStorage.setItem("dob",birthday);
      localStorage.setItem("age",age);



    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  userTb(id, name, gender, location, age, bio, birthday, pictureurl, facebookId) VALUES (?,?,?,?,?,?,?,?,?)', ["1",userName,gender,location,age,bio,birthday,picture,facebookId],)
    .then((data) => {
       
        console.log('Add User to DB '+data);
        
    }) .catch(e => {
        console.log(e)
    });

//-------------------------------Adding records into Education Table-----------------------------------------------------
  // methodinstance.educationArray=this.jsonData.education;
   methodinstance.educationArray=[];
   //localStorage.setItem("education",methodinstance.educationArray[0].school.name);
   localStorage.setItem("education","");

    for(var i=0;i<methodinstance.educationArray.length;i++){
    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  educationTb(educationId, schoolName, type, year,ischecked) VALUES (?,?,?,?,?)', [methodinstance.educationArray[i].id,methodinstance.educationArray[i].school.name,methodinstance.educationArray[i].type,methodinstance.educationArray[i].year.name,i==0?true:false],)
    .then((data) => {
      
        console.log('Add EducationTb to DB '+data);
        
    }) .catch(e => {
        console.log(e)
    });

    }

 //------------------------------Adding records into Work Table-------------------------------------------------------
  //methodinstance.worksArray=this.jsonData.work;
  methodinstance.worksArray=[];
  // localStorage.setItem("occupation",methodinstance.worksArray[0].position.name);
   localStorage.setItem("occupation","");

  for(var i=0;i<methodinstance.worksArray.length;i++){

  this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO workTb(workId, company, position, location,ischecked,isfacebook) VALUES (?,?,?,?,?,?)', [methodinstance.worksArray[i].id,methodinstance.worksArray[i].employer.name,methodinstance.worksArray[i].position.name+".",methodinstance.worksArray[i].location.name,i==0?true:false,true],)
      .then((data) => {
          console.log('Add WorkTb to DB '+data);
      }) .catch(e => {

          console.log(e)
      });

   }


   //-------------------------------------------------------------------------------------------------------------------

           
  this.getPhotosDetails(Acces_token,jsonResponce);

}  //end theregisterSocialmedia()


 getPhotosDetails(Acces_token,jsonResponce){
   
    let btn=this;

    //---------------------------------------Facebook uploaded photos list--------------------------------------------------
        
         btn.http.get("https://graph.facebook.com/v2.11/me/photos?type=uploaded", {
         
            params: {
                access_token: Acces_token,
                fields: "name,picture",
                format: "json"
            }
        }).subscribe(function (result) {
           debugger;
           let detail = JSON.parse(result['_body']);
      
           btn.addPhotosToLocal(detail);
           
           if(jsonResponce.id.length > 0) {
              btn.sendRegisteringDataApi(jsonResponce,detail);
           }

         },function (error) {  
          
           btn.appdetailsProvider.HideLoading();
           btn.appdetailsProvider.ShowToast("Verify that the application is installed in the device",3000);
           return false;
         });
    //------------------------------------------------------------------------------------------------------------------
    }


sendRegisteringDataApi(jsonResponce,photodetail) {
debugger;
let jsonArray=jsonResponce;
let photoArray=photodetail;

  let userName=jsonResponce.name;
  let gender=jsonResponce.gender;
  let facebookId=jsonResponce.id;
 // let picture=this.jsonData.picture.data.url;
  let picture="https://graph.facebook.com/"+facebookId+"/picture?type=large";
  //let location=this.jsonData.location.name;
  let location="";
  //let bio=this.jsonData.about;
  let bio="";
  //let age=this.jsonData.age_range.max;
  let age="25";
  //let birthday=this.jsonData.birthday;
  let birthday="03/15/1995";

  localStorage.setItem("bio",bio);
  localStorage.setItem("dob",birthday);

  let currentStateCountry=localStorage.getItem('currentLocation')==null?'':localStorage.getItem('currentLocation');
  let currentCity=localStorage.getItem('currentCity')==null?'':localStorage.getItem('currentCity');
  /*-----------------------------------------------------*/

      let match_gender_preference='both';
      let min_age_range=18;
      let max_age_range=70;
      let match_maximum_distance=20;
      let outnow_match_maximum_distance=20;

      let profile_visible=true;
      let push_notifications=true;
      let sound=true;

      
      localStorage.setItem("name",userName);
      localStorage.setItem("gender",gender);
      localStorage.setItem("facebookId",facebookId);
      localStorage.setItem("profilepic",picture);
  /*-----------------------------------------------------*/


   let date2= new Date(birthday);
     var diff = Math.floor(new Date().getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    localStorage.setItem("age",''+years);
    



  let personaldata=this.persondataArray.push({fb_id: facebookId, person_name:userName, person_age:years, gender:gender});
    
    for(var i=0;i< photodetail.data.length;i++) {
      if(i==0) {          
        let fbImgPath="https://graph.facebook.com/"+facebookId+"/picture?type=large"
        //let fbImgPath=picture;
       this.picturearray.push({image_id:photodetail.data[i].id,link:fbImgPath,image_position:i+1,primary_picture:true});
      } else {
       this.picturearray.push({image_id:"",link:"",image_position:i+1});
      }

    }

     

    let body={personal_data:{
        fb_id: facebookId,
        person_name:localStorage.getItem("fullName"),
        person_age:years, 
        age:years,
        gender:gender,
        registered:currentCity+' '+currentStateCountry
        },

      match_settings:{
        match_gender_preference: gender,
        match_minimum_age: min_age_range,
        match_maximum_age: max_age_range,
        match_maximum_distance: match_maximum_distance,
        outnow_match_maximum_distance: outnow_match_maximum_distance},

      profile_settings: {
        profile_visible: profile_visible,
        push_notifications: push_notifications,
        app_haptics: sound},

      personal_attributes:{
      occupation:"",
      education:"",
      profile_pictures:this.picturearray,
      bio:bio}}

      console.log("Person Register :-->"+JSON.stringify(body));

      let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
      let requestOptions = new RequestOptions({headers: headers});

      let methodcontext=this;
      this.http.post(this.appdetailsProvider.personUrl, body, requestOptions)
      .subscribe(
           //success part
        function(response) {
        
        setTimeout(() => {
            methodcontext.appdetailsProvider.HideLoading();
            localStorage.setItem("person_id",JSON.parse(response['_body']).person_id);
            //methodcontext.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:true});
            localStorage.setItem("firstTimeuserExp","true");
            methodcontext.navCtrl.setRoot(FirstTimeUserExpPage,{isFromPage:"loginPage",isNewUser:true});
 
         },1000*2);   //2 sec
               
       },
            function(error) { 
            
              
            }
        );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



//-------------------------------------------add data to local database from api-------------------------------------
  loginfromApidata(jsonResponce,AccessToken) {

      this.getPhotosDetails(AccessToken,"");
 
      
   		let methodinstance=this;
      let tempjsonarray=jsonResponce;
      let jsonpersonData=jsonResponce.personal_data;
      let personaldata=jsonResponce.personal_data;
      let personal_attributes=jsonResponce.personal_attributes;
      let picturearray=personal_attributes.profile_pictures;
      let profileImg=picturearray.length > 0 ? picturearray[0].link : "";

      //--------------------match_settings--------------------------
      let match_settings=jsonResponce.match_settings;

      let match_gender_preference=match_settings.match_gender_preference;
      let min_age_range=match_settings.match_minimum_age;
      let max_age_range=match_settings.match_maximum_age;
      let match_maximum_distance=match_settings.match_maximum_distance;
      let outnow_match_maximum_distance=match_settings.outnow_match_maximum_distance;

      //--------------------profile_settings-----------------------
      let profile_settings=jsonResponce.profile_settings;

      let profile_visible=profile_settings.profile_visible;
      let push_notifications=profile_settings.push_notifications;
      let sound=profile_settings.app_haptics;

   		localStorage.setItem("name",personaldata.person_name);
   		localStorage.setItem("gender",personaldata.gender);
      localStorage.setItem("person_id",personaldata.person_id);
   		localStorage.setItem("facebookId",personaldata.fb_id);
   		localStorage.setItem("profilepic",profileImg);

          //-------------get Out Now info START-------------------
            try{
              let scheduleIdsList="";
              let outnowSchedulesList = jsonResponce.schedule_data.schedules;
               if(outnowSchedulesList.length > 0){
                 for (var a = 0; a < outnowSchedulesList.length; a++) {
                   debugger;
                   scheduleIdsList=scheduleIdsList===''?outnowSchedulesList[a].schedule_id : scheduleIdsList+","+outnowSchedulesList[a].schedule_id;

                   let isOutNow=jsonResponce.schedule_data.schedules[a].schedule_isoutnow;

                   if(isOutNow){
                     debugger;
                     let date: Date = new Date(jsonResponce.schedule_data.schedules[a].schedule_enddate);
                     let endDate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

                     let OutNow_end_dateTime=this.datepipe.transform(endDate.toString()+"",'yyyy-MM-dd hh:mm a');
                     
                     console.log("OutNow end Date : "+OutNow_end_dateTime);
                     
                     //localStorage.setItem('OutNow_end_dateTime',OutNow_end_dateTime);
                   }
                 }
                 localStorage.setItem('OutNow_scheduleIdsList',scheduleIdsList);
               } else {
                 localStorage.setItem('OutNow_end_dateTime',"");
                 localStorage.setItem('OutNow_scheduleIdsList',"");
               }
            } catch(Exception){

            }
          //-------------get Out Now info END-------------------
      		  let userName=personaldata.person_name;
      		  let gender=personaldata.gender;
      		  let facebookId=personaldata.fb_id;
      		  let location="";
      		  let bio=personal_attributes.bio;
      		  let age=personaldata.person_age;
      		  let birthday="";



            localStorage.setItem("bio",bio);
            localStorage.setItem("dob","08/06/2000");
            localStorage.setItem("age",age);


         		//this.appdetailsProvider.HideLoading();
        		 //methodinstance.navCtrl.setRoot(HomePage);
         
         	 this.profileImages = [
            {
              image_id:"",
              profilepic: profileImg,
              isfacebook:'1',
              position:'1',
              feverate:'1'
            },
            {
             image_id:"",
             profilepic: '',
             isfacebook:'0',
             position:'2',
             feverate:'0'
            },
            {
             image_id:"",
             profilepic: '',
             isfacebook:'0',
             position:'3',
             feverate:'0'
            },
            { 
             image_id:"",
             profilepic: '',
             isfacebook:'0',
             position:'4',
             feverate:'0'
            },
            {
             image_id:"",
             profilepic: '',
             isfacebook:'0',
             position:'5',
             feverate:'0'
            },
            {
              image_id:"",
              profilepic: '',
              isfacebook:'0',
              position:'6',
              feverate:'0'
            },
            ];
            

            for (var i = 0; i < 6; i++) {
              for (var j = 0; j < picturearray.length; j++) {
                if(i+1 === picturearray[j].image_position) {
                    this.profileImages[i].image_id=picturearray[j].image_id;
                    this.profileImages[i].profilepic=picturearray[j].link;
                    this.profileImages[i].position=picturearray[j].image_position;
                    this.profileImages[i].feverate=picturearray[j].image_position === 1 ? '1' : '0';
                    break;
                }
              }
            }

            


             for(var i=0; i < this.profileImages.length;i++ ) {

            this.appdetailsProvider.getDbInstance().executeSql("INSERT INTO profilepicTb( imageurl, image_id, isfacebook, position, feverate) VALUES (?,?,?,?,?)", [this.profileImages[i].profilepic,this.profileImages[i].image_id, this.profileImages[i].isfacebook, this.profileImages[i].position, this.profileImages[i].feverate]).then((data) => {        
                        console.log("INSERTED: " + JSON.stringify(data));
                   
                    }, (error) => {
                         console.log("ERROR: " + JSON.stringify(error.err));
                    });
            }

            //--------------------------------add record to setting table-----------------------------------------------------

            if(!outnow_match_maximum_distance){
              outnow_match_maximum_distance=50;
            }
            this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO settingsTb(profilevisible, interestedin, age, pushnotification,sound,distance,outnowdistance) VALUES (?,?,?,?,?,?,?)', [profile_visible,match_gender_preference,min_age_range+"-"+max_age_range,push_notifications,sound,match_maximum_distance,outnow_match_maximum_distance],)
                .then((data) => {
                 
                    console.log('Add settingsTb to DB '+data);
                    
                }) .catch(e => {
                    console.log(e)
                });

      			//-------------------------------Adding records into User Table----------------------------------------------------------
        

          this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  userTb(id, name, gender, location, age, bio, birthday, pictureurl, facebookId) VALUES (?,?,?,?,?,?,?,?,?)', ["1",userName,gender,location,age,bio,birthday,profileImg,facebookId],)
          .then((data) => {
             
              console.log('Add User to DB '+data);
              
          }) .catch(e => {
              
              console.log(e)
          });

      //-------------------------------Adding records into Education Table-----------------------------------------------------

          let educationValue=personal_attributes.education;
          if(educationValue=='null' || educationValue==null || educationValue){
            educationValue='';
          }
          methodinstance.educationArray=educationValue;
         
          localStorage.setItem("education",educationValue);
          //for(var i=0;i<methodinstance.educationArray.length;i++){    //commented for multiple records
          this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  educationTb(educationId, schoolName, type, year,ischecked) VALUES (?,?,?,?,?)', ["1",educationValue,"","",true],)
          .then((data) => {
              console.log('Add EducationTb to DB '+data);
          }) .catch(e => {
       
              console.log(e)
          });

          //}

      //------------------------------Adding records into Work Table-------------------------------------------------------
      //methodinstance.worksArray=jsonResponce.work;


      //for(var i=0;i<methodinstance.worksArray.length;i++){
        let occupationValue=personal_attributes.occupation;
        if(occupationValue=='null' || occupationValue==null || occupationValue){
          occupationValue='';
        }
      localStorage.setItem("occupation",occupationValue);
      this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO workTb(workId, company, position, location,ischecked,isfacebook) VALUES (?,?,?,?,?,?)', ["1","",occupationValue+".","",true,true],)
          .then((data) => {
           
              console.log('Add WorkTb to DB '+data);

          }) .catch(e => {
              console.log(e)
          });

      //}
      
      //------------------------------add image records into image Table-------------------------------------------------------
      /*for(var i=0;i<picturearray.length;i++){

          this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO photosTb(photoId, imageUrl) VALUES (?,?)', [picturearray[i].image_id,picturearray[i].link],)
              .then((data) => {

                  console.log('Add photosTb to DB '+data);
                  
              }) .catch(e => {

                  console.log(e)
              });

          }*/


        setTimeout(() => {
              
              methodinstance.appdetailsProvider.HideLoading();
              //methodinstance.navCtrl.setRoot(HomePage);

              //methodinstance.navCtrl.setRoot(ProfilescreenPage,{isFromPage:"loginPage",isNewUser:false});
                 localStorage.setItem("firstTimeuserExp","true");
              methodinstance.navCtrl.setRoot(FirstTimeUserExpPage,{isFromPage:"loginPage",isNewUser:false});
         },1000*3);   //3 sec

      //-------------------------------------------------------------------------------------------------------------------
 }//end the loginfromApidata

 addPhotosToLocal(fbResponce){

   let methodinstance=this;
  //------------------------------Adding records into Photos Table-------------------------------------------------------
    methodinstance.photosArray = fbResponce.data;
  debugger;

    if(methodinstance.photosArray.length > 0){

    for(var i=0;i<methodinstance.photosArray.length;i++){

    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO photosTb(photoId, imageUrl) VALUES (?,?)', [methodinstance.photosArray[i].id,methodinstance.photosArray[i].picture],)
        .then((data) => {
            console.log('Add photosTb to DB '+data);
        }) .catch(e => {
           
            console.log(e)
        });

    }
  } else {
    let facebookId=localStorage.getItem("facebook_ID");
    let picture="https://graph.facebook.com/"+facebookId+"/picture?type=large";
    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO photosTb(photoId, imageUrl) VALUES (?,?)', [1,picture],)
        .then((data) => {
            console.log('Add photosTb to DB '+data);
        }) .catch(e => {
           
            console.log(e)
        });
  }

  setTimeout(() => {
    //this.appdetailsProvider.HideLoading();
   // methodinstance.navCtrl.setRoot(HomePage);
    console.log('ALL DATA IS ADDED DONE IN LOCAL DB');
    },1000*5);   //5 sec
  }//end the addPhotosToLoca1l().

  
  openPrivacyLikes(pageName:any){
    if(this.appdetailsProvider.CheckConnection()){
        let context=this;
        context.isModalVisible=true;
        context.modal = context.modalCtrl.create(ModalOpenPrivacyLinks,{ pageName: pageName});
        context.modal.onDidDismiss(data => {
              console.log(data);
              context.isModalVisible=false;
        });
        context.modal.present();
    }

  }

   onBackPress(){
    //-------------Back press fuctinality-------------
    this.platform.registerBackButtonAction(() => {
      if(this.isModalVisible){
        this.modal.dismiss();
      }else{
        if (this.navCtrl.canGoBack() || this.appdetailsProvider.modalpresent==true) {

            
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
            
            if(!this.backPressed) {
              this.backPressed = true;
              this.appdetailsProvider.ShowToast("Press again to exit",1000);
              setTimeout(() => this.backPressed = false, 2000);
              return;
            }
            //localStorage.removeItem("guestuserdidlogin");
            this.platform.exitApp();
        }
      }
    });
  }

  getRecentLocations(){
          
    let methodinstance=this;
      methodinstance.http.get(methodinstance.appdetailsProvider.getRecentLocations).subscribe(
        //success part
     function(response) {
       console.log("Recent location Resp : ->"+JSON.stringify(response));
       
       let responceBody=JSON.parse(response['_body']);
       
    if(responceBody.length > 0) {

          //--------------------- Adding the recent locations in local TB STRAT -----------------
          for (let i = 0; i < responceBody.length; i++) {
            
         
          let city=responceBody[i].location_name;
          let state=responceBody[i].location_name;
          let country=responceBody[i].location_country;
          
          methodinstance.appdetailsProvider.getDbInstance().executeSql("INSERT INTO recentLoactionTb( city, state, contry, priority) VALUES (?,?,?,?)", [city, state, country, '100']).then((data) => {        
              
              console.log("INSERTED: " + JSON.stringify(data));
              console.log("INSERTED-ID: " + JSON.stringify(data.insertId));
              /*if(data.insertId > 10){
                        
                  methodinstance.appdetailsProvider.getDbInstance().executeSql("DELETE FROM recentLoactionTb WHERE id IN (SELECT id FROM recentLoactionTb ORDER BY priority,id ASC LIMIT 1)").then((data) => {
                      
                      console.log("Delete success: " + JSON.stringify(data));    
                }, (error) => {
                      debugger;
                      console.log("ERROR Delete: " + JSON.stringify(error.err));
                });
              }*/
          
          }, (error) => {
            debugger;
          });
        }
          //---------------------Adding the recent locations in local TB END ---------------------
      }
     
         },
         function(error) { 
         }
     );
}


  //--------------------- get current location code-----------------------------------
  myLocation() {
    debugger;
    if (this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled().then((state) => {

        if (state == false) {
          let alt = this.alertCtrl.create({
            title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
              text: 'Cancel', role: 'cancel', handler: () => {
              }
            },
            {
              text: 'Ok', handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }]
          });
          alt.present();
        } else {
          this.getMycurrentLocation();
        }
      }).catch(e => console.error(e));
    } else {
      this.diagnostic.isGpsLocationEnabled().then((state) => {

        if (state == false) {
          let alt = this.alertCtrl.create({
            title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
              text: 'Cancel', role: 'cancel', handler: () => {
              }
            },
            {
              text: 'Ok', handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }]
          });
          alt.present();
        } else {
          this.getMycurrentLocation();
        }
      }).catch(e => console.error(e));
    }
  }

  getMycurrentLocation() {
    var options = {
      enableHighAccuracy: false,
      timeout: Infinity,
      maximumAge: 10000
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      //------------get the current city,state and country START-------
      this.nativeGeocoder.reverseGeocode(latitude, longitude)
          .then((result: NativeGeocoderReverseResult) =>
            {
              let country=result.countryName;
              let city=result.subAdministrativeArea;
              let state=result.administrativeArea;

              console.log('Current location :-> '+city+' '+state+','+country);

              localStorage.setItem('currentLocation',state+", "+country);
              localStorage.setItem('currentCity',city);
              localStorage.setItem('current_geo_value',latitude+","+longitude);
            })
          .catch((error: any) =>
            { 
              console.log(error);
            });
      //------------get the current city,state and country END---------
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  //--------------------------------------------------------------------



}



