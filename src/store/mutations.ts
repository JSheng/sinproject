const mutations = {
  updateToken(state: any,token:string){
    state.token = token;
  },
  updateUser(state: any,params: User){
    state.userInfo = params;
  }
}
export default mutations;
