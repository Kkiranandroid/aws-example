import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';

/**
 * Generated class for the ViewOthersProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-others-profile',
  templateUrl: 'view-others-profile.html',
})
export class ViewOthersProfilePage {
  chat_person_id:any="";
  getPersonResponce:any="";
  defaultImage:any= 'assets/imgs/imagecoming.png';
  profileImages:any[]=[];
  person_name:any="";
  person_age:any="";
  bio:any="";
  isCardsLoading:any=true;

  constructor(public navCtrl: NavController,
  			  public http: Http,
              public appdetailsProvider:AppdetailsProvider,
              public viewCtrl: ViewController,
  	          public navParams: NavParams) {

    this.chat_person_id = navParams.get('chat_person_id');

    setTimeout(() => {
	  this.getPersonDetails(this.chat_person_id);
	},1000);
  }

  getPersonDetails(chat_person_id) {
      debugger;
      let methodinstance=this;
      let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
       
      let options = new RequestOptions({headers: headers});

      this.http.get(methodinstance.appdetailsProvider.uerdataUrl+chat_person_id,options).subscribe(
             //success part
          function(response) {

            methodinstance.getPersonResponce = JSON.parse(response['_body']);
            console.log("PersonDetails : -> "+JSON.stringify(methodinstance.getPersonResponce));
            debugger;

            let nextPersonSortedCardImages;
            try {
              nextPersonSortedCardImages=methodinstance.getPersonResponce.personal_attributes.profile_pictures;
              nextPersonSortedCardImages.sort(function (a, b) {
                return a.image_position - b.image_position;
              });       
            } catch(Exception){

            }

            methodinstance.profileImages=nextPersonSortedCardImages;
            methodinstance.bio=methodinstance.getPersonResponce.personal_attributes.bio;
            methodinstance.person_name=methodinstance.getPersonResponce.personal_data.person_name;
            methodinstance.person_age=methodinstance.getPersonResponce.personal_data.person_age;

            methodinstance.isCardsLoading=false;

          },function(error) { 
               debugger;
                methodinstance.isCardsLoading=false;
                methodinstance.appdetailsProvider.SomethingWentWrongAlert();
      });

    }

    closeIcon() {
	 const index = this.viewCtrl.index;
	 this.navCtrl.remove(index);
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOthersProfilePage');
  }

}
