import { Component, ViewChild,ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController, ModalController ,ViewController, AlertController, Platform, Content, LoadingController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { Datelist } from '../datelist/datelist';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { UploadServiceProvider } from '../../providers/upload-service/upload-service';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Occupation } from '../occupation/occupation';
import { Education } from '../education/education';
import { Gender } from '../gender/gender';
import { LoginPage } from '../login/login';
import { EditprofilephotoPage } from '../editprofilephoto/editprofilephoto';
import { Messages } from '../messages/messages';

import { Fbphotoupload } from '../fbphotoupload/fbphotoupload';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import { Firebase } from '@ionic-native/firebase';
import { Crop } from '@ionic-native/crop';
import { DragulaService } from 'ng2-dragula';

import { SortablejsDirective} from 'angular-sortablejs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

import { CalenderPage } from '../calender/calender';

import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';

import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

/**
 * Generated class for the ProfilescreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profilescreen',
  templateUrl: 'profilescreen.html',
})

export class ProfilescreenPage {
@ViewChild('msgInput ') msgInput : ElementRef;

  iAmMan:any;
  iAmWoman:any;

  fname:any=""; 
  lname:any=""; 
  age:any="26"; 
  dob:any="08/06/2000";
  gender:any="Male";
  occupation:any="Software engineer";
  education:any="VTU univercity Belagavi";
  bio:any;
  profilePic:any="assets/imgs/defoult_profile_pic.jpg";


  //defaultImage:any= 'assets/imgs/defoult_profile_pic.jpg';
  //defaultImage:any= 'assets/imgs/image1515.jpg';
  defaultImage:any= 'assets/imgs/imagecoming.png';
  offset:any  = 100;


  tempArray1:any[]=[];
  tempArray2:any[]=[];

  InstagramImages:any[]=[];

  profileImages:any[]=[
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:1,feverate:'',deleteicon:0},
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:2,feverate:'',deleteicon:0},
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:3,feverate:'',deleteicon:0},
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:4,feverate:'',deleteicon:0},
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:5,feverate:'',deleteicon:0},
    {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:6,feverate:'',deleteicon:0}
  ];
  pictureList:any[]=[];
  base64image:any="";
  personId:any="";
  fb_Id:any="";

  /* Setting Page Veribles */
  profilevisible:any;
  interestedin:any="";
  pushnotification:any;
  sound:any;

  agerange: any = { lower: 27, upper: 43 };
  distancerange: any =20;
  outnowdistance: any =20;

  menischecked:any;
  womenischecked:any;
  allischecked:any;


  iAmManIsChecked:any;
  iAmWomenIsChecked:any;


  biodata:any="";
  firstname:any="";
  lastname:any="";

  isNewUser:any;

  isFrom:any="";
  isEdit:any="";
  isFistTime:any=false; //this is used for make a isEdit is FALSE bcoz when we are setting the radio button value on that time onCheck is called so isEdit is true

  picturearray:any[]=[];

  isProfilePhotosEdit:any=false;
  isProfilePhotosDeleted:any=false;
  profilePhotosEditLabel:any="Edit";

  isInstgramLoggedIn:any=true;

  flag:any=true;

  /*-------------instagram code-----------------------*/
  private instagramResponse;
  private oauth: OauthCordova = new OauthCordova();

  /*https://api.instagram.com/oauth/authorize/?
  client_id=8e1316dd4f3e4c7cb1207d37f1c8a119
  &redirect_uri=https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/login/instagram?person_id={the personid}
  &response_type=code*/

    private instagramProvider: Instagram = new Instagram({
        clientId: "8e1316dd4f3e4c7cb1207d37f1c8a119",// Register you client id from https://www.instagram.com/developer/
        redirectUri: 'https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/login/instagram'/*?person_id='+localStorage.getItem("person_id")*/,  // Let is be localhost for Mobile Apps
        responseType: 'token',   // Use token only 
        appScope: ['basic','public_content']
    });
/*-------------------------------------------------------*/

  public many: Array<string> = ['The', 'possibilities', 'are', 'endless!','How','well'];

  toolBarIconColorMsg:any = "";

  @ViewChild('input') myInput ;   
  @ViewChild(Content) content: Content;

  constructor(public modalCtrl: ModalController,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public appdetailsProvider:AppdetailsProvider,
              public uploadServiceProvider:UploadServiceProvider,
              private camera: Camera, 
              public actionSheetCtrl:ActionSheetController,
              public http:Http,
              public firebase: Firebase,
              private cameraPreview: CameraPreview, 
              private crop: Crop,
              private transfer: FileTransfer, 
              private file: File,
              public loading: LoadingController,
              private imageResizer: ImageResizer,
              private dragulaService: DragulaService,
              public viewCtrl: ViewController,
              public platform: Platform) {

    this.isEdit = false;

    if(appdetailsProvider.globleInstagramImages.length>0){
      this.isInstgramLoggedIn=false;
      this.InstagramImages=appdetailsProvider.globleInstagramImages;
    } else {
      this.getInstagramImagesFromLocalTb();
    }

    this.isFrom = navParams.get('isFromPage');
    this.isNewUser = navParams.get('isNewUser');
    

    this.personId = localStorage.getItem("person_id");



    this.fb_Id = localStorage.getItem("facebookId");

    this.occupation=  localStorage.getItem("occupation")==null?"":localStorage.getItem("occupation");
    this.education=  localStorage.getItem("education")==null?"":localStorage.getItem("education");
    this.gender=  localStorage.getItem("gender")=="male"?"Man":"Woman";
      if(!this.occupation){
             this.occupation ="";
            }
            if(!this.education){
             this.education="";
            }

    if(localStorage.getItem("messageIconColor")==="0") {
       this.toolBarIconColorMsg="flotBlack";
     }else{
       this.toolBarIconColorMsg='';
     }

    if(this.isFrom === "loginPage"){
      //-------------Send FCM token to server--------------
      this.appdetailsProvider.setFcmTokenId();
      this.appdetailsProvider.getDeviceDetails();
      setTimeout(() => {
        this.appdetailsProvider.sendFcmIdToServer(this.personId);
        //this.appdetailsProvider.initFlurry("Login Success",this.personId,localStorage.getItem("gender")=="male"?"M":"F",localStorage.getItem("age"));
      },2000);
      //---------------------------------------------------
    }

    setTimeout(() => {
        this.isFistTime=true;
     },2000);

    setTimeout(() => {

      this.profileImages=this.appdetailsProvider.globleProfileImages;

       this.getUserDetails(); 
       //this.getprofileData();
       this.getsettingData();
       this.getBioeData();

       //this.setArray();
       
       if(this.isFrom === "loginPage"){
        appdetailsProvider.getScheduledData();
       }
       
       /*if(this.isNewUser) {
         setTimeout(() => {
           this.appdetailsProvider.ShowLoadingMeg("Uploading profile picture");
           var img = document.getElementById("id_profilepic1");
           this.asyncMethod(img,this.profileImages[0]);
         },3000);
       }*/
    },100);

  }//constructor 


resizetextarea(){
  let textArea = document.getElementsByTagName('textarea')[0];
    textArea.style.height = 'auto';
   // if (textArea.scrollHeight < 100) {
      textArea.style.height = textArea.scrollHeight + "px";
      textArea.style.overflowY = 'hidden';
   /* } else {
      textArea.style.height = "100px";
      textArea.style.overflowY = 'auto';
    }*/

  }


  ionViewDidEnter(){

    setTimeout(() => {
          this.getprofileData();
    },200);

    if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
    } else {
           this.toolBarIconColorMsg='';
    }
      
    this.occupation=  localStorage.getItem("occupation")==null?"":localStorage.getItem("occupation");
    this.education=  localStorage.getItem("education")==null?"":localStorage.getItem("education");
    this.gender=  localStorage.getItem("gender")=="male"?"Man":"Woman";
      if(!this.occupation){
             this.occupation ="";
            }
            if(!this.education){
             this.education="";
            }
  }


  //------ Add image method on image move mode -----
  addOnMoveMode(value?) {
    if(value) {
        this.flag=false;
    } else {
        setTimeout(() => {
          if(this.flag){
            this.presentActionSheet();
          } else {
            this.flag=true;
          }
        },100);
    }
  }


    editProfile(){
        this.myInput.setFocus();
    }

    getUserDetails(){
         this.age=localStorage.getItem("age");
         this.dob=localStorage.getItem("dob");
         this.gender=localStorage.getItem("gender")=="male"?"Man":"Woman";
         this.occupation=localStorage.getItem("occupation")==null?"":localStorage.getItem("occupation");
         this.education= localStorage.getItem("education")==null?"":localStorage.getItem("education");
            if(!this.occupation){
             this.occupation ="";
            }
            if(!this.education){
             this.education="";
            }
         
         let profilePicValue=localStorage.getItem("profilepic");
         this.profilePic=profilePicValue.length > 0 ? profilePicValue:this.profilePic;
    }

    goToHome() {
      if(this.appdetailsProvider.CheckConnection()) {
        this.done(true);
      }
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilescreenPage');

      if(localStorage.getItem("messageIconColor")==="0") {
              this.toolBarIconColorMsg="flotBlack";
        } else {
           this.toolBarIconColorMsg='';
        }
    }

    interestedOn(interestedon) {
    
    let methodinstance=this;

    if(methodinstance.interestedin=="men" || methodinstance.interestedin=="Men")
       {
        methodinstance.interestedin="Men";
        methodinstance.menischecked=true;
        methodinstance.womenischecked=false;
        methodinstance.allischecked=false;
      }else if(methodinstance.interestedin=="Women" || methodinstance.interestedin=="women") {
        methodinstance.interestedin="Women"
        methodinstance.menischecked=false;
        methodinstance.womenischecked=true;
        methodinstance.allischecked=false;
      }else {
        methodinstance.interestedin="Men and Women"
        methodinstance.menischecked=false;
        methodinstance.womenischecked=false;
        methodinstance.allischecked=true;
      }
    this.setsettingdata("interestedin",interestedon);
    }
   
    
    testRadioOpen: boolean;
    testRadioResult;
  showRadio() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Interested in');

        alert.addInput({
          type: 'radio',
          label: 'Men',
          value: 'men',
          checked: this.menischecked
        });

        alert.addInput({
          type: 'radio',
          label: 'Women',
          value: 'women',
          checked: this.womenischecked
        });

        alert.addInput({
          type: 'radio',
          label: 'Men and Women',
          value: 'both',
          checked: this.allischecked
        });

        alert.addButton('Cancel');
        alert.addButton({
          text: 'Ok',
          handler: data => {
            console.log('Radio data:', data);
            
            this.interestedin=data;
            this.interestedOn(data);
            this.testRadioOpen = false;
            this.testRadioResult = data;
          }
        });

        alert.present().then(() => {
          this.testRadioOpen = true;
        });
  }

  showGenderPopup() {
        let alert = this.alertCtrl.create();
        alert.setTitle("I'm a");

        alert.addInput({
          type: 'radio',
          label: 'Man',
          value: 'Man',
          checked: this.iAmManIsChecked
        });

        alert.addInput({
          type: 'radio',
          label: 'Women',
          value: 'Women',
          checked: this.iAmWomenIsChecked
        });

        alert.addButton('Cancel');
        alert.addButton({
          text: 'Ok',
          handler: data => {
            
            console.log('Radio data:', data);
            this.gender = data;
            this.iAmGender(data);
          }
        });
        alert.present();
  }

  iAmGender(genderValue){
    
    let methodinstance=this;
    if(methodinstance.gender=="man" || methodinstance.gender=="Man"){
      this.iAmManIsChecked=true;
      this.iAmWomenIsChecked=false;
    } else {
      this.iAmManIsChecked=false;
      this.iAmWomenIsChecked=true;
    }
    //-------Add to local DB---------------
    
    console.log("UPDATE userTb set gender='"+ (this.iAmManIsChecked ? "male" : "female") +"'");
      methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE userTb set gender='"+ (this.iAmManIsChecked ? "male" : "female") +"'",[]).then((data) => {   
      console.log("updated userTb-->Gender tb: " + JSON.stringify(data));
                
                localStorage.setItem("gender",this.iAmManIsChecked ? "male" : "female");
                methodinstance.isEdit=true;
                
      }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
      });
    //---------------------------------------
  }


  getprofileData() {
      
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb ORDER BY position ASC", []).then((data) => {
             
             if(data.rows.length > 0) {

            
             methodinstance.pictureList=[];
             methodinstance.appdetailsProvider.globleProfileImages=[];
             for(var i = 0; i < data.rows.length; i++) {
               
               methodinstance.appdetailsProvider.globleProfileImages.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:(data.rows.item(i).position), feverate:data.rows.item(i).feverate, deleteicon:0});

                if(data.rows.item(i).feverate==='1'){
                   methodinstance.profilePic=data.rows.item(i).imageurl;
                }
                if(data.rows.item(i).imageurl!==''){
                   methodinstance.pictureList.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate, deleteicon:0});
                }

                //methodinstance.appdetailsProvider.globleProfileImages=methodinstance.profileImages;
              }

              setTimeout(()=>{
                   methodinstance.profileImages=[];
                   methodinstance.profileImages=methodinstance.appdetailsProvider.globleProfileImages;
              },1000)
             
            } 

          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }

  presentActionSheet1(imagepositionThis,isClikedOnImageThis) {
      if(this.profileImages[imagepositionThis].deleteicon !== 1) {
        if(this.appdetailsProvider.CheckConnection()) {
          this.navCtrl.push(EditprofilephotoPage,{isFromPage:this.isFrom,imageposition:imagepositionThis,isClikedOnImage:isClikedOnImageThis});
        }
      }
  }

  checkFocus(){
    this.isEdit = true;
  } 
   
  //Convert image to base 64 start
  /*@ViewChild('canvasforbase') canvasRef;
    imgToBase64(imageTag) {
    
    
    let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext('2d');
    canvas.height = imageTag.naturalHeight;
    canvas.width = imageTag.naturalWidth;
    context.drawImage(imageTag, 0, 0);  
    let b=canvas.toDataURL();
    
    return b;
  }*/

  savebiodata($event){
  
   let methodinstance=this;
    setTimeout(() => {
       console.log("Enterd Bio value : " +this.biodata);
         methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE userTb set bio='"+this.biodata+"'",[]).then((data) => {       
            console.log("updated userTb tb with Bio: " + JSON.stringify(data));
         }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
         });

         methodinstance.resizetextarea();
    }, 100);
  }

  saveOccupationData($event){

    
         localStorage.setItem("occupation",this.occupation);
  }
  saveEducationData($event){
    
         localStorage.setItem("education",this.education);
  }
  myageChange($event){
    
         localStorage.setItem("age",this.age);
          if(this.isFistTime && this.isFrom!=="loginPage"){
                   this.isEdit=true;
                 }
  }

  saveUserName($event){
    
   let methodinstance=this;
    setTimeout(() => {
       console.log("Enterd Name value : " +this.firstname+" "+this.lastname);
         let fullName=this.firstname+" "+this.lastname;

         localStorage.setItem("name",fullName);

         methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE userTb set name='"+fullName+"'",[]).then((data) => {       
            console.log("updated userTb tb with Bio: " + JSON.stringify(data));
         }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
         });
    }, 100);
  }
  getBioeData(){
     let methodinstance=this;
       methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM userTb", []).then((data) => {
  
         
         if(data.rows.length > 0) {
              methodinstance.bio=data.rows.item(0).bio;

              var name=data.rows.item(0).name;

              localStorage.setItem("name",name);
              methodinstance.fname=name.split(' ')[0];
              methodinstance.lname=name.split(' ')[1];

              //----Get gender value-------
              let gender=data.rows.item(0).gender;
              

              if(gender=="man" || gender=="Man" || gender=="male" || gender=="Male"){
                  methodinstance.iAmManIsChecked=true;
                  methodinstance.iAmWomenIsChecked=false;
                  methodinstance.gender="Man";
              } else {
                  methodinstance.iAmManIsChecked=false;
                  methodinstance.iAmWomenIsChecked=true;
                  methodinstance.gender="Woman";
              }

                 setTimeout(() => {

         methodinstance.resizetextarea();
    }, 100);

/*              methodinstance.resizetextarea();*/

          }
        }, (error) => {
            console.log("ERROR123 : " + JSON.stringify(error));
        });

  }

  gotoOccupation(){
    this.isEdit=true;
    this.navCtrl.push(Occupation);
  }
  gotoEducation(){
     this.isEdit=true;
    this.navCtrl.push(Education);
  }
  gotoGender(){
    this.isEdit=true;
    this.navCtrl.push(Gender);
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

  //-----------------getting information from setting table-----------------
getsettingData(){
             
     let methodinstance=this;
        methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM settingsTb", []).then((data) => {
         
       methodinstance.profilevisible=data.rows.item(0).profilevisible;
       methodinstance.interestedin=data.rows.item(0).interestedin;
       //methodinstance.age.lower=data.rows.item(0).age.split("-")[0];
       //methodinstance.age.upper=data.rows.item(0).age.split("-")[1];

       methodinstance.agerange = { lower:data.rows.item(0).age.split("-")[0] , upper: data.rows.item(0).age.split("-")[1] };
       methodinstance.pushnotification=data.rows.item(0).pushnotification;
       methodinstance.sound=data.rows.item(0).sound;
       methodinstance.distancerange=data.rows.item(0).distance;
       methodinstance.outnowdistance=data.rows.item(0).outnowdistance;

       if(methodinstance.interestedin=="men" || methodinstance.interestedin=="Men" || methodinstance.interestedin=="male")
       {
        methodinstance.interestedin="Men";
        methodinstance.menischecked=true;
        methodinstance.womenischecked=false;
        methodinstance.allischecked=false;
      } else if(methodinstance.interestedin=="Women" || methodinstance.interestedin=="women" || methodinstance.interestedin=="female") 
      {
        methodinstance.interestedin="Women"
        methodinstance.menischecked=false;
        methodinstance.womenischecked=true;
        methodinstance.allischecked=false;
      } else {
        methodinstance.interestedin="Men and Women"
        methodinstance.menischecked=false;
        methodinstance.womenischecked=false;
        methodinstance.allischecked=true;
      }
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

    

    agechange(ev: any) {
      
      this.setsettingdata("age",this.agerange.lower+"-"+this.agerange.upper);
    }

    distancechange(ev: any) {
      this.setsettingdata("distance",this.distancerange);
    }

    updateSettingDatas() {
      console.log("Gender : "+this.gender);
    }

    set70PlusValue(value:any) {
      let returnValue;
      if(value>69){
        returnValue="70+"
      }else{
        returnValue=value;
      }
      return returnValue;
    }

    profilePhotosEdit(){
      
      this.pictureList=[];
      for(var i = 0; i < this.profileImages.length; i++) {
        if(this.profileImages[i].profilepic!=='') {
           this.pictureList.push({image_id:this.profileImages[i].image_id, profilepic:this.profileImages[i].profilepic, isfacebook:this.profileImages[i].isfacebook, position:this.profileImages[i].position, feverate:this.profileImages[i].feverate, deleteicon:0});
        }
      }

      if(this.pictureList.length >1){
        this.isEdit=true;
        this.isProfilePhotosEdit=!this.isProfilePhotosEdit;
      } else{
        this.appdetailsProvider.ShowToast("You can't edit the picture, because you have only one picture.",3000);
      }
    }

    //---------------------------------------updating setting table-------------------------------
   setsettingdata(columnname,value) {
     let methodinstance=this;
     methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE settingsTb set "+columnname+"='"+value+"'",[]).then((data) => {       
      console.log("updated education tb: " + JSON.stringify(data));
      if(methodinstance.isFistTime && this.isFrom !== "loginPage"){
                   methodinstance.isEdit=true;
                 }
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
    }

    goBack(){
      const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
    }

    cancel(){
      this.isEdit=false;
      this.isProfilePhotosEdit=false;
    }

    done(isFromNextButton?,isFromDelete?) {
      let methodinstance=this;
      
      if(this.appdetailsProvider.CheckConnection()){

       if(this.isNewUser) {
           //Send the new person profile pic
           var img = document.getElementById("id_profilepic1");
           this.asyncMethod(img,this.profileImages[0]);
       }

      if(this.isProfilePhotosEdit){

        for (var i = 0; i < 6; i++) {
          if(this.pictureList[i]){
            console.log("image-pos : "+this.pictureList[i].position);
            this.profileImages[i]=this.pictureList[i];
            this.profileImages[i].position= (i+1);
          } else {
            let demoList=[];
            demoList.push({image_id:'', profilepic:'', isfacebook:'', position:+(i+1), feverate:"0", deleteicon:0});
            this.profileImages[i]=demoList[0];
          }
        }
      

      

      for (var j = 0; j < this.profileImages.length; j++) {
        
        //if(methodinstance.profileImages[j].profilepic.length > 0){
          methodinstance.profileImages[j].feverate=j==0?1:0

          this.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set feverate='"+(j==0?1:0)+"', image_id='"+methodinstance.profileImages[j].image_id+"' ,imageurl ='"+methodinstance.profileImages[j].profilepic+"' WHERE position ='"+methodinstance.profileImages[j].position+"'",[]).then((data) => {       
                console.log("INSERTED1123: " + JSON.stringify(data));
                if(data.rowsAffected>0){
                  //methodinstance.isEdit=false;
                  methodinstance.isProfilePhotosEdit=false;
                }
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        //}
      }

      setTimeout(() =>{
        if(isFromNextButton){
          methodinstance.updateUserDetails(true,false,isFromDelete);
        }else{
          methodinstance.updateUserDetails(false,false,isFromDelete);
        }
      },1000);

    } else if(this.appdetailsProvider.CheckConnection()){
        if(isFromNextButton){
          methodinstance.updateUserDetails(true,false,isFromDelete);
        }else{
          methodinstance.updateUserDetails(false,false,isFromDelete);
        }
      }
    } else {
      methodinstance.isProfilePhotosEdit=false;
      methodinstance.isEdit=false;
    }

    }

    updateUserDetails(isFTUE,isFromLogout,isFromDelete?){
    let methodcontext=this;

      methodcontext.appdetailsProvider.ShowLoading();
      

      methodcontext.updateProfileImages();

      
      

      for(var i=0;i< this.profileImages.length;i++){
         this.picturearray.push({image_id:this.profileImages[i].image_id,link:this.profileImages[i].profilepic, image_position:this.profileImages[i].position,primary_picture:i==0?true:false});

      }

      let intrerestedValue="";
      if(this.interestedin==="Men" || this.interestedin==="men") {
        intrerestedValue="male";
      } else if(this.interestedin==="Women" || this.interestedin==="women") {
        intrerestedValue="female";
      } else {
        intrerestedValue="both";
      }


      let body={personal_data:{
       person_id:this.personId,
       fb_id: this.fb_Id,
       person_name:localStorage.getItem("fullName"),
        person_age:this.age, 
        age:this.age, 
        gender:this.gender=="Man"?"male":"female"
        },

       personal_attributes:{
      occupation:this.occupation,
      education:this.education,
      profile_pictures:this.picturearray,
      bio:this.biodata},

      match_settings:{
        match_gender_preference: intrerestedValue,
        match_minimum_age: this.agerange.lower,
        match_maximum_age: this.agerange.upper > 70 ? 100 : this.agerange.upper,
        match_maximum_distance: this.distancerange,
        outnow_match_maximum_distance:this.outnowdistance
      },

      profile_settings: {
        profile_visible: this.profilevisible,
        push_notifications: this.pushnotification,
        app_haptics: this.sound}

     }
      console.log(body);
      

                    let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let requestOptions = new RequestOptions({
      headers: headers
      });
      
      this.http.post(this.appdetailsProvider.personUrl, body,requestOptions)
      .subscribe(
           //success part
            function(response) {
            
            methodcontext.appdetailsProvider.HideLoading();
            
            localStorage.setItem("person_id",JSON.parse(response['_body']).person_id);
            
            methodcontext.isEdit=false;
            
            if(isFromLogout) {
                methodcontext.logoutAction();
            } else if(isFTUE) {
                let  schedulList = localStorage.getItem('schedule_ids_list') ? localStorage.getItem('schedule_ids_list') : ''; //This user all schedul list ids
                
                methodcontext.navCtrl.setRoot(HomePage,{schedule_id:schedulList});
            } else {
                if(!isFromDelete){
                  methodcontext.goBack();
                  methodcontext.appdetailsProvider.ShowToast("Profile updated successfully",2000);
                }
                
                
            }
       },function(error) {
          methodcontext.appdetailsProvider.HideLoading();
          methodcontext.appdetailsProvider.SomethingWentWrongAlert();
       }
      );
    }

    updateProfileImages(){
      
      let methodinstance=this;
      let arrayObj=[];
      
      if(methodinstance.profileImages.length>0){
        localStorage.setItem("profilepic",methodinstance.profileImages[0].profilepic);
      }

      for (var i = 0; i < methodinstance.profileImages.length; i++) {
           if(methodinstance.profileImages[i].profilepic.length > 0){
                  arrayObj.push({image_id: methodinstance.profileImages[i].image_id, image_position: i+1});
           }
      }

      
      
      let body={
                person_id: this.personId,
                images: arrayObj
          }
          
          
          console.log("ProfileImgRequest : "+JSON.stringify(body));
                        let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let requestOptions = new RequestOptions({
      headers: headers
      });
      

          methodinstance.http.post(methodinstance.appdetailsProvider.updateProfileImages, body, requestOptions).subscribe(
           //success part
          function(response) {
           let respBody=JSON.parse(response['_body']);
           
           }, function(error) {
              
           });
    }

    deleteIconClicked(image:any,index){
    
        /*let local_image_id;
        for (var i = 0; i < this.pictureList.length; i++) {
         if(+(this.pictureList[i].position)=== +(index+1)){
           local_image_id=this.pictureList[i].image_id;
           break;
         }
        }*/

        let alert = this.alertCtrl.create({
          subTitle: 'Are you sure you want to delete this image?',
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
                  this.deletePictureAPICall(image.image_id);
                }
              }
            }
          ]
        });
        alert.present();
  }

    deletePictureAPICall(image_id:any) {
    //-----------------Delete API call---------------
      let methodcontext=this;

      let deleteUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage?person_id="+this.personId+"&image_id="+image_id;
      console.log(deleteUrl);
      methodcontext.appdetailsProvider.ShowLoading();

    methodcontext.http.delete(deleteUrl).subscribe(
     //success part
     function(response) {
       methodcontext.appdetailsProvider.HideLoading();
       let respBody=JSON.parse(response['_body']).status;
       console.log(JSON.stringify(respBody));
         if(respBody==='success'){
           
           /*setTimeout(()=>{
             methodcontext.appdetailsProvider.ShowToast("Picture deleted successfully",1000);
           },2000);*/
           methodcontext.isProfilePhotosDeleted=true;

           
           let temp=[];
           for (var i = 0; i < methodcontext.pictureList.length; ++i) {
             if(methodcontext.pictureList[i].image_id!==image_id){
               temp.push(methodcontext.pictureList[i]);
             }
           }
           setTimeout(()=>{
             methodcontext.pictureList=[];
             methodcontext.appdetailsProvider.globleProfileImages=[];
             methodcontext.pictureList=temp;
             methodcontext.appdetailsProvider.globleProfileImages=temp;

             methodcontext.done(false,true);
           },200);
           
           
         }
     }, function(error) {
        methodcontext.appdetailsProvider.HideLoading();
     });
    }

   //----------Profile iamge uploade-----------------
   sendProfileImagesToAPI(personId,base64Image) {
          

      let methodcontext=this;

       let body={person_id: personId,
            image_detail:{
              image_data: base64Image,
              image_position: "1"
          }
        }

      console.log("API_CALL"+JSON.stringify(body));
                  let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let requestOptions = new RequestOptions({
      headers: headers
      });
      
       methodcontext.http.post(methodcontext.appdetailsProvider.sendImageUrl, body,requestOptions).subscribe(
             //success part
       function(response) {

         methodcontext.appdetailsProvider.HideLoading();

         let respBody=JSON.parse(response['_body']);

          
          console.log("sendImageUrl-API Resp "+JSON.stringify(respBody));

             let image_id=respBody.image_id;
             let image_link=respBody.image_link;
             let image_position=respBody.image_position;
             

              //methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
              methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='1'",[]).then((data) => {       
              methodcontext.appdetailsProvider.HideLoading();
              console.log("INSERTED: " + JSON.stringify(data));
              
              
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            
            });
                 
       }, function(error) {   
           methodcontext.appdetailsProvider.HideLoading();                
       });
    }

    logoutAction() {
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
           this.appdetailsProvider.deleteTable("outNowRecentLoactionTb");

           //removing local storage 
           localStorage.clear();

           this.navCtrl.setRoot(LoginPage);
      }
}

  //--------------Uploade photo START-----------------
  presentActionSheet() {
    let methodinstance=this
    let profiledata;
    for (var i = 0; i < methodinstance.profileImages.length; i++) {
      if(methodinstance.profileImages[i].profilepic===""){
        profiledata=methodinstance.profileImages[i];
        break;
      }
    }
    

    
   let actionSheet = this.actionSheetCtrl.create({
     cssClass : "bottomDrawer",
     buttons: [
       {
         text: 'Import from Facebook',
         role: 'destructive',
         handler: () => {
           this.navCtrl.push(Fbphotoupload,{picpos:profiledata,isFromPage:this.isFrom});
           console.log('Destructive clicked');
         }
       },
       {
         text: 'Take a Photo',
         role: 'destructive',
         handler: () => {
          // this.TakePicture(profiledata);
           this.opencamer(profiledata);
           //this.takePicture();
           console.log('Destructive clicked');
         }
       },
       {
         text: 'Choose from Library',
         handler: () => {
          this.SelectPicture(profiledata);
          //this.navCtrl.push(Myphotoupload,{picpos:profiledata});
          console.log('Archive clicked');
         }
       },
       {
         text: 'Cancel',
         role: this.platform.is('ios')==true?'cancel':'',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present();
 }



 opencamer(profiledata){

   let context=this;

  const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.CAMERA,
      correctOrientation:true,
      cameraDirection:this.camera.Direction.FRONT
  }

  context.camera.getPicture(options).then((imageData) => {
   // imageData is either a base64 encoded string or a file URI
   // If it's base64:
   context.appdetailsProvider.ShowLoadingMeg("Uploading profile picture");

   //let base64Image = imageData;
   let base64Image = 'data:image/jpeg;base64,'+imageData;
   profiledata.profilepic=context.defaultImage;
   debugger;
   context.sendProfileImagesToAPI1(context.personId,base64Image,profiledata.position);
   
   /*if (context.platform.is('ios')) {
    context.appdetailsProvider.resizeImage(imageData).then( resizedImage => {
     let base64Image = 'data:image/jpeg;base64,' + resizedImage;
     profiledata.profilepic=context.defaultImage;
     setTimeout(() => {
        context.upload(context.personId,resizedImage,profiledata.position);
      }, 1000);
    });
   } else {

     context.appdetailsProvider.resizeImage(imageData).then( resizedImage => {
     let base64Image = 'data:image/jpeg;base64,' + resizedImage;
     profiledata.profilepic=context.defaultImage;
     setTimeout(() => {
        context.upload(context.personId,resizedImage,profiledata.position);
      }, 1000);
    });

   }*/
   
  }, (err) => {
   console.log(err);
  });
}

  //Select pic from galary/storage
  SelectPicture(profiledata) {
        
        let methodcontext=this;
         const options: CameraOptions = {
              quality: 40,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
              correctOrientation: true
            }
            this.camera.getPicture(options).then((imageData) => {

             //let base64Image = imageData;
             let base64Image = 'data:image/jpeg;base64,'+imageData;
             

             profiledata.profilepic=methodcontext.defaultImage;
             methodcontext.appdetailsProvider.ShowLoadingMeg("Uploading profile picture");
             debugger;
             methodcontext.sendProfileImagesToAPI1(methodcontext.personId,base64Image,profiledata.position);

             //this.uploadServiceProvider.upload(imageData,'D/fnXeLqljCk9A7rgM3cxHiWdaWOhlLyH20jxWH5');

             /*if (this.platform.is('ios')) {
               
               methodcontext.appdetailsProvider.ShowLoadingMeg("Uploading profile picture");

               methodcontext.appdetailsProvider.resizeImage(imageData).then( resizedImage => {
                 
                 profiledata.profilepic=methodcontext.defaultImage;
                 methodcontext.upload(methodcontext.personId,resizedImage,profiledata.position);
               });
             } else {
                 return methodcontext.crop.crop(base64Image, {quality: 100}).then((path) => {

                   methodcontext.appdetailsProvider.resizeImage(path).then( resizedImage => {
                         
                        profiledata.profilepic=methodcontext.defaultImage;
                        methodcontext.appdetailsProvider.ShowLoadingMeg("Uploading profile picture");

                         setTimeout(() => {
                           methodcontext.upload(methodcontext.personId,resizedImage,profiledata.position);
                         },1000);
                   });
                 },(error) => {
                    methodcontext.appdetailsProvider.HideLoading();
                 });
             }*/
             
            }, (err) => {
                methodcontext.appdetailsProvider.HideLoading();
            });
    }
    
   upload(personId,filepath,position) {
    
    let timeOut=false;
    let methodcontext=this;

    setTimeout(()=>{
       if(!timeOut){
         methodcontext.appdetailsProvider.HideLoading();
         methodcontext.appdetailsProvider.ShowCloseButtonToast("We're sorry, we weren't able to complete your request. Please try again." );
         methodcontext.syncUserProfilePictures(personId);
       }
     },30000);

   AWS.config.update({ accessKeyId: 'AKIAIFNQEZP6K3KKCOIA', secretAccessKey: 'D/fnXeLqljCk9A7rgM3cxHiWdaWOhlLyH20jxWH5',region: 'us-east-1'})
   
   var s3 = new AWS.S3();
   
    this.file.resolveLocalFilesystemUrl(filepath)
            .then((entry: any) => {
              
                entry.getParent((directoryEntry: any) => {
                    this.file.readAsArrayBuffer(directoryEntry.nativeURL, entry.name)
                        .then((imageData: any) => {
                             
                             var params1 = {
                                            Bucket: 'woowootempholding',
                                            Key: personId,
                                            Body: imageData,
                                            ContentType: 'image/jpg'
                                          }
                            
                          
                            s3.putObject(params1, function (err, resp) {
                               
                               methodcontext.appdetailsProvider.ShowLoadingMeg("Updating...!!",true);
                               if (err) {
                                  timeOut=true;
                                  methodcontext.appdetailsProvider.HideLoading();
                                  methodcontext.appdetailsProvider.SomethingWentWrongAlert();
                                  console.log("ERR = " + err.message);
                                } else {
                                  timeOut=true;
                                  setTimeout(() => {
                                    console.log('Successfully uploaded Image.'+resp);
                                    methodcontext.syncUserProfilePictures(personId);
                                  },1000);
                                }
                    
                           });  

                        })
                        .catch((error) => {
                            console.log('Can not read file: ' + JSON.stringify(error));
                            methodcontext.appdetailsProvider.HideLoading();
                        });
                    
                }, (error) => {
                    console.log('Can not resolve file directory: ' + JSON.stringify(error));
                    methodcontext.appdetailsProvider.HideLoading();
                });
            })
            .catch((error) => {
                console.log('Can not resolve file path: ' + JSON.stringify(error));
                methodcontext.appdetailsProvider.HideLoading();
            })

  }

  count:any=0;

  syncUserProfilePictures(personId:any) {
    let methodcontext=this;
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});

    let previesImageListSize = methodcontext.pictureList.length;
                                                 
   let requestOptions = new RequestOptions({headers: headers});
   methodcontext.http.get(methodcontext.appdetailsProvider.uerdataUrl+personId, requestOptions).subscribe(
   //success part
   function(response) {

      let personDetails=JSON.parse(response['_body']).personal_attributes.profile_pictures;

      console.log(JSON.stringify(personDetails));

      console.log("pictureList ArrayLenght : "+ methodcontext.pictureList.length);

      for (var i = 0; i < personDetails.length; i++) {
          
          /*--------------Store the image to loacl db ---------------------*/
          methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+personDetails[i].link+"' , image_id='"+personDetails[i].image_id+"'  WHERE position ='"+personDetails[i].image_position+"'",[]).then((data) => {       
                                                                    
          console.log("INSERTED: " + JSON.stringify(data));
          console.log("Successfully uploaded data to myBucket/myKey");

          }, (error) => {
            methodcontext.appdetailsProvider.SomethingWentWrongAlert();
            console.log("ERROR: " + JSON.stringify(error.err));
          });
          }

          setTimeout(() => {
                                                
            methodcontext.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb ORDER BY position ASC", []).then((data) => {
                       
            console.log("Get profilepicTb imgs & lenght is "+data.rows.length);

             if(data.rows.length > 0) {
                methodcontext.profileImages=[];
                methodcontext.pictureList=[];
                methodcontext.appdetailsProvider.globleProfileImages=[];
                for(var i = 0; i < data.rows.length; i++) {
                  methodcontext.profileImages.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate, deleteicon:0});
                  methodcontext.appdetailsProvider.globleProfileImages.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate, deleteicon:0});

                  if(data.rows.item(i).feverate==='1'){
                     methodcontext.profilePic=data.rows.item(i).imageurl;
                  }
                  if(data.rows.item(i).imageurl!=='') {
                     methodcontext.pictureList.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate, deleteicon:0});
                  }
                }

              } 
            }, (error) => {
                 methodcontext.appdetailsProvider.HideLoading();
                 console.log("ERROR: " + JSON.stringify(error));
            });

            setTimeout(() => {
              //-------------Recursing the get person API cal every 1.5 sec for 5 time ---------
              
              if(previesImageListSize === methodcontext.pictureList.length && methodcontext.count < 5){
                methodcontext.count = methodcontext.count + 1;
                methodcontext.syncUserProfilePictures(personId);
                //methodcontext.appdetailsProvider.ShowToast("Count : "+methodcontext.count,2000);
              } else {
                methodcontext.count = 0;
                methodcontext.appdetailsProvider.HideLoading();
              }
            },1000);

          },1000);
      },function(error) { 
        methodcontext.appdetailsProvider.HideLoading();
        
      });
                                                
  }

  sendProfileImagesToAPI1(personId,base64Image,position) {
    
    let methodcontext=this;
    let body={person_id: personId,
          image_detail:{
            image_data: base64Image,
            image_position: position
        }
     }
     
    console.log("API_CALL"+JSON.stringify(body));
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers}); 

    methodcontext.http.post(methodcontext.appdetailsProvider.sendImageUrl, body,requestOptions).subscribe(
           //success part
     function(response) {

       let respBody=JSON.parse(response['_body']);
       
        
        console.log("sendImageUrl-API Resp "+JSON.stringify(respBody));

           let image_id=respBody.image_id;
           let image_link=respBody.image_link;
           let image_position=respBody.image_position;

           setTimeout(() => {
              methodcontext.syncUserProfilePictures(personId);
              methodcontext.appdetailsProvider.HideLoading();
            },1000);

            //methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
            /*methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
            
            console.log("INSERTED: " + JSON.stringify(data));

          }, (error) => {
              methodcontext.appdetailsProvider.HideLoading();
              methodcontext.appdetailsProvider.SomethingWentWrongAlert();
              console.log("ERROR: " + JSON.stringify(error.err));
          
          });*/
               
     }, function(error) { 
        methodcontext.appdetailsProvider.HideLoading();
        
              
     });
  }

  async asyncMethod(img,profiledata){
      
      let base=await this.imgToBase64(img);
      this.base64image=base;
            
      this.sendProfileImagesToAPI1(this.personId,this.base64image,'1');
    }

    //Convert image to base 64 start
  @ViewChild('canvasforbase') canvasRef;
  imgToBase64(imageTag): Promise<any>  {
    
    return new Promise<any>(resolve => {
      let canvas = this.canvasRef.nativeElement;
      let context = canvas.getContext('2d');
      canvas.height = imageTag.naturalHeight;
      canvas.width = imageTag.naturalWidth;
      context.drawImage(imageTag, 0, 0);  
      let b=canvas.toDataURL();
      //return b; 
      resolve(b);
    }); 
  }

 //-------------- Uploade photo END -----------------


 //-------------- Lezy loading start-----------------
 
  createThumbnail(bigImg:any) {
    
    let smallImg='';
    this.generateFromImage(bigImg, 10, 10, 0.2, data => {
      
      return smallImg = data;
    });
  }

  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
   debugger
    var canvas: any = document.createElement("canvas");
    var image = new Image();
 
    image.onload = () => {
      var width = image.width;
      var height = image.height;
 
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
 
      ctx.drawImage(image, 0, 0, width, height);
 
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
 
      callback(dataUrl)
    }
    image.src = img;
  }
 
 //-------------- Lezy loading end-----------------



 //--------------- Instagram Code start -----------
 instagramlogin(){

    let context=this;
    if(this.appdetailsProvider.CheckConnection()){
    
      let val="https://api.instagram.com/oauth/authorize/?client_id=8e1316dd4f3e4c7cb1207d37f1c8a119&redirect_uri=https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/login/instagram?person_id="+this.personId+"&response_type=code"
      console.log(val);
      context.oauth.logInVia(context.instagramProvider).then((success) => {

          console.log("Instagram Login Responce : -> "+JSON.stringify(success));
          

          //context.userdetailsProv.ShowLoading();
          context.appdetailsProvider.ShowLoading();

          /* Returns User uploaded Photos */
          context.getInstagramUserInfo(success).subscribe(response => context.instagramResponse=response.data);

          

          setTimeout(function(){
            console.log("Instagram Response :-> "+context.instagramResponse);
              
              if(context.instagramResponse){
                context.appdetailsProvider.HideLoading();
                if(context.instagramResponse.length > 0){
                    context.addInstagramImagesToLocalTb(context.instagramResponse);
                } 
              } else {
                setTimeout(function(){
                  try {
                  context.appdetailsProvider.HideLoading();
                  if(context.instagramResponse.length > 0){
                    context.addInstagramImagesToLocalTb(context.instagramResponse);
                  } 
                } catch(Exception) {
                  context.appdetailsProvider.SomethingWentWrongAlert();
                }
                },5000);
              }
              
              
          }, 5000);

        }, (error) => {
          
          console.log(JSON.stringify(error));
      });
    }
  }

  
getInstagramUserInfo(response) {
    //GET USER PHOTOS
    return this.http.get('https://api.instagram.com/v1/users/self/media/recent?access_token=' + response.access_token)
    .map((res:Response) => res.json());
}  

  

instagramDisconnect() {
  let context=this;
    let alert = this.alertCtrl.create({
      subTitle: "Are you sure you want to disconnect instagram?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Saved clicked');
            context.isInstgramLoggedIn=true;
            context.appdetailsProvider.globleInstagramImages=[];
            context.InstagramImages=[];
            context.appdetailsProvider.deleteTable("instagramImagesTb");
          }
        }
      ]
    });
  alert.present();
}

addInstagramImagesToLocalTb(imageList){
  let methodcontext=this;

  for(var i = 0; i < imageList.length; i++ ){
      try {
          let id=imageList[i].id;
          let standard=imageList[i].images.standard_resolution.url;
          let low=imageList[i].images.low_resolution.url;
          let thumbnail=imageList[i].images.thumbnail.url;

          methodcontext.InstagramImages.push({standard_resolution:standard,
                                             low_resolution:low,
                                             thumbnail:thumbnail
                                             });

          methodcontext.appdetailsProvider.globleInstagramImages.push({standard_resolution:standard,
                                             low_resolution:low,
                                             thumbnail:thumbnail
                                             });
          methodcontext.isInstgramLoggedIn = false;

          setTimeout(() => {
            methodcontext.content.scrollToBottom();
          },1000);

          methodcontext.appdetailsProvider.getDbInstance().executeSql("INSERT INTO instagramImagesTb( id, thumbnailImg, lowImg, standardImg) VALUES (?,?,?,?)",[id, thumbnail, low, standard ]).then((data) => {        
                      console.log("INSERTED: " + JSON.stringify(data));
                  }, (error) => {
                       console.log("ERROR: " + JSON.stringify(error.err));
          
                  });
      } catch(Exception) {
        
        console.log("Error is occured in addInstagramImagesToLocalTb");
      }
  }
}

getInstagramImagesFromLocalTb() {
  let methodcontext=this;
  methodcontext.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM instagramImagesTb", []).then((data) => {
                       
            console.log("Get instagramImagesTb imgs & lenght is "+data.rows.length);

             if(data.rows.length > 0) {
                  methodcontext.InstagramImages=[];
                  methodcontext.appdetailsProvider.globleInstagramImages=[];
                  for(var i = 0; i < data.rows.length; i++) {
                  methodcontext.profileImages.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate, deleteicon:0});

                
                methodcontext.InstagramImages.push({standard_resolution:data.rows.item(i).standardImg,
                                                         low_resolution:data.rows.item(i).lowImg,
                                                         thumbnail:data.rows.item(i).thumbnailImg
                                                         });

                methodcontext.appdetailsProvider.globleInstagramImages.push({standard_resolution:data.rows.item(i).standardImg,
                                                               low_resolution:data.rows.item(i).lowImg,
                                                               thumbnail:data.rows.item(i).thumbnailImg
                                                               });
                methodcontext.isInstgramLoggedIn=false;

                }

              } 
            }, (error) => {
                 console.log("ERROR: " + JSON.stringify(error));
            });
}
 //--------------- Instagram Code end -------------


 takePicture() {
   debugger;
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 1000,
            targetHeight: 1000,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then((uri) => {
          debugger;
            const fileTransfer: FileTransferObject = this.transfer.create();

            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: uri.substr(uri.lastIndexOf('/') + 1),
                chunkedMode: true,
                headers: {'x-access-token': localStorage.getItem("authoKey")},
                /*params: {
                    metadata: {foo: 'bar'},
                    token: 'D/fnXeLqljCk9A7rgM3cxHiWdaWOhlLyH20jxWH5'
                }*/
            };
            let loader = this.loading.create({
                content: 'Uploading ...',
            });
            loader.present().then(() => {
                let s3UploadUri = 'https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/settings/foldercreds';
                fileTransfer.upload(uri, s3UploadUri, options).then((data) => {
                    let message;
                    let response = JSON.parse(data.response);
                    debugger;
                    if (response['status']) {
                        message = 'Picture uploaded to S3: ' + response['key']
                    } else {
                        message = 'Error Uploading to S3: ' + response['error']
                    }
                    loader.dismiss();
                    this.appdetailsProvider.ShowToast(message,3000);
                }, (err) => {
                  debugger;
                    loader.dismiss();
                    this.appdetailsProvider.ShowToast('Error',3000);
                });
            });
        });
    }

}
