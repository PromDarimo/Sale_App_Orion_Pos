import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ItemSelectionComponent } from './item-selection.component';
import {TranslateModule} from '@ngx-translate/core';
import{HttpClientModule} from '@angular/common/http' //import json

@NgModule({
  declarations: [ItemSelectionComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    HttpClientModule
  ],
  exports: [ItemSelectionComponent]
})
export class ItemSelectionModule { }
