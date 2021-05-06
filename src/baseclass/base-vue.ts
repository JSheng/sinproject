import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { State } from 'vuex-class';
@Component
export default class BaseVue extends Vue {
  @State("$http") $http!: API.ApiModule;
}
