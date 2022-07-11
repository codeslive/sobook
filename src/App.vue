<template>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    //App.vue
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    },
  },
  //App.vue
  mounted() {
    //移动端设备
    if (this._isMobile()) {
        console.log(this.$route.path);
        
    }else{
      
    
    }
  },



};
</script>

<style lang="stylus"></style>
