var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
/*import { Http } from '@angular/http';*/
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';
import { LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';
var AppdetailsProvider = /** @class */ (function () {
    function AppdetailsProvider(http, loadingCtrl, alertCtrl, platform, toastCtrl, sqlite, firebase, device, file) {
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.sqlite = sqlite;
        this.firebase = firebase;
        this.device = device;
        this.file = file;
        this.cardListArray = [];
        this.profileImages = [];
        this.globleProfileImages = [];
        this.location = "England, United Kingdom";
        this.city = "Portsmouth";
        this.modalpresent = false;
        this.notificationType = '';
        this.mapKey = "AIzaSyBokAhy2i2u2Ra9Vxw17xu5fCR2ZyBEBmA";
        this.fbUerdataUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person?fbid=";
        this.uerdataUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person?person_id=";
        this.personUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/person";
        //scheduledlisturl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule?pid=sakdhksadkasn";
        this.scheduledlisturl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule?person_id=";
        this.addschedule = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/schedule";
        //sendImageUrl="https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage";
        this.sendImageUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage/add";
        this.swipeCardUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/swipe";
        this.matchesUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/matches";
        this.updateProfileImages = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage/edit";
        this.getOccupationUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/occupations?person_id=";
        this.getEducationUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/education?person_id=";
        this.getMatches = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/matches?person_id=";
        this.getConversionList = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation?person_id=";
        this.createConversation = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation";
        this.getConversationDetails = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/conversation/conversationdetail?person_id=";
        this.reportUser = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/reportuser";
        this.createDevice = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/device";
        this.updateDevice = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/device?device_id=";
        this.fileUploadUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/settings/foldercreds";
        this.authenticationUrl = "https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/login?fb_id=";
        this.deleteProfileImage = " https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/profileimage?person_id={Person ID}&image_id=";
        this.createTable();
        this.getCartItemArray();
        //this.loadJsonFile();
    }
    AppdetailsProvider.prototype.getCartItemArray = function () {
        var methodinstance = this;
        var schedulList = localStorage.getItem('schedule_ids_list');
        var personId = localStorage.getItem("person_id");
        if (!schedulList) {
            schedulList = "";
            return;
        }
        /*let respBody=this.matchsList;
          methodinstance.cardListArray=[];
          methodinstance.cardListArray=respBody;*/
        debugger;
        var body = {
            person_id: personId,
            schedule_ids: schedulList.split(",")
        };
        var body1 = {
            person_id: "0af234ee-d800-191d-5ca2-40f8445e8bea",
            schedule_ids: ["431bdac2-a606-65fe-4e2f-5ad151c378f8", "4deb8c34-d01f-76fe-a015-8d844c9ca67b"]
        };
        console.log(body);
        console.log(body1);
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var options = new RequestOptions({
            headers: headers
        });
        methodinstance.http.post(methodinstance.matchesUrl, body, options)
            .subscribe(
        //success part
        function (response) {
            debugger;
            var respBody = JSON.parse(response['_body']);
            methodinstance.cardListArray = [];
            methodinstance.cardListArray = respBody;
        }, function (error) {
            debugger;
            methodinstance.getCartItemArray();
        });
    };
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
    AppdetailsProvider.prototype.getImageFromDir = function (root, dirName, packegeLevel) {
        var _this = this;
        var context = this;
        context.file.listDir(root, dirName).then(function (data) {
            var _loop_1 = function () {
                if (data[j].name.charAt(0) != ".") {
                    if (data[j].isFile == true) {
                        if (data[j].nativeURL.search(".jpg") > -1 || data[j].nativeURL.search(".png") > -1) {
                            //console.log('Image :--> '+data[j].nativeURL+" Directory "+dirName);
                            //context.localImages.push({imageUrl:data[j].nativeURL});
                            _this.getDbInstance().executeSql('REPLACE INTO localImagesTb(imageurl, directory) VALUES (?,?)', [data[j].nativeURL, dirName])
                                .then(function (data) {
                                console.log('Add localImagesTb to DB ' + data);
                            }).catch(function (e) {
                                console.log(e);
                            });
                        } //end if condition
                    }
                    else {
                        var maindirpath = data[j].nativeURL.slice(0, -1);
                        var dirpath = maindirpath.slice(0, maindirpath.lastIndexOf("/") + 1);
                        var dirnames_1 = data[j].name;
                        debugger;
                        context.file.listDir(dirpath, dirnames_1).then(function (data) {
                            debugger;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].name.charAt(0) != ".") {
                                    if (data[i].isFile == true) {
                                        if (data[i].nativeURL.search(".jpg") > -1 || data[i].nativeURL.search(".png") > -1) {
                                            console.log('Image :--> ' + data[i].nativeURL + " Directory " + dirnames_1);
                                            //context.localImages.push({imageUrl:data[i].nativeURL});
                                            _this.getDbInstance().executeSql('REPLACE INTO localImagesTb(imageurl, directory) VALUES (?,?)', [data[i].nativeURL, dirnames_1])
                                                .then(function (data) {
                                                debugger;
                                                console.log('Add localImagesTb to DB ' + data);
                                            }).catch(function (e) {
                                                debugger;
                                                console.log(e);
                                            });
                                        } //end if condition
                                    }
                                }
                            }
                        }, function (err) {
                        });
                    }
                }
            };
            for (var j = 0; j < data.length; j++) {
                _loop_1();
            }
        }, function (err) {
        });
    };
    //  file:///storage/emulated/0/Pictures/Screenshot
    //to show the loading symbol
    AppdetailsProvider.prototype.ShowLoading = function () {
        this.loading = this.loadingCtrl.create({ content: 'Please wait...' }); //Create loading
        this.loading.present(); //Start loading symbol
    };
    AppdetailsProvider.prototype.ShowLoadingMeg = function (mes) {
        this.loading = this.loadingCtrl.create({ content: mes }); //Create loading
        this.loading.present(); //Start loading symbol
    };
    AppdetailsProvider.prototype.ShowLoadingnew = function () {
        this.loading = this.loadingCtrl.create({ content: 'Loading...' }); //Create loading
        this.loading.present(); //Start loading symbol
    };
    //to hide the loading symbol
    AppdetailsProvider.prototype.HideLoading = function () {
        this.loading.dismiss();
    };
    AppdetailsProvider.prototype.ShowToast = function (mes, duration) {
        if (duration == null || duration == undefined || duration == "") {
            duration = 3000;
        }
        this.toast = this.toastCtrl.create({
            message: mes,
            duration: duration,
            position: 'bottom',
        });
        this.toast.onDidDismiss(function () {
        });
        this.toast.present();
    };
    AppdetailsProvider.prototype.getDbInstance = function () {
        return this.dateindb;
    };
    AppdetailsProvider.prototype.createTable = function () {
        var _this = this;
        this.sqlite.create({
            name: 'datein.db',
            location: 'default'
        }).then(function (db) {
            _this.dateindb = db;
            //----------------------------------- User Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS userTb(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(10),gender VARCHAR(10),location VARCHAR(100),bio VARCHAR(100),age VARCHAR(10),birthday VARCHAR(20),pictureurl VARCHAR(100),facebookId VARCHAR(30))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexuser ON userTb(facebookId)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for userTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //----------------------------------- Education Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS educationTb(educationId VARCHAR(10),schoolName VARCHAR(100),type VARCHAR(20),year VARCHAR(100),ischecked VARCHAR(10))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexeducation ON educationTb(schoolName)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for educationTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //----------------------------------- Work(occupesion) Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS workTb(workId VARCHAR(10),company VARCHAR(100),position VARCHAR(20),location VARCHAR(100),ischecked VARCHAR(10),isfacebook VARCHAR(10))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexwork ON workTb(position)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for workTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //----------------------------------- Photos Table -----------------------------------------------------
            db.executeSql('create table IF NOT EXISTS photosTb(photoId VARCHAR(10),imageUrl VARCHAR(100))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexphoto ON photosTb(photoId)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for photoTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //-------Profile Table----------
            db.executeSql('create table IF NOT EXISTS profilepicTb(id INTEGER PRIMARY KEY AUTOINCREMENT,image_id VARCHAR(200), imageurl VARCHAR(200),isfacebook VARCHAR(10), position VARCHAR(30), feverate VARCHAR(30))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexprofilepicTb ON profilepicTb(position)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for profilepicTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //-------Local images Table----------
            db.executeSql('create table IF NOT EXISTS localImagesTb(imageurl VARCHAR(300),directory VARCHAR(10))', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexlocalImages ON localImagesTb(imageurl)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for localImagesTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
            //-------settings Table----------
            db.executeSql('create table IF NOT EXISTS settingsTb(id INTEGER PRIMARY KEY AUTOINCREMENT, profilevisible VARCHAR(10),interestedin VARCHAR(10), age VARCHAR(20), pushnotification VARCHAR(20), sound VARCHAR(20), distance VARCHAR(20), outnowdistance VARCHAR(20))', {})
                .then(function (data) {
                console.log('Executed CREATE UNIQUE INDEX for settingsTb');
            })
                .catch(function (e) {
                console.log(e);
            });
            //-------settings Table----------
            db.executeSql('create table IF NOT EXISTS recentLoactionTb(id INTEGER PRIMARY KEY AUTOINCREMENT, city VARCHAR(50),state VARCHAR(50), contry VARCHAR(50), priority VARCHAR(10) DEFAULT 0 )', {})
                .then(function (data) {
                db.executeSql('CREATE UNIQUE INDEX myindexrecentlocal ON recentLoactionTb(city)', {})
                    .then(function () {
                    console.log('Executed CREATE UNIQUE INDEX for recentLoactionTb');
                })
                    .catch(function (e) {
                    console.log(e);
                });
            })
                .catch(function (e) {
                console.log(e);
            });
        }).catch(function (e) {
        });
    };
    AppdetailsProvider.prototype.deleteTable = function (tableName) {
        this.dateindb.executeSql("delete from " + tableName, []).then(function (data) {
            console.log('Executed CREATE UNIQUE INDEX for settingsTb');
        }).catch(function (e) {
            console.log(e);
        });
    };
    AppdetailsProvider.prototype.SomethingWentWrongAlert = function () {
        //   this.HideLoading();
        this.ShowToast("Something went wrong, please try again", 5000);
        return false;
    };
    //to check the intenet connection
    AppdetailsProvider.prototype.CheckConnection = function () {
        if (navigator.connection != undefined) {
            if (navigator.connection.type == "none") {
                this.ShowToast("Internet is disabled, please enable internet", 3000);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            //if opened in browser
            return true;
        }
    };
    //to check the intenet connection
    AppdetailsProvider.prototype.CheckConnectionWithoutMessage = function () {
        if (navigator.connection != undefined) {
            if (navigator.connection.type == "none") {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    };
    AppdetailsProvider.prototype.getScheduledData = function () {
        debugger;
        var methodinstance = this;
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var options = new RequestOptions({
            headers: headers
        });
        this.http.get(this.scheduledlisturl + localStorage.getItem("person_id"), options).subscribe(
        //success part
        function (response) {
            debugger;
            var temp = JSON.parse(response['_body']);
            debugger;
            if (temp) {
                debugger;
                //Stored the schedule_ids in localStorage.
                var tempScheduleIdsList_1 = "";
                if (temp.length > 0) {
                    localStorage.setItem('schedule_ids_list', "");
                    for (var i = 0; i < temp.length; i++) {
                        tempScheduleIdsList_1 = tempScheduleIdsList_1 === "" ? temp[i].schedule_id : tempScheduleIdsList_1 + "," + temp[i].schedule_id;
                    }
                    setTimeout(function () {
                        localStorage.setItem('schedule_ids_list', tempScheduleIdsList_1);
                    }, 1000);
                }
            }
        }, function (error) {
            debugger;
        });
    };
    AppdetailsProvider.prototype.setFcmTokenId = function () {
        var _this = this;
        if (this.platform.is('cordova')) {
            this.platform.ready().then(function () {
                _this.firebase.getToken().then(function (token) {
                    console.log(" ---FCM Token--- ");
                    console.log(token); // save the token server-side and use it to push notifications to this device
                    if (token == null || token == "") {
                        _this.setFcmTokenId();
                    }
                    else {
                        _this.firebase_token = token;
                        localStorage.setItem("firebase_token", _this.firebase_token);
                    }
                });
            });
        }
    };
    AppdetailsProvider.prototype.getDeviceDetails = function () {
        console.log("---- Device details ----");
        console.log("UUID : " + this.device.uuid + "\nModel : " + this.device.model + "\nPlatform : " + this.device.platform + "\nManufacturer : " + this.device.manufacturer + "\nSerial : " + this.device.serial + "\nVersion : " + this.device.version + "\n");
        localStorage.setItem("device_uuid", this.device.uuid);
        localStorage.setItem("device_model", this.device.model);
        localStorage.setItem("device_platform", this.device.platform);
        localStorage.setItem("device_version", this.device.version);
        localStorage.setItem("device_manufacturer", this.device.manufacturer);
        localStorage.setItem("device_serial", this.device.serial);
    };
    AppdetailsProvider.prototype.sendFcmIdToServer = function (personId) {
        var body = {
            person_id: personId,
            device_id: localStorage.getItem("device_uuid"),
            firebase_token: localStorage.getItem("firebase_token"),
            device_make: localStorage.getItem("device_manufacturer"),
            device_model: localStorage.getItem("device_model"),
            device_platform: localStorage.getItem("device_platform"),
            device_version: localStorage.getItem("device_version")
        };
        console.log("RegisterDevicesFcm-Req :-->" + JSON.stringify(body));
        var methodcontext = this;
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var options = new RequestOptions({
            headers: headers
        });
        this.http.post(this.createDevice, body, options).subscribe(
        //success part
        function (response) {
            console.log("RegisterDevicesFcm-Resp :-->" + JSON.stringify(response));
            debugger;
        }, function (error) {
            console.log("RegisterDevicesFcm-Error :-->" + JSON.stringify(error));
            debugger;
        });
    };
    AppdetailsProvider.prototype.loadJsonFile = function () {
        console.log('json called');
        var context = this;
        debugger;
        context.http.get('assets/data/matchesApiResp.json')
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            debugger;
            context.matchsList = data;
            console.log(data);
        });
    };
    AppdetailsProvider.prototype.getPersonDetails = function (position, personId) {
        debugger;
        var methodinstance = this;
        var methodcontext = this;
        var headers = new Headers({
            'x-access-token': localStorage.getItem("authoKey")
        });
        var options = new RequestOptions({
            headers: headers
        });
        this.http.get(methodinstance.uerdataUrl + personId, options).subscribe(
        //success part
        function (response) {
            var personDetails = JSON.parse(response['_body']).personal_attributes.profile_pictures;
            for (var i = 0; i < personDetails.length; i++) {
                // if(personDetails[i].image_position===position){
                debugger;
                /*--------------Store the image to loacl db ---------------------*/
                methodinstance.getDbInstance().executeSql("UPDATE profilepicTb set imageurl='" + personDetails[i].link + "' , image_id='" + personDetails[i].image_id + "'  WHERE position ='" + personDetails[i].image_position + "'", []).then(function (data) {
                    console.log("INSERTED: " + JSON.stringify(data));
                    console.log("Successfully uploaded data to myBucket/myKey");
                }, function (error) {
                    methodinstance.SomethingWentWrongAlert();
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
                /*--------------------------------------------------------------*/
                //}
            }
        }, function (error) {
            debugger;
        });
    };
    AppdetailsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            LoadingController,
            AlertController,
            Platform,
            ToastController,
            SQLite,
            Firebase,
            Device,
            File])
    ], AppdetailsProvider);
    return AppdetailsProvider;
}());
export { AppdetailsProvider };
//# sourceMappingURL=appdetails.js.map