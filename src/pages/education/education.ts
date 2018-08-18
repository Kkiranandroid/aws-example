import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, ViewController} from 'ionic-angular';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Keyboard } from '@ionic-native/keyboard';
import {Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'education',
  templateUrl: 'education.html',
})
export class Education {
educationArray:any[]=[];
education:any="";
personId:any="";
educationList:any[]=[];
OccupationArrayFromApi:any[]=[];
showList:any="";
fbEducationList=true;
showClearIcon:any="false";

  constructor(public navCtrl: NavController, public navParams: NavParams,private appdetailsProvider:AppdetailsProvider,public platform:Platform,private keyboard: Keyboard,public http:Http,public viewCtrl: ViewController) { 

      this.personId = localStorage.getItem("person_id");
      this.educationList.push({position:"Nanavalala"});

      this.showList="false";
      this.initializeItems();
      this.geteducationDetails();

       this.platform.ready().then(() => {
      this.keyboard.onKeyboardHide().subscribe(() => {
      //this.saveeducationData();
      });
    });
  }


  clearEditText(){
        //Clear Text input and hide the list and keybord
        this.education="";
        this.showList="false";
        this.showClearIcon="false";
      }
    

//-------------------education details-------------------------------
    geteducationDetails() {           debugger;
		 let methodinstance=this;
   		 methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM educationTb", []).then((data) => {
           			if(data.rows.length > 0) {
          				debugger;
           for(var i = 0; i < data.rows.length; i++) {
           debugger;
              methodinstance.educationArray.push({schoolName:data.rows.item(i).schoolName,ischecked:data.rows.item(i).ischecked, educationId:data.rows.item(i).educationId});
            }
           this.fbEducationList=false;
          } 

        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
  }


  //----------------------------radiobutton change------------------------------

  radioeducationselect(array){
  let methodinstance=this;
localStorage.setItem("education",array.schoolName);
   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE educationTb set ischecked='"+false+"'",[]).then((data) => {       
              console.log("updated education tb: " + JSON.stringify(data));
              methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE educationTb set ischecked='"+true+"' WHERE educationId ='"+array.educationId+"'",[]).then((data) => {       
              console.log("INSERTED: " + JSON.stringify(data));
              methodinstance.cancelButton();
              debugger;
            }, (error) => {
               console.log("ERROR: " + JSON.stringify(error.err));
           });

        }, (error) => {
        
            console.log("ERROR: " + JSON.stringify(error.err));
        });

  }

//---------------------------------saveeducation data-------------------------
  saveeducationData() {
  debugger;
  let methodinstance=this;
//education
  if(methodinstance.education.length > 0) {

    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  educationTb(educationId, schoolName, type, year,ischecked) VALUES (?,?,?,?,?)', [ Math.floor(Math.random() * (20000 - 200)) + 200,methodinstance.education,"","",true],)
      .then((data) => {
      methodinstance.educationArray=[];
      methodinstance.geteducationDetails();
      methodinstance.education="";
          debugger;
          console.log('Add EducationTb to DB '+data);
          
      }) .catch(e => {
          debugger;
          console.log(e)
      });
    }

  }

   getItems(ev) {
           debugger;
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.value;

    // if the value is an empty string don't filter the educationList
    if (val && val.trim() != '') {
      this.showList="true";
      this.showClearIcon="true";
      this.educationList = this.educationList.filter((item) => {
           debugger;
        return (item.position.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
    this.showList="false";
    this.showClearIcon="false";
    }
  }

  initializeItems() {
    this.educationList = [];
           debugger;


    let methodinstance=this;

    if(methodinstance.OccupationArrayFromApi.length>0){
      for(var i = 0; i < methodinstance.OccupationArrayFromApi.length; i++) {
          methodinstance.educationList.push({position:methodinstance.OccupationArrayFromApi[i].education_name});
      }
    }else{
            let headers = new Headers({
                                     
                                            'x-access-token': localStorage.getItem("authoKey")
                                       });
                                         
                                       let requestOptions = new RequestOptions({
                                        headers: headers
                                        });
    methodinstance.http.get(methodinstance.appdetailsProvider.getEducationUrl+methodinstance.personId,requestOptions).map(res => res.json()).subscribe(data => { 
           debugger;
           methodinstance.OccupationArrayFromApi=data;
          for(var i = 0; i < data.length; i++) {
          methodinstance.educationList.push({position:data[i].education_name});
          }
        }); 
    }
  }

  addToEducationTB(educationName){


  let methodinstance=this;
/*localStorage.setItem("education",array.schoolName);*/
   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE educationTb set ischecked='"+false+"'",[]).then((data) => {       
            console.log("updated education tb: " + JSON.stringify(data));

  debugger;
  let methodinstance=this;
//education
  if(educationName.length > 0) {
    this.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO  educationTb(educationId, schoolName, type, year,ischecked) VALUES (?,?,?,?,?)', [ Math.floor(Math.random() * (20000 - 200)) + 200,educationName,"","",true],)
      .then((data) => {
        methodinstance.educationArray=[];
        localStorage.setItem("education",educationName);
        methodinstance.geteducationDetails();
        methodinstance.education="";
          debugger;
          console.log('Add EducationTb to DB '+data);
          
      }) .catch(e => {
          debugger;
          console.log(e)
      });
    }

        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
        });

  }


  cancelButton(){
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }

}