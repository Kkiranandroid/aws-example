import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,ActionSheetController, AlertController } from 'ionic-angular';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Fbphotoupload } from '../fbphotoupload/fbphotoupload';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import {Http, Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

/**
 * Generated class for the EditprofilephotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofilephoto',
  templateUrl: 'editprofilephoto.html',
})
export class EditprofilephotoPage {
  isFrom:any="";
  profileImages:any[]=[];
  base64image:any="";
  personId:any="";
  imageposition:any="";
  isClikedOnImage:any="";
  largePhoto:any="";
  clrGray:any="#8E8E93";
  starColor:any="ios-star-outline";
  currentImagePosition:any;

  constructor(public navCtrl: NavController, 
              private crop: Crop,
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public appdetailsProvider:AppdetailsProvider, 
              public actionSheetCtrl:ActionSheetController,
              public http:Http,
              private cameraPreview: CameraPreview, 
              private camera: Camera, 
              public alertCtrl: AlertController) {
    
  this.isFrom = navParams.get('isFromPage');
  
  this.personId = localStorage.getItem("person_id");

  this.imageposition = navParams.get("imageposition");
  this.isClikedOnImage = navParams.get("isClikedOnImage");

  

  setTimeout(() => {
       this.getprofileData();

       setTimeout(() => {
         
         this.ckickedImage(this.profileImages[this.imageposition].profilepic,this.profileImages[this.imageposition]);
       },200);
    },100);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilephotoPage');
  }

    imgSection:boolean=true;
    addPicSection:boolean=false;
    
    showAdd(){
        this.imgSection=false;
        this.addPicSection=true;
    }
    showImg(){
        this.imgSection=true;
        this.addPicSection=false;
    }
    ckickedImage(image,profiledata){
      
      this.currentImagePosition=profiledata;
      this.largePhoto=image;
      if(profiledata.feverate=='1'){
         this.starColor = 'ios-star';//blue
      }else{
        this.starColor = 'ios-star-outline';//blue
      }

      if(profiledata.position == 0){
         this.clrGray = '#8E8E93';//gray
      } else {
        this.clrGray = '#595BD2';//blue
      }
    }

    getprofileData(){
      
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb ORDER BY position ASC", []).then((data) => {
              
             if(data.rows.length > 0) {
              methodinstance.largePhoto=data.rows.item(0).imageurl;

               if(data.rows.item(0).feverate=='1'){
                   this.starColor = 'ios-star';//blue
                }else{
                  this.starColor = 'ios-star-outline';//blue
                }
             
             for(var i = 0; i < data.rows.length; i++) {
                methodinstance.profileImages.push({image_id:data.rows.item(i).image_id, profilepic:data.rows.item(i).imageurl, isfacebook:data.rows.item(i).isfacebook, position:data.rows.item(i).position, feverate:data.rows.item(i).feverate});
              }
               this.currentImagePosition=methodinstance.profileImages[0];
            } 

          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }
  clickBottomAddButton(profiledata,index){
    
    if(profiledata.position==0){
    this.clrGray = '#8E8E93';
    }

    if(profiledata.position !== "0" && this.profileImages[index-1].profilepic == "") {
        return;
    }

    //this.currentImagePosition=profiledata;
    this.currentImagePosition=this.profileImages[index];
    this.largePhoto="";
    this.clrGray = '#8E8E93';
    this.starColor = 'ios-star-outline';

  }

  clickedCameraIcon(){
    
    let profiledata=this.currentImagePosition;

    /*if(profiledata.position !== "0" && this.profileImages[profiledata.position-1].profilepic == ""){
        return;
    }*/

    this.opencamer(profiledata);
  }

  clickedFileIcon(){
    
    let profiledata=this.currentImagePosition;

    /*if(profiledata.position !== "0" && this.profileImages[profiledata.position-1].profilepic == ""){
        return;
    }*/

    this.SelectPicture(profiledata);
  }


  clickedDeleteIcon(){
    let profiledata=this.currentImagePosition;
    if(profiledata.profilepic && profiledata.position !== "0") {

        let alert = this.alertCtrl.create({
        subTitle: 'Are yor sure you want to delete this photo?',
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
            this.removeimage(profiledata);
            }
          }
        ]
      });
      alert.present();
      
    }
  }
  clickedStarIcon(){
    let profiledata=this.currentImagePosition;
    if(profiledata.profilepic) {
      this.starColor=this.starColor == 'ios-star'? 'ios-star' : 'ios-star';
      this.addFeveret(profiledata);
    }
  }

  removeimage(imagelist) {
      let methodcontext=this;

      methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='' , image_id='' WHERE position ='"+imagelist.position+"'",[]).then((data) => {       
                console.log("INSERTED: " + JSON.stringify(data));
                methodcontext.largePhoto="";
                imagelist.profilepic="";
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });



    /*
    //-----------------Delete API call---------------
    
      let body={
                person_id: this.personId,
                images:[{
                  image_id: "",
                  image_position: imagelist.position
                }]
          }
      console.log(JSON.stringify(body));

    methodcontext.http.post(methodcontext.appdetailsProvider.updateProfileImages, body).subscribe(
     //success part
     function(response) {

       let respBody=JSON.parse(response['_body']);
       

            methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='' , image_id='' WHERE position ='"+imagelist.position+"'",[]).then((data) => {       
                console.log("INSERTED: " + JSON.stringify(data));
                methodcontext.largePhoto="";
                imagelist.profilepic="";
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
               
     }, function(error) { 
        methodcontext.appdetailsProvider.HideLoading();
             
     });
     */


     
  }

  addFeveret(imagelist) {
    
   let methodinstance=this;
   let fev=imagelist.feverate=="0"? 1 : 0 ;
   let position=imagelist.position;

   let apiReqArray=[];
   

    if(fev === 1){
      for (var i = 0; i < methodinstance.profileImages.length; i++) {
        if(methodinstance.profileImages[i].position === position) {
          methodinstance.profileImages[i].feverate=1;
          } else {
            methodinstance.profileImages[i].feverate=0;
          }
        }
      } else {
        for (var i = 0; i < methodinstance.profileImages.length; i++) {
        if(methodinstance.profileImages[i].position === '1') {
          methodinstance.profileImages[i].feverate=1;
          } else {
            methodinstance.profileImages[i].feverate=0;
          }
        }
      }
    
      //--------set the feverate item in first position.----------------
       for (var i = 0; i < methodinstance.profileImages.length; i++) {
         if(methodinstance.profileImages[i].feverate === 1) {
           let obj=methodinstance.profileImages[i];
           methodinstance.profileImages.splice(i, 1);//remove item
           methodinstance.profileImages.splice(0, 0, obj); // add the item in 1st position
           break;
         }
       }
      

       //--------set the positions as per array list--------------
       for (var m = 0; m < methodinstance.profileImages.length; m++) {
         methodinstance.profileImages[m].position= m + 1;
       }

      console.log("ERROR: " + JSON.stringify(methodinstance.profileImages.length));

      
      
          //imageurl, image_id, isfacebook, position, feverate
      for (var j = 0; j < methodinstance.profileImages.length; j++) {
          this.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set isfacebook='"+methodinstance.profileImages[j].isfacebook+"', position='"+methodinstance.profileImages[j].position+"', feverate='"+methodinstance.profileImages[j].feverate+"' WHERE imageurl ='"+methodinstance.profileImages[j].profilepic +"'",[]).then((data) => {       
                console.log("INSERTED: " + JSON.stringify(data));
             
                methodinstance.profileImages[imagelist.position].feverate=imagelist.feverate=="0"?"1":"0";
            }, (error) => {
              
                console.log("ERROR: " + JSON.stringify(error.err));
            });
      }
  }


  presentActionSheet() {
    let profiledata=this.currentImagePosition;
    

    /*if(profiledata.position !== "0" && this.profileImages[profiledata.position-1].profilepic == ""){
        return;
    }*/

    
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
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present();
 }


  opencamer(profiledata){
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'front',
      tapPhoto: true,
      previewDrag: false,
      toBack: false,
      alpha: 1
    };

  // start camera
  this.cameraPreview.startCamera(cameraPreviewOpts).then(
    (res) => {
      console.log(res)
    },
    (err) => {
      console.log(err)
    });

    const pictureOpts: CameraPreviewPictureOptions = {
      width: 400,
      height: 400,
      quality: 50
  }

  // take a picture
  this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      
      this.appdetailsProvider.ShowLoading();
      let picture = 'data:image/jpeg;base64,' + imageData;

      profiledata.profilepic=picture;

      this.largePhoto=picture;
      this.cameraPreview.stopCamera();


    setTimeout(() => {
      var img = document.getElementById("id_profilepic"+profiledata.position);
      this.clrGray = '#595BD2';//blue
      this.starColor = 'ios-star-outline';//gray

      if(profiledata.position==0) {
          this.clrGray = '#8E8E93';
      }
      this.asyncMethod(imageData,img,profiledata);
    }, 400);


  }, (err) => {
    console.log(err);
  });
}

//Select pic from galary/storage
  SelectPicture(profiledata){
        
        let methodcontext=this;
         const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
              correctOrientation: true
            }
            this.camera.getPicture(options).then((imageData) => {


             let base64Image = imageData;

             return this.crop.crop(base64Image, {quality: 100}).then((path) => {

             profiledata.profilepic=path;
             this.largePhoto=path;
             this.appdetailsProvider.ShowLoading();

             setTimeout(() => { 
              var img = document.getElementById("id_profilepic"+profiledata.position);
                this.clrGray = '#595BD2';//blue
                this.starColor = 'ios-star-outline';//gray


                if(profiledata.position==0) {
                     this.clrGray = '#8E8E93';
                  }
              this.asyncMethod(path,img,profiledata);

            }, 400);

            },
            (error) => {
                methodcontext.appdetailsProvider.HideLoading();
            });

             
            }, (err) => {
                methodcontext.appdetailsProvider.HideLoading();
            });
    }

    async asyncMethod(imageData,img,profiledata){
      let base=await this.imgToBase64(imageData,img);
      this.base64image=base;
      
      this.sendProfileImagesToAPI(this.personId,this.base64image,profiledata.position,imageData);
    }

  //Convert image to base 64 start
  @ViewChild('canvasforbase') canvasRef;
  imgToBase64(imgURL,imageTag): Promise<any>  {
    
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

  sendProfileImagesToAPI(personId,base64Image,position,localImage) {
    

    let methodcontext=this;

    let body={person_id: personId,
          image_detail:{
            image_data: base64Image,
            image_position: position
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

       let respBody=JSON.parse(response['_body']);

        
        console.log("sendImageUrl-API Resp "+JSON.stringify(respBody));

           let image_id=respBody.image_id;
           let image_link=respBody.image_link;
           let image_position=respBody.image_position;

            //methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
            methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
            methodcontext.appdetailsProvider.HideLoading();
            console.log("INSERTED: " + JSON.stringify(data));
            
            
          }, (error) => {
              methodcontext.appdetailsProvider.HideLoading();
              methodcontext.appdetailsProvider.SomethingWentWrongAlert();
              console.log("ERROR: " + JSON.stringify(error.err));
          
          });
               
     }, function(error) { 
        methodcontext.appdetailsProvider.HideLoading();
        
              
     });
  }
    cancel(){
      const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
    }
    done(){
      const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
    }
}
