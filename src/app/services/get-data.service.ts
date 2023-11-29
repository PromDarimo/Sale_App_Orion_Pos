import { Injectable } from '@angular/core';
import { ApiService } from './core/api.service';
import { ICategory } from './model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private api: HttpClient) { }

  async get_items() {
    // return this.api.showLoading(this.api.post("item.item/get_e_menu"));
    
    // sameple data
    let tmpJson = require('../../assets/sample_items.json');
    let data: Array<ICategory> = tmpJson;
    // return data;
  }

  readData(): Observable<item[]> {
    return this.api.get<item[]>("http://localhost:8080/orion_pos/read.php");
  }

  CreateInvoice(item: any): Observable<any>{
    return this.api.post<any>('http://localhost:8080/orion_pos/invoice.php',JSON.stringify(item));
  }

  getUser(): Observable<any[]> {
    return this.api.get<any[]>("http://localhost:8080/orion_pos/user.php");
  }

  getCus(): Observable<any[]> {
    return this.api.get<any[]>("http://localhost:8080/orion_pos/read_cus.php");
  }
}

export interface item{
  id : number,
  title : string,
  items : [
      {
          id : number,
          item_code : string,
          item_unit : string,
          item_name : string,
          menu_desc : string,
          price : number
      }
  ]
}