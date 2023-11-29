import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class UiHelperService {

  private _isLoading: boolean | undefined;
  private _isShowToast: boolean | undefined;
  private _loader: HTMLIonLoadingElement | undefined;

  constructor(
    private loader: LoadingController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController) {
      
  }

  // loading component
  async showLoading(text: string = 'Please wait...', duration = 30) {
    // dismiss previous loading if exists
    // if (this._loader) {
    //   this._loader.dismiss();
    // }

    this._isLoading = true;
    this._loader = await this.loader.create({
      message: text,
      duration: duration * 1000
    });
    await this._loader.present();
  }
  hideLoading() {
    if (this._isLoading && this._loader) {
      this._loader.dismiss();
      this._isLoading = false;
    }
  }

  // alert component
  alert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [{
          text: "OK"
        }],
        backdropDismiss: false,
      }).then(ctrl => {
        ctrl.onDidDismiss().then(() => {
          resolve();
        });
        ctrl.present();
      });
    });
  }

  alertError(e: any, logError: boolean = false): Promise<void> { // e can be IError or default error
    return new Promise((resolve) => {
      if (logError) {
        console.log(e);
      }

      let title: string;
      let msg: string;
      if (e.error !== undefined && e.error.name !== undefined) {
        title = e.error.name;
        msg = e.error.message;
      }
      else {
        title = e.name;
        if (e.error !== undefined && e.error.message !== undefined)
          msg = e.error.message;
        else
          msg = e.message;
      }
      this.alertCtrl.create({
        header: title,
        message: msg,
        buttons: [{
          text: 'OK',
          handler: () => {
            resolve();
          }
        }]
      }).then(ctrl => {
        ctrl.present();
      });
    });
  }

  alertYesNo(title: string, message: string, yesText: string = "Yes", noText: string = "No"): Promise<boolean> {
    return new Promise((resolve) => {
      this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [{
          text: noText,
          role: 'cancel',
          handler: () => {
            resolve(false);
          }
        }, {
          text: yesText,
          handler: () => {
            resolve(true);
          }
        }]
      }).then(ctrl => {
        ctrl.present();
      });
    });
  }

  // toast compoent
  showToast(message: string, duration: number = 3000, position: EToastPosition = EToastPosition.Bottom) {
    let opt: ToastOptions = {
      message: message,
      position: position
    }
    if (duration > 0) {
      opt.duration = duration;
    }
    this._isShowToast = true;
    this.toastCtrl.create(opt).then(ctrl => {
      ctrl.present().then(() => {
        if (! this._isShowToast) {
          ctrl.dismiss();
        }
      });
    });
  }
  hideToast() {
    this._isShowToast = false;
    this.toastCtrl.dismiss();
  }
  
  /**
   * Shows toast when data is saved. Used this, so we don't have to write the same message multiple times.
   */
  showToast_Saved() {
    this.showToast("Data saved");
  }

  /**
   * Delays promise
   * @param milisecond number of miliseconds to delay
   * @returns promise that resolved after delay
   */
  delay(milisecond: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, milisecond);
    });
  }

}

export enum EToastPosition {
  Bottom = 'bottom',
  Middle = 'middle',
  Top = 'top'
}