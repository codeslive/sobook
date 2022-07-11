//1.state状态
const state = {
    cirecleImg: '',
    username: '未登录',
    circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", //默认头像地址
    showAvatar: true,
}

const mutations = {
    //用户头像
    getCirecleImg(state, imgUrl) {
        state.cirecleImg = imgUrl;
    },

    getName(state, username) {
        state.username = username;
    },


    getShow(state, showAvatar) {
        state.showAvatar = showAvatar;
    },

    getNewImg(state, circleUrl){
        state.circleUrl = circleUrl;
    }



}

const actions = {}

const getters = {}

//5.导出且注册当前模块
export default {
    //注册模块使当前模块成为待命名的区域  vue.cart.xxx
    namespaced: true,
    state,
    mutations,
    actions,
    getters

}