<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import BaseVue from "@/baseclass/base-vue"
import SiderTrigger from '@/views/main/components/header-bar/sider-trigger.vue'
import customBreadCrumb from '@/views/main/components/header-bar/custom-bread-crumb.vue'
import {Component, Prop} from "vue-property-decorator"

@Component({
  name:'HeaderBar',
  components:{
    SiderTrigger,
    customBreadCrumb
  }
})
export default class HeaderBar extends BaseVue{
  @Prop(Boolean) collapsed = false;
  get breadCrumbList(){
    return [{"uuid":"1","puuid":"0","name":"home","icon":"ivu-icon ivu-icon-md-home","href":"","to":"","meta":{"title":"首页"}}]
  }
  handleCollpasedChange (state:any) {
    this.$emit('on-coll-change', state)
  }
}
</script>

<style lang="scss">
.header-bar{
  width: 100%;
  height: 100%;
  position: relative;
  background: #e3e4e4;
  .custom-content-con{
    float: right;
    height: auto;
    padding-right: 20px;
    line-height: 64px;
    & > *{
      float: right;
    }
  }
}
</style>
