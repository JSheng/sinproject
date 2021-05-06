<template>
  <Form ref="loginForm" :model="loginForm" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="loginForm.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="loginForm.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class LoginForm extends Vue {
  loginForm = {userName:"",password:""}
  get rules(){
    return {
      userName:[{ required: true, message: '账号不能为空', trigger: 'blur' }],
      password:[{ required: true, message: '密码不能为空', trigger: 'blur' }]
    }
  }
  handleSubmit(){
    this.$refs.loginForm.validate((valid) => {
      if (valid) {
        this.$emit('on-success-valid', {
          userName: this.loginForm.userName,
          password: this.loginForm.password
        })
      }
    })
  }
}
</script>
