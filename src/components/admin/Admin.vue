<template>
  <div class="admin">
    <h3>
      <em>书店后台管理系统</em><span @click="goHome()" class="head">退出</span>
      <span>管理员</span
      ><span>
        <el-icon>
          <Avatar />
        </el-icon>
      </span>
    </h3>
    <el-container>
      <el-aside width="250px">
        <el-menu
          class="el-menu-demo"
          router
          text-color="gray"
          background-color="white"
          active-text-color="gray"
        >
          <el-menu-item index="/admin/type"
            ><span>
              <el-icon> <Chicken /> </el-icon>类型管理92版
            </span></el-menu-item
          >
          <el-menu-item index="/admin/type_93"
            ><span>
              <el-icon> <Cherry /> </el-icon>类型管理93版
            </span></el-menu-item
          >
          <el-menu-item index="/admin/book"
            ><span>
              <el-icon> <Coin /> </el-icon>商品管理
            </span></el-menu-item
          >
          <el-menu-item index="/admin/news"
            ><span>
              <el-icon> <Compass /> </el-icon>热点图片
            </span></el-menu-item
          >
          <el-menu-item index="/admin/dingdan"
            ><span>
              <el-icon> <ShoppingCartFull /> </el-icon>订单发货
            </span></el-menu-item
          >
          <el-menu-item index="/admin/user"
            ><span>
              <el-icon> <User /> </el-icon>用户列表
            </span></el-menu-item
          >
          <el-menu-item index="/admin/admin_add"
            ><span>
              <el-icon> <UserFilled /> </el-icon>管理员添加
            </span></el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition
              name="fade"
              appear
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  Avatar,
  Chicken,
  Cherry,
  Coin,
  Compass,
  ShoppingCartFull,
  UserFilled,
  User,
} from "@element-plus/icons-vue";

//引入vuex mapMutations 模块
import { mapMutations } from "vuex";

export default {
  name: "Admin",
  components: {
    Avatar,
    Chicken,
    Cherry,
    Coin,
    Compass,
    ShoppingCartFull,
    UserFilled,
    User,
  },

  data() {
    return {

    };
  },

  methods: {
    //跳转回前端页面
    ...mapMutations("user", ["getName", "getShow"]),
    goHome() {
      localStorage.setItem("token", ""); //清除token
      localStorage.setItem("nickname", ""); //清除名字
      localStorage.setItem("account", ""); //清除帐号
      localStorage.setItem("role", ""); //清除管理员
      this.nickname = "请登录";
      this.getName("未登录");
      this.getShow(true); //恢复默认头像
      this.$router.push("/"); //跳转回前台
    },
  },


  created() {

  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.el-aside {
  background-color: white;
}

.admin h3 {
  height: 60px;
  line-height: 60px;
  background-color: rgb(84, 92, 100);
}

.admin h3 em {
  font-style: normal;
  margin-left: 20px;
  color: white;
  font-style: initial;
}

.admin h3 span {
  float: right;
  font-size: 10px;
  font-style: normal;
  margin-right: 50px;
  color: white;
}

.head {
  color: rgb(134, 92, 100) !important;
}

.admin h3 span:hover {
  cursor: pointer;
}

.el-menu-item.is-active {
  background-color: #c8c7c7 !important;
}

.fade-enter-active {
  transition: opacity 1s ease;
}

.fade-leave-from {
  display: none;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


