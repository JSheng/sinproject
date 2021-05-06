/**
 * http请求方法对象父类
 */
class BaseRequest {

  /**
   * axios封装请求对象
   */
  /**
   * axios封装请求对象
   */
  protected request!: HttpRequest<any>;

  constructor () {
  }

  public setRequest(request:HttpRequest<any>):void{
    this.request = request;
  }

  public getRequest():HttpRequest<any>{
    return this.request;
  }

  public toModules():any{
    const apis:any = {}
    return apis;
  }
}
export default BaseRequest;
