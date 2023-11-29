import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICategory, ICategoryItem, IItem, IItemList } from 'src/app/services/model';
import { HttpClient } from '@angular/common/http' //json import
import { GetDataService } from 'src/app/services/get-data.service';
@Component({
  selector: 'app-item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss'],
})
export class ItemSelectionComponent implements OnInit, OnChanges {

  @Output() onItemClick = new EventEmitter();
  @Input() categories: Array<ICategory> = [];
  tmpCategories: Array<ICategory> = [];
  tmpParentId: Array<number> = [];
  tmpActivedCategory: ICategory | undefined;
  tmpSubItems: Array<IItem> = [];
  tmpParentItemId: Array<number> = [];
  tmpParentCategoryTitle: string = '';
  isModalOpen = false;
  getJson:any=[];
  topping_category: any;
  selected_item: IItemList | undefined;

  item_list : any;
  constructor(private http: HttpClient,
              private api : GetDataService
    ) { }

  ngOnInit() {
    // this.Onget();
    return this.api.readData().subscribe((res )=>{ //readpolicies is function
      this.item_list = res;
      console.log(this.item_list);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] != undefined) {
      this.tmpCategories = this.categories;
      if (this.tmpCategories.length > 0) {
        this.category_Click(this.tmpCategories[0]);
      }
    }
  }

  init(categories: ICategory[]) {
    this.categories = categories;
    this.tmpCategories = categories;
    if (this.tmpCategories.length > 0) {
      this.category_Click(this.tmpCategories[0]);
    }
  }

  category_Click(cat: ICategory) {
    this.tmpActivedCategory = cat;
    if (cat.children.length > 0) {
      this.tmpCategories = cat.children;
      this.tmpParentId.push(cat.id);
      this.tmpParentCategoryTitle = cat.title;
    }

    this.tmpParentItemId.splice(0);
  }

  back_Click() {
    this._findCategory(this.categories);
  }

  private _findCategory(categories: Array<ICategory>) {
    for (let cat of categories) {
      if (cat.id == this.tmpParentId[this.tmpParentId.length - 1]) {
        this.tmpCategories = categories;
        this.tmpParentId.splice(this.tmpParentId.length - 1);
        return true;
      }
      if (cat.children.length > 0 && this._findCategory(cat.children)) {
        return true;
      }
    }
    return false;
  }

  item_Click(item: IItem) {
    if (item.children?.length > 0) {
      this.tmpParentItemId.push(item.id);
      this.tmpSubItems = item.children;
    }
    else {
      this.onItemClick.emit(item);
    }
  }

  itemBack_Click() {
    if (this.tmpActivedCategory !== undefined) {
      this._findItem(this.tmpActivedCategory.items);
    }
  }

  private _findItem(items: Array<IItem>) {
    for (let item of items) {
      if (item.id == this.tmpParentItemId[this.tmpParentItemId.length - 1]) {
        this.tmpSubItems = items;
        this.tmpParentItemId.splice(this.tmpParentItemId.length - 1);
        return true;
      }
      if (item.children.length > 0 && this._findItem(item.children)) {
        return true;
      }
    }
    return false;
  }

  //model topping
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  async Onget() {//function
    this.http.get('assets/sample_items.json').subscribe(res => {
      // console.log(res); check in console work or not
      this.getJson = res;
      for (let c of this.getJson) {
        if (c.id == -1) {
          this.topping_category = c;
          console.log(this.topping_category);
          break;
        }
      }
    })
  }
  topping_selection(topping: ICategoryItem) {
    let new_topping: IItemList = {
      id: topping.id,
      item_name: topping.item_name,
      item_code: topping.item_code,
      price: topping.price,
      qty: 1,
      topping: []
    }
    this.selected_item?.topping.push(new_topping);

    console.log(new_topping);
  }
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
}
