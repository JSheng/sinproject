import axios from '@/utils/http'; // 导入http中创建的axios实例
export default function(){
    return axios.get("./serverConfig.json")
};