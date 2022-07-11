<template>
  <div class="banner">
    <!-- Vue3 + Element-Plus carousel走马灯 显示动态数据时 默认会显示一个空白元素 
      解决办法：
          当数组的长度大于0时,才开始渲染元素！！！
    -->
    <el-carousel :interval="3000" v-if="bannerList.length > 0" arrow="always">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <el-image
          :src="`${$Imgurl}/api/public/showImg/${item.picture}`"
          class="image"
        ></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
</script>

<script>
export default {
  name: "HomeSwiper",
  data() {
    return {
      bannerList: [],
    };
  },
  methods: {},
  mounted() {
    this.axios
      .get(`api/public/findHot/5/1`)
      .then((res) => {
        if (res.status === 200) {
          this.bannerList = res.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

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

.banner {
  width: 100%;
  height: 300px;
  /* margin: 0 10%; */

}

.banner .el-image {
  width: 100%;
  height: 300px;
  /* border-radius: 5px; */
}

.banner ul li {
  list-style: none;
}
</style>
