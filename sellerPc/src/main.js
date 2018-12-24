// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '@/style/style.css'
import 'element-ui/lib/theme-chalk/index.css'
import GeminiScrollbar from 'vue-gemini-scrollbar'
import AMap from 'vue-amap'
import VDistpicker from 'v-distpicker'

Vue.component('v-distpicker', VDistpicker)//全局注册省市选择器组件
Vue.use(ElementUI)
Vue.use(AMap)
Vue.use(GeminiScrollbar)//引用自定义滚动条组件

AMap.initAMapApiLoader({
  key: 'fe2312e4704c6f8f7787c7864ecebae6',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})