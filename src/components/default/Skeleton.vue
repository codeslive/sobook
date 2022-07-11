<template>
    <div class="content">
  <!-- 内容骨架屏 -->
  <el-skeleton style="width: 100%" direction="vertical" alignment="flex-start" :loading="loading" animated class="content-skeleton">
    <template #template>
      <div class="avatar" style="display: flex; align-items: center;">
        <el-skeleton-item variant="circle" 
        style="margin-bottom: 12px; width: 48px; height: 48px; background-color: #aaa;" />
        <div style="
          display: flex; 
          flex-direction: column; 
          position: relative; 
          bottom: 6npmpx;
          margin-left: 8px;">
          <el-skeleton-item variant="text" style="width: 80px; margin-bottom: 8px;" />
          <el-skeleton-item variant="text" style="width: 50px;" />
        </div>
      </div>
      <el-skeleton-item variant="rect" style="width: 100%; height: 240px; background-color: #aaa;" />
       <el-skeleton-item variant="rect" style="width: 100%; height: 100px; background-color: #aaa;" />
       <el-skeleton-item variant="rect" style="width: 100%; height: 100px; background-color: #aaa;" />
       <el-skeleton-item variant="rect" style="width: 100%; height: 100px; background-color: #aaa;" />
      <div style="padding: 12px 14px 0 0">
        <el-skeleton-item variant="h1" style="width: 50%;" />
        <el-skeleton-item variant="text" style="margin-top: 8px; margin-right: 16px" />
      </div>
    </template>
  </el-skeleton>
</div>
</template>

<script>
export default {
  name: "Skeleton",
  data() {
    return {
        loading:true
    };
  },
  methods: {},
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
</style>
