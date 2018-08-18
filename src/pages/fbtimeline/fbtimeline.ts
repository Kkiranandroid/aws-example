import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController } from 'ionic-angular';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

import {Http, Headers, RequestOptions } from '@angular/http';
import { ProfilescreenPage } from '../profilescreen/profilescreen';
import { EditprofilephotoPage } from '../editprofilephoto/editprofilephoto';


@IonicPage()
@Component({
  selector: 'fbtimeline',
  templateUrl: 'fbtimeline.html',
})
export class Fbtimeline {

    fbtimelines: Array<{img: string}>;
    fbTimelineArray:any= [];
    positionList:any= [];
    base64image:any="";
    fb_Id:any="";
    personId:any="";
    isFrom:any="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public appdetailsProvider:AppdetailsProvider, public viewCtrl: ViewController,public http:Http) { 
  debugger;

  this.fbTimelineArray = navParams.get('list');
  this.positionList = navParams.get('position');
  this.fb_Id = localStorage.getItem("facebookId");
  this.personId = localStorage.getItem("person_id");
  this.isFrom = navParams.get('isFromPage');
  debugger;
  }

  ckickedImage(fbtimeline) {
  debugger;
  this.appdetailsProvider.ShowLoading();
    setTimeout(() => {
                debugger;
                var img = document.getElementById("facebook_profilepic"+fbtimeline.photoId);
                let base=this.imgToBase64("data:image/*;base64,"+fbtimeline.imageUrl,img);
                this.base64image=base;
                debugger;
                this.sendProfileImagesToAPI(this.personId,this.base64image,this.positionList.position,fbtimeline);
    }, 400);
  }

  //Convert image to base 64 start
  @ViewChild('canvasforbase') canvasRef;
    imgToBase64(imgURL,imageTag) {
    
    debugger;
    let canvas = this.canvasRef.nativeElement;
    let context = canvas.getContext('2d');
    canvas.height = imageTag.naturalHeight;
    canvas.width = imageTag.naturalWidth;
    context.drawImage(imageTag, 0, 0);  
    let b=canvas.toDataURL();
        debugger;
   
    return b;  
  }


  sendProfileImagesToAPI(personId,base64Image,position,fbtimeline) {
    debugger;
    //console.log("PersonId : "+personId+" Position : "+position+" Base64String : "+base64Image);

    let body={person_id: personId,
              image_detail:{
                image_data: base64Image,
                image_position: position
              }
             }

            debugger;
    console.log("SendImage-API Resp:--> "+JSON.stringify(body));
    let methodcontext=this;
          let headers = new Headers({
                                            'x-access-token': localStorage.getItem("authoKey")
                                       });
                                         
                                       let requestOptions = new RequestOptions({
                                         headers: headers
                                       });
    
    methodcontext.http.post(methodcontext.appdetailsProvider.sendImageUrl, body,requestOptions).subscribe(
           //success part
     function(response) {

            debugger;
       let respBody=JSON.parse(response['_body']);
        debugger;
        console.log("sendImageUrl-API Resp "+JSON.stringify(respBody));

        let image_id=respBody.image_id;
        let image_link=respBody.image_link;
        let image_position=respBody.image_position;
        //methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"'  WHERE position ='"+position+"'",[]).then((data) => {       
        methodcontext.appdetailsProvider.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='"+image_link+"' , image_id='"+image_id+"' WHERE position ='"+methodcontext.positionList.position+"'",[]).then((data) => {
            console.log("INSERTED : " + JSON.stringify(data));
            debugger;

            methodcontext.appdetailsProvider.HideLoading();
        
            if(methodcontext.isFrom=="loginPage") {
                  const index = methodcontext.viewCtrl.index;
                  for(let i = index; i >0; i--) {
                    methodcontext.navCtrl.remove(i);
                  }

                 /* methodcontext.navCtrl.push(ProfilescreenPage).then(() => {
                 const index = methodcontext.viewCtrl.index;
                  for(let i = index; i >0; i--){
                    methodcontext.navCtrl.remove(i);
                  }
                 }); */

            } else {
               methodcontext.navCtrl.push(ProfilescreenPage).then(() => {
               const index = methodcontext.viewCtrl.index;
                for(let i = index; i >1; i--) {
                  methodcontext.navCtrl.remove(i);
                }
               });
            }   
           
            debugger;
        }, (error) => {
          methodcontext.appdetailsProvider.HideLoading();
          console.log("ERROR: " + JSON.stringify(error.err));
        });
               
     }, function(error) {
       methodcontext.appdetailsProvider.HideLoading();
       debugger;
     });
    
  }

  cancelButton() {
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }

}