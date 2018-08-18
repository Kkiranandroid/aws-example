var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewEncapsulation, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, PopoverController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
//import { SwipeCardsModule } from './ng2-swipe-cards/index.ts';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppdetailsProvider } from '../../providers/appdetails/appdetails';
import { Messages } from '../messages/messages';
import { Datelist } from '../datelist/datelist';
import { OutNowMainPage } from '../out-now-main/out-now-main';
import { SettingsubPage } from '../settingsub/settingsub';
import { NotificationPopupPage } from '../notification-popup/notification-popup';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CalenderPage } from '../calender/calender';
import { SettingsmainPage } from '../settingsmain/settingsmain';
import { FilterPage } from '../filter/filter';
import { DatePipe } from '@angular/common';
import moment from 'moment';
var HomePage = /** @class */ (function () {
    function HomePage(platform, navCtrl, navParams, http, appdetailsProvider, popoverCtrl, viewCtrl, geolocation, nativeGeocoder, diagnostic, alertCtrl, datepipe) {
        var _this = this;
        this.platform = platform;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.appdetailsProvider = appdetailsProvider;
        this.popoverCtrl = popoverCtrl;
        this.viewCtrl = viewCtrl;
        this.geolocation = geolocation;
        this.nativeGeocoder = nativeGeocoder;
        this.diagnostic = diagnostic;
        this.alertCtrl = alertCtrl;
        this.datepipe = datepipe;
        //Refreshing the page every 1 min
        this.REFRESH_TIME_OUT = 1000 * 60;
        this.toolBarIconColorMsg = '';
        this.refreshMsg = 'refresh to see new matches';
        this.rotateClass = 'noAnimate';
        this.people = [];
        this.swipeDelay = 200;
        this.resetTimeout = 0;
        this.resetting = false;
        this.elements = {};
        this.drag = {};
        this.gettingMatches = false;
        this.dragInProgress = false;
        this.outnow = false;
        this.isFabShowing = true;
        this.cardWidth = 0;
        this.currentPerson = 0;
        this.currentImage = 1;
        this.totalImages = 1;
        this.swipeThreshold = 0.15; // If we have moved over the threshold confirm yes or no, to make the user have to swipe further increase this number
        this.dragThreshold = 0.25; // Drags will only complete if the user has dragged a certain percentage across the screen, to adjust this change the number here
        this.showSwipeMatched = false;
        this.swipeMode = true;
        this.noConnection = false;
        this.isProfileOn = true;
        this.noMatchesFound = false;
        this.isFromPage = "Anytime";
        this.anyTimeTextColor = "anyTimeTextBlack";
        this.toolBarIconColor = "flotBlack";
        this.dateValue = "";
        this.schedulList = "";
        this.schedule_id = "";
        this.opacityDiv1 = 0;
        this.opacityDiv2 = 0;
        this.matchesSwipe1 = "none";
        this.calenderOptionValue = "none";
        this.my_Class = 'style1';
        this.items = [];
        this.startindex = 0;
        this.mainarray = [];
        this.cards = [];
        this.cardCursor = 0;
        this.orientation = "x";
        this.overlay = {
            like: {
                backgroundColor: '#28e93b'
            },
            dislike: {
                backgroundColor: '#e92828'
            }
        };
        this.cardLogs = [];
        this.tinderCardLogs = [];
        this.index = 0;
        this.navigator = '';
        this.personId = "";
        //public outNowClass = 'outNowClass';
        //public outNowClassHead = 'outNowClassHead';
        this.outNowClass = '';
        this.outNowClassHead = '';
        this.outNowClassIsProfileOn = '';
        this.outNowLabel = "I'm out NOW!";
        this.showFilter = true;
        /*suhas changes 04-05-2018*/
        this.dateSwipeBtm = 'dateSwipeBtmHide';
        this.Matches_PersonId = "";
        this.Matches_Username = "";
        this.Matches_Age = "";
        this.Matches_Occupation = "";
        this.Matches_Education = "";
        this.Matches_Bio = "";
        debugger;
        if (this.people.length == 0 || this.people) {
            if (parseInt(localStorage.getItem('homePageRefreshCount')) < 20) {
                this.setTimeIntervalForRefresh();
            }
        }
        var methodinstance = this;
        appdetailsProvider.rootContext = this;
        var self = this;
        this.personId = localStorage.getItem("person_id");
        this.isFromPage = navParams.get('isFromPage');
        this.dateValue = navParams.get('dateValue');
        this.schedule_id = navParams.get('schedule_id');
        /*if(navParams.get('isFromNotification')){
          const index = this.viewCtrl.index;
          debugger;
          if(index>0){
     no       this.navCtrl.remove(index);
          }
          navCtrl.push(Messages);
        }*/
        if (!appdetailsProvider.getDbInstance()) {
            appdetailsProvider.createTable();
            setTimeout(function () {
                _this.getSettingData();
            }, 1000);
        }
        else {
            this.getSettingData();
        }
        if (this.schedule_id) {
            console.log('I am in true block');
            this.schedulList = this.schedule_id;
            setTimeout(function () {
                // IS THIS RIGHT?
                debugger;
                self.getMatches(_this.schedulList);
            }, 1000);
        }
        else {
            // console.log('I am in else block'+localStorage.getItem('schedule_ids_list'));
            this.schedulList = localStorage.getItem('schedule_ids_list'); //This user all schedul list ids 
            // setTimeout(() => { // Here?
            //   this.imagedate(localStorage.getItem('schedule_ids_list'));
            // }, 200);
        }
        if (localStorage.getItem("messageIconColor") === "0") {
            this.toolBarIconColorMsg = "flotBlack";
        }
    }
    HomePage.prototype.transitionImages = function (showId, hideId, showTransition, hideTransition, startPosition) {
        var self = this;
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
    };
    HomePage.prototype.swipeOutCard = function (direction) {
        var self = this;
        this.resetting = true;
        this.elements.card.addClass("swipe-out-" + direction);
        this.resetTimeout = setTimeout(function () {
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
            self.drag.startY = -1;
            if (direction != "reset") {
                //self.people[self.currentPerson].personal_data.liked = true; force match
                if (self.people[self.currentPerson].personal_data.liked == true && direction == "right") {
                    self.showSwipeMatched = true;
                }
                self.currentPerson = self.currentPerson + 1;
                self.currentImage = 1;
                self.showCard();
            }
            else {
                self.elements.card.css("transform", "translate(0px,0px) rotate(0deg)").removeClass("swipe-out-" + direction);
            }
        }, this.swipeDelay);
    };
    HomePage.prototype.dragMoved = function (e) {
        // A movement has been detected on our card
        if (!this.dragInProgress) { // Are we in the middle of a drag? if not we don't need to track this move
            return;
        }
        if (e.type == "touchmove") {
            this.drag.curX = e.touches[0].clientX;
            this.drag.curY = e.touches[0].clientY;
        }
        else {
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
            }
            else { // this is the other way round
                this.elements.signs.left.css("opacity", 0);
                this.elements.signs.right.css("opacity", opacity);
            }
            // Now we apply the css to the card
            this.elements.card.css("transform", css);
        }
        else {
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
    };
    HomePage.prototype.dragStarted = function (e) {
        this.dragInProgress = true;
        this.drag.moved = false; // Set a flag to show if the user has moved after the drag started
        if (this.resetting) {
            clearTimeout(this.resetTimeout);
            this.elements.card.removeClass("swipe-reset");
            this.elements.signs.left.removeClass("opacity-reset");
            this.elements.signs.right.removeClass("opacity-reset");
            this.dragMoved(e);
        }
        else {
            // We are not resetting, so record the start co-ordinates of this event
            if (e.type == "touchstart") {
                this.drag.startX = e.touches[0].clientX;
                this.drag.startY = e.touches[0].clientY;
            }
            else {
                this.drag.startX = e.clientX;
                this.drag.startY = e.clientY;
            }
        }
    };
    HomePage.prototype.dragFinished = function (e) {
        this.dragInProgress = false;
        if (e.type == "touchend") {
            this.drag.curX = e.changedTouches[0].clientX;
            this.drag.curY = e.changedTouches[0].clientY;
        }
        else {
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
                }
                else if (this.drag.dX > (this.cardWidth * this.swipeThreshold)) { // Have we swiped right?
                    this.swipeOutCard("right");
                }
                else { // We didn't swipe enough, so move the card back to the center
                    this.swipeOutCard("reset");
                }
            }
            else { // We are not on the swipe screen, we are in the details screen so we have to handle scrolling images left and right in a carousel
                if (this.drag.dX < 0 - (this.cardWidth * this.dragThreshold)) { // move left
                    if (this.currentImage < this.totalImages) { // If there is another image to show swipe it in
                        this.transitionImages(this.currentImage + 1, this.currentImage, "swipe-in", "swipe-out-left");
                    }
                }
                else if (this.drag.dX < 0) { // move left, abandonded
                    this.transitionImages(this.currentImage, this.currentImage + 1, "swipe-in", "swipe-out-right");
                }
                else if (this.drag.dX > (this.cardWidth * this.dragThreshold)) { // move right
                    if (this.currentImage > 1) { // If there is another image to show swipe it in
                        this.transitionImages(this.currentImage - 1, this.currentImage, "swipe-in", "swipe-out-right");
                    }
                }
                else {
                    this.transitionImages(this.currentImage, this.currentImage - 1, "swipe-in", "swipe-out-left");
                }
            }
        }
        else { // We haven't moved at all since the mouse down, this is a tap event
            console.log("Tapped on ", e.target.id);
            if ((e.target && e.target.id == "swipe-info") || (e.target && e.target.id == "swipe-info-icon") ||
                (e.target && e.target.id == "swipe-details-arrow") || (e.target && e.target.id == "swipe-details-arrow-icon")) {
                // And the user has clicked on the info button
                this.toggleShowInfo(); // toggle the information screen
            }
            else {
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
    };
    // Toggle between swipe mode and detail mode
    HomePage.prototype.toggleShowInfo = function () {
        console.log("Showing info");
        debugger;
        this.swipeMode = !this.swipeMode;
        if (!this.swipeMode) {
            this.isFabShowing = false;
            var padding = this.elements.card.height() - 65;
            console.log("Setting top to this", padding);
            this.elements.details.css("padding-top", padding + "px");
            this.elements.page.css("overflow-y", "scroll");
            this.elements.main.addClass("swipe-showdetails");
            this.elements.main.removeClass("swipe-hidedetails");
        }
        else {
            this.isFabShowing = true;
            this.showCard();
            this.elements.page.css("overflow-y", "hidden");
            this.elements.main.removeClass("swipe-showdetails");
            this.elements.main.addClass("swipe-hidedetails");
            this.elements.page.scrollTop(0);
        }
    };
    // Construct the html notes for a person
    HomePage.prototype.buildNotes = function (person) {
        var html = "<h1>" + person.personal_data.person_name + ", " + person.personal_data.person_age + "</h1>";
        var formatted_date = this.datepipe.transform(person.schedule_data.schedules[0].schedule_startdate, 'EEEE, MMMM dd');
        console.log("Checking out now for person", person.schedule_data.schedules[0].schedule_isoutnow, " and ", this.outNowClass);
        if (person.schedule_data.schedules[0].schedule_isoutnow && this.outNowClass != "") {
            formatted_date = "Out now!";
        }
        html += "<p>" + formatted_date + "</p>";
        html += "<p>" + person.schedule_data.schedules[0].schedule_location_city + "</p>";
        html += "<p>" + person.schedule_data.schedules[0].schedule_location_country + "</p>";
        return html;
    };
    HomePage.prototype.showCard = function () {
        console.log("Showing card", (this.people.length - this.currentPerson), "cards left");
        if (this.people[this.currentPerson] == undefined) {
            console.log("Hiding this person");
            this.elements.card.css("display", "none");
        }
        else {
            this.elements.card.css("display", "block");
            var person = this.people[this.currentPerson];
            this.currentPersonDetails = this.people[this.currentPerson];
            console.log("Showing data for", person.personal_data.person_name);
            this.totalImages = person.personal_attributes.profile_pictures.length;
            if (this.totalImages > 6) {
                this.totalImages = 6;
            }
            var html = "";
            for (var i = 1; i <= this.totalImages; i++) {
                if (i == this.currentImage) {
                    this.elements.images[i].css("opacity", 1).css("transform", "");
                    html = html + "<em>&#x25cf</em>";
                }
                else {
                    this.elements.images[i].css("opacity", 0).css("transform", "");
                    html = html + "&#x25cf";
                }
            }
            for (i = this.totalImages + 1; i < 6; i++) {
                this.elements.images[i].css("opacity", 0).css("transform", "");
            }
            this.elements.breadcrumbs.html(html);
            console.log(person);
            for (var i = 0; i < this.totalImages; i++) {
                console.log(i);
                console.log("Showing", person.personal_attributes.profile_pictures[i]);
                if (person.personal_attributes.profile_pictures[i] != undefined) {
                    console.log("Have url");
                    this.elements.images[i + 1].css("background-image", "url('" + person.personal_attributes.profile_pictures[i].link + "')");
                }
                else {
                    console.log("Don't have url");
                    this.elements.images[i + 1].css("background-image", "none");
                }
            }
            this.elements.cardNotes.html(this.buildNotes(person));
            var html = "<h1>" + person.personal_data.person_name + ", " + person.personal_data.person_age + "</h1>";
            var formatted_date = this.datepipe.transform(person.schedule_data.schedules[0].schedule_startdate, 'EEEE, MMMM dd');
            html += "<p>" + formatted_date + "</p>";
            html += "<p>" + person.schedule_data.schedules[0].schedule_location_city + "</p>";
            html += "<p>" + person.schedule_data.schedules[0].schedule_location_country + "</p>";
            html += "<p>" + person.personal_attributes.occupation + "</p>";
            html += "<p>" + person.personal_attributes.education + "</p>";
            html += "<p>" + person.personal_attributes.bio + "</p>";
            this.elements.detailsData.html(html);
        }
        // Next person
        var nextPerson = this.people[this.currentPerson + 1];
        if (nextPerson == undefined) {
            console.log("Hiding next person");
            this.elements.nextCard.css("display", "none");
            // nextPerson = this.people[0];
        }
        else {
            this.elements.nextCard.css("display", "block");
            console.log("Next");
            console.log(nextPerson);
            if (nextPerson.personal_attributes.profile_pictures[0] != undefined) {
                console.log("Showing next person");
                this.elements.nextImage.css("background-image", "url('" + nextPerson.personal_attributes.profile_pictures[0].link + "')");
            }
            else {
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
            debugger;
            if (this.currentPerson > (this.people.length - 5)) {
                this.getMatches(localStorage.getItem('schedule_ids_list'));
            }
        }
    };
    //------------------------Report person-------------------------------
    HomePage.prototype.presentPrompt = function () {
        var _this = this;
        this.currentPersonDetails;
        this.closeTransitionBtm();
        var alert = this.alertCtrl.create({
            title: 'Report ' + this.currentPersonDetails.personal_data.person_name,
            subTitle: 'Please provide detail on why you are reporting ' + this.currentPersonDetails.personal_data.person_name,
            cssClass: 'reportAlert',
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
                    handler: function (data) {
                        if (data.report.length > 0) {
                            _this.reportPerson(data.report);
                        }
                    }
                },
                {
                    text: 'X',
                    cssClass: 'reportAlertClose',
                    handler: function (data) {
                        _this.presentPrompt();
                    }
                }
            ]
        });
        alert.present();
    };
    HomePage.prototype.reportPerson = function (reportingDetails) {
        var context = this;
        context.appdetailsProvider.ShowLoading();
        var reportReq = {
            person_id: this.personId,
            reportedby_person_id: this.currentPersonDetails.personal_data.person_id,
            report_description: reportingDetails
        };
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var requestOptions = new RequestOptions({
            headers: headers
        });
        this.http.post(this.appdetailsProvider.reportUser, reportReq, requestOptions)
            .subscribe(function (response) {
            context.appdetailsProvider.HideLoading();
            var temp = JSON.parse(response['_body']).result;
            if (temp === "success") {
                //context.popupAlert();
                var alert_1 = context.alertCtrl.create({
                    subTitle: 'User Reported!',
                    enableBackdropDismiss: true,
                    buttons: ['ok']
                });
                alert_1.present();
            }
        }, function (error) {
            context.appdetailsProvider.HideLoading();
        });
    };
    //-----------------------------------------------------------------------------------------
    // Swith on the outnow flag
    HomePage.prototype.toggleOutnow = function () {
        this.outnow = !this.outnow;
        if (!this.outnow) {
            this.elements.card.removeClass("outnow");
        }
        else {
            this.elements.card.addClass("outnow");
        }
    };
    HomePage.prototype.sendSwipe = function (direction, person) {
        var self = this;
        var dateValue = new Date().toISOString();
        var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
        dateValue = moment((new Date(Date.now() - tzoffset)))['_d'].toISOString().slice(0, -1);
        var body = {
            swipes: [{
                    person_id: self.personId,
                    swiped_person_id: person.personal_data.person_id,
                    swiped_direction: (direction == "right" ? 2 : 1),
                    swiped_date: dateValue
                }]
        };
        var headers = new Headers({ 'x-access-token': localStorage.getItem("authoKey") });
        var requestOptions = new RequestOptions({ headers: headers });
        self.http.post(self.appdetailsProvider.swipeCardUrl, body, requestOptions).subscribe(function (response) {
            var respBody = JSON.parse(response['_body']);
            console.log("sendSwipe " + JSON.stringify(respBody));
        }, function (error) {
            // TODO, some kind of handler for errors here, we can cache them and send later
            // Version 2
            console.log("sendSwipeError " + JSON.stringify(error));
        });
    };
    //-------------Auto Refresh Card start----------------
    HomePage.prototype.setTimeIntervalForRefresh = function () {
        var _this = this;
        debugger;
        if (this.people.length == 0 || this.people) {
            this.task = setInterval(function () {
                if (parseInt(localStorage.getItem('homePageRefreshCount')) < 20) {
                    var intervalRefreshCount = +localStorage.getItem('homePageRefreshCount');
                    localStorage.setItem('homePageRefreshCount', (intervalRefreshCount + 1).toString());
                    if (_this.people.length == 0 || !_this.people) {
                        _this.clickRefreshIcon(true);
                    }
                    else {
                        clearInterval(_this.task);
                        localStorage.setItem('homePageRefreshCount', '0');
                    }
                }
                else {
                    clearInterval(_this.task);
                    localStorage.setItem('homePageRefreshCount', '0');
                }
            }, this.REFRESH_TIME_OUT);
        }
        else {
            clearInterval(this.task);
            localStorage.setItem('homePageRefreshCount', '0');
        }
    };
    HomePage.prototype.clickRefreshIcon = function (fromInterval) {
        var _this = this;
        if (!fromInterval) {
            clearInterval(this.task);
            localStorage.setItem('homePageRefreshCount', '0');
            this.setTimeIntervalForRefresh();
        }
        this.setOutNowBackgrount();
        this.refreshMsg = "Please wait..."; /*+localStorage.getItem('homePageRefreshCount')*/
        this.rotateClass = 'noAnimate addAnimate';
        if (this.appdetailsProvider.CheckConnectionWithoutMessage()) {
            this.dateValue = "";
            this.schedule_id = "";
            this.getMatches(localStorage.getItem('schedule_ids_list'));
        }
        else {
            setTimeout(function () {
                _this.refreshMsg = 'No internet connection';
                _this.rotateClass = 'noAnimate';
            }, 2000);
        }
    };
    //-------------Auto Refresh Card end----------------
    HomePage.prototype.getMatches = function (scheduleIds, retry) {
        if (retry == undefined) {
            retry = 0;
        }
        console.log("Getting matches for", scheduleIds, retry);
        console.log("This schedule list is", this.schedulList);
        scheduleIds = this.schedulList; // #fudge
        var self = this;
        var personId = localStorage.getItem("person_id");
        if (scheduleIds == null) {
            scheduleIds = "";
        }
        var body = {
            person_id: personId,
            schedule_ids: scheduleIds !== null && scheduleIds.split(",")
        };
        var headers = new Headers({ 'x-access-token': localStorage.getItem("authoKey") });
        var requestOptions = new RequestOptions({ headers: headers });
        self.http.post(self.appdetailsProvider.matchesUrl, body, requestOptions).subscribe(
        //success part
        function (response) {
            self.noConnection = false;
            console.log("Success getting matches");
            var respBody = JSON.parse(response['_body']);
            //respBody=self.matchsList; // hard coded data in matchsList array.
            self.people.push.apply(self.people, respBody);
            self.refreshMsg = 'refresh to see new matches';
            self.rotateClass = 'noAnimate';
            console.log("Got", self.people.length, "people");
            if (self.people.length > 20) {
                console.log("Too many people, shifting");
                for (var i = 1; i < self.currentPerson; i++) {
                    self.people.shift();
                    self.currentPerson = self.currentPerson - 1;
                }
                console.log("Now got", self.people.length, "people");
            }
            self.showCard();
        }, function (error) {
            console.log("error " + JSON.stringify(error));
            if (retry < 4) {
                self.getMatches(scheduleIds, retry + 1);
            }
            else {
                console.log("FAILED TO GET MATCHES"); // TODO set a flag here
                self.noConnection = true;
                self.showCard();
                self.refreshMsg = 'refresh to see new matches';
                self.rotateClass = 'noAnimate';
            }
        });
    };
    HomePage.prototype.retryMatches = function () {
        this.getMatches(localStorage.getItem('schedule_ids_list'));
    };
    HomePage.prototype.swipeInitialise = function () {
        var self = this;
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
        debugger;
        this.getMatches(localStorage.getItem('schedule_ids_list'));
    };
    HomePage.prototype.closeMatch = function () {
        this.showSwipeMatched = false;
    };
    HomePage.prototype.getSettingData = function () {
        console.log("Getting profile hidden");
        var self = this;
        self.appdetailsProvider.getDbInstance().executeSql("SELECT * FROM settingsTb", []).then(function (data) {
            self.isProfileOn = data.rows.item(0).profilevisible === "true" ? true : false;
        }, function (error) {
            console.log("Getting setting data");
            self.isProfileOn = false;
        });
    };
    HomePage.prototype.swipeEvent = function ($e) {
        if ($e.deltaX >= 0) {
            this.opacityDiv1 = $e.deltaX / 100;
        }
        else {
            this.opacityDiv2 = -$e.deltaX / 100;
        }
    };
    HomePage.prototype.sortDateCalIcon = function (Option) {
        console.log("Option :-->" + Option);
        this.calenderOptionValue = Option;
    };
    HomePage.prototype.toggle_class = function () {
        if (this.my_Class == "style1") {
            this.my_Class = 'style1 style2';
        }
        else {
            this.my_Class = 'style1';
        }
    };
    HomePage.prototype.notifi = function () {
        this.navCtrl.push(NotificationPopupPage, { title: "title", messagetype: "message" });
    };
    HomePage.prototype.ionViewWillUnload = function () {
        debugger;
        clearInterval(this.task);
    };
    HomePage.prototype.goToSlideNext = function (i) {
        if (this.dateSwipeBtm !== 'dateSwipeBtmHide') {
            this.closeTransitionBtm();
        }
        else {
            var cardsSliderArray = this.userImages.toArray();
            if (cardsSliderArray.length > 0) {
                var cardSlider = cardsSliderArray[i];
                cardSlider.slideNext();
            }
            //this.userImages.slideNext();
        }
    };
    HomePage.prototype.goToSlidePrev = function (i) {
        if (this.dateSwipeBtm !== 'dateSwipeBtmHide') {
            this.closeTransitionBtm();
        }
        else {
            var cardsSliderArray = this.userImages.toArray();
            if (cardsSliderArray.length > 0) {
                var cardSlider = cardsSliderArray[i];
                cardSlider.slidePrev();
            }
            //this.userImages.slidePrev();
        }
    };
    HomePage.prototype.goToSetting = function (goto) {
        debugger;
        if (goto == undefined) {
            this.navCtrl.push(SettingsubPage);
        }
        else {
            this.navCtrl.push(SettingsubPage, { isFromProfileTurnOff: 'isFromProfileTurnOff' });
        }
    };
    HomePage.prototype.ionViewWillEnter = function () {
        console.log("ionViewWillEnter");
        debugger;
        var self = this;
        this.getSettingData();
        //this.loadJsonFile();
        if (localStorage.getItem("messageIconColor") === "0") {
            this.toolBarIconColorMsg = "flotBlack";
        }
    };
    HomePage.prototype.ionViewDidLoad = function () {
        this.swipeInitialise();
        this.setOutNowBackgrount();
    };
    HomePage.prototype.setOutNowBackgrount = function () {
        debugger;
        var OutNow_end_dateTime = localStorage.getItem('OutNow_end_dateTime');
        if (localStorage.getItem("messageIconColor") === "0") {
            this.toolBarIconColorMsg = "flotBlack";
        }
        console.log("OutNow end Date : " + OutNow_end_dateTime);
        //------------------------------------------------------
        this.outNowClass = '';
        this.outNowClassHead = '';
        this.outNowClassIsProfileOn = '';
        this.outNowLabel = "I'm out NOW!";
        this.showFilter = false;
        this.toolBarIconColorMsg = "flotBlack";
        //------------------------------------------------------
        if (this.platform.is('ios')) {
            var spliteDate = OutNow_end_dateTime.split(' ');
            var fixedDate = spliteDate[0];
            var hr = parseInt(spliteDate[1].split(':')[0]);
            var min = spliteDate[1].split(':')[1];
            var aa = spliteDate[2];
            var HH = aa === 'PM' ? hr + 12 : hr;
            var finalDateFormate = fixedDate + "T" + HH + ":" + min + ":00.000Z";
            var date = new Date(moment(finalDateFormate).toDate());
            var endDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
            var currentDate = new Date();
            var currentDateUTCFormate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(), currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds());
            if (endDate >= currentDateUTCFormate) {
                //localStorage.setItem('OutNow_end_dateTime', "");
                this.outNowClass = 'outNowClass';
                this.outNowClassHead = 'outNowClassHead';
                this.anyTimeTextColor = "anyTimeTextWhile";
                this.toolBarIconColor = "flotWhite";
                this.outNowLabel = "I’m back in";
                this.showFilter = false;
                this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
            }
            else if (this.isFromPage === "OutNow") {
                this.outNowClass = 'outNowClass';
                this.outNowClassHead = 'outNowClassHead';
                this.anyTimeTextColor = "anyTimeTextWhile";
                this.toolBarIconColor = "flotWhite";
                this.outNowLabel = "I’m back in";
                this.showFilter = false;
                this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
            }
        }
        else {
            // my changes
            var date = new Date();
            var currentdate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
            if (new Date(this.datepipe.transform(OutNow_end_dateTime, 'yyyy-MM-dd hh:mm a')) >= new Date() /*new Date(this.datepipe.transform(currentdate.toString(),'yyyy-MM-dd hh:mm a'))*/) {
                //localStorage.setItem('OutNow_end_dateTime', "");
                this.outNowClass = 'outNowClass';
                this.outNowClassHead = 'outNowClassHead';
                this.anyTimeTextColor = "anyTimeTextWhile";
                this.toolBarIconColor = "flotWhite";
                this.outNowLabel = "I’m back in";
                this.showFilter = false;
                this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
            }
            else if (this.isFromPage === "OutNow") {
                this.outNowClass = 'outNowClass';
                this.outNowClassHead = 'outNowClassHead';
                this.anyTimeTextColor = "anyTimeTextWhile";
                this.toolBarIconColor = "flotWhite";
                this.outNowLabel = "I’m back in";
                this.showFilter = false;
                this.outNowClassIsProfileOn = "outNowClassIsProfileOn";
            }
        }
    };
    HomePage.prototype.imagedate = function (schedulList) {
        var methodinstance = this;
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
        }
        else {
            if (schedulList.length) {
                var personId = localStorage.getItem("person_id");
                var body = {
                    person_id: personId,
                    schedule_ids: schedulList !== null && schedulList.split(",")
                };
                //body1 is for testing.
                var body1 = {
                    person_id: "0af234ee-d800-191d-5ca2-40f8445e8bea",
                    schedule_ids: ["431bdac2-a606-65fe-4e2f-5ad151c378f8", "4deb8c34-d01f-76fe-a015-8d844c9ca67b"]
                };
                var headers = new Headers({
                    'x-access-token': localStorage.getItem("authoKey")
                });
                var requestOptions = new RequestOptions({
                    headers: headers
                });
                console.log(JSON.stringify(body));
                methodinstance.http.post(methodinstance.appdetailsProvider.matchesUrl, body, requestOptions)
                    .subscribe(
                //success part
                function (response) {
                    console.log("success");
                    var respBody = JSON.parse(response['_body']);
                    //respBody=methodinstance.matchsList;
                    methodinstance.mainarray = respBody;
                    methodinstance.cards = respBody;
                    methodinstance.noMatchesFound = methodinstance.cards.length > 0 ? false : true;
                }, function (error) {
                    console.log("error " + JSON.stringify(error));
                    console.log("IdList " + methodinstance.schedulList);
                    setTimeout(function () {
                        methodinstance.noMatchesFound = false;
                        if (methodinstance.schedulList) {
                            methodinstance.imagedate(methodinstance.schedulList);
                        }
                    }, 200);
                });
            }
            else {
                methodinstance.noMatchesFound = true;
            }
        }
    };
    HomePage.prototype.profilePage = function () {
        //this.navCtrl.push(ProfilescreenPage);
        this.navCtrl.push(SettingsmainPage);
    };
    HomePage.prototype.like = function (like) {
        console.log("value :--> like");
        var self = this;
        if (this.cards.length > 0) {
            self.cards[this.cardCursor++].likeEvent.emit({ like: like });
            // DO STUFF WITH YOUR CARD
            this.tinderCardLogs.push("callLike(" + JSON.stringify({ like: like }) + ")");
            this.scrollToBottom(this.tinderCardLogContainer);
        }
    };
    HomePage.prototype.onCardLike = function (event) {
        console.log("value :--> onCardLike");
        var item = this.cards[this.cardCursor++];
        // DO STUFF WITH YOUR CARD
        this.tinderCardLogs.push("onLike(" + JSON.stringify(event) + ")");
        this.scrollToBottom(this.tinderCardLogContainer);
    };
    HomePage.prototype.getKittenUrl = function () {
        console.log("value :--> getKittenUrl");
        var w = 500 - Math.floor((Math.random() * 100) + 1);
        var h = 500 - Math.floor((Math.random() * 100) + 1);
        return "http://placekitten.com/" + w + "/" + h;
    };
    HomePage.prototype.onRelease = function (event, i) {
        if (event.additionalEvent == "panright") {
            //this.matchesSwipe1 = "block"
            this.sendSwipRequestToApi("2", i);
        }
        else {
            if (event.center.x > 180 && event.additionalEvent != "panleft") {
                //this.matchesSwipe1 = "block";
                this.sendSwipRequestToApi("2", i);
            }
            else {
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
    };
    HomePage.prototype.onAbort = function (event) {
        this.cardLogs.push("onAbort(event)");
        this.scrollToBottom(this.cardLogContainer);
        this.opacityDiv1 = 0;
        this.opacityDiv2 = 0;
    };
    HomePage.prototype.onSwipe = function (event) {
        this.cardLogs.push("onSwipe(event)");
        this.scrollToBottom(this.cardLogContainer);
    };
    HomePage.prototype.scrollToBottom = function (el) {
        setTimeout(function () {
            el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
        }, 100);
    };
    HomePage.prototype.gotoFilter = function () {
        debugger;
        if (this.appdetailsProvider.CheckConnection()) {
            if (this.dateValue) {
                this.navCtrl.push(FilterPage, { isFromPage: "DateValue", schedule_id: this.schedule_id });
            }
            else {
                this.navCtrl.push(FilterPage, { isFromPage: this.isFromPage, schedule_id: this.schedule_id });
            }
        }
    };
    HomePage.prototype.sendSwipRequestToApi = function (swipedDirection, cardPosition) {
        var methodcontext = this;
        var dateValue = new Date().toISOString();
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
        var body = {
            swipes: [{
                    person_id: this.personId,
                    swiped_person_id: methodcontext.swipedCardObj.personal_data.person_id,
                    swiped_direction: swipedDirection,
                    swiped_date: dateValue
                }]
        };
        console.log("SwapeCard_API_CALL" + JSON.stringify(body));
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var requestOptions = new RequestOptions({
            headers: headers
        });
        methodcontext.http.post(methodcontext.appdetailsProvider.swipeCardUrl, body, requestOptions).subscribe(
        //success part
        function (response) {
            var respBody = JSON.parse(response['_body']);
            console.log("swipe-API Resp " + JSON.stringify(respBody));
        }, function (error) {
            console.log("swipe-Error Resp " + JSON.stringify(error));
        });
    };
    HomePage.prototype.messagePage = function () {
        this.matchesSwipe1 = "none";
        if (this.appdetailsProvider.CheckConnection()) {
            this.navCtrl.push(Messages);
        }
    };
    HomePage.prototype.gotoDatelist = function (fab) {
        fab.close();
        if (this.appdetailsProvider.CheckConnection()) {
            this.navCtrl.push(Datelist);
        }
    };
    HomePage.prototype.gotoOutnow = function (fab) {
        fab.close();
        //if (this.appdetailsProvider.CheckConnection()) {
        if (this.outNowLabel === "I'm out NOW!") {
            /*localStorage.setItem('currentLocation', "");
            localStorage.setItem('currentCity', "");*/
            //this.navCtrl.push(Outnow);
            this.navCtrl.push(OutNowMainPage);
        }
        else {
            if (this.appdetailsProvider.CheckConnection()) {
                this.confirmAlert();
            }
        }
        //}
    };
    HomePage.prototype.confirmAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            subTitle: 'Do you want to be back in?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: function (data) {
                        console.log('Saved clicked');
                        if (_this.appdetailsProvider.CheckConnection()) {
                            _this.deleteOutNowSchedules();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    HomePage.prototype.deleteOutNowSchedules = function () {
        if (this.appdetailsProvider.CheckConnection()) {
            var context_1 = this;
            var outNowIdListObj = [];
            var outNowIdList = [];
            context_1.appdetailsProvider.ShowLoading();
            var outNowIds = localStorage.getItem('OutNow_scheduleIdsList');
            outNowIds = outNowIds === null ? "" : outNowIds;
            if (outNowIds.length > 0) {
                outNowIdList = outNowIds.split(",");
                for (var i = 0; i < outNowIdList.length; i++) {
                    outNowIdListObj.push({ "schedule_id": outNowIdList[i] });
                }
                var body = { person_id: this.personId, schedule: outNowIdListObj };
                var headers = new Headers();
                var options = new RequestOptions({ headers: headers });
                headers.append('Content-Type', 'application/json');
                headers.append('x-access-token', localStorage.getItem("authoKey"));
                console.log('Delete-Schedule ' + JSON.stringify(body));
                context_1.http.delete(context_1.appdetailsProvider.addschedule, new RequestOptions({
                    headers: headers,
                    body: body
                })).subscribe(function (response) {
                    context_1.appdetailsProvider.HideLoading();
                    localStorage.setItem('OutNow_end_dateTime', "");
                    context_1.isFromPage = "Anytime";
                    context_1.anyTimeTextColor = "anyTimeTextBlack";
                    context_1.toolBarIconColor = "flotBlack";
                    context_1.outNowLabel = "I'm out NOW!";
                    context_1.showFilter = true;
                    context_1.outNowClass = '';
                    context_1.outNowClassHead = '';
                    context_1.outNowClassIsProfileOn = '';
                    localStorage.setItem('OutNow_scheduleIdsList', "");
                    console.log("Coming back in setting id's to " + localStorage.getItem('schedule_ids_list'));
                    console.log("Coming back in ShedulList = " + context_1.schedulList);
                    context_1.schedulList = localStorage.getItem('schedule_ids_list');
                    setTimeout(function () {
                        context_1.getMatches(localStorage.getItem('schedule_ids_list'));
                    }, 200);
                }, function (error) {
                    context_1.appdetailsProvider.HideLoading();
                });
            }
        }
    };
    HomePage.prototype.closeFab = function (fab) {
        fab.close();
    };
    HomePage.prototype.transitionBtm = function (item) {
        this.dateSwipeBtm = 'dateSwipeBtmHide dateSwipeBtmShow';
        this.Matches_PersonId = item.personal_data.person_id;
        this.Matches_Username = item.personal_data.person_name;
        this.Matches_Age = item.personal_data.person_age;
        this.Matches_Occupation = item.personal_attributes.occupation;
        this.Matches_Education = item.personal_attributes.education;
        this.Matches_Bio = item.personal_attributes.bio;
    };
    HomePage.prototype.closeTransitionBtm = function () {
        this.dateSwipeBtm = 'dateSwipeBtmHide';
    };
    HomePage.prototype.goToCalenderPage = function () {
        var currentLocation = localStorage.getItem('currentLocation');
        var currentCity = localStorage.getItem('currentCity');
        var current_geo_value = localStorage.getItem('current_geo_value');
        if (currentLocation && currentCity && current_geo_value) {
            this.navCtrl.push(CalenderPage, { isFrom: "DateList" });
        }
        else {
            this.myLocation();
        }
    };
    //--------------------- get current location code-----------------------------------
    HomePage.prototype.myLocation = function () {
        var _this = this;
        if (this.platform.is('ios')) {
            this.diagnostic.isLocationEnabled().then(function (state) {
                if (state == false) {
                    _this.appdetailsProvider.HideLoading();
                    var alt = _this.alertCtrl.create({
                        title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
                                text: 'Cancel', role: 'cancel', handler: function () {
                                }
                            },
                            {
                                text: 'Ok', handler: function () {
                                    _this.diagnostic.switchToLocationSettings();
                                }
                            }]
                    });
                    alt.present();
                }
                else {
                    _this.appdetailsProvider.ShowLoading();
                    _this.getMycurrentLocation();
                }
            }).catch(function (e) { return console.error(e); });
        }
        else {
            this.diagnostic.isGpsLocationEnabled().then(function (state) {
                if (state == false) {
                    _this.appdetailsProvider.HideLoading();
                    var alt = _this.alertCtrl.create({
                        title: 'Location Services Disabled', subTitle: 'Please enable location services', buttons: [{
                                text: 'Cancel', role: 'cancel', handler: function () {
                                }
                            },
                            {
                                text: 'Ok', handler: function () {
                                    _this.diagnostic.switchToLocationSettings();
                                }
                            }]
                    });
                    alt.present();
                }
                else {
                    _this.appdetailsProvider.ShowLoading();
                    _this.getMycurrentLocation();
                }
            }).catch(function (e) { return console.error(e); });
        }
    };
    HomePage.prototype.getMycurrentLocation = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: false,
            timeout: Infinity,
            maximumAge: 10000
        };
        this.geolocation.getCurrentPosition(options).then(function (resp) {
            var latitude = resp.coords.latitude;
            var longitude = resp.coords.longitude;
            _this.nativeGeocoder.reverseGeocode(latitude, longitude)
                .then(function (result) {
                var country = result.countryName;
                var city = result.subAdministrativeArea;
                var state = result.administrativeArea;
                localStorage.setItem('currentLocation', state + ", " + country);
                localStorage.setItem('currentCity', city);
                localStorage.setItem('current_geo_value', latitude + "," + longitude);
                _this.appdetailsProvider.HideLoading();
                _this.navCtrl.push(CalenderPage, { isFrom: "DateList" });
            })
                .catch(function (error) {
                console.log(error);
                _this.appdetailsProvider.HideLoading();
            });
        }).catch(function (error) {
            console.log('Error getting location', error);
            _this.appdetailsProvider.HideLoading();
        });
    };
    //--------------------------------------------------------------------
    HomePage.prototype.loadJsonFile = function () {
        console.log('json called');
        var context = this;
        //Get the matches records for testing.
        context.http.get('assets/data/matchesApiResp.json')
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            context.matchsList = data;
            console.log(data);
        });
    };
    __decorate([
        ViewChild('cardLog'),
        __metadata("design:type", Object)
    ], HomePage.prototype, "cardLogContainer", void 0);
    __decorate([
        ViewChild('tinderCardLog'),
        __metadata("design:type", Object)
    ], HomePage.prototype, "tinderCardLogContainer", void 0);
    __decorate([
        ViewChildren('userImages'),
        __metadata("design:type", QueryList)
    ], HomePage.prototype, "userImages", void 0);
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            encapsulation: ViewEncapsulation.None,
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [Platform,
            NavController,
            NavParams,
            Http,
            AppdetailsProvider,
            PopoverController,
            ViewController,
            Geolocation,
            NativeGeocoder,
            Diagnostic,
            AlertController,
            DatePipe])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map