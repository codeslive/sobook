<template>
  <div class="detail">
    <div class="search">
      <input
        type="search"
        placeholder="请输入搜索关键词"
        v-model.lazy.trim="search_val"
        @keyup.enter="findBook()"
      />
      <input type="button" value="搜索" @click="findBook()" />
    </div>
    <el-container>
      <el-aside width="250px">
        <p @click="getBook(0)" :class="{ default: typeid == -1 }">
          所有类型的商品<em>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </em>
        </p>
        <hr />
        <div v-for="(item, index) in newMenu" :key="item.id">
          <p @click="getType(item.id)" :class="{ default: item.id == typeid }">
            {{ item.type
            }}<em>
              <el-icon>
                <ArrowRight />
              </el-icon>
            </em>
          </p>
          <hr />
          <span
            v-for="key in newMenu[index].children"
            :key="key.id"
            @click="getType(key.id)"
            class="types"
          >
            {{ key.type }}
          </span>
        </div>
      </el-aside>

      <el-main>
        <div class="contents">
          <div
            class="bookcontent"
            v-for="item in allBook"
            :key="item.id"
            v-show="!showR"
          >
            <div class="left">
              <el-image
                :src="`${$Imgurl}/api/public/showImg/${item.picture}`"
                lazy
              ></el-image>
            </div>
            <div class="right" @mouseover="Mouseover(item)">
              <h6 v-html="item.name"></h6>
              <h6 v-html="item.author"></h6>
              <h6 v-html="item.publisher"></h6>
              <h6>
                <em v-html="`￥${item.price}`"></em>
                <button @click="addCart(item.id)">购买</button>
              </h6>
            </div>
          </div>
        </div>

        <!-- 加载空状态 -->
        <el-empty :description="description" v-show="showR"></el-empty>
      </el-main>
    </el-container>
    <!-- 分页 -->
    <div class="pagination" v-show="show">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="total"
        :page-size="num"
        v-model:currentPage="page"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ArrowRight } from "@element-plus/icons-vue";
import { $post } from "@/ajax";
export default {
  components: {
    ArrowRight,
  },
  name: "Detail",
  data() {
    return {
      search_val: "",
      findKey: "",
      menu: [], //侧边导航栏
      newMenu: [],
      allBook: [],
      show: false,
      showR: false,
      description: "",
      num: 8,
      page: 0,
      total: 0,
      nav: 0,
      typeid: 0,
    };
  },

  watch: {
    // 分页请求数据
    page() {
      let pages = `/api/public/findBookByPage/${this.page - 1}/8/0`;
      this.axios
        .get(pages)
        .then((res) => {
          this.allBook = res.data.data.books;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  methods: {
    getMenu(id, arr) {
      //判断
      if (id === 0) {
        this.menu.forEach((item) => {
          if (item.pid === 0) {
            arr.push(item);
          }
        });

        //在第一级菜单完成之后，从第一级的第一个菜单开始，进入第二季菜单的筛选
        this.getMenu(this.newMenu[0].id, this.newMenu);
      } else {
        arr.forEach((item) => {
          this.menu.forEach((val) => {
            if (item.id === val.pid) {
              if (!item.children) item.children = [];
              item.children.push(val);
            }
          });
        });
      }
    },

    //获取全部书籍
    getBook() {
      this.typeid = -1;
      this.axios
        .get(`/api/public/findBookByPage/0/8/0`)
        .then((res) => {
          if (res.status === 200) {
            this.allBook = res.data.data.books;
            this.total = res.data.data.total;

            this.total > 8 ? (this.show = true) : (this.show = false);
            this.total <= 0 ? (this.showR = true) : (this.showR = false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //根据书本类型获取书籍
    getType(val) {
      let id = val;
      //点击时把item.id的值给到typeid就可以实现样式加载了
      this.typeid = val;
      this.axios
        .get(`/api/public/findBookByPage/0/8/${id}`, id)
        .then((res) => {
          if (res.status === 200) {
            this.allBook = res.data.data.books;
            this.total = res.data.data.total;
            this.total > 8 ? (this.show = true) : (this.show = false);
            if (this.total <= 0) {
              this.showR = true;
              this.description = "没有找到该类型数据~";
            } else {
              this.showR = false;
              this.description = "";
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //加入购物车
    addCart(id) {
      let bookid = id;
      $post(`/api/public/addCart/${bookid}`)
        .then((res) => {
          if (res.status === 200) {
            this.$message.success({
              duration: 600,
              grouping: true,
              message: "添加购物车成功~",
            });
          }
        })
        .catch((error) => {
          this.$message.error({
            grouping: true,
            duration: 600,
            message: "你尚未登录,请登录~",
          });
        });
    },

    //菜单栏背景渲染
    Mouseover(item) {
      //拿到书本的类型id
      this.typeid = item.bookType.id;
      //第一次for循环,是遍历一级菜单的
      for (let i = 0; i < this.newMenu.length; i++) {
        //第二次for循环,是遍历二级菜单的
        for (let j = 0; j < this.newMenu[i].children.length; j++) {
          //拿到菜单栏的children数组
          let obj = this.newMenu[i].children[j];
          //菜单栏的children数组的子类型id与书本的类型id作判断。
          if (obj.id == this.typeid) {
            // 如果相等,就把菜单栏第一级的菜单id给到typeid
            //然后拿遍历newMenu数组的第一层item.id与最新的typeid判断是否相等,如果相等,加载背景样式,否则不加载。
            this.typeid = this.newMenu[i].id;
          }
        }
      }
    },

    //搜索
    findBook(id) {
      let page = 1;

      if (id == 0) {
        //数据打包
        this.findKey = this.$store.state.findKey;
      } else {
        this.findKey = this.search_val;
      }

      var info = {
        key: this.findKey,
      };

      //发送post请求
      this.axios
        .post(
          `/api/public/book/findIf/${page - 1}/${this.num}`,
          this.$qs.stringify(info),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded ; charset=UTF-8",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.allBook = res.data.data.books;

            this.total = res.data.data.total;

            this.description = "没有搜到你想要的数据~";
            this.allBook.length > 8 ? (this.show = true) : (this.show = false);
            this.allBook.length <= 0
              ? (this.showR = true)
              : (this.showR = false); // 加载空状态
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  created() {
    let key = this.$store.state.findKey;
    if (key != "" && key != undefined && key != null) {
      this.findBook(0);
    }

    console.log(this.$store.state.findKey);

    this.axios
      .get(`/api/public/type/findAll2`)
      .then((res) => {
        if (res.status === 200) {
          this.menu = res.data.data;
          this.getMenu(0, this.newMenu);
        }
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
  list-style: none;
  text-decoration: none;
}
.serch {
  margin: 10px 10px;
}

.el-aside {
  background-color: white;
  height: auto;
  margin-left: 5px;
}

.el-aside hr {
  background: rgb(139, 0, 0);
  border: 0.01px solid rgb(139, 0, 0);
  height: 0.01px;
}

.el-aside p {
  color: rgb(93, 158, 255);
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}

.el-aside p em {
  float: right;
}

.default {
  background-color: gainsboro !important;
}

.el-aside span {
  color: rgb(93, 158, 255);
  font-size: 12px;
  margin: 0 10px;
  cursor: pointer;
}

.types {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  border: 1px solid transparent; /* 出现:hover抖动问题,把边框设置为透明,然后再设置边框*/
}

.el-aside span:hover {
  border-radius: 5px;
  border: 1px solid deepskyblue;
}

/* 布局容器 */
.contents {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.contents .bookcontent {
  width: 48%;
  height: 100px;
  display: flex;
  margin: 5px 5px;
}
/* 左边 */
.contents .bookcontent .left {
  width: 20%;
  height: 100%;
}

.contents .bookcontent .el-image {
  width: 90px;
  height: 100px;
}

/* 右边 */
.contents .bookcontent .right {
  width: 60%;
  height: 100%;
}

.contents .bookcontent .right:hover {
  background-color: gainsboro !important;
}

.contents .bookcontent .right h6 {
  font-style: initial;
  font-weight: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  margin: 5px 10px;
}

.contents .bookcontent .right h6 em {
  font-style: initial;
}

.contents .bookcontent .right button {
  color: white;
  border: none;
  width: 40px;
  height: 20px;
  margin: 0 5px;
  border-radius: 5px;
  background-color: rgb(245, 108, 108);
}

.search {
  width: 94%;
  margin: 10px 3%;
  height: 30px;
  border: 1px solid rgb(84, 150, 167);
  border-radius: 6px;
  overflow: hidden;
}

.search input[type="search"] {
  width: 95%;
  line-height: 28px;
  border: none;
  text-indent: 1em;
  outline: none;
}

.search input[type="button"] {
  border: none;
  width: 5%;
  background-color: rgb(84, 150, 167);
  height: 30px;
  color: white;
}
</style>
