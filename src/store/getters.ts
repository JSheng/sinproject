import { GetterTree, Getter } from 'vuex'
const getUserInfo:Getter<any,any> = (state:any)=>{
  return state.userInfo;
}

const getterTree: GetterTree<any, any> = {
  getUserInfo
}
export default getterTree;
