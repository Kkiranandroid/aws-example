import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import {Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'occupation',
  templateUrl: 'occupation.html',
})
export class Occupation {

  fbworkname:any="MarketMakers";
  OccupationArray:any[]=[];
  OccupationArrayFromApi:any[]=[];
  personId:any="";

  fbOccupetionList=true;
  otherOccupetionList=true;

  constructor(public navCtrl: NavController, public navParams: NavParams,private appdetailsProvider:AppdetailsProvider,public http:Http,public viewCtrl: ViewController) { 

      this.personId = localStorage.getItem("person_id");
      this.OccupationArrayFromApi = [];
      setTimeout(() => {
        debugger;
         this.getOcuupationdata();
         this.getfacebookdata();
      },1000);    
  }

  getfacebookdata(){
  debugger;
   this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM workTb where isfacebook='true'", []).then((data) => {
     debugger;
        if(data.rows.length > 0) {
          for(var i = 0; i < data.rows.length; i++) {
               if(data.rows.item(i).isfacebook==="true"){
                 debugger;
                  this.OccupationArray.push({position:data.rows.item(i).position,ischecked:data.rows.item(i).ischecked, workId:data.rows.item(i).workId});
               }
            }
                
           this.fbOccupetionList=false;   
          }else{
            this.fbOccupetionList=false;   
          } 
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });

  }

  getOcuupationdata(){

       this.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM workTb where isfacebook='false'", []).then((data) => {
         debugger;
                if(data.rows.length > 0) {
                   for(var i = 0; i < data.rows.length; i++) {
            
                   if(data.rows.item(i).isfacebook==="false"){
                      this.OccupationArrayFromApi.push({position:data.rows.item(i).position,ischecked:data.rows.item(i).ischecked, workId:data.rows.item(i).workId});
                   }
                  }
                      this.otherOccupetionList=false;
              //   this.fbOccupetionList=false;   
                } else{
                  debugger;
                    this.getOtherOccupationFromAPI();
                }

        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });

  }

//--------------------------Occupation details----------------------------
    /*getOccupationDetails(){ 
     this.OccupationArray=[];
		 let methodinstance=this;
   		 methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM workTb", []).then((data) => {
           			if(data.rows.length > 0) {
          	
           for(var i = 0; i < data.rows.length; i++) {
      
           if(data.rows.item(i).isfacebook=="true"){
             methodinstance.OccupationArray.push({position:data.rows.item(i).position,ischecked:data.rows.item(i).ischecked, workId:data.rows.item(i).workId});
           }else{
              //methodinstance.OccupationArrayFromApi.push({position:data.rows.item(i).position,ischecked:data.rows.item(i).ischecked, workId:data.rows.item(i).workId});
           }


            }
           methodinstance.otherOccupetionList=false;
           methodinstance.fbOccupetionList=false;           
          } 

        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
  }*/

  getOtherOccupationFromAPI(){
  let methodinstance=this;
          let headers = new Headers({
                                     
                                            'x-access-token': localStorage.getItem("authoKey")
                                       });
                                         
                                       let requestOptions = new RequestOptions({
                                        headers: headers
                                        });
  methodinstance.http.get(methodinstance.appdetailsProvider.getOccupationUrl+methodinstance.personId,requestOptions).map(res => res.json()).subscribe(data => { 
         debugger;
         this.OccupationArrayFromApi = [];

          for(var i = 0; i < data.length; i++) {

            methodinstance.OccupationArrayFromApi.push({position:data[i].occupation_name,ischecked:false});

            methodinstance.appdetailsProvider.getDbInstance().executeSql('REPLACE INTO workTb(workId, company, position, location,ischecked,isfacebook) VALUES (?,?,?,?,?,?)', ["1","",data[i].occupation_name,"",false,false],)
            .then((data) => {
             
                console.log('Add WorkTb to DB '+data);
                
            }) .catch(e => {

                console.log(e)
            });
          }

           methodinstance.otherOccupetionList=false;
           methodinstance.fbOccupetionList=false;   
        }); 
  }

  radioOtherOccupationClicked(occupationArray) {
    debugger;

  //name.ischecked = name.ischecked == "true" ? "false" : "true";

   let methodinstance=this;

   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE workTb set ischecked='false' WHERE ischecked='true'",[]).then((data) => {       
            console.log("updated education tb: " + JSON.stringify(data));

     methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE workTb set ischecked='true' WHERE position ='"+occupationArray.position+"'",[]).then((data) => {       
            console.log("INSERTED: " + JSON.stringify(data));
            localStorage.setItem("occupation",occupationArray.position);
            methodinstance.cancelButton();
            debugger;
        }, (error) => {
        
            console.log("ERROR: " + JSON.stringify(error.err));
        });


        }, (error) => {
        
            console.log("ERROR: " + JSON.stringify(error.err));
        });

   
  }


radioOccupationselect(id,position){
  let methodinstance=this;

   methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE workTb set ischecked='false' WHERE ischecked='true'",[]).then((data) => {       
            console.log("updated ocupetion tb: " + JSON.stringify(data));

               methodinstance.appdetailsProvider.getDbInstance().executeSql("UPDATE workTb set ischecked='true' WHERE position ='"+position+"'",[]).then((data) => {       
            console.log("INSERTED: " + JSON.stringify(data));
            localStorage.setItem("occupation",position);
            methodinstance.cancelButton();
            debugger;
        }, (error) => {
        
            console.log("ERROR: " + JSON.stringify(error.err));
        });

        }, (error) => {
        
            console.log("ERROR: " + JSON.stringify(error.err));
        });

  }

  cancelButton(){
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }

  }
    
