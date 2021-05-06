import BaseRequest from '@/baseclass/base-request'; // 导入http中创建的axios实例
class IndexRequest extends BaseRequest {
  private apiContext:any
  constructor (apiContext:any) {
    super();
    this.apiContext = apiContext;
  }

  public toModules():any{
    let apis: any = {};
    if(this.apiContext !== undefined){
      this.apiContext.keys().map((api:String) => {
        // 如果是根目录的 index.ts、 不做任何处理
        if (api.startsWith('./index')) {
          return
        }
        const moudle:BaseRequest = this.apiContext(api).default;
        moudle.setRequest(this.request)
        apis = {...(moudle.toModules()),...apis};
      });
    }
    return apis;
  }

}
export default IndexRequest;
