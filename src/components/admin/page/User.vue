<template>
  <div class="user">
    <h3>用户列表 - 密码重置- 冻结<span> </span></h3>
    <el-table :data="user_list" border style="width: 100%">
      <el-table-column label="用户头像">
        <template #default="scope">
          <img :src="`${$Imgurl}/api/public/showImg/${scope.row.img}`" />
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="nickname"></el-table-column>
      <el-table-column label="角色">
        <template #default="scope">
          <p>{{ frole(scope.row.role) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="帐号" prop="account"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{ closed: scope.row.closed == 0 }">{{
            fclosed(scope.row.closed)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结">
        <template #default="scope">
          <el-button
            type="danger"
            @click="
              freezeUser(scope.row.account, scope.row.id, scope.row.closed)
            "
          class="btns">
            <el-icon> <Lock /> </el-icon>冻结
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="解冻">
        <template #default="scope">
          <el-button
            type="success"
            @click="thawUser(scope.row.account, scope.row.id)"
          class="btns">
            <el-icon> <Lollipop /> </el-icon>解冻
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev,pager,next"
      :total="total"
      :page-size="num"
      v-model:currentPage="page"
    ></el-pagination>
  </div>
</template>

<script>
import { $post, $get } from "@/ajax";
import { Lock, Lollipop } from "@element-plus/icons-vue";
export default {
  name: "User",
  components: {
    Lock,
    Lollipop,
  },
  data() {
    return {
      user_list: [],
      total: 0,
      num: 10,
      page: 0,
      closed: "",
    };
  },

  watch: {
    page() {
      let start = 0;
      let num = 10;

      //当页数小于等于1时,条数从0开始请求,否则就是从(页数 * 条数 - 条数)处开始请求。
      this.page <= 1 ? (start = 0) : (start = this.page * num - num);

      //分页请求地址
      let pages = `api/adm/user/findAll?start=${start}&num=${num}`;
      $get(pages)
        .then((res) => {
          this.user_list = res.data.data.users; //数据
          this.total = res.data.data.total; //总条数
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  computed: {
    //冻结
    fclosed() {
      return function (x) {
        return x == 0 ? (x = "已激活") : (x = "已冻结");
      };
    },
    //角色
    frole() {
      return function (x) {
        return x == "G" ? (x = "管理员") : (x = "普通用户");
      };
    },
  },

  methods: {
    //默认请求的数据
    getUser() {
      let start = 0;
      let num = 10;
      let user = `api/adm/user/findAll?start=${start}&num=${num}`;
      $get(user)
        .then((res) => {
          if (res.status === 200) {
            this.user_list = res.data.data.users;
            this.total = res.data.data.total;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //冻结
    freezeUser(account, index) {
      let id = account;
      $post(`/api/adm/user/close/${index}`, id)
        .then((res) => {
          if (res.status === 200) {
            //冻结成功,重新查询数组
            this.getUser();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //解冻
    thawUser(account, index) {
      let id = account;
      $post(`/api/adm/user/resetPwd/${index}`, id)
        .then((res) => {
          if (res.status === 200) {
            //解冻成功,重新查询数组
            this.getUser();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {},
  created() {
    this.getUser();
  },
};
</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

img {
  width: 40px;
  height: 40px;
}

.closed {
  color: green !important;
}

.user span {
  color: gainsboro;
}

h3 {
  height: 60px;
  line-height: 60px;
}

.btns{
  width: 90px;
}
</style>
