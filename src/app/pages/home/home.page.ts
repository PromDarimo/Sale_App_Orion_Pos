import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonModal } from '@ionic/angular';
import { ItemSelectionComponent } from 'src/app/components/item-selection/item-selection.component';
import { GetDataService } from 'src/app/services/get-data.service';
import { ICategory, ICategoryItem, IItem, IItemList, QRstringify, QRExport, QRtopping } from 'src/app/services/model';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http' //json import
import { ShareDataService } from 'src/app/services/share-data.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  categories: Array<ICategory> = []; //for store json data from service
  Filter!: string;
  Filter1! : string
  order_items: IItem[] = []; //declared model name order_items
  // order_test: IItem[] = [];
  order_test: QRExport[] = [];

  selectedTap: number = 0;
  public loaded = false;
  toggle = true;

  editing_item!: IItem; //for
  editing_qr!: QRExport;

  isOpenQr: boolean = false
  isOpenEditModal: boolean = false;
  selected_item: IItem | undefined; //for topping item
  topping_category: any = [];//for get topping from json
  topping_Mark: ICategoryItem[] = [];
  search_item: ICategoryItem[] = [];
  search_cus: any;
  getJson: any;
  display_users: any[] = [];
  display_cus: any[] = []
  isSearching: boolean = false;
  myAngularxQrCode: any;
  stringifiedData: any;
  @ViewChild(IonModal) modal: IonModal | undefined;

  cus_list : any;
  isModalOpen : boolean = false;
  total_price : number = 0;
  net_total : number = 0;
  discount : number = 0;

  invoice : any = {
    id : 0,
    receive : 0,
    total : 0,
    discount : 0,
    net_total : 0,
    staffID : 0,
    cusID: 0,
  }

  recive : any ={
    money : 0
  }

  item_list : any;
  constructor(private getDataSer: GetDataService,
     public translate: TranslateService, 
     private http: HttpClient, 
     public shareData: ShareDataService,
    private api : GetDataService
     ) {

  }

  ngOnInit() {
   this.api.getCus().subscribe(res =>{
      this.cus_list = res;
      console.log(this.cus_list);
    });
    this.Onget();

  }

  ionViewDidEnter() {
    this.getDataSer.get_items().then(res => {
      console.log("hello data", res); // just log the result to console
      // this.categories = res;
      // this.shareData.category_data = res;

    });
  }

  //tap
  tab_Click(tap_id: number) {
    this.selectedTap = tap_id;
    this.toggle = !this.toggle;//change color
  }

  //item select
  onItem_Click(item: any) {
    let new_item: IItem = {
      id: item.id,
      item_name: item.item_name,
      item_code: item.item_code,
      price: item.price,
      topping: [],
      item_unit: '',
      menu_desc: '',
      category: '',
      images: [],
      notes: [],
      children: [],
      qty: 1
    }
    this.order_items.push(new_item);
    console.log("Item selected", this.order_items);
    this.itemEdit_Click(new_item); //click ler item del trov push open model topping
  }

  //for open modol topping and edit item
  itemEdit_Click(item: IItem) {
    this.editing_item = item;// edit item jab yok info item del click pi ler(=ng all info bos item)
    this.isOpenEditModal = true;
  }

  //get topping 
  async Onget() {//function
    this.api.readData().subscribe((res)=>{ //readpolicies is function
      this.item_list = res;
      console.log(this.item_list);
    })

    this.http.get('assets/sample_items.json').subscribe(res => {
      // console.log(res); check in console work or not
      this.getJson = res;
      for (let c of this.getJson) {
        if (c.id == -1) {
          this.topping_category = c;
          break;
        }
      }

      //for search item test
      this.search_item = [];
      for (let cat of this.item_list) {
        this.search_item = this.search_item.concat(cat.items);
      }

      this.search_cus = [];
      for (let cat of this.cus_list) {
        this.search_cus = this.search_cus.concat(cat);
      }
      console.log(this.search_cus, "heyyyy");
    })
  }

  topping_selection(topping: any) {
    let isExist: boolean = false;
    for (let i of this.editing_item?.topping) {
      if (topping.id == i.id) {
        if (i.qty < 3) {
          i.qty++;
          isExist = true;
          break;
        }

      }
    }


    if (!isExist) {
      let new_topping: IItem = {
        id: topping.id,
        item_name: topping.item_name,
        item_code: topping.item_code,
        price: topping.price,
        qty: 1,
        topping: [],
        item_unit: topping.null,
        menu_desc: '',
        category: '',
        images: [],
        notes: [],
        children: []
      }


      this.editing_item?.topping.push(new_topping);
      console.log("topping selected", new_topping);

    }

  }
  //search
  search() {
    this.display_users = [];
    if (this.Filter.length == 0) {
      return;
    }
    this.isSearching = true;
    window.setTimeout(() => {
      let tmp;
      tmp = this.Filter.toLowerCase(); //covert to small char and fliter is input from user
      for (let tp of this.search_item) {
        if ((<string>tp.item_name).toLowerCase().indexOf(tmp) >= 0) {
          this.display_users.push(tp);
          console.log("search", tp);
        }
      }
      this.isSearching = false;
    }, 500);
  }

  searchCustomer() {
    this.display_cus = [];
    if (this.Filter1.length == 0) {
      return;
    }
    // this.isSearching = true;
    window.setTimeout(() => {
      let tmp;
      tmp = this.Filter1.toLowerCase(); //covert to small char and fliter is input from user
      for (let tp of this.search_cus) {
        if ((<string>tp.customer_name).toLowerCase().indexOf(tmp) >= 0) {
          this.display_cus.push(tp);
          console.log("search", tp);
        }
      }
      // this.isSearching = false;
    }, 500);
  }


  //open modol topping and push item
  open_editing(item: any) { //display in search to push
    let new_item: IItem = {
      id: item.id,
      item_name: item.item_name,
      item_code: item.item_code,
      price: item.price,
      topping: [],
      item_unit: '',
      menu_desc: '',
      category: '',
      images: [],
      notes: [],
      children: [],
      qty: 1
    }


    this.order_items.push(new_item);
    this.itemEdit_Click(new_item);//open topping modol
    console.log("search items selected", this.order_items);


  }
  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }
  confirm1() {
    this.isOpenQr = false;
  }
  confirm(item: any) {
    this.modal?.dismiss('confirm');


    let test1: IItem = {
      id: item.id,
      item_name: item.null,
      item_code: item.null,
      price: item.null,
      item_unit: item.null,
      menu_desc: item.null,
      category: item.null,
      images: item.null,
      notes: item.null,
      children: item.null,
      topping: item.topping,
      qty: item.qty,
    }
    this.order_test.push(test1);
    // let test1: QRExport={
    //   id: item.id,
    //   qty: item.qty,
    //   topping: item.topping //note
    // }


    this.stringifiedData = JSON.stringify(this.order_test); //convert to string json
    this.myAngularxQrCode = this.stringifiedData;
    console.log("qr code", this.myAngularxQrCode);
  }


  decrement(item: IItem) {
    let isQty: boolean = false;
    if (item.qty == 1) {
      isQty = true;
    }
    else {
      item.qty -= 1;
    }
  }
  increment(item: any) {
    item.qty += 1;
  }
  delete_item(index: number) {
    this.order_items.splice(index, 1);
  }
  delete_topping(index: number) {
    this.editing_item?.topping.splice(index, 1);
  }

  Openqrcode(qrcode: boolean, item: any) {
    this.isOpenQr = true
    console.log("qr code", this.myAngularxQrCode);
  }

  openTotal(){
    this.isModalOpen = true;
    // console.log("Isuzu",this.order_items);
    for(let i of this.order_items){
      let test = i.qty * i.price; //item by qty

      this.total_price += Number(test);
      console.log(test);
    }
    this.net_total = this.total_price ;
    console.log("total price",this.total_price);

    this.invoice.total = this.total_price;
    this.invoice.net_total = this.total_price - this.invoice.discount;
    console.log(this.invoice);
  }

  close(){
    this.isModalOpen = false;
  }

  setOpen(item : any){
    // this.isModalOpen = false;
    if( Number(this.invoice.receive) > Number(this.invoice.total)){
      this.api.CreateInvoice(item).subscribe((res) => {
        console.log("success");
      });
    }
    this.isModalOpen = false;
    
    console.log(this.invoice);
  }
}
