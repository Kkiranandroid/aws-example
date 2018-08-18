import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { Fbtimeline } from '../fbtimeline/fbtimeline';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

@IonicPage()
@Component({
  selector: 'fbphotoupload',
  templateUrl: 'fbphotoupload.html',
})
export class Fbphotoupload {
    fbPics: Array<{name: string, pos: string, img: string, details: string }>;

    fbTimelineArray:any= [];
    profilePicArray:any= [];
    positionList:any= [];
    isFrom:any="";
    noItemFound=false;


  constructor(public navCtrl: NavController, public navParams: NavParams,public appdetailsProvider:AppdetailsProvider, public viewCtrl: ViewController) { 
      debugger;
      this.positionList = navParams.get('picpos');
      this.isFrom = navParams.get('isFromPage');
      debugger;

      this.getFacebookTimelinePhotos("1");
  }

getFacebookTimelinePhotos(isFirst){

       this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM photosTb", []).then((data) => {
        debugger;
         if(data.rows.length > 0) {

         for(var i = 0; i < data.rows.length; i++) {
          this.fbTimelineArray.push({photoId: data.rows.item(i).photoId, imageUrl: data.rows.item(i).imageUrl});
          }
         }
        }, (error) => {
        debugger;
          console.log("Error block");
          console.log("ERROR: " + JSON.stringify(error));
      });

       debugger;
      if(this.profilePicArray.length == 0) {
        this.profilePicArray.push({photoId: "1", imageUrl: localStorage.getItem('profilepic')});
      }

      setTimeout(() => {
        debugger;
        if(this.profilePicArray.length >0) {
          this.fbPics = [{"name":"Profile Pictures", "pos":"1", "img":localStorage.getItem('profilepic'), "details":"1 Photo"}];
        } else {
          if(this.profilePicArray.length == 0) {
            this.noItemFound=true;
          }else{
            this.noItemFound=false;
          }
        }

        debugger;
        if(this.fbTimelineArray.length > 0) {
         debugger;
          this.fbPics = [{"name":"Timeline Photos", "pos":"0", "img":this.fbTimelineArray[0].imageUrl, "details":this.fbTimelineArray.length+" Photos"}];
        } else {
            console.log("Empty block");
             if(isFirst=="1") {
               setTimeout(() => {
                this.getFacebookTimelinePhotos("0"); 
                },500);
             }
            }
       },500);//5 sec
      }

    
    gotoFbtimeline(fbPic) {
      debugger;
        if(fbPic.pos=="0") {

          this.navCtrl.push(Fbtimeline,{list:this.fbTimelineArray,position:this.positionList,isFromPage:this.isFrom});

         } else {

          this.navCtrl.push(Fbtimeline,{list:this.profilePicArray,position:this.positionList,isFromPage:this.isFrom});

         }
    }
    
    cancelButton(){
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }
}