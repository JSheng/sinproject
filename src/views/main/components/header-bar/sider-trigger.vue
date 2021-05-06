<template>
  <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
    <Icon :type="icon" :size="size" /></a>
</template>
<script lang="ts">
import BaseVue from "@/baseclass/base-vue"
import { Component, Prop } from 'vue-property-decorator'
@Component
export default class SiderTrigger extends BaseVue {
  @Prop({type:Boolean,default: false}) collapsed!:Boolean
  @Prop({type:String,default: 'navicon-round'}) icon!:String
  @Prop({type:Number,default: 26}) size!:Number
  handleChange () {
    this.$emit('on-change', !this.collapsed)
  }
}
</script>
<style lang="scss">
$size: 40px;
.trans{
  transition: transform .2s ease;
}
.sider-trigger-a{
  padding: 6px;
  width: $size;
  height: $size;
  display: inline-block;
  text-align: center;
  color: #5c6b77;
  margin-top: 12px;
  i{
    transition: transform .2s ease;
    vertical-align: top;
  }
  &.collapsed i{
    transform: rotateZ(90deg);
    transition: transform .2s ease;
  }
}
</style>
