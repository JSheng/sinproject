import axios from 'axios'
// @ts-ignore
import qs from 'qs'; // 根据需求是否导入qs模块
import {Constants} from '@/baseclass/constants'
import { Modal } from 'view-design'

class HttpRequest<T> {
  private queue:any;
  private baseUrl!:string;
  private cookiess:String[];
  constructor () {
    this.queue = {};
    this.cookiess = [];
    axios.defaults.withCredentials=true;
  }

  public setHeaders(hesders:{}):void{
    if (!Object.keys(hesders).length) {
      axios.defaults.headers = {...hesders,...axios.defaults.headers}
    }
  }

  public setBaseUrl(baseUrl:string):void{
    this.baseUrl = baseUrl;
  }

  public setCookies(cookiess:any):void{
    this.cookiess = cookiess;
  }

  parseCookies(cookiess:String[]){
    let cookie = ''
    cookiess.forEach((item:any,i:number) => {
      cookie += item + '=' + cookiess[i] + '; '
    })
    return cookie;
  }

  getInsideConfig (baseUrl:string,cookiess:any[]) {
    const config = {
      baseURL: baseUrl||Constants.BASE_URL,
      headers: {
        cookie: this.parseCookies(cookiess)
      },
      timeout: 1000 * 12
    }
    return config
  }
  redirectUrl(url:string){
    window.top.location.href = url;
  }
  destroy (url: string) {
    delete this.queue[url]
  }

  interceptors (instance:any, url:string) {
    // 请求拦截
    instance.interceptors.request.use((config: any) => {
      this.queue[url] = true
      return config
    }, (error: any) => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res:any) => {
      if (res.status === 200){
        this.destroy(url)
        if(res.data){
          let result:RestResult<any> = res.data
          if(result.state === "error"||result.state === "ERROR"){
            if(res.data["message"]){
              /// @ts-ignore
              Modal.error({
                title:'错误提示',
                content:result.message
              })
            }
          }else{
            return result
          }
        }else{
          const {data,status} = res
          return {data,status};
        }
      } else {
        return Promise.reject(res);
      }
    }, (error: { response: any; }) => {
      const { response } = error;
        if (response) {
          this.destroy(url)
          // 状态码判断
          switch (response.status) {
            // 401: 未登录状态，跳转登录页
            case 401:
                this.redirectUrl("/login");
                break;
            // 403 token过期
            // 清除token并跳转登录页
            case 403:
                localStorage.removeItem('token');
                setTimeout(() => {
                  this.redirectUrl("/login");
                }, 1000);
                break;
            // 404请求不存在
            case 404:
              this.redirectUrl("/404");
                break;
            case 500:
              console.log(error);
              /// @ts-ignore
              Modal.error({
                title:'错误提示',
                content:'出错了,请联系管理员'
              })
              break;
            default:
              /// @ts-ignore
              Modal.error({
                title:'错误提示',
                content:response.data.message
              })
            }
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            //store.commit('changeNetwork', false);
        }
      return Promise.reject(error)
    })
  }
  request (options:any) {
    const instance = axios.create()
    // eslint-disable-next-line no-param-reassign
    options = Object.assign(this.getInsideConfig(this.baseUrl,this.cookiess), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  public get(url:string,params?:any){
    let options = {method: 'get',url: url,data:params};
    return this.request(options);
  }
  public post(url:string,params?:any){
    let options = {method: 'post',url: url,data:params};
    return this.request(options);
  }
  public put(url:string,params?:any){
    let options = {method: 'put',url: url,data:qs.stringify(params)};
    return this.request(options);
  }
  public delete(url:string,params?:any){
    let options = {method: 'delete',url: url,data:params};
    return this.request(options);
  }
}
export default HttpRequest
