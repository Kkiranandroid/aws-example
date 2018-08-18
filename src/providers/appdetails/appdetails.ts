import { Injectable } from '@angular/core';
/*import { Http } from '@angular/http';*/
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { LoadingController,AlertController,Platform,ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';

import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

import { Network } from '@ionic-native/network';


//import { FlurryAnalytics, FlurryAnalyticsObject, FlurryAnalyticsOptions,FlurryAnalyticsLocation } from '@ionic-native/flurry-analytics';


/*
  Generated class for the AppdetailsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var navigator: any;

@Injectable()
export class AppdetailsProvider {

   loading:any;
   toast:any;
   dateindb:any;

   matchsList:any;

   cardListArray:any[]=[];
   profileImages:any[]=[];
   globleProfileImages:any[]=[
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:1,feverate:'',deleteicon:0},
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:2,feverate:'',deleteicon:0},
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:3,feverate:'',deleteicon:0},
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:4,feverate:'',deleteicon:0},
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:5,feverate:'',deleteicon:0},
        {image_id:'',profilepic:'assets/imgs/imagecoming.png',isfacebook:false,position:6,feverate:'',deleteicon:0}
  ];
   globleInstagramImages:any[]=[];

   location:any="England, United Kingdom";
   city:any="Portsmouth";

   firebase_token:any;
   rootContext:any;

   modalpresent=false;
   notificationType:any='';

   netwSpeed:any=0;

   IMAGE_HEIGHT:any=200;
   IMAGE_WIDTH:any=200;

   //flurryAnalyticsObject:FlurryAnalyticsObject;
   

   mapKey="AIzaSyBokAhy2i2u2Ra9Vxw17xu5fCR2ZyBEBmA";

   fbUerdataUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person?fbid=";
   uerdataUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person?person_id=";
   personUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person";
   //scheduledlisturl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule?pid=sakdhksadkasn";
   scheduledlisturl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule?person_id=";
   addschedule="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule";
   //sendImageUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage";
   sendImageUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage/add";
   swipeCardUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/swipe";
   matchesUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/matches";
   updateProfileImages="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage/edit";
   getOccupationUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/occupations?person_id=";
   getEducationUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/education?person_id=";
   getMatches="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/matches?person_id=";
   getConversionList="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation?person_id=";
   createConversation="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation";
   getConversationDetails="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation/conversationdetail?person_id=";
   reportUser="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/reportuser";
   createDevice="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/device";
   updateDevice="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/device?device_id=";
   fileUploadUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/settings/foldercreds";
   authenticationUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/login?fb_id="
   deleteProfileImage="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage?person_id={Person ID}&image_id=";
   getRecentLocations="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/locations";

  constructor(public http: Http,
              public loadingCtrl: LoadingController,
              public alertCtrl:AlertController,
              public platform:Platform,
              public toastCtrl: ToastController,
              public sqlite: SQLite,
              public firebase: Firebase,
              public device: Device,
              private imageResizer: ImageResizer,
              public network: Network,
              //public flurryAnalytics: FlurryAnalytics,
              private file: File) {
     this.createTable();
     this.getCartItemArray();

     //this.loadJsonFile();

      /*this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
          this.netwSpeed=network.downlinkMax;
          console.log("Network speed : "+this.netwSpeed);
          
          if (network.type === 'wifi') {
             console.log('we got a wifi connection, woohoo! '+network.downlinkMax);
          }
      }, 3000);
      });*/
     
  }


  getCartItemArray() {
          let methodinstance=this;
          let schedulList=localStorage.getItem('schedule_ids_list');
          let personId = localStorage.getItem("person_id");

          if(!schedulList){
            schedulList="";
            return;
          }

          /*let respBody=this.matchsList;
            methodinstance.cardListArray=[];
            methodinstance.cardListArray=respBody;*/

          debugger;
           let body={
                  person_id: personId,
                  schedule_ids: schedulList.split(","),
                  network_speed : this.ConnectionSpeed()
           }

           let body1={
              person_id:"0af234ee-d800-191d-5ca2-40f8445e8bea",
              schedule_ids:["431bdac2-a606-65fe-4e2f-5ad151c378f8","4deb8c34-d01f-76fe-a015-8d844c9ca67b"]
           }
           console.log(body);
           console.log(body1);
    

         let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let options = new RequestOptions({
      headers: headers
      });

           methodinstance.http.post(methodinstance.matchesUrl, body, options)
          .subscribe(
               //success part
                function(response) {
                debugger;
                let respBody=JSON.parse(response['_body']);
                methodinstance.cardListArray=[];
                methodinstance.cardListArray=respBody;
           },function(error) { 
            debugger;
            methodinstance.getCartItemArray();
           }
          );
  }


  /*loadeLocalImages(){
     let context=this;
     context.file.listDir(context.file.externalRootDirectory,'').then((data)=> {
         for(var i = 0; i < data.length; i++) {
            let dirName=data[i].fullPath.replace("/","").replace("/","");
            context.getImageFromDir(context.file.externalRootDirectory,dirName,0);
         }
     }, (err) => {
    });
  }*/

 getImageFromDir(root,dirName,packegeLevel) {
 let context=this;
    context.file.listDir(root,dirName).then((data)=> {
        for(var j = 0; j < data.length; j++) {
        if(data[j].name.charAt(0)!="."){
          if(data[j].isFile==true){

            if(data[j].nativeURL.search(".jpg") > -1 || data[j].nativeURL.search(".png") > -1){
                  //console.log('Image :--> '+data[j].nativeURL+" Directory "+dirName);
                   //context.localImages.push({imageUrl:data[j].nativeURL});

                   this.getDbInstance().executeSql('REPLACE INTO localImagesTb(imageurl, directory) VALUES (?,?)', 
                   [data[j].nativeURL,dirName],)
                    .then((data) => {
                        console.log('Add localImagesTb to DB '+data);
                        
                    }) .catch(e => {
                        console.log(e)
                    });

            }//end if condition
          } else {
              let maindirpath=data[j].nativeURL.slice(0,-1);
              let dirpath=maindirpath.slice(0,maindirpath.lastIndexOf("/")+1);
              let dirnames=data[j].name;
             
              debugger;
              context.file.listDir(dirpath,dirnames).then((data)=>{
              debugger;
                      for(var i = 0; i < data.length; i++) {
                       if(data[i].name.charAt(0)!=".") {
                        if(data[i].isFile==true) {

                          if(data[i].nativeURL.search(".jpg") > -1 || data[i].nativeURL.search(".png") > -1) {
                                console.log('Image :--> '+data[i].nativeURL+" Directory "+dirnames);
                                 //context.localImages.push({imageUrl:data[i].nativeURL});

                                 this.getDbInstance().executeSql('REPLACE INTO localImagesTb(imageurl, directory) VALUES (?,?)', 
                                 [data[i].nativeURL,dirnames],)
                                  .then((data) => {
                                      debugger;
                                      console.log('Add localImagesTb to DB '+data);
                                      
                                  }) .catch(e => {
                                      debugger;
                                      console.log(e)
                                  });

                          }//end if condition
                        }
                       }

                      }

                  }, (err) => {
                  });
            }
        }

        }

    }, (err) => {
    });
 }

 //  file:///storage/emulated/0/Pictures/Screenshot


   //to show the loading symbol
   ShowLoading(){
        this.loading = this.loadingCtrl.create({ content: 'Please wait...' });//Create loading
        this.loading.present();//Start loading symbol
   }
   ShowLoadingMeg(mes:any,isChecngContent?){
     debugger;
      if(!isChecngContent){
        this.loading = this.loadingCtrl.create({ content: mes });//Create loading
        this.loading.present();//Start loading symbol
      } else {

        this.loading.data.content = mes;
        //this.loading.setContent(mes);
        //this.loading.present();//Start loading symbol
      }
   }
   ShowLoadingnew(){
       this.loading = this.loadingCtrl.create({ content:'Loading...'});//Create loading
       this.loading.present();//Start loading symbol
   }

    //to hide the loading symbol
   HideLoading(){
        this.loading.dismiss();
   }

   ShowCloseButtonToast(mes){
         let alert = this.alertCtrl.create({
          title:'Connection Error!',
          subTitle: mes,
          buttons: [
            {
              text: 'OK',
              handler: data => {
                console.log('Saved clicked');
              }
            }
          ]
        });
        alert.present();
    }

   ShowToast(mes,duration){
        if(duration==null||duration==undefined||duration=="")
        {
            duration=3000;
        }
  
        this.toast = this.toastCtrl.create({
            message: mes,
            duration: duration,
            position: 'bottom',
           
          });

         this.toast.onDidDismiss(() => {
           
          });
         this.toast.present();
    }

    getDbInstance(){
        return this.dateindb;
    }


    createTable(){

    this.sqlite.create({
    name: 'datein.db',
          location: 'default'
          }) .then((db: SQLiteObject) => {

            this.dateindb=db;

          //----------------------------------- User Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS userTb(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(10),gender VARCHAR(10),location VARCHAR(100),bio VARCHAR(100),age VARCHAR(10),birthday VARCHAR(20),pictureurl VARCHAR(100),facebookId VARCHAR(30))', {})
            .then((data) => {
                        db.executeSql('CREATE UNIQUE INDEX myindexuser ON userTb(facebookId)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for userTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });

                  })
                  .catch(e => {
                 
                  console.log(e)
                  });

          //----------------------------------- Education Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS educationTb(educationId VARCHAR(10),schoolName VARCHAR(100),type VARCHAR(20),year VARCHAR(100),ischecked VARCHAR(10))', {})
            .then((data) => {
                        db.executeSql('CREATE UNIQUE INDEX myindexeducation ON educationTb(schoolName)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for educationTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });
                  })
                  .catch(e => {
                 
                  console.log(e)
                  });



          //----------------------------------- Work(occupesion) Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS workTb(workId VARCHAR(10),company VARCHAR(100),position VARCHAR(20),location VARCHAR(100),ischecked VARCHAR(10),isfacebook VARCHAR(10))', {})
            .then((data) => {
                        db.executeSql('CREATE UNIQUE INDEX myindexwork ON workTb(position)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for workTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });

                  })
                  .catch(e => {
                  console.log(e)
                  });


          //----------------------------------- Photos Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS photosTb(photoId VARCHAR(10),imageUrl VARCHAR(100))', {})
            .then((data) => {
                        db.executeSql('CREATE UNIQUE INDEX myindexphoto ON photosTb(photoId)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for photoTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });

                  })
                  .catch(e => {
                 
                  console.log(e)
                  });


            //-------Profile Table----------
              db.executeSql('create table IF NOT EXISTS profilepicTb(id INTEGER PRIMARY KEY AUTOINCREMENT,image_id VARCHAR(200), imageurl VARCHAR(200),isfacebook VARCHAR(10), position VARCHAR(30), feverate VARCHAR(30))', {})
            .then((data) => {
                  
                    db.executeSql('CREATE UNIQUE INDEX myindexprofilepicTb ON profilepicTb(position)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for profilepicTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });

                  })
                  .catch(e => {
                 
                  console.log(e)
                  });

         

            //-------Local images Table----------
              db.executeSql('create table IF NOT EXISTS localImagesTb(imageurl VARCHAR(300),directory VARCHAR(10))', {})
            .then((data) => {

                  db.executeSql('CREATE UNIQUE INDEX myindexlocalImages ON localImagesTb(imageurl)', {})
                        .then(() => {
                        console.log('Executed CREATE UNIQUE INDEX for localImagesTb');
                        })
                        .catch(e => {
                        console.log(e);
                        });

                  })
                  .catch(e => {
                 
                  console.log(e)
                  });

            //-------settings Table----------
                  db.executeSql('create table IF NOT EXISTS settingsTb(id INTEGER PRIMARY KEY AUTOINCREMENT, profilevisible VARCHAR(10),interestedin VARCHAR(10), age VARCHAR(20), pushnotification VARCHAR(20), sound VARCHAR(20), distance VARCHAR(20), outnowdistance VARCHAR(20))', {})
                .then((data) => {
                      console.log('Executed CREATE UNIQUE INDEX for settingsTb');
        
                      })
                      .catch(e => {
                     
                      console.log(e)
                      });


            //-------recentLoactionTb Table----------
                  db.executeSql('create table IF NOT EXISTS recentLoactionTb(id INTEGER PRIMARY KEY AUTOINCREMENT, city VARCHAR(50),state VARCHAR(50), contry VARCHAR(50), priority VARCHAR(10) DEFAULT 0 )', {})
                .then((data) => {
                      db.executeSql('CREATE UNIQUE INDEX myindexrecentlocal ON recentLoactionTb(city)', {})
                        .then(() => {
                          console.log('Executed CREATE UNIQUE INDEX for recentLoactionTb');
                        })
                        .catch(e => {
                          console.log(e);
                        });
        
                      })
                      .catch(e => {
                     
                      console.log(e)
                      });
            //-------outNowRecentLoactionTb Table----------
                  db.executeSql('create table IF NOT EXISTS outNowRecentLoactionTb(id INTEGER PRIMARY KEY AUTOINCREMENT, city VARCHAR(50),state VARCHAR(50), contry VARCHAR(50), priority VARCHAR(10) DEFAULT 0 )', {})
                .then((data) => {
                      db.executeSql('CREATE UNIQUE INDEX myindexrecentlocal ON outNowRecentLoactionTb(city)', {})
                        .then(() => {
                          console.log('Executed CREATE UNIQUE INDEX for outNowRecentLoactionTb');
                        })
                        .catch(e => {
                          console.log(e);
                        });
        
                      })
                      .catch(e => {
                     
                      console.log(e)
                      });

            //-------instagramImagesTb Table----------
                  db.executeSql('create table IF NOT EXISTS instagramImagesTb(id INTEGER, thumbnailImg VARCHAR(300),lowImg VARCHAR(300), standardImg VARCHAR(300))', {})
                .then((data) => {
                      db.executeSql('CREATE UNIQUE INDEX myindexinstagramImages ON instagramImagesTb(id)', {})
                        .then(() => {
                          console.log('Executed CREATE UNIQUE INDEX for instagramImagesTb');
                        })
                        .catch(e => {
                          console.log(e);
                        });
        
                      })
                      .catch(e => {
                     
                      console.log(e)
                      });




         

          }).catch(e => {
              
        });
    }



    deleteTable(tableName) {

      this.dateindb.executeSql("delete from "+ tableName,[]).then((data) => {

      console.log('Executed CREATE UNIQUE INDEX for settingsTb');
      }).catch(e => {

        console.log(e);
      });
    }

     SomethingWentWrongAlert(){
         //   this.HideLoading();
            this.ShowToast("Something went wrong, please try again",3000)
                    return false;
     }

     //to check the intenet connection
      CheckConnection(){
            if(navigator.connection!=undefined) {
                if(navigator.connection.type=="none") {
                    this.ShowToast("Internet is disabled, please enable internet",3000)
                    return false;
                } else {
                    return true;
                }
            } else {
                //if opened in browser
                return true;
            }
      }


      //To check the intenet connection
      CheckConnectionWithoutMessage(){
            if(navigator.connection!=undefined) {
                if(navigator.connection.type=="none") {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
      }


      //To check the internet connection
      ConnectionSpeed(){
        try {
          let val=navigator.onLine;
          if(this.network.downlinkMax) {
             return this.network.downlinkMax;
          } else {
             return 0;
          }
        } catch(Exception){
          return 0;
        }
      }


      getScheduledData() {
      debugger;

     let methodinstance=this;
           let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let options = new RequestOptions({
      headers: headers
      });
     this.http.get(this.scheduledlisturl+localStorage.getItem("person_id"),options).subscribe(
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
                localStorage.setItem('schedule_ids_list',"");
                localStorage.setItem('schedule_dates_list',"");
                for (var i = 0; i < temp.length; i++) {                
                      tempScheduleIdsList = tempScheduleIdsList===""?temp[i].schedule_id : tempScheduleIdsList+","+temp[i].schedule_id;
                      tempScheduleDateList = tempScheduleDateList===""?temp[i].schedule_startdate : tempScheduleDateList+","+temp[i].schedule_startdate;
                  }
                 setTimeout(() => {
                 localStorage.setItem('schedule_ids_list',tempScheduleIdsList);
                 localStorage.setItem('schedule_dates_list',tempScheduleDateList);
                 }, 1000);
              }
        }
       },
            function(error) {
            debugger;
            }
        );
    }


    setFcmTokenId() {
            if (this.platform.is('cordova')){
                 this.platform.ready().then(() => {
                    this.firebase.getToken().then(token=> {
                      console.log(" ---FCM Token--- ");
                      console.log(token); // save the token server-side and use it to push notifications to this device
                      if(token==null || token=="") {
                          this.setFcmTokenId();
                      } else {
                       this.firebase_token=token;
                       localStorage.setItem("firebase_token", this.firebase_token);
                      }
                    });
                 });
            }
    }

    getDeviceDetails() {
      console.log("---- Device details ----");
      console.log("UUID : "+this.device.uuid+"\nModel : "+this.device.model+"\nPlatform : "+this.device.platform+"\nManufacturer : "+this.device.manufacturer+"\nSerial : "+this.device.serial+"\nVersion : "+this.device.version+"\n");

      localStorage.setItem("device_uuid", this.device.uuid);
      localStorage.setItem("device_model", this.device.model);
      localStorage.setItem("device_platform", this.device.platform);
      localStorage.setItem("device_version", this.device.version);
      localStorage.setItem("device_manufacturer", this.device.manufacturer);
      localStorage.setItem("device_serial", this.device.serial);
    }

    sendFcmIdToServer(personId:any) {
      let body = {
        person_id: personId,
        device_id:localStorage.getItem("device_uuid"),
        firebase_token:localStorage.getItem("firebase_token"),
        device_make:localStorage.getItem("device_manufacturer"),
        device_model:localStorage.getItem("device_model"),
        device_platform:localStorage.getItem("device_platform"),
        device_version:localStorage.getItem("device_version")
      }

      console.log("RegisterDevicesFcm-Req :-->"+JSON.stringify(body));
      let methodcontext=this;
          let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let options = new RequestOptions({
      headers: headers
      });
      this.http.post(this.createDevice, body,options).subscribe(
      //success part
        function(response) {
          console.log("RegisterDevicesFcm-Resp :-->"+JSON.stringify(response));
          debugger;

        },function(error) { 
          console.log("RegisterDevicesFcm-Error :-->"+JSON.stringify(error));
          debugger;
        }
      );
    }

    loadJsonFile() {
        console.log('json called');
        let context=this;
        debugger;

            context.http.get('assets/data/matchesApiResp.json')
                   .map(res => res.json())
                   .subscribe(data => { 
                    debugger;
                    context.matchsList = data;
                    console.log(data);
                   });
    }


  resizeImage(url) {
      let options;
        if (this.platform.is('ios')) {
          options = {
           uri: url,
           fileName: 'tempImage',
           quality: 50,
           width: 250,
           height: 250,
           base64 : false
          } as ImageResizerOptions;
        } else {
          options = {
           uri: url,
           folderName: 'WooWoo',
           fileName: 'tempImage',
           quality: 50,
           width: 250,
           height: 250,
          } as ImageResizerOptions;
        }

      return new Promise( (resolve, reject) => {
        this.imageResizer.resize(options).then((filePath: string) => {
          console.log('Compresed FilePath : -->', filePath);
          resolve(filePath);
        }).catch(e => console.log(e));
      });
   }  



    getPersonDetails(position:any,personId:any){
      debugger;
      let methodinstance=this;
    let methodcontext=this;
          let headers = new Headers({
   
          'x-access-token': localStorage.getItem("authoKey")
     });
       
     let options = new RequestOptions({
      headers: headers
      });
      this.http.get(methodinstance.uerdataUrl+personId,options).subscribe(
             //success part
          function(response) {

            let personDetails=JSON.parse(response['_body']).personal_attributes.profile_pictures;

            for (var i = 0; i < personDetails.length; i++) {
             // if(personDetails[i].image_position===position){

                debugger;
          /*--------------Store the image to loacl db ---------------------*/
              methodinstance.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+personDetails[i].link+"' , image_id='"+personDetails[i].image_id+"'  WHERE position ='"+personDetails[i].image_position+"'",[]).then((data) => {       
                
                console.log("INSERTED: " + JSON.stringify(data));
                console.log("Successfully uploaded data to myBucket/myKey");
                        
              }, (error) => {
                methodinstance.SomethingWentWrongAlert();
                console.log("ERROR: " + JSON.stringify(error.err));
              });
          /*--------------------------------------------------------------*/

              //}
            }
          },function(error) { 
               debugger;
      });

    }


  getInternetDownloadingSpeed() {
    debugger;
    let methodInstance=this;

    let imageAddr = 'https://www.kenrockwell.com/contax/images/g2/examples/31120037-600.jpg'
    let startTime = 0, endTime = 0;
    let downloadSize = 151842;
    let download = new Image();

    startTime = (new Date()).getTime();
    download.onload = function () {
      debugger;
      endTime = (new Date()).getTime();
      download.src="";
      setTimeout(() => {

          debugger;
        let speedBps = 0;
        let speedKbps = 0;
        let speedMbps = 0;
        let duration = 0;
        let bitsLoaded = 0;
        duration = (endTime - startTime)/1000;
        bitsLoaded = downloadSize * 8;
        speedMbps = parseInt((((parseInt(((bitsLoaded / duration) / 1024).toFixed(2))) / 1024)/100).toFixed(4));
        methodInstance.netwSpeed = speedMbps;
      },500);
    }
    download.src = imageAddr;
  }

}