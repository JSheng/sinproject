<template>
  <Modal v-model="showModal">
        <p slot="header" class="text-left info">
            <Icon :if="titleIcon" type="titleIcon"></Icon>
            <span>{{title}}</span>
        </p>
        <div class="text-center">
            <p>{content}</p>
        </div>
        <div slot="footer" class="">
            <Button :if="showCancel" type="error" size="small" @click="cancel">取消</Button>
            <Button type="error" size="small" @click="sure">确认</Button>
        </div>
    </Modal>
</template>

<script lang="ts">
import { Component,Prop } from 'vue-property-decorator'
import BaseVue from '@/baseclass/base-vue'
@Component({
  name:"SAlert"
})
export default class Alert extends BaseVue {
  public static alert:Alert|undefined;
  private title:string = "aaa"
  private titleIcon:string = ""
  private content:string = ""
  private showCancel:boolean = false
  private showModal:boolean = true

  public setTitle(title:string){
    this.title = title
  }
  public setTitleIcon(titleIcon:string){
    this.titleIcon = titleIcon
  }
  public setContent(content:string){
    this.content = content
  }
  public setShwoCancel(show:boolean){
    this.showCancel = show
  }

  private cancel(){

  }

  private sure(){

  }

  public open(){
    this.showModal = true
  }

  public static getInstance(){
    Alert.alert = Alert.alert||new Alert()
    return Alert.alert
  }

  public static info(title:string,content:string,callback?:any){
    Alert.alert = Alert.getInstance()
    Alert.alert.setTitle(title)
    Alert.alert.setTitleIcon("")
    Alert.alert.setContent(content)
    Alert.alert.setShwoCancel(false)
    Alert.alert.open()
  }
  public static warn(title:string,content:string,callback?:any){
    Alert.alert = Alert.getInstance()
    Alert.alert.setTitle(title)
    Alert.alert.setTitleIcon("")
    Alert.alert.setContent(content)
    Alert.alert.setShwoCancel(false)
    Alert.alert.open()
  }
  public static error(title:string,content:string,callback?:any){
    Alert.alert = Alert.getInstance()
    Alert.alert.setTitle(title)
    Alert.alert.setTitleIcon("")
    Alert.alert.setContent(content)
    Alert.alert.setShwoCancel(false)
    Alert.alert.open()
  }
  public static confim(title:string,content:string,callback?:any){
    Alert.alert = Alert.getInstance()
    Alert.alert.setTitle(title)
    Alert.alert.setContent(content)
    Alert.alert.setShwoCancel(true)
    Alert.alert.open()
  }
}
</script>
<style lang="scss" scoped>
.footer {
  padding: 5px 18px 5px 18px;
}
.info {
  color:#f60
}
.warn {
  color:#f60
}
.error {
  color:#f60
}
</style>
