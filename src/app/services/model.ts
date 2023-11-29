export interface QRstringify{
  id: number
  qty:number
  topping: Array<IItemList>
}
export interface ICategory {
  id: number
  title: string
  children: Array<ICategory>
  items: Array<IItem>
}

export interface IItem {
  id: number
  item_name: string
  qty: number
  item_code: string
  item_unit: string
  menu_desc: string
  category: string
  images: Array<string> // will be set later
  price: number
  notes: Array<{
    id: number
    full_title: string
  }>
  topping: Array<{
    id: number
    item_name: string
    item_code: string
    price: number
    qty:number
  }>

  children: Array<IItem>
}
export interface ICategoryItem{
  id: number
  item_name: string
  item_code: string
  price: number
}

export interface IItemList {
  id: number  // id bos json file
  item_name: string
  item_code: string
  price: number
  qty: number
  topping: Array<IItemList>
}
export interface IItopping{
  // topping_name:string
  // topping: Array<IItemList>
  topping:Array<{
    id: number
    item_name: string
    item_code: string
    price: number
    qty:number
  }>
}

export interface QRExport{
  id: number
  qty:number
  topping:Array<{
    id:number
    qty:number
  }>
}
export interface QRtopping{
  topping:Array<{
    id:number
    qty:number
  }>
}