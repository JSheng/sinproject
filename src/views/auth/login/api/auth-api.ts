import BaseRequest from '@/baseclass/base-request';

class AuthRequest extends BaseRequest{

  public toModules(){
    const req:HttpRequest<any> = super.getRequest();
    const auth:API.AuthInterface = {
        //登录认证
        login(username:string='',password:string='') {
          return req.post(`login`, {userName:username,password:password});
        },
        //系统退出
        loginOut() {
          return req.get(`loginOut`);
        }
    }
    return {auth};
  }
}
let request = new AuthRequest()
export default request;
