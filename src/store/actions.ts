const actions = {
  updateToken({commit}: any,token:string){
    commit('updateToken',token)
  },
  updateUser({commit}: any,user: User){
    commit('updateUser',user)
  }
}
export default actions;
