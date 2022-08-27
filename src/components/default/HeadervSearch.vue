<template>
  <div class="search">
    <input
      type="search"
      placeholder="请输入搜索关键词"
      v-model.lazy.trim="search_val"
      @keyup.enter="getBooks()"
    />
    <input type="button" value="搜索" @click="getBooks()" />
  </div>
</template>

<script>
export default {
  name: "HeadervSearch",
  data() {
    return {
      search_val: "",
      keyval:""
    };
  },
  methods: {
    getBooks() {
      if (this.search_val != "") {
        this.$store.commit("findKey", this.search_val);
        this.$router.push({
          path: "/home/detail",
          query: {
            key: 1,
          },
        });
      } else {
        this.$message.error({
          grouping: true,
          duration: 800,
          message: "搜索内容不为空~",
        });
      }
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
