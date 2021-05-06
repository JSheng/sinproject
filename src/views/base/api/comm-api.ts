import BaseRequest from '@/baseclass/base-request';

/**
 * 公共http请求对象
 */
class CommRequest extends BaseRequest{

  public toModules(){
    const req:HttpRequest<any> = super.getRequest();
    // common为子模块名称
    const common:any = {
      config(){
        return req.get("./serverConfig.json");
      },
      menu(){
        return req.get("/menu");
      }
    }
    return {common};
  }
}
let request = new CommRequest();
export default request;
