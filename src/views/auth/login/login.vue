<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip" v-bind:class="{'error':isError,'login-tip-color':!isError}">{{message}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import LoginForm from '@/views/auth/login/components/login_form.vue'
import RestCode from '@/baseclass/resultCode'
import BaseVue from '@/baseclass/base-vue'
import { State } from 'vuex-class';
import { LoginInfo } from './login';
@Component({
  components:{
    LoginForm
  }
})
export default class Login extends BaseVue {

  @State("user") user!:User;
  @State("token") token!:string;

  private message:String = "输入任意用户名和密码即可"
  private isError:Boolean = false
  handleSubmit(userInfo:LoginInfo):void{
    this.$http.auth.login(userInfo.userName,userInfo.password).then((result:RestResult<TokenInfo>)=>{
      if(result.code === RestCode.AUTH_LOGIN_001.code){
        this.$store.dispatch("updateUser", result.data.user);
        this.$store.dispatch("updateToken", result.data.token);
        this.$router.push({name: 'index'});
      }else if(result.code === RestCode.AUTH_LOGIN_002.code){
        this.isError = true
        this.message = RestCode.AUTH_LOGIN_002.message
      }else{
        this.isError = true
        this.message = '未知异常'
      }
    })
  }
}
</script>

<style lang="scss">
  .login{
    width: 100%;
    height: 100%;
    background-color: #2c3e50;
    background-size: cover;
    background-position: center;
    position: relative;

  }
  .login-con{
    position: absolute;
    left: 37%;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
  }
  .login-header{
    font-size: 16px;
    font-weight: 300;
    text-align: center;
    padding: 30px 0;
  }
  .form-con{
    padding: 10px 0 0;
  }
  .login-tip{
    font-size: 10px;
    text-align: center;
  }
  .login-tip-color {
    color: #c3c3c3;
  }
</style>
