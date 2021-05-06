/**
 * auth模块接口声明文件
 **/
declare namespace API {
  interface ApiModule {
    auth:AuthInterface
  }
  interface AuthInterface {
    login(username:string,password:string):RestResult<any>
    loginOut():RestResult<any>
  }
}


