<template>
  <div class="main">
    <!-- 搜索区域 -->
    <HeadervSearch></HeadervSearch>
    <!-- 轮播区域 -->
    <HomeSwiper></HomeSwiper>

    <h6>好评最高5本书</h6>
    <hr />
    <div class="book">
      <el-card
        class="books"
        shadow="hover"
        :body-style="{ padding: '0px' }"
        v-for="item in imgList_rete"
        :key="item.id"
      >
        <el-image
          :src="`${$Imgurl}/api/public/showImg/${item.picture}`"
          class="image"
        ></el-image>
        <p>{{ item.name }}</p>
        <aside>
          <span>￥{{ item.price }}</span>
          <button @click="addCart(item.id)">购买</button>
        </aside>
      </el-card>
    </div>
    <h6>销量最高5本书</h6>
    <hr />
    <div class="book">
      <el-card
        class="books"
        shadow="hover"
        :body-style="{ padding: '0px' }"
        v-for="item in imgList_sale"
        :key="item.id"
      >
        <el-image
          :src="`${$Imgurl}/api/public/showImg/${item.picture}`"
          class="image"
        ></el-image>
        <p>{{ item.name }}</p>
        <aside>
          <span>￥{{ item.price }}</span>
          <button @click="addCart(item.id)">购买</button>
        </aside>
      </el-card>
    </div>
    <h6>好评最高5本书</h6>
    <hr />
    <div class="book">
      <el-card
        class="books"
        shadow="hover"
        :body-style="{ padding: '0px' }"
        v-for="item in imgList_fav"
        :key="item.id"
      >
        <el-image
          :src="`${$Imgurl}/api/public/showImg/${item.picture}`"
          class="image"
        ></el-image>
        <p>{{ item.name }}</p>
        <aside>
          <span>￥{{ item.price }}</span>
          <button @click="addCart(item.id)">购买</button>
        </aside>
      </el-card>
    </div>
  </div>
</template>

<script>
import { $post } from "@/ajax";
import HomeSwiper from "@/components/default/HomeSwiper.vue";
import HeadervSearch from "@/components/default/HeadervSearch.vue";

export default {
  name: "Main",
  components: {
    HeadervSearch,
    HomeSwiper,
  },
  data() {
    return {
      imgList_fav: [],
      imgList_rete: [],
      imgList_sale: []
    };
  },

  methods: {
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
            duration: 600,
            grouping: true,
            message: "你尚未登录,请登录~",
          });
        });
    },

    getRete() {
      this.axios
        .get("api/public/book/findRate5")
        .then((res) => {
          if (res.status === 200) {
            this.imgList_rete = res.data.data;
            return true;
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },

    getFav() {
      this.axios
        .get("api/public/book/findFav5")
        .then((res) => {
          if (res.status === 200) {
            this.imgList_fav = res.data.data;
             return true;
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },

    //意向最高
    getSale() {
      this.axios
        .get("api/public/book/findSale5")
        .then((res) => {
          if (res.status === 200) {
            this.imgList_sale = res.data.data;
             return true;
          }
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    },
  },

  created() {
    this.getRete();
    this.getFav();
    this.getSale();
 
    
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

h6 {
  font-style: initial;
  font-weight: normal;
  margin: 20px 20px;
  font-size: 15px;
  font-weight: bold;
  color: rgb(199, 21, 133);
}

hr {
  border: 1.2px solid #ff4500;
  background-color: #ff4500;
  width: 97%;
  margin: 0 auto;
  margin-bottom: 20px;
}

.book {
  display: flex;
  justify-content: space-around;
}

.books {
  width: 180px;
  height: 250px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 180px;
  display: block;
}

.book p {
  text-align: center;
  margin: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
}

.book aside {
  text-align: center;
}

.book aside span {
  display: inline-block;
  margin-right: 5px;
}

.book aside button {
  color: white;
  border: none;
  width: 40px;
  height: 20px;
  border-radius: 5px;
  background-color: rgb(245, 108, 108);
}
</style>
