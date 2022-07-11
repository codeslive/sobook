<template>
  <div class="admin_add">
    <h3>管理员添加<span> </span></h3>
    <el-form :model="form">
      <el-input v-model="form.account" placeholder="请输入账号">
        <template #prepend>帐号</template>
      </el-input>
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
      >
        <template #prepend>密码</template>
      </el-input>
      <el-input v-model="form.nickname" placeholder="请输入名字">
        <template #prepend>名字</template>
      </el-input>
      <el-input v-model="form.phone" type="phone" placeholder="请输入电话号码">
        <template #prepend>电话</template>
      </el-input>
    </el-form>
    <el-button type="primary" @click="postAdmin()">添加</el-button>
  </div>
</template>

<script>
import { $post } from "@/ajax";
export default {
  name: "Admin_add",
  data() {
    return {
      form: {
        account: "", //账号
        password: "", //密码
        nickname: "", //名字
        phone: "", //电话
      },
    };
  },
  methods: {
    postAdmin() {
      //数据打包
      let data = {
        account: this.form.account,
        password: this.form.password,
        nickname: this.form.nickname,
        phone: this.form.phone,
      };
      if (
        this.form.account != "" &&
        this.form.password != "" &&
        this.form.nickname != "" &&
        this.form.phone != ""
      ) {
        $post("/api/adm/user/addAdm", data)
          .then((res) => {
            if (res.status === 200) {
              (this.form.account = ""),
                (this.form.password = ""),
                (this.form.nickname = ""),
                (this.form.phone = "");
            }
            //message消息提示添加成功
            this.openTip();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    //message消息提示
    openTip() {
      this.$message({
         duration: 1500,
        message: "管理员添加成功",
        type: "success",
      });
    },
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

.admin_add {
  margin: 0 auto;
}

.admin_add .el-input {
  width: 80%;
  margin: 5px 0;
}
.admin_add .el-button {
  width: 300px;
  margin-top: 10px;
}

h3 {
  height: 60px;
  line-height: 60px;
}
</style>


