declare interface SAlert {
  info(title:string,content:string,callback:any):void
  warn(title:string,content:string,callback:any):void
  error(title:string,content:string,callback:any):void
  confim(title:string,content:string,callback:any):void
}
