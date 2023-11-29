import { Injectable } from '@angular/core';
import { LoadingController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Subscription, Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  // the base api link. Ex: http://localhost/smart_pos/api.php
  // if it is not set, then full url should be used when calling post or get method
  public BaseURL: string = '';

  public EnableLog: boolean = false;

  constructor(public loading: LoadingController, public http: HttpClient) { 

  }

  private _getAPIURL(functionName: string) {
    // prepare api url
    let apiURL: string = this.BaseURL;
    if (apiURL.length > 0) { // if base url is set, then concate with the function name
      if (! apiURL.endsWith('/')) {
        apiURL += '/';
      }
      apiURL += functionName;
    }
    else { // if base url is not set, then full api url is provided
      apiURL = functionName;
    }
    return apiURL;
  }

  private _getPostDataOrParams(method: EMethod, postDataOrParam: any): string {
    if (method == EMethod.POST) {
      let tmp = JSON.stringify(postDataOrParam);
      if (this.EnableLog) console.log(tmp); // for testing purpose
      return tmp;
    }
    else {
      if (postDataOrParam.length > 0) {
        return '/' + postDataOrParam.join('/');
      } else {
        return "";
      }
    }
  }

  private async _request_api(method: EMethod, functionName: string, postDataOrParam: any, time_out: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // choose to use post or get method
      // let ret: Promise<any>;
      let obs: Observable<any>;
      let sub: Subscription;
      if (method == EMethod.POST) {
        // ret = this.http.post(this._getAPIURL(functionName), this._getPostDataOrParams(method, postDataOrParam)).toPromise();
        obs = this.http.post(this._getAPIURL(functionName), this._getPostDataOrParams(method, postDataOrParam)).pipe(timeout(time_out * 1000));
      }
      else {
        // ret = this.http.get(this._getAPIURL(functionName) + this._getPostDataOrParams(method, postDataOrParam)).toPromise();
        obs = this.http.get(this._getAPIURL(functionName) + this._getPostDataOrParams(method, postDataOrParam)).pipe(timeout(time_out * 1000));
      }
      // success or reject promise
      let tmp1 = new Date();

      sub = obs.subscribe({
        next: (res) => {
          if (this.EnableLog) {
            let tmp2 = new Date();
            console.log((tmp2.getTime() - tmp1.getTime()) / 1000);
          }
          // clearTimeout(timer);
          resolve(res);
        },
        error: (e: any) => {
        // clearTimeout(timer);
        reject(e);
      }});

      // promise time out
      // let timer: any;
      // if (time_out > 0) {
      //   timer = window.setTimeout(() => {
      //     sub.unsubscribe();
      //     let error = {
      //       name: 'Request Timeout',
      //       message: 'The server is not responed! Make sure your network is available and try again.'
      //     }
      //     reject(error);
      //   }, time_out * 1000);
      // }
    });
    // try {
    //   let res = await ret;
    //   clearTimeout(timer);
    //   return res;
    // } catch (e) {
    //   clearTimeout(timer);
    //   throw e;
    // }
  }

  private _request_obs(method: EMethod, functionName: string, postDataOrParam: any) {
    return new Observable<any>(subscriber => {
      let obs: Observable<any>;
      if (method == EMethod.POST) {
        obs = this.http.post(this._getAPIURL(functionName), this._getPostDataOrParams(method, postDataOrParam));
      }
      else {
        obs = this.http.get(this._getAPIURL(functionName) + this._getPostDataOrParams(method, postDataOrParam));
      }

      let tmp1 = new Date();
      let sub = obs.subscribe({
        next: (res) => {
          if (this.EnableLog) {
            let tmp2 = new Date();
            console.log((tmp2.getTime() - tmp1.getTime()) / 1000);
          }

          subscriber.next(res);
          subscriber.complete();
        },
        error: (e) => {
          subscriber.error(e);
          subscriber.complete();
        }
      });

      return {
        unsubscribe() {
          sub.unsubscribe();
        }
      }
    });
    
  }

  public post(functionName_or_fullURL: string, data: object, time_out: number = 60): Promise<any> {
    return this._request_api(EMethod.POST, functionName_or_fullURL, data, time_out);
  }

  public postObs(functionName_or_fullURL: string, data: object) {
    return this._request_obs(EMethod.POST, functionName_or_fullURL, data);
  }

  public get(functionName_or_fullURL: string, params: string[] = [], time_out: number = 60): Promise<any> {
    return this._request_api(EMethod.GET, functionName_or_fullURL, params, time_out);
  }

  public getObs(functionName_or_fullURL: string, params: string[] = []) {
    return this._request_obs(EMethod.GET, functionName_or_fullURL, params);
  }

}

enum EMethod {
  GET,
  POST
}
