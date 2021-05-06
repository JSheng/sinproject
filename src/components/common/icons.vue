<template>
  <i :class="`iconfont icon-${type}`" :style="styles"></i>
</template>

<script>
  import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Icon extends Vue {
  @Prop({type:String,required:true}) type
  @Prop({type:String,default:'#5c6b77'}) color
  @Prop({type:Number,default:16}) size

  get styles() {
    return {
      fontSize: `${this.size}px`,
      color: this.color
    }
  }
}
</script>

<style type="scss">

</style>
