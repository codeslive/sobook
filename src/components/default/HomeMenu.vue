<template>
  <div class="home-menu">
    <!-- <div class="body-menu">
      <div class="right">书城演示系统</div>
      <ul class="center">
        <li
          v-for="item in navList"
          :key="item.id"
          @click="addSty(item.id, item.link)"
          :class="{ default: id == item.id }"
          >{{ item.title }}</li
        >
      </ul>
   
      <el-avatar
        :size="40"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          v-show="showAvatar"      
      ></el-avatar>
      
      <el-avatar
        :size="40"
        :src="`${$Imgurl}/api/public/showImg/${cirecleImg}`"
        v-show="!showAvatar"
      ></el-avatar>

      <div class="addLogin">
        
      </div>

      <div class="exit">
        <span @click="exitLogin()">退出</span>
      </div>
    </div> -->

    <nav>
      <ul>
        <li>书城购物系统</li>
        <li
          v-for="item in navList"
          :key="item.id"
          @click="addSty(item.id, item.link)"
          :class="{ default: id == item.id }"
        >
          {{ item.title }}
        </li>

        <!-- <li class="headerSearch">
          <input
            type="search"
            placeholder="请输入搜索内容"
            v-model="search"
            @keyup.enter="findBook()"
          />
          <input type="button" value="搜索" @click="findBook()"/>
        </li> -->

        <el-avatar
          :size="50"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          v-show="showAvatar"
        ></el-avatar>

        <el-avatar
          :size="50"
          :src="`${$Imgurl}/api/public/showImg/${cirecleImg}`"
          v-show="!showAvatar"
        ></el-avatar>
        <div @click="dialogFormVisible = true" class="name">{{ username }}</div>
        <div class="exit" @click="exitLogin()">退出</div>
      </ul>
    </nav>

    <el-dialog v-model="dialogFormVisible" width="40%" :title="title" center>
      <el-form :model="form">
        <!-- 登录 -->
        <div v-show="showLogin" class="newAccout">
          <el-input v-model="form.username" placeholder="请输入你的用户账号">
            <template #prepend>帐号</template>
          </el-input>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入你的用户密码"
          >
            <template #prepend>密码</template>
          </el-input>
        </div>

        <!-- 注册 -->
        <div v-show="!showLogin" class="newAccout">
          <el-input
            v-model.lazy.trim="obj_name.uname"
            placeholder="请输入你的用户名称"
            maxlength="11"
            @blur="Uname()"
          >
            <template #prepend>用户名称</template>
          </el-input>
          <p :class="{ rules: obj_name.show }">{{ obj_name.Ntip }}</p>
          <el-input
            v-model.lazy.trim="obj_phone.uphone"
            type="phone"
            placeholder="请输入你的用户手机号"
            maxlength="11"
            @blur="Uphone()"
          >
            <template #prepend>手机号码</template>
          </el-input>
          <p :class="{ rules: obj_phone.show }">{{ obj_phone.Ptip }}</p>
          <el-input
            v-model.lazy.trim="obj_account.uaccount"
            type="text"
            placeholder="请输入你的用户账号"
            maxlength="6"
            @blur="Uaccount()"
          >
            <template #prepend>注册账号</template>
          </el-input>
          <p :class="{ rules: obj_account.show }">{{ obj_account.Atip }}</p>
          <el-input
            v-model.lazy.trim="obj_pwd.upwd"
            type="password"
            show-password
            placeholder="密码长度不小于6位"
            maxlength="6"
            @blur="Upassword()"
          >
            <template #prepend>注册密码</template>
          </el-input>
          <p :class="{ rules: obj_pwd.show }">{{ obj_pwd.Ptip }}</p>
          <el-input
            v-model.lazy.trim="obj_checkpwd.checkpwd"
            type="password"
            show-password
            placeholder="密码长度不小于6位"
            maxlength="6"
            @blur="Ulastpass()"
          >
            <template #prepend>确认密码</template>
          </el-input>
          <p :class="{ rules: obj_checkpwd.show }">{{ obj_checkpwd.Ctip }}</p>
        </div>
      </el-form>

      <!-- 按钮 -->
      <el-button
        type="primary"
        @click="toLogin()"
        class="btn"
        v-show="showLogin"
        >用户登录</el-button
      >
      <el-button
        type="primary"
        class="btn"
        v-show="!showLogin"
        @click="Register()"
        >立即注册</el-button
      >
      <el-button
        type="danger"
        class="reset"
        v-show="!showLogin"
        @click="Reset()"
        >重置</el-button
      >
      <p v-show="showLogin" @click="showRegi(0)" class="tem">还没账号?点击去注册</p>
      <p v-show="!showLogin" @click="showRegi(1)" class="tem">已有账号?去登录</p>
    </el-dialog>
  </div>
</template>

<script>
import { $get, $post } from "../../ajax";
import { mapState, mapMutations } from "vuex";
export default {
  name: "HomeMenu",
  data() {
    return {
      navList: [
        { id: 1, title: "主页", link: "/home" },
        { id: 2, title: "商品详情页", link: "/home/detail" },
        { id: 3, title: "购物车", link: "/home/cart" },
        { id: 4, title: "我的订单", link: "/home/order" },
        { id: 5, title: "个人设置", link: "/home/manger" },
      ],
      id: 1,
      num: "/home",
      dialogFormVisible: false,

      form: {
        //登录
        username: "",
        password: "",
        grant_type: "password", //获取token采用密码模式
        client_id: "sobook4", //应用ID
        client_secret: "444444", //密钥
      },

      users: [],

      //注册
      obj_name: {
        uname: "", //用户名称
        show: false,
        Ntip: "",
      },
      obj_phone: {
        uphone: "", //用户手机号
        show: false,
        Ptip: "",
      },

      obj_account: {
        uaccount: "", //用户账号
        show: false,
        Atip: "",
      },

      obj_pwd: {
        upwd: "", //用户密码
        show: false,
        Ptip: "",
      },
      obj_checkpwd: {
        checkpwd: "", //确认密码
        show: false,
        Ctip: "",
      },
      showLogin: true,
      showClose: false,
      message: "",

      title: "用户登录",
      tip: "",
      counts: 0,
      search:'',
    };
  },
  methods: {
    getFocus() {
      console.log(1);
    },
    addSty(id, link) {
      this.id = id;
      if (link != "" && link != undefined) {
        localStorage.setItem("link", link);
        this.$router.push(link);
      }
    },
    ...mapMutations("user", ["opAlert"]),
    openAlert(bool) {
      this.openAlert(bool);
    },


    // findBook(){
    //   if(this.search!='' && this.search!=null){
    //      this.$router.push({
    //     path:'/home/detail',
    //     query:{
    //       key:this.search
    //     }
    //   })
    //   }
    // },

    //登录函数
    ...mapMutations("user", [
      "getCirecleImg",
      "getName",
      "getShow",
      "openLogin",
    ]),
    toLogin() {
      $post("/oauth/token", this.form)
        .then((res) => {
          localStorage.setItem("token", res.data.access_token);

          //get请求：当登录者的数据[登录者的角色名nickname：登录帐号;role角色]
          $get("/api/info/getUser").then((res) => {
            localStorage.setItem("nickname", res.data.nickname);
            localStorage.setItem("account", res.data.account);
            this.getCirecleImg(res.data.img);
            this.getName(res.data.nickname);

            //role作用：1.确定登录者登录成功之后跳转到哪个页面：2.确定登录者能够访问的页面权限
            localStorage.setItem("role", res.data.role);

            if (res.data.role === "G") {
              //管理员===后台

              this.$router.push("/admin");
              this.$message.success({
                duration: 1000,
                message: "管理员登录成功~",
              });
              this.dialogFormVisible = false;
              return;
            } else {
              this.$router.push("/home");
              this.$message.success({
                duration: 1000,
                message: `登录成功，欢迎${res.data.nickname}来到书城~`,
              });
              this.dialogFormVisible = false;
              this.getShow(false);
              return;
            }
          });
        })
        .catch((error) => {
          if (this.form.username != "" && this.form.password != "") {
            this.$message.error({
              duration: 1500,
              message: "账号或密码错误",
            });
          }
        });
    },

    //退出登录
    exitLogin() {
      localStorage.setItem("token", ""); //清除token
      localStorage.setItem("nickname", ""); //清除名字
      localStorage.setItem("account", ""); //清除帐号
      localStorage.setItem("role", ""); //清除管理员
      this.$router.push("/"); //跳转回前台
      this.$message.success({
        duration: 800,
        message: "已退出~",
      });

      let nickname = "未登录";
      this.getCirecleImg(imgUrl);
      this.getName(nickname);
      let imgUrl = "";
      this.getShow(true);
    },

    //登录/注册的模板切换
    showRegi(id) {
      id === 0 ? (this.showLogin = false) : (this.showLogin = true);
      if (id === 0) {
        this.title = "用户注册";
        this.showLogin = false;
        this.Reset();
      } else {
        this.title = "用户登录";
        this.showLogin = true;
      }
    },

    //用户名验证
    Uname() {
      let that = this.obj_name;
      if (that.uname != "") {
        //允许提交
        that.show = false;
        that.Ntip = "*用户名正确";
        return true;
      } else {
        //不允许提交
        that.show = true;
        that.Ntip = "*用户名不可为空";
        return false;
      }
    },

    //用户手机号验证
    Uphone() {
      let that = this.obj_phone;
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      //不为空
      if (that.uphone != "" && reg.test(that.uphone)) {
        //允许提交
        that.show = false;
        that.Ptip = "*手机号格式正确";
        return true;
      } else {
        //不允许提交
        that.show = true;
        that.Ptip = "*手机号格式错误，请重新输入";
        return false;
      }
    },

    //用户账号验证
    Uaccount() {
      let that = this.obj_account;
      if (that.uaccount != "" && that.uaccount.length >= 3) {
        //允许提交
        that.show = false;
        that.Atip = "*账号格式正确";
        return true;
      } else {
        //不允许提交
        that.show = true;
        that.Atip = "*账号长度不小于3个字符";
        return false;
      }
    },

    //密码验证
    Upassword() {
      let that = this.obj_pwd;
      if (that.upwd != "" && !isNaN(that.upwd) && that.upwd.length >= 6) {
        //允许提交
        that.show = false;
        that.Ptip = "*密码格式正确";
        return true;
      } else {
        //不允许提交
        that.show = true;
        that.Ptip = "*密码长度不小于6";
        return false;
      }
    },

    //确认密码验证
    Ulastpass() {
      let that = this.obj_checkpwd;
      //不为空
      if (that.checkpwd != "" && that.checkpwd === this.obj_pwd.upwd) {
        //允许提交
        if (this.obj_pwd.upwd.length >= 6) {
          this.Upassword();
          return true;
        } else {
          that.show = true;
          that.Ctip = "*密码长度不能小于6位";
          return false;
        }
      } else {
        //不允许提交
        if (this.obj_pwd.upwd != "" && that.checkpwd != "") {
          that.show = true;
          that.Ctip = "*两次输入密码不一致";
          return false;
        }
      }
    },

    //用户注册
    ...mapMutations("user", ["getNewImg"]),
    Register() {
      //输入框不为空验证
      if (
        this.obj_name.uname != "" &&
        this.obj_phone.uphone != "" &&
        this.obj_account.uaccount != "" &&
        this.obj_pwd.upwd != "" &&
        this.obj_checkpwd.checkpwd != ""
      ) {
        //如果返回的都是true,提交数据
        if (
          this.Uname() &&
          this.Uphone() &&
          this.Uaccount() &&
          this.Upassword()
        ) {
          //打包注册数据
          let Myuser = {
            nickname: this.obj_name.uname,
            phone: this.obj_phone.uphone,
            account: this.obj_account.uaccount,
            password: this.obj_checkpwd.checkpwd,
          };
          //向后台提交用户注册信息
          this.axios
            .post(`/api/public/addUser`, Myuser, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message.success({
                  duration: 1500,
                  message: "注册成功",
                });
                this.dialogFormVisible = false;
                this.getNewImg(
                  "https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png@1280w_1l_2o_100sh.png"
                );
                //重置
                this.Reset();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },

    //重置
    Reset() {
      //输入框清空
      this.obj_name.uname = "";
      this.obj_phone.uphone = "";
      this.obj_account.uaccount = "";
      this.obj_pwd.upwd = "";
      this.obj_checkpwd.checkpwd = "";

      //提示语清空
      this.obj_name.Ntip = "";
      this.obj_phone.Ptip = "";
      this.obj_account.Atip = "";
      this.obj_pwd.Ptip = "";
      this.obj_checkpwd.Ctip = "";
    },
  },

  computed: {
    ...mapState("user", ["cirecleImg", "username", "showAvatar", "circleUrl"]),
  },
  mounted() {},
  created() {},
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav {
  width: 100%;
  height: 59px;
  line-height: 59px;
  background-color: #5496a7;
  color: white;
}

nav ul {
  display: flex;
}

nav ul li {
  padding: 0 5px;
  border: none;
  cursor: pointer;
  margin: 0 5px;
}

nav ul li:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

nav ul li:first-child {
  width: 150px !important;
  height: 59px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

nav ul li:first-child .el-image {
  width: 100%;
  height: 100%;
}

.headerSearch:hover {
  background-color: initial;
}

.headerSearch input[type="search"] {
  width: 200px;
  outline: none;
  border: none;
  text-indent: 1rem;
  line-height: 30px;
  border-radius: 5px 0 0 5px;
}

.headerSearch input[type="search"]:focus {
  box-shadow: 0px 0px 2px #0e84d9 inset;
}

.headerSearch input[type="button"] {
  outline: none;
  border: none;
  text-align: center;
  line-height: 30px;
  border-radius: 0 5px 5px 0;
  width: 50px;
  color: gray;
  background-color: #ffffff;
}

.el-avatar {
  margin: 4.5px 0;
  margin-left: 30px;
  margin-right: 5px;
}

nav ul li:last-child:hover {
  background-color: initial;
}

.name {
  line-height: initial;
  line-height: 80px;
  overflow: hidden;
  height: 59px;
  cursor: pointer;
}

.exit {
  margin: 0 30px;
  cursor: pointer;
  width: 150px;
  text-align: right;
}

.default {
  color: gold !important;
}

/* 头像穿透 */
.el-image :deep() .el-image__inner {
  width: 100%;
  height: 100%;
  border-radius: 25px !important;
}

/* 注册按钮 */
.btn {
  width: 98%;
  margin: 0 1%;
  margin-top: 20px;
}

.tem{
  margin: 5px 0;
}

/* 重置按钮 */
.reset {
  width: 98%;
  margin: 0 1%;
  margin-top: 10px;
  background-color: #f78989;
}

p {
  color: gray;
  text-align: center;
  cursor: pointer;
}

p:hover {
  color: rgb(189, 174, 101);
}

/* 注册输入框 */
.newAccout .el-input {
  margin: 5px 0;
}

/* 用户填写信息提示语 */
.newAccout p {
  text-align: initial;
  color: #008000;
  margin: 1px 95px;
}

/* 用户填写信息格式错误加载 */
.rules {
  color: red !important;
}
</style>
