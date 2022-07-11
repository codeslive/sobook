<template>
  <div class="banner">
    <aside>
      <h3>类型</h3>
      <el-button type="primary" @click="add(), (dialogFormVisible = true)" class="addType">
        <el-icon>
          <CirclePlus />
        </el-icon>添加数据
      </el-button>
    </aside>

    <el-table :data="list" style="width: 100%" row-key="cateid" lazy border default-expand-all :tree-props="{ children: 'children' }">
      <el-table-column prop="catetype" label="书本类型" sortable />
      <el-table-column prop="cateid" label="类型ID" sortable />
      <el-table-column prop="prio" label="优先级" sortable />
      <el-table-column label="添加子节点" sortable>
        <template #default="scope">
          <el-button type="primary" v-if="scope.row.cateids === 0" @click="
              cateadd(
                scope.row.cateid,
                scope.row.cateids,
                scope.row.catetype,
                scope.row.prio
              ),
                (dialogFormVisible = true)
            " class="add">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改" sortable width="180">
        <template #default="scope">
          <el-button type="primary" @click="
              cateEdit(
                scope.row.cateid,
                scope.row.cateids,
                scope.row.catestype,
                scope.row.prio,
                scope.row.catetype
              ),
                (dialogFormVisible = true)
            " class="Edit">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="类型管理">
      <el-form :model="form">
        <el-form-item label="PID">
          <el-input v-model="form.cateid" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="父类型">
          <el-input v-model="form.catetype" autocomplete="off" readonly></el-input>
        </el-form-item>
        <hr />
        <el-form-item label="本ID">
          <el-input v-model="form.cateids" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="*本类型">
          <el-input v-model="form.catestype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-input v-model="form.prio" autocomplete="off"></el-input>
        </el-form-item>
        <el-button type="primary" @click="postData(), (dialogFormVisible = false)">{{ title }}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Plus, Edit, CirclePlus } from "@element-plus/icons-vue";
export default {
  name: "Type_93",
  components: {
    Plus,
    Edit,
    CirclePlus,
  },
  data () {
    return {
      list: [],
      newList: [],
      form: {
        cateid: "", //id
        catetype: "", //类型
        cateids: 0,
        catestype: "", //本类型
        prio: "", //优先级
      },
      dialogFormVisible: false,
      title: "",
    };
  },
  methods: {
    getMenu (arr) {
      let a = arr;
      let that = this;
      this.list = [];
      for (let i in a) {
        if (a[i].pid == 0) {
          //判断父节点
          let obj = {
            cateid: a[i].id,
            catetype: a[i].type,
            cateids: 0,
            catestype: a[i].type, //本类型
            prio: a[i].prio, //优先级
          };

          let childrens = [];
          for (let j in a) {
            if (a[j].pid == a[i].id) {
              //根据 pid 与 id 对应判断父子关系
              childrens.push({
                cateid: a[j].id,
                catestype: a[i].type,
                cateids: a[i].id,
                catetype: a[j].type, //本类型
                prio: a[i].prio + 10, //优先级
              });
            }
          }

          if (childrens.length > 0) {
            obj.children = childrens;
          }
          that.list.push(obj);
        }
      }
    },

    //父节点添加
    add (id) {
      this.title = "添加";
      this.form.cateid = 0;
      this.form.catetype = "一层节点";
      this.form.cateids = 0;
      this.form.catestype = "";
      this.form.prio = 100;
    },

    //修改
    cateEdit (id, pid, type, prio, types) {
      this.title = "修改";

      pid === 0
        ? (this.form.catetype = "一层节点")
        : (this.form.catetype = type);

      this.form.cateids = id;
      this.form.cateid = pid;
      this.form.prio = prio;
      this.form.catestype = types;
    },

    //添加子节点
    cateadd (id, pid, type, prio) {
      this.form.cateids = "";
      this.form.catestype = "";
      this.form.prio = "";

      //查询
      this.title = "添加子节点";
      this.form.cateid = id;
      this.form.catetype = type;
      this.form.cateids = pid;
      this.form.prio = prio;
    },

    postData () {
      //备份
      let that = this;
      //判断名称不为空
      if (
        this.form.catestype != "" &&
        this.form.cateids !== "" &&
        this.form.prio != ""
      ) {
        let data = {
          pid: this.form.cateid,
          id: this.form.cateids,
          type: this.form.catestype,
          prio: this.form.prio,
        };

        this.axios
          .post("api/adm/type/add", this.$qs.stringify(data), {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded ; charset=UTF-8",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              //添加成功重新查询数据
              this.getMenu(res.data.data);
              //清空
              this.form.cateids = "";
              this.form.catestype = "";
              this.form.prio = "";
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },

  created () {
    let that = this;
    this.axios
      .get("/api/adm/type/findAll2")
      .then((res) => {
        if (res.status === 200) {
          that.getMenu(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

.el-table {
  border-top: 1px solid #000;
  margin-top: 5px;
}

.banner aside {
  width: 100%;
  height: 60px;
  line-height: 60px;
}

.banner aside h3 {
  width: 85%;
  float: left;
  font-weight: bold;
  margin-left: 3px;
}

.addType{
  width: 120px;
}

.add , .Edit{
  width: 60px;
}


</style>
