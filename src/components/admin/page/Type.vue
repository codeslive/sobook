<template>
  <div class="type">
    <h3>类型<span>
        <el-button type="primary" @click="cateadd(),dialogFormVisible = true" class="addType">
          <el-icon>
            <CirclePlus />
          </el-icon>添加类型
        </el-button>
      </span></h3>
    <el-table :data="tab_list" border style="width: 100%">
      <el-table-column prop="id" label="类型ID"  />
      <el-table-column prop="type" label="书本类型" />
      <el-table-column label="功能">
        <template #default="scope">
          <el-button  type="primary" plain @click="cateEdit(scope.row.id,scope.row.type),dialogFormVisible = true" class="Edit">
            <el-icon>
              <Edit />
            </el-icon>
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
        <el-button type="primary" @click="postData(),dialogFormVisible = false">{{title}}</el-button>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
import {
  Edit,
  CirclePlus,
} from '@element-plus/icons-vue';

export default {
  name: 'Type',
  components: {
    Edit,
    CirclePlus
  },
  data () {
    return {
      tab_list: [],
      title: '',

      form: {
        cateid: '',
        catetype: ''
      },
      dialogFormVisible: false,
    }
  },

  methods: {

    //修改
    cateEdit (x,y) {

      //查询
      this.title = '修改';
      this.form.cateid = x;
      this.form.catetype = y;

    },

    //添加
    cateadd () {
      // console.log(x);
      
      this.title = '添加';
      this.form.cateid = 0;
      this.form.catetype = ''
    },


    //提交数据post
    postData () {
      //备份
      let that = this;
      //判断名称不为空
      if (this.form.catetype != '' && this.form.cateid !== '') {

        let data = {
          id: this.form.cateid,
          type: this.form.catetype,
          pid : 0,
          isdel : 0,
          prio : 120
        }

        this.axios.post('api/adm/type/add', this.$qs.stringify(data), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded ; charset=UTF-8' },
        }).then((res) => {
          if (res.status === 200) {
            that.tab_list = res.data.data;
            //清空输入框
            this.form.cateid = '';
            this.form.catetype = '';
          }
        }).catch((error) => {
          console.log(error);
        })
      }

    },

  },

  created () {
    this.axios.get('/api/adm/type/findAll').then((res) => {
      this.tab_list = res.data.data;
    }).catch((error) => {
      console.log(error);
    })
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.type {
  width: 100%;
  height: 700px;
}

.type h3 {
  height: 60px;
  line-height: 60px;
}

.el-table {
  border-top: 1px solid #000;
  margin-top: 5px;
}

.type span {
  float: right;
}


.addType{
    width: 120px;
}

.Edit{
  width: 50px;
}

.el-input{
  width: 90%;
  float: right;
}
</style>0
