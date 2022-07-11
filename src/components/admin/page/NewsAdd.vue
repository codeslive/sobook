<template>
  <div class="newsadd">
    <el-form :model="form">
      <el-form-item label="描述">
        <el-input v-model="form.memo"></el-input>
      </el-form-item>
      <el-form-item label="热度">
        <el-input v-model="form.hot"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-input v-model="form.type"></el-input>
      </el-form-item>

      <el-form-item label="图片">
        <div style="margin-top: 15px; display: flex">
          <div style="display: flex">
            <el-upload
              class="avatar-uploader"
              :multipe="false"
              :show-file-list="true"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :file-list="fileList"
              :on-change="handleChange"
              action="uploadAction"
              list-type="picture"
              accept=".jpg, .jpeg, .png, .gif"
            >
              <h3>点击上传图片</h3>
            </el-upload>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <hr />
    <el-button type="default" @click="goNews()">返回列表</el-button>
    <el-button type="primary" plain @click="addpic()">提交</el-button>
  </div>
</template>

<script>
import { $postUpload } from "@/ajax";
export default {
  name: "NewsAdd",
  data() {
    return {
      fileList: [], //图片
      dialogImageUrl: "",
      form: {
        memo: "",
        hot: "",
        type: 1,
      },
      pic: "",
    };
  },

  methods: {
    //上传器的方法
    beforeUpload(file) {
      console.log("beforeUplaod");
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },

    addpic() {
      //判断输入框是否为空
      if (this.form.memo != "" && this.form.hot != "" && this.form.type != "") {
        //创建一个空的表单对象数据
        let fd = new FormData();
        //将需要打包的数据，append方式提交给对象
        fd.append("memo", this.form.memo); //描述
        fd.append("hot", this.form.hot); //热度
        fd.append("type", this.form.type); //类型
        // fd.append("pic", this.fileList);//图片

        //判断是否传了图片
        if (this.fileList[0] != null && this.fileList.length > 0) {
          fd.append("pic", this.fileList[0].raw);
        }

        //发起post请求
        $postUpload("/api/adm/hot/addHot", fd, {
          header: { "Content-Type": "multipart/form-data" },
        })
          .then((res) => {
            //请求成功后，返回查询页
            if (res.data.code === 200) {
              //消息提示
              this.openTip();
              this.$router.push("/admin/news");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    openTip() {
      this.$message({
        duration:600,
        message: "图片添加成功",
        type: "success",
      });
    },

    //点击返回热点管理首页
    goNews() {
      this.$router.push("/admin/news");
    },
  },
};
</script>

<style scoped>
</style>
