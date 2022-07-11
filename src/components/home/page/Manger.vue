<template>
  <div class="Manger">
    <div class="heardImg">
      <el-upload
        class="avatar-uploader"
        :multipe="false"
        :show-file-list="true"
        :auto-upload="false"
        :limit="1"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-change="handleChange"
        action="uploadAction"
        list-type="picture-card"
        accept=".jpg, .jpeg, .png, .gif"
      >
        点击选择头像
      </el-upload>
    </div>
    <p @click="uploadImg()" class="avtip">立即修改</p>

    <el-form :model="form">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入需要修改的密码"
      >
        <template #prepend>密码</template> </el-input
      ><span @click="revisePwd()">修改</span>
      <br />

      <el-input v-model="form.nickname" placeholder="请输入需要更改的名字">
        <template #prepend>名字</template> </el-input
      ><span @click="reviseName()">修改</span>
      <br />

      <el-input
        v-model="form.phone"
        type="phone"
        placeholder="请输入需要更改电话号码"
      >
        <template #prepend>电话</template> </el-input
      ><span @click="reviseName()">修改</span>
    </el-form>
      
  </div>
</template>

<script>
import { $post, $postUpload } from "@/ajax";
import { mapMutations } from "vuex";
export default {
  name: "Manger",
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      pic: "",
      form: {
        password: "",
        nickname: "",
        phone: "",
      },
    };
  },
  methods: {
     ...mapMutations("user", ["getCirecleImg" , "getName"]),
    //上传器的方法
    beforeUpload(file) {
      console.log("beforeUplaod", file);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },

    //头像上传
    uploadImg() {
      let fd = new FormData();
      if (this.fileList[0] != null && this.fileList.length > 0) {
        fd.append("img", this.fileList[0].raw);

        $postUpload(`/api/fore/user/updateImg`, fd)
          .then((res) => {
            if (res.status === 200) {
              this.$message.success({
                message: "头像上传成功",
              });
              //把新的用户头像地址存到Vuex
              this.getCirecleImg(res.data.data);
              
              this.fileList = [];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$message.error({
          duration: 1000,
          message: "请上传图片",
        });
      }
    },

    //修改密码
    revisePwd() {
      if (this.form.password != "") {
        let data = {
          pwd: this.form.password,
        };

        $post(`/api/fore/user/updatePwd`, data)
          .then((res) => {
            if (res.status === 200) {
              this.$message.success({
                duration: 1000,
                message: "密码修改成功",
              });
              this.form.password = "";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$message.error({
          duration: 1000,
          message: "密码不可为空",
        });
      }
    },

    //修改手机号,用户名
    reviseName() {
      if (this.form.nickname != "" || this.form.phone != "") {
        let data = {
          nickname: this.form.nickname,
          phone: this.form.phone,
        };

        $post(`/api/fore/user/updateInfo`, data)
          .then((res) => {
            if (res.status === 200) {
              if (this.form.nickname != "") {
                this.$message.success({
                  duration: 1000,
                  message: "用户名修改成功",
                });
               this.getName(this.form.nickname);
               
                
              } else if (this.form.phone != "") {
                this.$message.success({
                  duration: 1000,
                  message: "手机号修改成功",
                });
              }
            }

            this.form.nickname = "";
            this.form.phone = "";
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$message.error({
          duration: 1000,
          message: "修改内容不可为空~",
        });
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

.Manger {
  height: 80vh;
  text-align: center;
  border: 1px solid #5496a7;
  background-color: rgb(140, 165, 173);
}

.heardImg {
  width: 180px;
  height: 160px;
  overflow: hidden;
  line-height: 130px;
  font-weight: bold;
  margin: 0 auto;
  margin-top: 80px;
}

.avatar-uploader {
  margin: 0 auto;
}

.imgbtn {
  /* margin: 0 40px; */
  margin-top: 10px;
}

hr {
  margin: 20px 0;
  width: 90%;
  border: 1px solid #5496a7;
}

.avtip {
  text-align: center;
  font-size: 12px;
  width: 130px;
  height: 30px;
  line-height: 30px;
  background-color: #e05252;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 auto;
}

.avtip:hover {
  background-color: #f78989;
}

.el-input {
  width: 52%;
}

.btn {
  margin: 10px 0;
}

.el-form .el-input {
  margin: 5px 0;
}

.el-form span {
  cursor: pointer;
  margin: 0 5px;
  color: rgb(211, 179, 98);
  font-size: 12px;
}

.el-form span:hover {
  color: rgb(214, 112, 112);
}
</style>
