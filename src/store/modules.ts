import camelCase from 'lodash/camelCase'
const modules:any = {};
const requireModule = require.context('../views/', true, /modules\.ts$/);
requireModule.keys().forEach(fileName => {
  const moduleName = camelCase(
    fileName.replace(/(\.\/|\.ts)/g, '')
  )
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName),
  }
});
export default modules;
