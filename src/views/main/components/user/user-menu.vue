<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar icon="ios-contact"/>
      <span>{{userName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="userInfo">个人信息</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script lang="ts">
import BaseVue from "@/baseclass/base-vue"
import { Component,Prop } from 'vue-property-decorator'

@Component
export default class UserMenu extends BaseVue {

  @Prop({type:String,default:''}) userName!:string;
  @Prop({type:String,default:''}) userAvatar!:string;
  @Prop({type:Number,default:0}) messageUnreadCount!:number;

  logout () {
    /* this.handleLogOut().then(() => {
      this.$router.push({
        name: 'login'
      })
    }) */
  }
  message () {
   this.$router.push({
      name: 'message_page'
    });
  }

  handleClick (name:String) {
    switch (name) {
      case 'logout': this.logout()
        break
      case 'message': this.message()
        break
      default:

    }
  }
}
</script>

<style lang="scss" scoped>
.user-avatar-dropdown {
     cursor: pointer;
     display: inline-block;
     vertical-align: middle;
    .ivu-badge-dot{
      top: 16px;
    }
  }
</style>
