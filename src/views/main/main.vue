<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user-menu :user-name="userName" />
        </header-bar>
      </Header>
    </Layout>
  </Layout>
</template>

<script lang="ts">
import BaseVue from "@/baseclass/base-vue";
import {Component} from "vue-property-decorator";
import {Getter} from "vuex-class"
import HeaderBar from "@/views/main/components/header-bar/header-bar.vue";
import UserMenu from "@/views/main/components/user/user-menu.vue";
@Component({
  components:{
    HeaderBar,
    UserMenu
  }
})
export default class Main extends BaseVue{

  @Getter("user") user?:User

  private collapsed:Boolean = false
  private isFullscreen:Boolean = false

  // eslint-disable-next-line no-dupe-args
  asyncData({store,route}:any) {
    let menuList:MenuItem[] = [{"uuid":"1",
      "puuid":"0",
      "name":"system",
      "icon":"",
      "href":"",
      "meta":{"title":"系统管理"},
      "children":[{
        "uuid":"2",
        "puuid":"1",
        "name":"userManage",
        "icon":"",
        "href":"",
        "meta":{"title":"用户管理"}
      },{
        "uuid":"3",
        "puuid":"1",
        "name":"deptManage",
        "icon":"",
        "href":"",
        "meta":{"title":"部门管理"}
      },{
        "uuid":"4",
        "puuid":"1",
        "name":"roleManage",
        "icon":"",
        "href":"",
        "meta":{"title":"角色管理"}
      },{
        "uuid":"5",
        "puuid":"1",
        "name":"systemManage",
        "icon":"",
        "href":"",
        "meta":{"title":"系统参数"}
      }]}];
    store.state["menuList"] = menuList

  }

  get menuList() {
    return this.$store.state.menuList
  }
  get userName(){
    return this.user?this.user.getUserName():"未知"
  }

  handleCollapsedChange (state:Boolean):void {
    this.collapsed = state
  }
  turnToPage (route:any):void {
    let pageParam:any = {name:"",params:"",query:""};
    if (typeof route === 'string'){
      pageParam.name = route
    } else {
      pageParam.name = route.name
      pageParam.params = route.params
      pageParam.query = route.query
    }
    if (pageParam.name.indexOf('isTurnByHref_') > -1) {
      window.open(pageParam.name.split('_')[1])
      return
    }
    this.$router.push(pageParam)
  }
}
</script>

<style lang="scss" scoped>
.main{
  .logo-con{
    height: 64px;
    padding: 10px;
    img{
      height: 44px;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  }
  .header-con{
    background: #fff;
    padding: 0 0px;
    width: 100%;
  }
  .main-layout-con{
    height: 100%;
    overflow: hidden;
  }
  .main-content-con{
    height: calc(100% - 60px);
    overflow: hidden;
  }
  .tag-nav-wrapper{
    padding: 0;
    height:40px;
    background:#F0F0F0;
  }
  .content-wrapper{
    padding: 18px;
    height: calc(100% - 80px);
    overflow: auto;
  }
  .left-sider{
    .ivu-layout-sider-children{
      overflow-y: scroll;
      margin-right: -18px;
    }
  }
}
.ivu-menu-item > i{
  margin-right: 12px !important;
}
.ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
  margin-right: 8px !important;
}
.collased-menu-dropdown{
  width: 100%;
  margin: 0;
  line-height: normal;
  padding: 7px 0 6px 16px;
  clear: both;
  font-size: 12px !important;
  white-space: nowrap;
  list-style: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover{
    background: rgba(100, 100, 100, 0.1);
  }
  & * {
    color: #515a6e;
  }
  .ivu-menu-item > i{
    margin-right: 12px !important;
  }
  .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
    margin-right: 8px !important;
  }
}

.ivu-select-dropdown.ivu-dropdown-transfer{
  max-height: 400px;
}
</style>
