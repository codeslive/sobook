<template>
  <div class="header">
    <!-- 头部导航栏以及登录/注册功能模块 -->

    <HomeMenu></HomeMenu>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>


  </div>
</template>

<script>
//引入菜单栏组件
import HomeMenu from "@/components/default/HomeMenu.vue";

export default {
  name: "Home",
  components: {
    HomeMenu
  },
};
</script>


<style scope>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-from {
  display: none;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header{
 
  overflow-y: scroll;
  overflow-x: hidden;

}

/* 解决因为导航栏切换路由因css滚动条出现造成页面晃动的问题 */
/* html {
  overflow-y: scroll;
  overflow-x: hidden;
} */

/* 直接去掉页面所有的滚动条 */
.header::-webkit-scrollbar{
         display:none
    }

</style>



    

  