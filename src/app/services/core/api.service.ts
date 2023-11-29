import { Injectable } from '@angular/core';
import { ApiHelperService } from './api-helper.service';
import { UiHelperService } from './ui-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  shop_key: string = ''; // pass by session service
  timezone_offset: string = '+07:00';

  constructor(private apiHelper: ApiHelperService, private ui: UiHelperService) {
    this.apiHelper.BaseURL = "http://localhost/cloud_pos/index.php/"; //link php
    // this.ApiHelper.BaseURL = "https://smart-pos-cloud.df.r.appspot.com/index.php/";

    this.apiHelper.EnableLog = true;
  }

  /**
   * Shows loading while promise is processing.
   * @param pro promise that will be processed
   * @returns  promise result on success, or FALSE on error.
   */
   async showLoading(pro: Promise<any>) {
    await this.ui.showLoading();
    let res: any;
    try {
      res = await pro;
      this.ui.hideLoading();
    } catch (e) {
      res = false;
      this.ui.hideLoading();
      await this.ui.alertError(e);
    }
    return res;
  }

  post(functionName: string, params: Array<any> = [], timeOut: number = 60) {
    return this.apiHelper.post(functionName, {
      params: params,
      shop_key: this.shop_key,
      timezone_offset: this.timezone_offset
    }, timeOut);
  }

  postObs(functionName: string, params: Array<any> = []) {
    return this.apiHelper.postObs(functionName, {
      params: params,
      shop_key: this.shop_key,
      timezone_offset: this.timezone_offset
    });
  }

}
