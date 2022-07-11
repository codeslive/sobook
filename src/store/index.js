import { createStore } from "vuex";
import user from './modules/user';
import createPersistedState from 'vuex-persistedstate';
export default createStore({
  state: {
    findKey:'',//搜索关键词
    orderList: [], // 购物车订单的数据,
    bookInfo:[],

  },
  mutations: {

    getOrder(state, orderList) {
      state.orderList = orderList;
    },

    findKey(state, findKey){
        state.findKey = findKey;
    },

    getBookInfo(state, bookInfo){
        state.bookInfo = bookInfo;
    }

  },
  actions: {},
  modules: {
    user,
  },


  //设置store存储持久性/同步
  plugins: [
    createPersistedState()
  ]



});
