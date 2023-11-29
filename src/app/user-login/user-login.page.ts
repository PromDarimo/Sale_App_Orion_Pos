import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { GetDataService } from '../services/get-data.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.page.html',
  styleUrls: ['./user-login.page.scss'],
})
export class UserLoginPage implements OnInit {
  test = "hey";
  user_list: any;
  user_login: any = {
    username: '',
    password: ''
  }

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private api: GetDataService
  ) { }

  ngOnInit() {
    return this.api.getUser().subscribe((res) => {
      // this.unit_list = res;
      this.user_list = res;
      console.log(res);
    });
  }

  async gotoNetPage() {
    // console.log(this.user_login.username)

    for (let i of this.user_list) {
      if (i.user_name == this.user_login.username && i.password == this.user_login.password) {
        console.log("success");

        const loading = await this.loadingCtrl.create({
          message: 'Loading...',
          duration: 500,
          cssClass: 'custom-loading',
        });
    
        await loading.present(); //waiting for duration 3 second
        await loading.onDidDismiss();
        this.navCtrl.navigateForward(['home']);//3  

      }
     
    }

  
  }
}
