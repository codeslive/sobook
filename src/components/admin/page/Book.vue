<template>
  <div class="book">
    <aside>
      <h3>商品列表</h3>
      <el-button type="primary" @click="bookadd()">
        <el-icon>
          <CirclePlus /> </el-icon
        >添加数据
      </el-button>
    </aside>
    <el-table :data="book_list" border style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="sn" label="编号" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="publisher" label="出处" />
      <el-table-column label="日期" width="180">
        <template #default="scope">
          {{ ftime(scope.row.tpublish) }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="180">
        <template #default="scope">
          <img :src="`${$Imgurl}/api/public/showImg/${scope.row.picture}`" />
        </template>
      </el-table-column>
      <el-table-column label="修改" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            @click="bookedit(scope.row.id, scope.$index)"
            class="edit">修改</el-button
          >
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
import { CirclePlus } from "@element-plus/icons-vue";
export default {
  name: "Book",
  components: {
    CirclePlus,
  },
  data() {
    return {
      book_list: [],
      num: 5,
      total: 0,
      page: 1,
      title: "",
    };
  },

  watch: {
    // 请求地址
    page() {
      let pages = "/api/adm/book/findByPage/" + this.page + "/5";
      this.axios
        .get(pages)
        .then((res) => {
          this.book_list = res.data.data.books;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  methods: {
    //添加
    bookadd(x) {
      this.$router.push({
        path: "/admin/bookedit",
        query: {
          bookid: 0,
        },
      });
    },
    //修改
    bookedit(bookid, index) {
      this.$router.push({
        path: "/admin/bookedit", //跳转路径
        query: {
          bookid: bookid, //书本的id
          index: index, //数组的下标
          page: this.page, //当前页数
        },
      });
    },
  },

  computed: {
    //过滤时间
    ftime() {
      return function (x) {
        let datas = new Date(x);
        let year = datas.getFullYear();
        let month = datas.getMonth() + 1;
        let day = datas.getDate();
        return `${year}-${month}-${day}`;
      };
    },
  },

  created() {
    this.axios
      .get("/api/adm/book/findByPage/1/5")
      .then((res) => {
        //获取数组的总长度
        this.total = res.data.data.total;
        //请求到的数据
        this.book_list = res.data.data.books;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.el-table img {
  width: 70px;
  height: 70px;
}

.book aside {
  width: 100%;
  height: 60px;
  line-height: 60px;
}

.book aside h3 {
  width: 85%;
  float: left;
  font-weight: bold;
  margin-left: 3px;
}

.book aside .el-button{
  width: 130px;
}

.edit{
  width: 80px;
}
</style>
