import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController , ViewController} from 'ionic-angular';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

@IonicPage()
@Component({
  selector: 'gender',
  templateUrl: 'gender.html',
})
export class Gender {
man:any;
woman:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,private appdetailsProvider:AppdetailsProvider,public viewCtrl: ViewController) { 
      this.getgender();
  }


//-----------------getting gender from user table------------------
   getgender(){      
   debugger;
     let methodinstance=this;
       methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT gender FROM userTb", []).then((data) => {
       debugger;
       if(data.rows.length > 0) {
         let gender=data.rows.item(0).gender;

         if(gender=="man" || gender=="Man" || gender=="male" || gender=="Male"){
            methodinstance.man=true;
            methodinstance.woman=false;
         } else {
            methodinstance.man=false;
            methodinstance.woman=true;
         }
       }

        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
  }
    

    //--------------------------------update gender selected --------------------------------
    showAlert(gender) {
      let methodinstance=this;
      debugger;

      if(methodinstance.man && gender=="female" || methodinstance.woman && gender=="male") {
        methodinstance.man = !methodinstance.man;
        methodinstance.woman = !methodinstance.woman;

      debugger;

      let alert = this.alertCtrl.create({
        subTitle: 'All matches will be removed if you change your gender',
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
              methodinstance.man="";
              methodinstance.woman="";
              methodinstance.getgender();
            }
          },
          {
            text: 'OK',
            handler: data => {
              console.log('Saved clicked');
             methodinstance.getdateGender(gender);
            }
          }
        ],
        enableBackdropDismiss: false
      });
      alert.present();
    }
  }
    

    //------------------update database for selected gender---------------------------------
    getdateGender(gender){
      let methodinstance=this;
      debugger;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE userTb set gender='"+gender+"'",[]).then((data) => {   
      console.log("updated education tb: " + JSON.stringify(data));
               localStorage.setItem("gender",gender);

              const index = this.viewCtrl.index;
              this.navCtrl.remove(index);

               debugger;
      }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
      });
    }

    cancelButton(){
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }
    
}