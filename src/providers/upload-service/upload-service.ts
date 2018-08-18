import 'rxjs/add/operator/map';
import { Inject, Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/*
  Generated class for the UploadServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
/*export class UploadServiceProvider {

  constructor(public http: Http) {
    console.log('Hello UploadServiceProvider Provider');
  }

}*/


@Injectable()
export class UploadServiceProvider {
  apiUrl = 'https://4z9lj1zeal.execute-api.us-east-1.amazonaws.com/Dev/settings/foldercreds';
  constructor( public http: Http, 
			  	private transfer: FileTransfer, 
			  	private file: File) {
  }

  //config S3 params
  s3UploadConfig(file, s3Params) {
    return{
      url: 'woowootempholding',
      method: 'POST',
      chunkedMode: false,
      headers: {
        connection: "close"
      },
      params : {
        key: file,
        AWSAccessKeyId: 'AKIAIFNQEZP6K3KKCOIA',
        acl: 'private',
        policy: s3Params.policy,
        signature: s3Params.signature,
        'Content-Type' : "image/jpeg"
      }
    };
  }

  // Get Signature
  generateSignature(token) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    headers.append('Authorization-Token', token);

    const options: RequestOptions = new RequestOptions();
    options.headers = headers;
    debugger;
    // Call API to get Signature
    return this.http.get(this.apiUrl+'/generate-signature', options);
  }

  // Upload Image to s3
   upload(file,token): Promise<any>{
    return new Promise((resolve, reject) => {
      this.generateSignature(token)
        .map(response => response.json().data)
        .subscribe(
          response => {
            let s3Params = response;
            let serveConfig = this.s3UploadConfig(file, s3Params);
            let key = `uploads/${file.substr(file.lastIndexOf('/')+1)}`;
            const fileTransfer: FileTransferObject = this.transfer.create();

            fileTransfer.upload(file, encodeURI(s3Params.bucket_name), serveConfig)
              .then((result) => {
                // when finished upload photo. S3 will return a link of image.
                // This link is combined from `s3Params.bucket_name + key`
                resolve(s3Params.bucket_name + key);
              }, (error) => {
                resolve(error.json());
              });
          });
    });
  }

  /*upload(file,token): Promise<any>{
    return new Promise((resolve, reject) => {
      this.generateSignature(token)
        .map(response => response.json().data)
        .subscribe(
          response => {
            let s3Params = response;
            let serveConfig = this.s3UploadConfig(file, s3Params);
            let key = `uploads/${file.substr(file.lastIndexOf('/')+1)}`;
            const fileTransfer: FileTransferObject = this.transfer.create();

            fileTransfer.upload(file, encodeURI(s3Params.bucket_name), serveConfig)
              .then((result) => {
                // when finished upload photo. S3 will return a link of image.
                // This link is combined from `s3Params.bucket_name + key`
                resolve(s3Params.bucket_name + key);
              }, (error) => {
                resolve(error.json());
              });
          });
    });
  }*/


  

}
