import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入qs
import qs from 'qs';
//创建一个app常量
const app = createApp(App);
//引入axios
import axios from 'axios';
import VueAxios from 'vue-axios';

//引入iconfont样式
import './assets/css/iconfont.css';

import 'animate.css';

//引入ElementUI
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

//配置公共请求路径
axios.defaults.baseURL = '';
app.config.globalProperties.$Imgurl = '';

//向原型添加qs插件【使用 this.$qs.函数名】
app.config.globalProperties.$qs = qs;
app.use(store).use(router).use(VueAxios, axios).use(ElementPlus).mount("#app");


