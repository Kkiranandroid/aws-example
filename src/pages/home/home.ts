import { Component, ViewEncapsulation, ViewChild, ViewChildren, TemplateRef, EventEmitter, NgModule, QueryList } from '@angular/core';
import { NavController, PopoverController, NavParams, ViewController, FabContainer, Platform, AlertController, Slides, ModalController } from 'ionic-angular';
//import { SwipeCardsModule } from './ng2-swipe-cards/index.ts';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import {Observable} from 'rxjs';

import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Messages } from '../messages/messages';
import { Datelist } from '../datelist/datelist';
import { SchedulePage } from '../schedule/schedule';
import { Outnow } from '../outnow/outnow';
import { OutNowMainPage } from '../out-now-main/out-now-main';
import { SettingsubPage } from '../settingsub/settingsub';
import { ConversationPage } from '../conversation/conversation';



import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CalenderPage } from '../calender/calender';
import { Broadcaster } from '@ionic-native/broadcaster';

import { SettingsmainPage } from '../settingsmain/settingsmain';
import { ProfilescreenPage } from '../profilescreen/profilescreen';
import { FilterPage } from '../filter/filter';
import { DatePipe } from '@angular/common';
import moment from 'moment';


declare var $: any;

@Component({
  selector: 'page-home',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'home.html'
})
export class HomePage {

  modeOfCurrentPersonImg:any="assets/imgs/ChatIcons.png";
  modeOfNextPersonImg:any="assets/imgs/ChatIcons.png";

  /* first time user exp */
  public FTUE_MODE:any;
  public firstTimeUserExp = "firstTimeUserExp";
  public firstTimeUserExp2 = "firstTimeUserExp firstTimeUserExpHide";
  public firstTimeUserExp3 = "firstTimeUserExp firstTimeUserExpHide";
  public firstTimeUserExp31 = "firstTimeUserExp firstTimeUserExpHide";
  public firstTimeUserExp4 = "firstTimeUserExp firstTimeUserExpHide";

  public fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";

  openFabMenu(){
    this.fabMenu1 = "firstTimeUserExp";
  }
  clickOn(clickedOption){
    
    let self=this;
    //alert(clickedOption);

    if(localStorage.getItem("FTUE_MODE")==='outnow' && clickedOption!=='outnow') {
      this.deleteOutNowSchedules();
    }

    localStorage.setItem("FTUE_MODE",clickedOption);

    try {
      if(clickedOption==='chatnow'){
            this.modeOfCurrentPersonImg="assets/imgs/ChatIcons.png"
            this.modeOfNextPersonImg="assets/imgs/ChatIcons.png"
        } else if(clickedOption==='outnow'){
            this.modeOfCurrentPersonImg="assets/imgs/outNow_match.png"
            this.modeOfNextPersonImg="assets/imgs/outNow_match.png"
        }else{
            this.modeOfCurrentPersonImg="assets/imgs/calenderIcons.png"
            this.modeOfNextPersonImg="assets/imgs/calenderIcons.png"
        }
      } catch(Exception) {

      }


    if(clickedOption ==='outnow'){
      this.fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";
      try{
        if(localStorage.getItem('OutNow_end_dateTime')==='' || localStorage.getItem('OutNow_end_dateTime') == null){
          if(localStorage.getItem('isOutNowFirstTime')=='true'){
            this.navCtrl.push(OutNowMainPage,{isFrom:"FTUE"});
          }else{
            this.navCtrl.push(OutNowMainPage,{isFrom:""});
          }
        } else {
          this.fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";
          this.isCardsLoading=true;
          this.norecordsFound=false;
          this.isCardDisplaying=false;
          this.getMatches(localStorage.getItem('OutNow_scheduleIdsList'));
        }
      }catch(Exception){

      }
      
    }else if(clickedOption ==='plannow'){
      if (this.appdetailsProvider.CheckConnection()) {
        if(localStorage.getItem('isPlanNowFirstTime')=='true'){
            this.navCtrl.push(SchedulePage,{isFrom:"FTUE"});
          }else{
            this.navCtrl.push(Datelist);
        }
        this.fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";
      }
    } else if(clickedOption ==='chatnow'){
     
      this.fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";
      this.isCardsLoading=true;
      this.norecordsFound=false;
      this.isCardDisplaying=false;
      this.getMatches("");

      if(localStorage.getItem('isChatNowFirstTime')=='true'){
        localStorage.setItem('isChatNowFirstTime','false');
      }      
    } 
  }


  closeFTUE(){
    this.fabMenu1 = "firstTimeUserExp firstTimeUserExpHide";

    //this.schedulList = localStorage.getItem('schedule_ids_list');
    //this.getMatches(this.schedulList);
  }

  firstTimeUserExpClick(clickedOption) {
    this.FTUE_MODE=clickedOption;
    let isUserFirsTime=localStorage.getItem("firstTimeuserExp");
    

    //---Adding the mode value in local storege and get this value in every where---
    localStorage.setItem("FTUE_MODE",clickedOption);
    try{
        if(clickedOption==='chatnow') {
            this.modeOfCurrentPersonImg="assets/imgs/ChatIcons.png"
            this.modeOfNextPersonImg="assets/imgs/ChatIcons.png"
            this.getMatches('');
        } else if(clickedOption==='outnow') {
            this.modeOfCurrentPersonImg="assets/imgs/outNow_match.png"
            this.modeOfNextPersonImg="assets/imgs/outNow_match.png"
        } else {
            this.modeOfCurrentPersonImg="assets/imgs/calenderIcons.png"
            this.modeOfNextPersonImg="assets/imgs/calenderIcons.png"
        }
    } catch (Exception){

    }
    this.firstTimeUserExp= "firstTimeUserExp firstTimeUserExpHide";
    this.firstTimeUserExp2= "firstTimeUserExp firstTimeUserExpChanges";
  }

  firstTimeUserExpClick2(){
     this.firstTimeUserExp2= "firstTimeUserExp firstTimeUserExpHide"; 
     this.firstTimeUserExp3 = "firstTimeUserExp";
  }
  firstTimeUserExpClick3(){
     this.firstTimeUserExp3= "firstTimeUserExp firstTimeUserExpHide"; 
     this.firstTimeUserExp31 = "firstTimeUserExp";
  }
  firstTimeUserExpClick31(){
     this.firstTimeUserExp31= "firstTimeUserExp firstTimeUserExpHide"; 
     this.firstTimeUserExp4 = "firstTimeUserExp";
  }
  firstTimeUserExpClick4(){
    
    this.firstTimeUserExp4 = "firstTimeUserExp firstTimeUserExpHide";
    localStorage.setItem("firstTimeuserExp","false");
    this.firstTimeuserExp="false";

    if(this.FTUE_MODE==='outnow'){
      try{
        if(localStorage.getItem('OutNow_end_dateTime')==='' || localStorage.getItem('OutNow_end_dateTime') == null){
          this.navCtrl.push(OutNowMainPage,{isFrom:"FTUE"});
        } else {
           this.setOutNowBackgrount('outnow');
        }
      }catch(Exception){

      }
    }else if(this.FTUE_MODE==='plannow'){
      this.navCtrl.push(SchedulePage,{isFrom:"FTUE"});
    } else if(this.FTUE_MODE==='chatnow'){

      if(localStorage.getItem('isChatNowFirstTime')=='true'){
        localStorage.setItem('isChatNowFirstTime','false');
      }
    } 
  }
  /* first time user exp */

  //Refreshing the page every 1 min
  REFRESH_TIME_OUT: any = 1000 * 60;
  offset:any  = 100;

  refreshMsg:any = 'refresh to see new matches';
  rotateClass:any ='noAnimate';

  currentPersonDetails:any; 

  people:any = [];

  swipeDelay: any = 200;
  resetTimeout: any = 0;
  resetting:boolean = false;

  elements: any = {};
  drag: any = {};
  gettingMatches: boolean = false;

  dragInProgress: boolean = false;
  outnow: boolean = false;

  isFabShowing: boolean = true;

  cardWidth: any = 0;

  currentPerson: any = 0;
  currentImage: any = 1;
  totalImages: any = 1;

  swipeThreshold:any = 0.15; // If we have moved over the threshold confirm yes or no, to make the user have to swipe further increase this number
  dragThreshold:any = 0.25; // Drags will only complete if the user has dragged a certain percentage across the screen, to adjust this change the number here

  showSwipeMatched = false;

  swipeMode: any = true;

  noConnection: boolean = false;
  isCardsLoading: boolean = true;
  isShowInstagramIcon: boolean = false;
  isNewMatchesFound: boolean = false;


  defoultImage:any="assets/imgs/defoult_image.png";
  defaultImage:any= 'assets/imgs/imagecoming.png';

  myProfileImage:any="assets/imgs/profile2.jpg";
  matchedProfileImage:any="assets/imgs/profile5.jpg";

  InstagramImages:any[]=[];

  transitionImages(showId,hideId,showTransition,hideTransition,startPosition?) {
    let self = this;
    debugger;
    this.elements.images[showId].css("opacity", "1");
    if (startPosition != undefined) {
      this.elements.images[showId].css("transform", "translate(" + startPosition + "px,0px) rotate(0deg)");
    }
    this.elements.images[showId].addClass(showTransition);
    this.elements.images[hideId].addClass(hideTransition);
    this.resetTimeout = setTimeout(function () {
      self.elements.images[hideId].css("opacity", "0");
      self.elements.images[hideId].css("transform", "translate(0px,0px) rotate(0deg)");
      self.elements.images[hideId].removeClass(hideTransition);
      self.elements.images[showId].css("transform", "translate(0px,0px) rotate(0deg)");
      self.elements.images[showId].removeClass(showTransition);
      self.resetting = false;
      self.currentImage = showId;
      self.showCard();
    }, this.swipeDelay);
  }

  swipeOutCard(direction) {
    let self = this;
    this.resetting = true;
    this.elements.card.addClass("swipe-out-" + direction);

    this.resetTimeout = setTimeout(function() {
      if (direction != "reset") {
        self.sendSwipe(direction, self.people[self.currentPerson]); // Send to the api that we have swiped this person
      }
      self.elements.signs.left.addClass("opacity-" + direction);
      self.elements.signs.right.addClass("opacity-" + direction);  
      self.resetting = false;
      self.elements.card.css("transform", "translate(0px,0px) rotate(0deg)").removeClass("swipe-out-" + direction);
      self.elements.signs.left.css("opacity", "0").removeClass("opacity-" + direction);
      self.elements.signs.right.css("opacity", "0").removeClass("opacity-" + direction);
      self.drag.startX = -1;
      self.drag.startY = - 1;

      if (direction != "reset") {

        //self.people[self.currentPerson].personal_data.liked = true; force match
        if (self.people[self.currentPerson].personal_data.liked == true && direction == "right") { 
          self.showSwipeMatched = true;
        }
    
        self.currentPerson = self.currentPerson + 1;
        self.currentImage = 1;
        self.showCard();

      } else {
        self.elements.card.css("transform", "translate(0px,0px) rotate(0deg)").removeClass("swipe-out-" + direction);
      }
    }, this.swipeDelay);
  }    

  dragMoved(e) {
    // A movement has been detected on our card

    if (!this.dragInProgress) { // Are we in the middle of a drag? if not we don't need to track this move
      return;
    }

    if (e.type == "touchmove") {
      this.drag.curX = e.touches[0].clientX;
      this.drag.curY = e.touches[0].clientY;
    } else {
      this.drag.curX = e.clientX;
      this.drag.curY = e.clientY;
    }

    this.drag.dX = this.drag.curX - this.drag.startX;
    this.drag.dY = this.drag.curY - this.drag.startY;

    if (this.drag.dX != 0 || this.drag.dY != 0) {
      this.drag.moved = true;
    }

    // We have two modes, swiping and details indicated by this flag
    if (this.swipeMode) {
      // Move the image under the pointer
      var css = "translate(" + this.drag.dX + "px," + this.drag.dY + "px)";

      // Work out how far we have moved
      var percentMoved = (this.drag.dX / this.cardWidth) * 100;

      // And calculate the rotation based on this, to make it rotate more reduce the divisor
      var rotation = 0 - percentMoved / 2.5;

      // The yes/no opacity is set here, to make them appear quicker change the divisor to a smaller number
      var opacity = Math.abs(percentMoved) / 50;
      css = css + " rotate(" + rotation + "deg)";

      // If we have moved to the left we will have a negative value here so we adjust the yes opacity and hide the no item
      if (percentMoved < 0) {
        this.elements.signs.left.css("opacity", opacity);
        this.elements.signs.right.css("opacity", 0);
      } else { // this is the other way round
        this.elements.signs.left.css("opacity", 0);
        this.elements.signs.right.css("opacity", opacity);
      }
      // Now we apply the css to the card
      this.elements.card.css("transform", css);     
    } else {
      if (this.drag.dX < 0) { // If we have moved left
        if (this.currentImage < this.totalImages) { // And are not at the last image
          // Move the current image left, and position the next image in the series next to it
          // We also have to unhide the next image in the series
          var css = "translate(" + this.drag.dX + "px,0px)";
          var css1 = "translate(" + (this.drag.dX + this.cardWidth) + "px,0px)";

          this.elements.images[this.currentImage].css("transform", css);
          this.elements.images[this.currentImage + 1].css("opacity", 1).css("transform", css1);
        }
      }
      if (this.drag.dX > 0) { // If we have moved right
        if (this.currentImage > 1) { // And are not at the first image
          // Move the current image right, and position the previous image directly before it
          // We also have to unhide the previous image               
          var css = "translate(" + this.drag.dX + "px,0px)";
          var css1 = "translate(" + (this.drag.dX - this.cardWidth) + "px,0px)";
          this.elements.images[this.currentImage].css("transform", css);
          this.elements.images[this.currentImage - 1].css("opacity", 1).css("transform", css1);
        }
      }
    }
  }

  dragStarted(e) {
    this.dragInProgress = true;
    this.drag.moved = false; // Set a flag to show if the user has moved after the drag started
    
    if (this.resetting) {
      clearTimeout(this.resetTimeout);
      this.elements.card.removeClass("swipe-reset");
      this.elements.signs.left.removeClass("opacity-reset");      
      this.elements.signs.right.removeClass("opacity-reset");
      this.dragMoved(e)
    } else {
      // We are not resetting, so record the start co-ordinates of this event
      if (e.type == "touchstart") {
        this.drag.startX = e.touches[0].clientX;
        this.drag.startY = e.touches[0].clientY;
      } else {
        this.drag.startX = e.clientX;
        this.drag.startY = e.clientY;
      }
    }
  }

  dragFinished(e) {
    this.dragInProgress = false;
    
      if(this.people[this.currentPerson + 1] == undefined){
        setTimeout(()=> {
           this.getMatches('');
        },3000);
      }

    
    if (e.type == "touchend") {
      this.drag.curX = e.changedTouches[0].clientX;
      this.drag.curY = e.changedTouches[0].clientY;
    } else {
      this.drag.curX = e.clientX;
      this.drag.curY = e.clientY;
    }

    this.drag.dX = this.drag.curX - this.drag.startX;
    this.drag.dY = this.drag.curY - this.drag.startY;

    this.drag.finishX = this.drag.curX;
    this.drag.finishY = this.drag.curY;

    if (this.drag.moved) { // Have we moved at all?
      if (this.swipeMode) { 
          if (this.drag.dX < 0 - (this.cardWidth * this.swipeThreshold)) { // Have we swiped left?
            this.swipeOutCard("left");
          } else if (this.drag.dX > (this.cardWidth * this.swipeThreshold)) { // Have we swiped right?
            this.swipeOutCard("right");
          } else { // We didn't swipe enough, so move the card back to the center
            this.swipeOutCard("reset");
          }
      } else { // We are not on the swipe screen, we are in the details screen so we have to handle scrolling images left and right in a carousel

        if (this.drag.dX < 0 - (this.cardWidth * this.dragThreshold)) { // move left
          if (this.currentImage < this.totalImages) { // If there is another image to show swipe it in
            this.transitionImages(this.currentImage + 1, this.currentImage, "swipe-in", "swipe-out-left");
          }
        } else if (this.drag.dX < 0) { // move left, abandonded
          this.transitionImages(this.currentImage, this.currentImage + 1, "swipe-in", "swipe-out-right");
        } else if (this.drag.dX > (this.cardWidth * this.dragThreshold)) { // move right
          if (this.currentImage > 1) { // If there is another image to show swipe it in
            this.transitionImages(this.currentImage - 1, this.currentImage, "swipe-in", "swipe-out-right");
          }
        } else {
          this.transitionImages(this.currentImage, this.currentImage - 1, "swipe-in", "swipe-out-left");
        }
      }    
    } else {// We haven't moved at all since the mouse down, this is a tap event
      console.log("Tapped on ", e.target.id);
      if ((e.target && e.target.id == "swipe-info") || (e.target && e.target.id == "swipe-info-icon") ||
          (e.target && e.target.id == "swipe-details-arrow") ||  (e.target && e.target.id == "swipe-details-arrow-icon")) {
             // And the user has clicked on the info button
        this.toggleShowInfo(); // toggle the information screen
      } else {
        // Determine the direction by working out which side of the screen has been clicked on
        // and show the appropriate image
        var direction = (this.drag.startX > this.cardWidth / 2) ? "right" : "left";
        if (direction == "left") {
          if (this.currentImage > 1) {
            this.currentImage = this.currentImage - 1;
            this.showCard();
          }
        }
        if (direction == "right") {
          if (this.currentImage < this.totalImages) {
            this.currentImage = this.currentImage + 1;
            this.showCard();
          }
        }
      }
    }
  }

  // Toggle between swipe mode and detail mode
  toggleShowInfo() {
    console.log("Showing info");
    
    this.swipeMode = !this.swipeMode;

    if (!this.swipeMode) {
      /*if(this.appdetailsProvider.globleInstagramImages.length>0){
       
       this.InstagramImages=this.appdetailsProvider.globleInstagramImages;
     }*/
      this.isFabShowing=false;
      var padding = this.elements.card.height() - 65;
      console.log("Setting top to this", padding);
      this.elements.details.css("padding-top", padding + "px");
      this.elements.page.css("overflow-y", "scroll");
      this.elements.main.addClass("swipe-showdetails");
      this.elements.main.removeClass("swipe-hidedetails");
    } else {
      this.isFabShowing=true;
      this.showCard();
      this.elements.page.css("overflow-y", "hidden");
      this.elements.main.removeClass("swipe-showdetails");
      this.elements.main.addClass("swipe-hidedetails");
      this.elements.page.scrollTop(0);
    }
  }

  // Construct the html notes for a person
  buildNotes(person) {
    var html = "<h1>" + person.personal_data.person_name + ", " + person.personal_data.person_age + "</h1>"

    var formatted_date = this.datepipe.transform(person.schedule_data.schedules[0].schedule_startdate, 'EEEE, MMMM dd');

    console.log("Checking out now for person", person.schedule_data.schedules[0].schedule_isoutnow , " and ", this.outNowClass);

    if (person.schedule_data.schedules[0].schedule_isoutnow && this.outNowClass != "") {
      formatted_date = "Out now!";
    }

    if(!formatted_date){
      formatted_date='';
    }

    html += "<p>" + formatted_date + "</p>";
    html += "<p>" + person.schedule_data.schedules[0].schedule_location_city + "</p>";
    html += "<p>" + person.schedule_data.schedules[0].schedule_location_country + "</p>";

    return html;
  }
  
  showCard() {
    
    debugger;
    let self=this;
    this.isCardsLoading=false;
    this.isCardDisplaying=true;

    if(this.people.length===0){
      this.norecordsFound=true;
    }else{
      this.norecordsFound=false;
    }
    
//-----------------Adding the details for current person details START-------------------
    console.log("Showing card", (this.people.length - this.currentPerson), "cards left");
    if (this.people[this.currentPerson] == undefined) {
      console.log("Hiding this person");
      this.elements.card.css("display", "none");
    } else {
      this.elements.card.css("display", "block");
      var person = this.people[this.currentPerson];

      if(person == undefined){
      alert("Hiding current person");
      }

    //---Get the instagram token from GetMatch API responce and call the instgram url to get the instgram details---
      /*try {
        if(person.personal_data.instagram_token) {
          this.isShowInstagramIcon=true;
          this.getInstagramPhotosFromToken(person.personal_data.instagram_token);
          //"7445830227.8e1316d.cfc133a4dea14b0ebc0a8d3d605ad499"
        } else {
          this.isShowInstagramIcon=false;
          this.InstagramImages=[];
        }
      }catch(Exception){

      }*/
    //------------------------------------------------------------------------------------------
         
      this.currentPersonDetails = this.people[this.currentPerson];
      console.log("Showing data for", person.personal_data.person_name);
      this.totalImages = person.personal_attributes.profile_pictures.length;
      if (this.totalImages > 6) {
        this.totalImages = 6;
      }

      var html = "";
      if(this.totalImages>0){
        for (var i = 1; i <= this.totalImages; i++) {
          if (i == this.currentImage) {
            this.elements.images[i].css("opacity", 1).css("transform", "");
            html = html + "<em>&#x25cf</em>";
          } else {
            this.elements.images[i].css("opacity", 0).css("transform", "");
            html = html + "&#x25cf";
          }
        }
      } else {
        /*html = html + "&#x25cf";
        this.elements.images[i].css("opacity", 0).css("transform", "");
        self.elements.images[i + 1].css("background-image", "url('" + self.defoultImage+ "')");*/
      }
    
      for (i = this.totalImages + 1; i < 6; i++) {
        this.elements.images[i].css("opacity", 0).css("transform", "");
      }
    
      this.elements.breadcrumbs.html(html);
      console.log(person);
      let sortedCardImages=[];
      try {
        sortedCardImages=person.personal_attributes.profile_pictures;
        console.log("Befour sort :-> "+JSON.stringify(sortedCardImages));
        sortedCardImages.sort(function (a, b) {
          return a.image_position - b.image_position;
        });
        console.log("After sort :-> "+JSON.stringify(sortedCardImages));
      } catch(Exception){

      }
        if(this.totalImages>0){
          for (var i = 0; i < 6; i++) {
            console.log(i);
            console.log("Showing", person.personal_attributes.profile_pictures[i]);
            if (sortedCardImages[i] != undefined) {
                console.log("Have url");
                              
                if(this.tempArray.indexOf(sortedCardImages[i].link) > -1) {
                  self.elements.images[i + 1].css("background-image", "url('" + self.defoultImage+ "')");
                } else {
                  self.elements.images[i + 1].css("background-image", "url('" + sortedCardImages[i].link + "')");
                }
            } else {
              console.log("Don't have url");
              this.elements.images[i + 1].css("background-image", "none");
            }
          }
        } else {
          //self.elements.images[i + 1].css("background-image", "url('" + self.defoultImage+ "')");
        }
   
      this.elements.cardNotes.html(this.buildNotes(person));
      
      var html = "<h1>" + person.personal_data.person_name + ", " + person.personal_data.person_age + "</h1>"
      var formatted_date = this.datepipe.transform(person.schedule_data.schedules[0].schedule_startdate, 'EEEE, MMMM dd');
       if(!formatted_date){
          formatted_date="";
       }
      html += "<p>" + formatted_date + "</p>";
      html += "<p>" + person.schedule_data.schedules[0].schedule_location_city + "</p>";
      html += "<p>" + person.schedule_data.schedules[0].schedule_location_country + "</p>";
      html += "<p>" + person.personal_attributes.occupation + "</p>";
      html += "<p>" + person.personal_attributes.education + "</p>";
      html += "<p>" + person.personal_attributes.bio + "</p>";

      this.elements.detailsData.html(html);
    }

//-----------------Adding the details for current person details END------------------------


//-----------------Adding the details for Next person details START-------------------------
    var nextPerson = this.people[this.currentPerson + 1];
    if (nextPerson == undefined) {
      console.log("Hiding next person");
      this.elements.nextCard.css("display","none");
      // nextPerson = this.people[0];
    } else {
      this.elements.nextCard.css("display","block");
      console.log("Next");
      console.log(nextPerson);


      let nextPersonSortedCardImages=[];
      try {
        nextPersonSortedCardImages=nextPerson.personal_attributes.profile_pictures;

        this.getInvalideImages(nextPersonSortedCardImages);

        nextPersonSortedCardImages.sort(function (a, b) {
          return a.image_position - b.image_position;
        });   
      } catch(Exception){

      }

      if (nextPersonSortedCardImages[0] != undefined) {
        console.log("Showing next person");
        this.elements.nextImage.css("background-image", "url('" + nextPersonSortedCardImages[0].link + "')");

      } else {
        console.log("Not showing");
        this.elements.nextImage.css("background-image", "none");
      }
      this.elements.nextDetails.html(this.buildNotes(nextPerson));

      var nextTotalImages = nextPerson.personal_attributes.profile_pictures.length;
      html = "<em>&#x25cf</em>";
      for (var i = 2; i <= nextTotalImages; i++) {
          html = html + "&#x25cf";
      }

      this.elements.nextBreadcrumbs.html(html);
      this.elements.nextDetails.html(this.buildNotes(nextPerson));

//-----------------Adding the details for Next person details END--------------

      if (this.currentPerson > (this.people.length - 5)) {
         this.getMatches(localStorage.getItem('schedule_ids_list'),0,true);
      }
    }

  }//END showCard().


//------------------------Report person------------------------
  presentPrompt() {
    this.currentPersonDetails;
    this.closeTransitionBtm();
    
    let alert = this.alertCtrl.create({
      title: 'Report '+this.currentPersonDetails.personal_data.person_name,
      subTitle: 'Please provide detail on why you are reporting '+this.currentPersonDetails.personal_data.person_name,
      cssClass:'reportAlert',
      enableBackdropDismiss: true,
      inputs: [
        {
          type: 'textarea',
          name: 'report',
          placeholder: 'Please add detail here.'
        }
      ],
      buttons: [
        {
          text: 'Report',
          handler: data => {
            if(data.report.length>0){
                this.reportPerson(data.report);
            }
        
          }
        },
        {
          text: 'X',
          cssClass:'reportAlertClose',
          handler: data => {
            this.presentPrompt();
          }
        }
      ]
    });
    
    alert.present();
  }

  
  //-----------------------------------------------------------

  // Swith on the outnow flag
  toggleOutnow() {
    this.outnow = !this.outnow;
    if (!this.outnow) {
      this.elements.card.removeClass("outnow");
    } else {
      this.elements.card.addClass("outnow");
    }
  }

  sendSwipe(direction, person) {
    let self = this;
    let dateValue = new Date().toISOString();

    var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
    dateValue = moment((new Date(Date.now() - tzoffset)))['_d'].toISOString().slice(0, -1);

    try{
      //Hear we need the display the Matched card.
      if(person.personal_data.liked && direction == "right"){
        self.matchesSwipe1 = "block";
        if(self.matchedProfileImage=person.personal_attributes.profile_pictures[0].link){
            self.matchedProfileImage=person.personal_attributes.profile_pictures[0].link;
        }
        if(localStorage.getItem("profilepic")){
          this.myProfileImage=localStorage.getItem("profilepic");
        }
      }
    }catch(Exception){

    }

    let body = {
      swipes: [{
        person_id: self.personId,
        swiped_person_id: person.personal_data.person_id,
        swiped_direction: (direction == "right" ? 2 : 1),
        swiped_date: dateValue
      }]
    }

    let headers = new Headers({ 'x-access-token': localStorage.getItem("authoKey") });
    let requestOptions = new RequestOptions({ headers: headers });
    
    self.http.post(self.appdetailsProvider.swipeCardUrl, body, requestOptions).subscribe(
      function (response) {
        let respBody = JSON.parse(response['_body']);
        console.log("sendSwipe " + JSON.stringify(respBody));
      }, function (error) {
        // TODO, some kind of handler for errors here, we can cache them and send later
        // Version 2
        console.log("sendSwipeError " + JSON.stringify(error));
      });
  }

 //-------------Auto Refresh Card start----------------
  setTimeIntervalForRefresh(){
        if (this.people.length == 0 || this.people) {
            this.task = setInterval(() => {
              if(parseInt(localStorage.getItem('homePageRefreshCount')) < 20){
                let intervalRefreshCount = +localStorage.getItem('homePageRefreshCount');
                localStorage.setItem('homePageRefreshCount',(intervalRefreshCount + 1).toString());

                if (this.people.length == 0 || !this.people) {
                  this.clickRefreshIcon(true);
                } else {
                  clearInterval(this.task);
                  localStorage.setItem('homePageRefreshCount','0');
                }

              } else {
                clearInterval(this.task);
                localStorage.setItem('homePageRefreshCount','0');
              }
            }, this.REFRESH_TIME_OUT);
        } else {
          clearInterval(this.task);
          localStorage.setItem('homePageRefreshCount','0');
        }
  }

  clickRefreshIcon(fromInterval?) {
    
      if(!fromInterval) {
      clearInterval(this.task);
      localStorage.setItem('homePageRefreshCount','0');
      this.setTimeIntervalForRefresh();
    }

    if(this.toolBarIconColor === "flotWhite"){
        this.isFromPage= "Anytime";
        this.setOutNowBackgrount();
    }

    this.refreshMsg="Please wait..."; /*+localStorage.getItem('homePageRefreshCount')*/
    this.rotateClass='noAnimate addAnimate';
    if(this.appdetailsProvider.CheckConnectionWithoutMessage()) {

      this.dateValue ="";
      this.schedule_id ="";
      this.getMatches(localStorage.getItem('schedule_ids_list'));  
    } else { 
      setTimeout(() => {
          this.refreshMsg='No internet connection';
          this.rotateClass='noAnimate';
      },2000);
    }
  }
  //-------------Auto Refresh Card end----------------

   getMatches(scheduleIds, retry?,dontClear?) {
    if (retry == undefined) {
      retry = 0;
    }
    let self = this;
    this.getInternetDownloadingSpeed();


    console.log("Getting matches for", scheduleIds, retry);
    console.log("This schedule list is", this.schedulList);
    console.log("Device internet speed ", self.connectionSpeed);

    //scheduleIds = this.schedulList; // #fudge
    let personId = localStorage.getItem("person_id");
    let mode = localStorage.getItem("FTUE_MODE");

    if(!localStorage.getItem("FTUE_MODE") || mode==null){
      mode='';
    }

    if (scheduleIds == null) {
      scheduleIds = "";
    }
    let body;
    
    if(mode==='chatnow') {
        body = {
          person_id: personId,
          schedule_ids: [''],
          network_speed : self.connectionSpeed,
          mode : mode
        }
    } else {
        body = {
          person_id: personId,
          schedule_ids: scheduleIds !== null && scheduleIds.split(","),
          network_speed : self.connectionSpeed,
          mode : mode
        }
    }

    let headers = new Headers({ 'x-access-token': localStorage.getItem("authoKey") });
    let requestOptions = new RequestOptions({ headers: headers });

    console.log("GetMatch_API_Req :-> "+JSON.stringify(body));
    
    self.http.post(self.appdetailsProvider.matchesUrl, body, requestOptions).subscribe(
        //success part
        function (response) {
          self.noConnection = false;
          console.log("Success getting matches");
          let respBody = JSON.parse(response['_body']);
          console.log("GetMatch_API_Resp :-> "+JSON.stringify(respBody));
          //respBody=self.matchsList; // hard coded data in matchsList array.
          //need to uncommend /*******/
          // No, this matchsList array is hardcoded matches list, We are using this for testing purpose only.
          //-------

          if (!dontClear) {
            self.people = [];
            self.currentPerson=0;
          }
          if(respBody.length > 0){
            clearInterval(self.task);
          }

          //deduplicate the response body
          for (var i = 0; i < respBody.length; i++) {
            var matched = false;
            for (var j = 0; j < self.people.length; j++) {
              if (self.people[j].personal_data.person_id == respBody[i].personal_data.person_id) {
                var matched = true;
                break;
              }
            }
            if (!matched) {
              self.people.push(respBody[i]);
            }
          }

          self.refreshMsg='Refresh to see new matches';
          self.rotateClass='noAnimate';

          console.log("Got", self.people.length, "people");
          
          if (self.people.length > 20) {
            console.log("Too many people, shifting");
            for (var i = 1; i < self.currentPerson; i++) {
              self.people.shift();
              self.currentPerson = self.currentPerson - 1;
            }
            console.log("Now got", self.people.length, "people");
          }

          //self.noConnection = self.people.length > 0 ? false : true;
          //We have setTimeout for cheking the brocken images from main array.

          setTimeout(() => {
               if (!dontClear) {
                 //self.asyncMethod();
                 self.showCard();
               }
          },1500);


          /* setTimeout(() => {
               self.showCard();
          },200); */

        }, function (error) {
          console.log("error " + JSON.stringify(error));
          if (retry < 4) {
            self.getMatches(scheduleIds, retry + 1);
          } else {
            console.log("FAILED TO GET MATCHES"); // TODO set a flag here
            self.noConnection = true;
            self.showCard();
            self.refreshMsg ='refresh to see new matches';
            self.rotateClass ='noAnimate';
          }
        });
  }

  retryMatches() {
    this.getMatches(localStorage.getItem('schedule_ids_list'));
  }

  swipeInitialise() {
    let self = this;
    console.log("Initialising v0.0.10");
    this.elements.page = $("#page-content > .scroll-content");
    this.elements.main = $("#swipe-main");
    this.elements.card = $("#swipe-card1");
    this.elements.cardNotes = $("#swipe-notes");
    this.elements.signs = {};
    this.elements.signs.left = $("#swipe-sign-left");
    this.elements.signs.right = $("#swipe-sign-right");
    this.elements.breadcrumbs = $('#swipe-main-breadcrumbs');
    this.elements.details = $("#person-details");
    this.elements.detailsData = $("#person-data");

    this.cardWidth = this.elements.card.width();
    setTimeout(function () {
      self.cardWidth = self.elements.card.width();
      // Move details div to correct place
      var padding = self.elements.card.height() - 65;
      console.log("Setting top to this", padding);
      self.elements.details.css("padding-top", padding + "px");
      console.log("Width is now", self.cardWidth);
    }, 100);

    this.elements.images = [];

    for (var i = 0; i <= 6; i++) {
      this.elements.images.push($("#swipe-main-image-" + i));
    }

    this.elements.nextCard = $("#swipe-card2");
    this.elements.nextImage = $("#swipe-next-image");
    this.elements.nextDetails = $("#swipe-next-notes");
    this.elements.nextBreadcrumbs = $('#swipe-next-breadcrumbs');
   
   
   this.getMatches(localStorage.getItem('schedule_ids_list'));

  }

  closeMatch() {
    this.showSwipeMatched = false;
    this.matchesSwipe1 = "none";
  }

  getSettingData() {
    console.log("Getting profile hidden");
    let self = this;
    self.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM settingsTb", []).then((data) => {
      self.isProfileOn = data.rows.item(0).profilevisible === "true" ? true : false;
    }, (error) => {
      console.log("Getting setting data");
      self.isProfileOn = false;
    });
  }

  isProfileOn: any = true;
  isCardDisplaying: any = true;
  noMatchesFound: any = false;
  norecordsFound: any = true;
  matchsList: any;

  isFromPage: any = "Anytime";
  anyTimeTextColor: any = "anyTimeTextBlack";
  toolBarIconColor: any = "flotBlack";
  dateValue: any = "";
  schedulList: any = "";
  schedule_id: any = "";

  opacityDiv1: any = 0;
  opacityDiv2: any = 0;
  matchesSwipe1: any = "none";
  calenderOptionValue: any = "none";
  swipeEvent($e) {
    if ($e.deltaX >= 0) {

      this.opacityDiv1 = $e.deltaX / 100;
    } else {
      this.opacityDiv2 = -$e.deltaX / 100;
    }
  }


  sortDateCalIcon(Option) {

    console.log("Option :-->" + Option);
    this.calenderOptionValue = Option;
  }


  public my_Class = 'style1';
  toggle_class() {
    if (this.my_Class == "style1") {
      this.my_Class = 'style1 style2';
    } else {
      this.my_Class = 'style1';
    }
  }

  @ViewChild('cardLog') cardLogContainer: any;
  @ViewChild('tinderCardLog') tinderCardLogContainer: any;
  @ViewChildren('userImages') userImages: QueryList<Slides>;

  items: any[] = [];
  startindex: any = 0;
  mainarray: any[] = [];
  cards: any[] = [];
  cardCursor: number = 0;
  orientation: string = "x";
  overlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };

  cardLogs: any = [];
  tinderCardLogs: any = [];

  index: any = 0;

  navigator: any = '';
  personId: any = "";
  swipedCardObj: any;

  task: any;

  //public outNowClass = 'outNowClass';
  //public outNowClassHead = 'outNowClassHead';

  public outNowClass = '';
  public outNowClassHead = '';
  public outNowClassIsProfileOn = '';
  public outNowLabel = "I'm out NOW!";
  showFilter=true;
  firstTimeuserExp:any=false;

  

  ionViewWillUnload(){
    
    clearInterval(this.task);
  }

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public appdetailsProvider: AppdetailsProvider,
    private popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private diagnostic: Diagnostic,
    public alertCtrl: AlertController,
    public broadcaster: Broadcaster,
    public modalCtrl: ModalController,
    public datepipe: DatePipe) {

     
     if (this.people.length == 0 || this.people) {
      if(parseInt(localStorage.getItem('homePageRefreshCount')) < 20){
        this.setTimeIntervalForRefresh();
      }
     }

     /*if(!appdetailsProvider.globleInstagramImages || appdetailsProvider.globleInstagramImages.length == 0){
       
       this.getInstagramImagesFromLocalTb();
     }*/
     try{
        if(localStorage.getItem("profilepic")) {
          this.myProfileImage=localStorage.getItem("profilepic");
          this.getprofileData();
        } else{
          this.getprofileData();
        }
     } catch(Exception){

     }

     
    
    this.firstTimeuserExp=localStorage.getItem("firstTimeuserExp");
    let methodinstance = this;
    appdetailsProvider.rootContext = this;
    let self = this;
    this.personId = localStorage.getItem("person_id");
    this.isFromPage = navParams.get('isFromPage');

    this.dateValue = navParams.get('dateValue');
    this.schedule_id = navParams.get('schedule_id');
    
    /*if(navParams.get('isFromNotification')){
      const index = this.viewCtrl.index;
      
      if(index>0){
     no       this.navCtrl.remove(index);
      }
      navCtrl.push(Messages);
    }*/

    try {
    if (!appdetailsProvider.getDbInstance()) {
      appdetailsProvider.createTable();
      setTimeout(() => {
        this.getSettingData();
      }, 1000);
    } else {
      this.getSettingData();
    }
 

    if (this.schedule_id) {
      console.log('I am in true block');
      this.schedulList = this.schedule_id;

      setTimeout(() => {
        // IS THIS RIGHT?
        self.getMatches(this.schedulList);
      }, 1000);
    } else {
      // console.log('I am in else block'+localStorage.getItem('schedule_ids_list'));
      this.schedulList = localStorage.getItem('schedule_ids_list'); //This user all schedul list ids 

      // setTimeout(() => { // Here?
      //   this.imagedate(localStorage.getItem('schedule_ids_list'));
      // }, 200);
    }

    

    } catch(Exception){
      console.log("EEERRRRRROOOORRRR");
  }

  this.broadcaster.addEventListener('pushNotification').subscribe((event) => {
    if(event.messagetype=="message"){
      if(localStorage.getItem("messageIconColor")==='1') {
        this.isNewMatchesFound=true;
      } else {
        this.isNewMatchesFound=false;
      }
    }
  });


  }

  goToSlideNext(i) {
    
    if (this.dateSwipeBtm !== 'dateSwipeBtmHide') {
      this.closeTransitionBtm();
    } else {
      let cardsSliderArray = this.userImages.toArray();

      if (cardsSliderArray.length > 0) {
        let cardSlider = cardsSliderArray[i];
        cardSlider.slideNext();
      }
      //this.userImages.slideNext();
    }
  }
  goToSlidePrev(i) {
    
    if (this.dateSwipeBtm !== 'dateSwipeBtmHide') {
      this.closeTransitionBtm();
    } else {
      let cardsSliderArray = this.userImages.toArray();
      if (cardsSliderArray.length > 0) {
        let cardSlider = cardsSliderArray[i];
        cardSlider.slidePrev();
      }
      //this.userImages.slidePrev();
    }
  }
  goToSetting(goto?) {
    
    if(goto == undefined) {
      this.navCtrl.push(SettingsubPage);
    } else {
      this.navCtrl.push(SettingsubPage,{isFromProfileTurnOff:'isFromProfileTurnOff'});
    }
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    
    let self = this;
    this.getSettingData();
    this.loadJsonFile();
     try{
       if(localStorage.getItem("messageIconColor")==='1') {
        this.isNewMatchesFound=true;
      } else {
        this.isNewMatchesFound=false;
      }


      if(localStorage.getItem("FTUE_MODE")==='chatnow' && localStorage.getItem("FTUE_MODE")){
          this.modeOfCurrentPersonImg="assets/imgs/ChatIcons.png"
          this.modeOfNextPersonImg="assets/imgs/ChatIcons.png"
      } else if(localStorage.getItem("FTUE_MODE")==='outnow' && localStorage.getItem("FTUE_MODE")){
          this.modeOfCurrentPersonImg="assets/imgs/outNow_match.png"
          this.modeOfNextPersonImg="assets/imgs/outNow_match.png"
      }else{
          this.modeOfCurrentPersonImg="assets/imgs/calenderIcons.png"
          this.modeOfNextPersonImg="assets/imgs/calenderIcons.png"
      }

     }catch(Exception){
       
     }
   
  
  }

  ionViewDidLoad() {
    this.swipeInitialise();
    this.setOutNowBackgrount();

    try{
       if(localStorage.getItem("messageIconColor")==='1') {
        this.isNewMatchesFound=true;
      } else {
        this.isNewMatchesFound=false;
      }


      if(localStorage.getItem("FTUE_MODE")==='chatnow' && localStorage.getItem("FTUE_MODE")){
        this.modeOfCurrentPersonImg="assets/imgs/ChatIcons.png"
        this.modeOfNextPersonImg="assets/imgs/ChatIcons.png"
      } else if(localStorage.getItem("FTUE_MODE")==='outnow' && localStorage.getItem("FTUE_MODE")){
          this.modeOfCurrentPersonImg="assets/imgs/outNow_match.png"
          this.modeOfNextPersonImg="assets/imgs/outNow_match.png"
      }else{
          this.modeOfCurrentPersonImg="assets/imgs/calenderIcons.png"
          this.modeOfNextPersonImg="assets/imgs/calenderIcons.png"
      }

     }catch(Exception){
       
     }
  }

  setOutNowBackgrount(isFrom?){
    
    let OutNow_end_dateTime = localStorage.getItem('OutNow_end_dateTime');
    
    console.log("OutNow end Date : " + OutNow_end_dateTime);

    

    if (this.platform.is('ios')) {
      let spliteDate = OutNow_end_dateTime.split(' ');
      let fixedDate = spliteDate[0];
      let hr = parseInt(spliteDate[1].split(':')[0]);
      let min = spliteDate[1].split(':')[1];
      let aa = spliteDate[2];
      let HH = aa === 'PM' ? hr + 12 : hr;
      let finalDateFormate = fixedDate + "T" + HH + ":" + min + ":00.000Z";

      let date: Date = new Date(moment(finalDateFormate).toDate());
      let endDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

    let currentDate: Date = new Date();
      let currentDateUTCFormate  = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds());

      
      if(endDate < currentDateUTCFormate) {
        this.navCtrl.push(OutNowMainPage,{isFrom:"FTUE"});
      }

      if(endDate >= currentDateUTCFormate) {

        //localStorage.setItem('OutNow_end_dateTime', "");

        this.outNowClass = 'outNowClass';
        this.outNowClassHead = 'outNowClassHead';
        this.anyTimeTextColor = "anyTimeTextWhile";
        this.toolBarIconColor = "flotWhite";
        this.outNowLabel = "I’m back in";
        this.showFilter=false;
        this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
        if(isFrom && localStorage.getItem('OutNow_scheduleIdsList')){
          this.getMatches(localStorage.getItem('OutNow_scheduleIdsList'),0,false);
        }

      } else if (this.isFromPage === "OutNow") {

        this.outNowClass = 'outNowClass';
        this.outNowClassHead = 'outNowClassHead';
        this.anyTimeTextColor = "anyTimeTextWhile";
        this.toolBarIconColor = "flotWhite";
        this.outNowLabel = "I’m back in";
        this.showFilter = false;
        this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
      } else {
        //------------------------------------------------------
        this.outNowClass ='';
        this.outNowClassHead ='';
        this.outNowClassIsProfileOn ='';
        this.outNowLabel ="I'm out NOW!";
        this.isFromPage= "Anytime";
        this.toolBarIconColor= "flotBlack";
        this.showFilter=true;

        localStorage.setItem('OutNow_end_dateTime','');
        //------------------------------------------------------
      }
    } else {

      // my changes
      
      let date=new Date();
      let currentdate  = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

      if(new Date(this.datepipe.transform(OutNow_end_dateTime,'yyyy-MM-dd hh:mm a')) >= new Date()/*new Date(this.datepipe.transform(currentdate.toString(),'yyyy-MM-dd hh:mm a'))*/){

        //localStorage.setItem('OutNow_end_dateTime', "");

        this.outNowClass = 'outNowClass';
        this.outNowClassHead = 'outNowClassHead';
        this.anyTimeTextColor = "anyTimeTextWhile";
        this.toolBarIconColor = "flotWhite";
        this.outNowLabel = "I’m back in";
        this.showFilter = false;
        this.outNowClassIsProfileOn = "outNowClassIsProfileOn";

        if(isFrom && localStorage.getItem('OutNow_scheduleIdsList')){
          this.getMatches(localStorage.getItem('OutNow_scheduleIdsList'),0,false);
        }

      } else if (this.isFromPage === "OutNow") {
        this.outNowClass = 'outNowClass';
        this.outNowClassHead = 'outNowClassHead';
        this.anyTimeTextColor = "anyTimeTextWhile";
        this.toolBarIconColor = "flotWhite";
        this.outNowLabel = "I’m back in";
        this.showFilter = false;
        this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
      } else {
        //------------------------------------------------------
        this.outNowClass ='';
        this.outNowClassHead ='';
        this.outNowClassIsProfileOn ='';
        this.outNowLabel ="I'm out NOW!";
        this.isFromPage= "Anytime";
        this.toolBarIconColor= "flotBlack";
        this.showFilter=true;
        localStorage.setItem('OutNow_end_dateTime','');
        //------------------------------------------------------
      }
    }
  }

  imagedate(schedulList) {
    let methodinstance = this;
    
    if (1 == 1) {
      return;
    }
    

    if (!methodinstance.appdetailsProvider.CheckConnectionWithoutMessage()) {
      methodinstance.cards = [];
      methodinstance.noMatchesFound = true;
      return;
    }

    if (schedulList === null) {
      schedulList = '';
    }

    if (methodinstance.appdetailsProvider.cardListArray.length > 0) {
      this.cards = methodinstance.appdetailsProvider.cardListArray;
    } else {
      if (schedulList.length) {
        let personId = localStorage.getItem("person_id");

        let body = {
          person_id: personId,
          schedule_ids: schedulList !== null && schedulList.split(","),
          network_speed : methodinstance.appdetailsProvider.ConnectionSpeed()
        }

        //body1 is for testing.
        let body1 = {
          person_id: "0af234ee-d800-191d-5ca2-40f8445e8bea",
          schedule_ids: ["431bdac2-a606-65fe-4e2f-5ad151c378f8", "4deb8c34-d01f-76fe-a015-8d844c9ca67b"]
        }

		  let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
      let requestOptions = new RequestOptions({headers: headers});
		
      console.log(JSON.stringify(body));

		  methodinstance.http.post(methodinstance.appdetailsProvider.matchesUrl, body,requestOptions)
          .subscribe(
            //success part
            function (response) {

              console.log("success");
              
              let respBody = JSON.parse(response['_body']);
              //respBody=methodinstance.matchsList;
              methodinstance.mainarray = respBody;
              methodinstance.cards = respBody;
              methodinstance.noMatchesFound = methodinstance.cards.length > 0 ? false : true;
            }, function (error) {

              console.log("error " + JSON.stringify(error));
              console.log("IdList " + methodinstance.schedulList);

              setTimeout(() => {
                methodinstance.noMatchesFound = false;
                if (methodinstance.schedulList) {
                  methodinstance.imagedate(methodinstance.schedulList);
                }
              }, 200);
            }
          );
      } else {
        methodinstance.noMatchesFound = true;
      }
    }
  }

  profilePage() {
    //this.navCtrl.push(ProfilescreenPage);
    this.navCtrl.push(SettingsmainPage, {}, {animate: true, direction:'back'});
  }


  like(like) {
    console.log("value :--> like");
    var self = this;
    if (this.cards.length > 0) {
      self.cards[this.cardCursor++].likeEvent.emit({ like });
      // DO STUFF WITH YOUR CARD
      this.tinderCardLogs.push("callLike(" + JSON.stringify({ like }) + ")");
      this.scrollToBottom(this.tinderCardLogContainer);
    }
  }

  onCardLike(event) {
    console.log("value :--> onCardLike");
    var item = this.cards[this.cardCursor++];
    // DO STUFF WITH YOUR CARD
    this.tinderCardLogs.push("onLike(" + JSON.stringify(event) + ")");
    this.scrollToBottom(this.tinderCardLogContainer);
  }

  getKittenUrl() {
    console.log("value :--> getKittenUrl");
    var w = 500 - Math.floor((Math.random() * 100) + 1);
    var h = 500 - Math.floor((Math.random() * 100) + 1);
    return "http://placekitten.com/" + w + "/" + h;
  }

  onRelease(event, i) {
    
    if (event.additionalEvent == "panright") {
      //this.matchesSwipe1 = "block"

      this.sendSwipRequestToApi("2", i);

    } else {

      if (event.center.x > 180 && event.additionalEvent != "panleft") {
        //this.matchesSwipe1 = "block";
        this.sendSwipRequestToApi("2", i);
      } else {
        this.sendSwipRequestToApi("1", i);
      }
    }

    if ((i + 1) == 5) {
      if (!this.schedule_id) {
        
        this.appdetailsProvider.getCartItemArray();
      }
    }

    if ((i + 1) % 10 == 0 && i + 1 != 0) {
      this.imagedate(this.schedulList);
    }

    this.cardLogs.push("onRelease(event)");
    this.scrollToBottom(this.cardLogContainer);

    this.opacityDiv1 = 0;
    this.opacityDiv2 = 0;
  }

  onAbort(event) {
    this.cardLogs.push("onAbort(event)");
    this.scrollToBottom(this.cardLogContainer);

    this.opacityDiv1 = 0;
    this.opacityDiv2 = 0;
  }

  onSwipe(event) {
    this.cardLogs.push("onSwipe(event)");
    this.scrollToBottom(this.cardLogContainer);
  }

  scrollToBottom(el) {
    setTimeout(() => {
      el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
    }, 100);
  }

  gotoFilter() {
    
    if (this.appdetailsProvider.CheckConnection()) {

      if (this.dateValue) {
        this.navCtrl.push(FilterPage, { isFromPage: "DateValue", schedule_id: this.schedule_id });
      } else {
        this.navCtrl.push(FilterPage, { isFromPage: this.isFromPage, schedule_id: this.schedule_id });
      }
    }
  }

  sendSwipRequestToApi(swipedDirection, cardPosition) {
    let methodcontext = this;

    let dateValue = new Date().toISOString();
    //let dateValue1 = new Date().toDateString();
    //let dateValue2 = new Date().toLocaleString();

    methodcontext.swipedCardObj = this.cards[cardPosition];
    console.log("Swipe_person_name " + cardPosition + " :--> " + methodcontext.swipedCardObj.person_name);

    //---------------------------------------------
    this.Matches_PersonId = methodcontext.swipedCardObj.personal_data.person_id;
    this.Matches_Username = methodcontext.swipedCardObj.personal_data.person_name;
    this.Matches_Age = methodcontext.swipedCardObj.personal_data.person_age;
    this.Matches_Occupation = methodcontext.swipedCardObj.personal_attributes.occupation;
    this.Matches_Education = methodcontext.swipedCardObj.personal_attributes.education;
    this.Matches_Bio = methodcontext.swipedCardObj.personal_attributes.bio;
    //---------------------------------------------

    var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
    dateValue = moment((new Date(Date.now() - tzoffset)))['_d'].toISOString().slice(0, -1);

    
    if (methodcontext.swipedCardObj.personal_data.liked === true && swipedDirection === "2") {
      methodcontext.matchesSwipe1 = "block";
    }

    let body = {
      swipes: [{
        person_id: this.personId,
        swiped_person_id: methodcontext.swipedCardObj.personal_data.person_id,
        swiped_direction: swipedDirection,
        swiped_date: dateValue
      }]
    }

    console.log("SwapeCard_API_CALL" + JSON.stringify(body));

	  let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    methodcontext.http.post(methodcontext.appdetailsProvider.swipeCardUrl, body, requestOptions).subscribe(
      //success part
      function (response) {

        let respBody = JSON.parse(response['_body']);

        console.log("swipe-API Resp " + JSON.stringify(respBody));

      }, function (error) {

        console.log("swipe-Error Resp " + JSON.stringify(error));
      });
  }

  messagePage() {
    if (this.appdetailsProvider.CheckConnection()) {
      this.navCtrl.push(Messages);
      this.matchesSwipe1 = "none";
    }else{
      this.matchesSwipe1 = "none";
    }
  }

  /*gotoDatelist(fab: FabContainer) {
    fab.close();
    if (this.appdetailsProvider.CheckConnection()) {
      this.navCtrl.push(Datelist);
    }
  }
  gotoOutnow(fab: FabContainer) {
    fab.close();

    //if (this.appdetailsProvider.CheckConnection()) {
      if (this.outNowLabel === "I'm out NOW!") {
         //localStorage.setItem('currentLocation', "");
         //localStorage.setItem('currentCity', "");
          //this.navCtrl.push(Outnow);        
          this.navCtrl.push(OutNowMainPage,{isFrom:""});
      } else {
        if (this.appdetailsProvider.CheckConnection()) {
          this.confirmAlert();
        }
      }
    //}
  }*/


  confirmAlert() {
    if(1==1){
       return;
    }
    let alert = this.alertCtrl.create({
      subTitle: 'Do you want to be back in?',
      enableBackdropDismiss:false,
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
            if (this.appdetailsProvider.CheckConnection()) {
              this.deleteOutNowSchedules();
            }
          }
        }
      ]
    });
    alert.present();
  }

  deleteOutNowSchedules() {

    //if (this.appdetailsProvider.CheckConnection()) {

      let context = this;
      let outNowIdListObj: any[] = [];
      let outNowIdList: any[] = [];

      //context.appdetailsProvider.ShowLoading();

      let outNowIds = localStorage.getItem('OutNow_scheduleIdsList');

      outNowIds = outNowIds === null ? "" : outNowIds;

      if (outNowIds.length > 0) {

        outNowIdList = outNowIds.split(",");

        for (var i = 0; i < outNowIdList.length; i++) {
          outNowIdListObj.push({ "schedule_id": outNowIdList[i] });
        }

        let body = { person_id: this.personId, schedule: outNowIdListObj }

        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });


        headers.append('Content-Type', 'application/json');
		    headers.append('x-access-token', localStorage.getItem("authoKey"));

        console.log('Delete-Schedule ' + JSON.stringify(body));

        context.http.delete(context.appdetailsProvider.addschedule, new RequestOptions({
          headers: headers,
          body: body
        })).subscribe(function (response) {

          //context.appdetailsProvider.HideLoading();

          localStorage.setItem('OutNow_end_dateTime', "");

          context.isFromPage = "Anytime";
          context.anyTimeTextColor = "anyTimeTextBlack";
          context.toolBarIconColor = "flotBlack";
          context.outNowLabel = "I'm out NOW!";
		      context.showFilter=true;
          context.outNowClass = '';
          context.outNowClassHead = '';
          context.outNowClassIsProfileOn = '';
          localStorage.setItem('OutNow_scheduleIdsList',"");
          //console.log("Coming back in setting id's to " + localStorage.getItem('schedule_ids_list'));
          //console.log("Coming back in ShedulList = " + context.schedulList);
          //context.schedulList = localStorage.getItem('schedule_ids_list');
          /*setTimeout(() => {
            context.getMatches(localStorage.getItem('schedule_ids_list'));
          }, 200);*/
        }, function (error) {

          //context.appdetailsProvider.HideLoading();
        });
      } else {
        //context.appdetailsProvider.HideLoading();
        //context.appdetailsProvider.SomethingWentWrongAlert();
      }
    //}
  }

  closeFab(fab: FabContainer) {
    fab.close();
  }

  /*suhas changes 04-05-2018*/
  public dateSwipeBtm = 'dateSwipeBtmHide';
  Matches_PersonId: any = "";
  Matches_Username: any = "";
  Matches_Age: any = "";
  Matches_Occupation: any = "";
  Matches_Education: any = "";
  Matches_Bio: any = "";
  transitionBtm(item: any) {
    this.dateSwipeBtm = 'dateSwipeBtmHide dateSwipeBtmShow';

    this.Matches_PersonId = item.personal_data.person_id;
    this.Matches_Username = item.personal_data.person_name;
    this.Matches_Age = item.personal_data.person_age;
    this.Matches_Occupation = item.personal_attributes.occupation;
    this.Matches_Education = item.personal_attributes.education;
    this.Matches_Bio = item.personal_attributes.bio;
  }

  closeTransitionBtm() {
    this.dateSwipeBtm = 'dateSwipeBtmHide';
  }

  goToCalenderPage(){
      let currentLocation=localStorage.getItem('currentLocation');
      let currentCity=localStorage.getItem('currentCity');
      let current_geo_value=localStorage.getItem('current_geo_value');
      if(currentLocation && currentCity && current_geo_value){
        this.navCtrl.push(SchedulePage,{isFrom:"DateList"});
        //this.navCtrl.push(CalenderPage,{isFrom:"DateList"});
      } else {
        this.myLocation();
      }
    }

  //--------------------- get current location code-----------------------------------
  myLocation() {
    if (this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled().then((state) => {

        if (state == false) {
          this.appdetailsProvider.HideLoading();
          let alt = this.alertCtrl.create({
            title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
              text: 'Cancel', role: 'cancel', handler: () => {
              }
            },
            {
              text: 'Ok', handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }]
          });
          alt.present();
        } else {
          this.appdetailsProvider.ShowLoading();
          this.getMycurrentLocation();
        }
      }).catch(e => console.error(e));
    } else {
      this.diagnostic.isGpsLocationEnabled().then((state) => {

        if (state == false) {
          this.appdetailsProvider.HideLoading();
          let alt = this.alertCtrl.create({
            title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
              text: 'Cancel', role: 'cancel', handler: () => {
              }
            },
            {
              text: 'Ok', handler: () => {
                this.diagnostic.switchToLocationSettings();
              }
            }]
          });
          alt.present();
        } else {
          this.appdetailsProvider.ShowLoading();
          this.getMycurrentLocation();
        }
      }).catch(e => console.error(e));
    }
  }

  getMycurrentLocation() {
    var options = {
      enableHighAccuracy: false,
      timeout: Infinity,
      maximumAge: 10000
    };
    this.geolocation.getCurrentPosition(options).then((resp) => {
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;

      this.nativeGeocoder.reverseGeocode(latitude, longitude)
        .then((result: NativeGeocoderReverseResult) => {
          let country = result.countryName;
          let city = result.subAdministrativeArea;
          let state = result.administrativeArea;
          localStorage.setItem('currentLocation', state + ", " + country);
          localStorage.setItem('currentCity', city);
          localStorage.setItem('current_geo_value', latitude + "," + longitude);
          this.appdetailsProvider.HideLoading();
          this.navCtrl.push(SchedulePage,{isFrom:"DateList"});
          //this.navCtrl.push(CalenderPage, { isFrom: "DateList" });
        })
        .catch((error: any) => {
          console.log(error);
          this.appdetailsProvider.HideLoading();
        });
    }).catch((error) => {
      console.log('Error getting location', error);
      this.appdetailsProvider.HideLoading();
    });
  }
  //--------------------------------------------------------------------


  //--------Set the Placeholder when image won't load START-------

  tempArray:any[]=[];
  isGetBrokenImageCompleted:boolean=true;
  count:any=0;

  /*async asyncMethod(){
    let self=this;
    if(this.people.length > 0) {
      await self.getBrockenImages();

      setTimeout(() => {
           this.recurviceCall();
      },1500);
    } else {
      if(this.count < 10){
          this.count++;
          setTimeout(() => {
             this.asyncMethod();
        },500);
      } else {
        this.count=0;
        this.showCard();
      }
    }    
  }

  recurviceCall(){
    if(this.isGetBrokenImageCompleted){
       this.showCard();
     } else {
       setTimeout(() => {
         this.recurviceCall();
       },500);
     }
  }

  getBrockenImages(){
    try {
      this.tempArray=[];
      this.isGetBrokenImageCompleted=false;
        //-----find the undefined images in array-------
         for (var i = 0; i < this.people.length; i++) {
         let subArra=this.people[i].personal_attributes.profile_pictures;
         if(!this.isGetBrokenImageCompleted){
             this.isGetBrokenImageCompleted = (i+1)==this.people.length ? true : false;
         }
         
         for (var j = 0; j < subArra.length; j++) {

             let obj=this.http.get(subArra[j].link);
             obj.subscribe(data => {
                console.log("Image url getting Done");
             }, error => {
                console.log(error);
                console.log("Image url getting Error");
                this.tempArray.push(error.url);
             });
            }
          }
        //-----------------------------------------------
    } catch(Exception) {
      console.log("Image url getting Error Catch");
    }
  }*/

  getInvalideImages(cardList:any){
    try {
        //-----find the undefined images in array-------
                 
         for (var j = 0; j < cardList.length; j++) {
             let obj=this.http.get(cardList[j].link);
             obj.subscribe(data => {
               let respBody = data['_body'];
               let url = data['url'];
               if(respBody.length>10){
                console.log("Image url getting Done");
               }else{
                console.log("Image url getting Error");
                this.tempArray.push(url);
               }
             }, error => {
                console.log(error);
                console.log("Image url getting Error");
                this.tempArray.push(error.url);
             });
            }
        
        //-----------------------------------------------
    } catch(Exception) {
      console.log("Image url getting Error Catch");
    }
  }

//--------Set the Placeholder when image won't load END-----------

  loadJsonFile() {
        console.log('json called');
        let context=this;
            //Get the matches records for testing.
            //context.http.get('assets/data/matchesApiResp.json')
            context.http.get('assets/data/latestMatches.json')
                   .map(res => res.json())
                   .subscribe(data => { 
                    
                    context.matchsList = data;
                    console.log(data);
                   });
  }

//--------------Get the Instagram User details though Access Token START---------
  getInstagramPhotosFromToken(token){
    if(token.length>0){
      this.getInstagramUserInfo(token).subscribe(response => this.InstagramImages=response.data);
    }else{
      this.InstagramImages=[];
    }
  }

  getInstagramUserInfo(access_token) {
    //GET USER PHOTOS
    return this.http.get('https://api.instagram.com/v1/users/self/media/recent?access_token=' + access_token)
    .map((res:Response) => res.json());
  }
  //--------------Get the Instagram User details though Access Token END---------


  connectionSpeed:any=0;
  getInternetDownloadingSpeed() {
    let methodInstance=this;

    //reference link : https://stackoverflow.com/questions/4583395/calculate-speed-using-javascript

    let imageAddr = 'https://www.kenrockwell.com/contax/images/g2/examples/31120037-600.jpg'
    let startTime = 0, endTime = 0;
    let downloadSize = 151842;
    let download = new Image();

    startTime = (new Date()).getTime();
    download.onload = function () {
      endTime = (new Date()).getTime();
      download.src="";
      setTimeout(() => {
          //methodInstance.showResults(startTime,endTime,downloadSize);
        let speedBps = 0;
        let speedKbps = 0;
        let speedMbps = 0;
        let duration = 0;
        let bitsLoaded = 0;
        duration = (endTime - startTime)/1000;
         //duration = duration==0 ? 1 : duration;
         bitsLoaded = downloadSize * 8;
         speedBps = bitsLoaded / duration;
         speedKbps = parseInt((speedBps / 1024).toFixed(2));
          speedMbps = Number(((speedKbps / 1024)/10).toFixed(2));

        methodInstance.connectionSpeed = speedMbps;
      },500);
    }
    download.src = imageAddr;
  }

  openModalDisplayInstagramPhotos(index) {
        let modal = this.modalCtrl.create(ModalDisplayInstagramPhotos, { InstagramImages: this.InstagramImages,index: index});
        modal.onDidDismiss(data => {

        });
         modal.present();
      }

  getprofileData() {
      let methodinstance=this;
      methodinstance.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM profilepicTb WHERE position='1'", []).then((data) => {
             if(data.rows.length > 0) {
               this.myProfileImage = data.rows.item(0).imageurl;   
               localStorage.setItem("profilepic",this.myProfileImage);          
            }
          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error));
          });
  }


  /*-----------Report User dialog code STRAT-------------*/
  reportNow:boolean = false;
  description:any;
  reportMessage:any = '';
   /*report abuse sections*/
  public reportAbuse = "firstTimeUserExp firstTimeUserExpHide";
  reportAbuseClick(){
    this.reportAbuse= "firstTimeUserExp";
  }
  reportAbuseClose(){
    this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide"; 
  }
  otherSelect() {
    this.reportNow = true;
    setTimeout(() => {
        var objDiv = document.getElementById("scrollDiv");
        objDiv.scrollTop = objDiv.scrollHeight;
  }, 200);
  }
checkFocus(){
    setTimeout(() => {
        var objDiv = document.getElementById("scrollDiv"); 
        objDiv.scrollTop = objDiv.scrollHeight;
        this.reportAbuse= "firstTimeUserExp reportAbuseChanges";
    }, 200);
}
checkUnFocus(){
    setTimeout(() => {
        this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide";
    }, 200);    
}
    /*report abuse sections*/

  ionChange(selectedMessage) {
    let self=this;
    if(selectedMessage==='Other') {
      self.reportMessage=selectedMessage;
      self.reportNow = true;
      setTimeout(() => {
        var objDiv = document.getElementById("scrollDiv");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 200);
    } else {
      self.reportMessage=selectedMessage;
      self.reportNow = false;
      self.description='';
    }
    
  }

  reportUserButtonClicked(){
    if(this.reportMessage==='Other'){
      
      if(this.description && this.description !== ''){
        this.reportPerson(this.description);
        this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide";
      } else {
        this.appdetailsProvider.ShowToast('Please enter the description',3000);
      }
    } else {
       if(this.reportMessage!==''){
        this.reportPerson(this.reportMessage);
        this.reportAbuse= "firstTimeUserExp firstTimeUserExpHide";
      }else{
        this.appdetailsProvider.ShowToast('Please select the report',3000);
      }
    }
  }

  reportPerson(reportingDetails:any){
    let context=this;
    context.appdetailsProvider.ShowLoading();    
    
    let reportReq = {
                      person_id: this.personId,
                      reportedby_person_id: this.currentPersonDetails.personal_data.person_id,
                      report_description: reportingDetails
                     };
    
    let headers = new Headers({'x-access-token': localStorage.getItem("authoKey")});
    let requestOptions = new RequestOptions({headers: headers});

    this.http.post(this.appdetailsProvider.reportUser,reportReq,requestOptions)
    .subscribe(
        function(response) {
              
              context.appdetailsProvider.HideLoading();
              let temp=JSON.parse(response['_body']).result;
              if(temp === "success"){
                  //context.popupAlert();
                  let alert = context.alertCtrl.create({
                      subTitle:'User Reported!',
                      enableBackdropDismiss: true,
                      buttons: ['ok']
                    });
                    alert.present();
                    context.description='';
              }

        },function(error) {
          context.appdetailsProvider.HideLoading();
        });
  }

  /*-----------Report User dialog code END -------------*/

}//class END

//-------------- Display Instagram Photos Modele START------------------
@Component({template: `
<ion-header class="modalHeader searchSecion">
  <ion-navbar class="borderBottomNone">
    <ion-title>
      <span class="headerCancelTxt" (click)="closeModal();"><i class="fa fa-angle-left" aria-hidden="true"></i></span>
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content>
  <ion-slides pager>
    <div *ngFor="let image of InstagramImages">
      <ion-slide>
        <img class="insideSlideImg ng2-lazyloaded imageSize" [defaultImage]="image.images.low_resolution.url" [lazyLoad]="image.images.standard_resolution.url" [offset]="offset">
      </ion-slide>
    </div>
</ion-slides>
</ion-content>`})

export class ModalDisplayInstagramPhotos {

  InstagramImages:any = [];
  index:any=0;
  offset:any  = 100;

  @ViewChild(Slides) slides: Slides;

  constructor(public platform: Platform,
    public http:Http,
    public viewCtrl: ViewController,
    public params: NavParams,
    public navCtrl: NavController){
    
    this.InstagramImages=params.get('InstagramImages');
    this.index=params.get('index');
    this.goToSlide(this.index);

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  goToSlide(index) {
    setTimeout(()=>{
    this.slides.slideTo(index, 50);
    },50);
  }

}