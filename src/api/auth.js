import base from './base'; // 导入接口域名列表
import axios from '@/utils/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const auth = {
    //登录认证
    login(params) {
      return axios.post(`${base.ind}/login`, qs.stringify(params));
    },
    //系统退出
    loginOut() {
      return axios.get(`${base.ind}/loginOut`);
    }
}

export default auth;
