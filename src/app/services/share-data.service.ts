import { Injectable } from '@angular/core';
import { ICategory } from './model';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  //for store data getegory from json
  category_data: ICategory[] = [];

  constructor() { }
}
