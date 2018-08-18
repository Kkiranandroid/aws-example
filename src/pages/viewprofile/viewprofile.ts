import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

/**
 * Generated class for the ViewprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewprofile',
  templateUrl: 'viewprofile.html',
})
export class ViewprofilePage {
  profileImages:any[]=[];
  imagesArray:any[]=[];
  myFullName:any;
  myAge:any;
  occupation:any;
  education:any;
  bio:any;
  name:any;
  gender:any;
  interestedin:any;

  selectedLocation:any;
  selectedCity:any;
  geo_value:any;

  defaultImage:any= 'assets/imgs/imagecoming.png';
  offset:any  = 100;

  constructor(public navCtrl: NavController,
  	          public appdetailsProvider: AppdetailsProvider, 
    		  public viewCtrl: ViewController, 
  			  public navParams: NavParams) {
    debugger;
  	if(appdetailsProvider.globleProfileImages.length>0){
  		this.profileImages=[];
        this.profileImages=appdetailsProvider.globleProfileImages;
        for (var i = 0; i < appdetailsProvider.globleProfileImages.length; i++) {
          if(appdetailsProvider.globleProfileImages[i].profilepic!==''){
          this.imagesArray.push(appdetailsProvider.globleProfileImages[i]);
          }
        }
  	}else{
  		this.getprofileData();
  	}

  	this.getUserDetails();
    this.getBioeData();
  	this.getsettingData();
  }

//-----------------getting Profile images from profile picture table START-----------------
  getprofileData() {
      
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb ORDER BY position ASC", []).then((data) => {
             
             if(data.rows.length > 0) {

             methodinstance.appdetailsProvider.globleProfileImages=[];
             for(var i = 0; i < data.rows.length; i++) {
               debugger;
               methodinstance.appdetailsProvider.globleProfileImages.push({ image_id:data.rows.item(i).image_id, 
               																profilepic:data.rows.item(i).imageurl, 
               																isfacebook:data.rows.item(i).isfacebook, 
               																position:(data.rows.item(i).position), 
               																feverate:data.rows.item(i).feverate, 
               																deleteicon:0});
                if(methodinstance.appdetailsProvider.globleProfileImages[i].profilepic!==''){
                 this.imagesArray.push(methodinstance.appdetailsProvider.globleProfileImages[i]);
                }
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
//-----------------getting Profile images from profile picture table END-----------------


//-----------------getting information from User table START-----------------
  getUserDetails(){
         this.myFullName=localStorage.getItem("fullName");
         this.myAge=localStorage.getItem("age");
      	 this.occupation=localStorage.getItem("occupation")==null?"":localStorage.getItem("occupation");
      	 this.education= localStorage.getItem("education")==null?"":localStorage.getItem("education");

         this.selectedLocation=localStorage.getItem('selectedLocation');
         this.selectedCity=localStorage.getItem('selectedCity');
        this.geo_value=localStorage.getItem('geo_value');
  }

  getBioeData(){
     let methodinstance=this;
       methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM userTb", []).then((data) => {
         debugger;
         if(data.rows.length > 0) {
              methodinstance.bio=data.rows.item(0).bio;
              methodinstance.name=data.rows.item(0).name;
              methodinstance.gender=data.rows.item(0).gender==="male"?"Man":"Women";
         }
        }, (error) => {
            console.log("ERROR123 : " + JSON.stringify(error));
        });

  }
//-----------------getting information from setting table END-----------------


  //-----------------getting information from setting table START-----------------
  getsettingData(){
             
     let methodinstance=this;
        methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM settingsTb", []).then((data) => {
         
       //methodinstance.profilevisible=data.rows.item(0).profilevisible;
       methodinstance.interestedin=data.rows.item(0).interestedin;
       //methodinstance.age.lower=data.rows.item(0).age.split("-")[0];
       //methodinstance.age.upper=data.rows.item(0).age.split("-")[1];

       /*methodinstance.agerange = { lower:data.rows.item(0).age.split("-")[0] , upper: data.rows.item(0).age.split("-")[1] };
       methodinstance.pushnotification=data.rows.item(0).pushnotification;
       methodinstance.sound=data.rows.item(0).sound;
       methodinstance.distancerange=data.rows.item(0).distance;
       methodinstance.outnowdistance=data.rows.item(0).outnowdistance;*/

       if(methodinstance.interestedin=="men" || methodinstance.interestedin=="Men" || methodinstance.interestedin=="male")
       {
        methodinstance.interestedin="Men";
      } else if(methodinstance.interestedin=="Women" || methodinstance.interestedin=="women" || methodinstance.interestedin=="female") 
      {
        methodinstance.interestedin="Women"
      } else {
        methodinstance.interestedin="Men and Women"
      }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
  }
 //-----------------getting information from setting table END-----------------

  closeIcon(){
  	const index = this.viewCtrl.index;
  	this.navCtrl.remove(index);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewprofilePage');
  }

}
