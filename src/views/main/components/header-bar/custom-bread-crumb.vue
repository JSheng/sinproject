<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
        <common-icon style="margin-right: 4px;" :type="item.icon || ''"/>
        {{ showTitle(item) }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script lang="ts">
import BaseVue from "@/baseclass/base-vue"
import { showTitle } from '@/utils/util'
import CommonIcon from '@/components/common/common-icon.vue'
import { Component, Prop } from 'vue-property-decorator'
@Component({
  name:'CustomBreadCrumb',
  components:{
    CommonIcon
  }
})
export default class CustomBreadCrumb extends BaseVue {
  @Prop({type:Array,default:() => []}) list!:Array<any>
  @Prop({type:Number,default:14}) fontSize!:Number
  @Prop({type:Boolean,default:false}) showIcon!:Boolean
  showTitle (item:string) {
    return showTitle(item, this)
  }
  isCustomIcon (iconName:string) {
    return iconName.indexOf('_') === 0
  }
  getCustomIconName (iconName:string) {
    return iconName.slice(1)
  }
}
</script>

<style lang="scss">
.custom-bread-crumb{
  display: inline-block;
  vertical-align: top;
}
</style>
