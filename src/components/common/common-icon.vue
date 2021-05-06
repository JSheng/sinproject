<template>
  <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize"/>
</template>

<script>
import Icons from './icons'
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({components:{Icons}})
export default class CommonIcon extends Vue {
  @Prop({type:String,required:true}) type
  @Prop(String) color
  @Prop(Number) size

  get iconType () {
    return this.type.indexOf('_') === 0 ? 'Icons' : 'Icon'
  }
  get iconName () {
    return this.iconType === 'Icons' ? this.getCustomIconName(this.type) : this.type
  }
  get iconSize () {
    return this.size || (this.iconType === 'Icons' ? 12 : undefined)
  }
  get iconColor () {
    return this.color || ''
  }
  getCustomIconName (iconName) {
    return iconName.slice(1)
  }
}
</script>

<style lang="scss">

</style>
