<template>
  <div class="news">
    <aside>
      <h3>轮播图广告</h3>
      <el-button type="primary" @click="add()">
        <el-icon>
          <CirclePlus />
        </el-icon>添加数据
      </el-button>
    </aside>
    <el-table :data="tab_banner" border style="width: 100%" type=index>
      <el-table-column prop="memo" label="描述" />
      <el-table-column prop="hot" label="热度" />
      <el-table-column prop="picture" label="图片">
        <template #default='scope'>
          <img :src="`${$Imgurl}/api/public/showImg/${scope.row.picture}`">
        </template>
      </el-table-column>
      <el-table-column label="功能" width="180">
        <template #default="scope">
          <el-button type="warning" plain @click="del(scope.row.id)" class="dels">
            <el-icon>
              <CloseBold />
            </el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="类型管理">
      <el-form :model="form">
        <el-form-item label="ID">
          <el-input v-model="form.cateid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="*类型">
          <el-input v-model="form.catetype" autocomplete="off"></el-input>
        </el-form-item>
        <el-button type="primary" @click="dialogFormVisible = false">提交</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  CloseBold, CirclePlus
} from '@element-plus/icons-vue';
export default {
  name: 'News',
  components: {
    CloseBold, CirclePlus
  },
  data () {
    return {
      tab_banner: [],
      form: {
        cateid: '',
        catetype: ''
      },
      dialogFormVisible: false,
    }
  },


  methods: {
    add () {
      this.$router.push('/admin/newsadd');
    },

    //删除
    del (id) {
      this.axios.delete(`/api/adm/hot/delete/${id}`).then((res) => {
        this.getHot();
      }).catch((error) => {
        console.log(error);
      });
    },


    getHot () {
      this.axios.get('/api/adm/hot/findAll').then((res) => {

        if (res.status === 200) {
          this.tab_banner = res.data.data;
        }
      }).catch((error) => {
        console.log(error);
      });
    }

  },

  created () {

    this.getHot();
  }
}
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

.news aside {
  width: 100%;
  height: 60px;
  line-height: 60px;
}

.news aside h3 {
  width: 85%;
  float: left;
  font-weight: bold;
  margin-left: 3px;
}

.news aside .el-button{
    width: 130px;
}

.dels{
  width: 80px;
}
</style>
