type AxiosPromise = import('axios').AxiosPromise;

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.ts' {
  import * as Http from 'axios';
  export default Http
}

/**声明api接口全局命名空间及接口，
 *其他api接口声明文件按此接口添加各自声明类型，
 *声明类型名称请保证全局唯一
 **/
declare namespace API {
  //api接口声明类型
  interface ApiModule {
    common:CommonInterface
  }
  interface CommonInterface {
    config():RestResult<any>
    menu():RestResult<any>
  }
}

// http请求回调函数类型
declare class HttpRequest<T> {
  public setHeaders(hesders:{}):void
  public setBaseUrl(baseUrl:string):void
  public setCookies(cookiess:any):void
  public request (options:any):AxiosPromise
  public get(url:string,params?:any):RestResult
  public post(url:string,params?:any):RestResult
  public put(url:string,params?:any):RestResult
  public delete(url:string,params?:any):RestResult
}

declare class BaseRequest {
  protected request: HttpRequest<any>;
  public setRequest(request:HttpRequest<any>):void;
  public getRequest():HttpRequest<any>;
  public toModules():any;
}

//返回对象声明类型
declare class RestResult<T=any> extends Promise<never>{
  public code:Number
  public state:String
  public data:T
  public message:String
}

type Callback = (...params:any[]) => void

declare class TokenInfo {
  public token:string
  public user:User
}

declare class User {
  public uuid:String
  public loginId:String
  public userName:String
  public isSuperAdmin:Boolean
  public setUuid(uuid:string):void;
  public getUuid():string;
  public setLoginId(loginId:string):void;
  public getLoginId():string;
  public setUserName(userName:string):void;
  public getUserName():string;
  public setSuperAdmin(isSuperAdmin:boolean):void;
  public gsetSuperAdmin():boolean;
}
//分页声明类型
declare class Pagination<T> {
  public pageNum:Number
  public pageSize:Number
  public total:Number
  public data:T
}

declare class MenuTree {
  public uuid:String
  public puuid:String
  public name:String
  public icon:String
  public href:String
  public theme:String
  public children?:Array<MenuItem>
}

declare class MenuItem {
  public name:String
  public uuid?:String
  public puuid?:String
  public icon:String
  public href?:String
  public meta?:MenuMeta
  public children?:Array<MenuItem>
}

declare class MenuMeta {
  public title?:String|Function
  public access?:Array<String|Number>
  public icon?:String
  public href?:String
  public showAlways?:Boolean
  public hideInMenu?:Boolean
  public __titleIsFunction__?:Boolean
}
