import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ItemSelectionModule } from 'src/app/components/item-selection/item-selection.module';
import {TranslateModule} from '@ngx-translate/core'; //import translate
import{HttpClientModule} from '@angular/common/http' //import json
import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ItemSelectionModule,
    TranslateModule,
    HttpClientModule,
    QRCodeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
