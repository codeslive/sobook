<template>
  <div class="bookadd">
    <aside>
      <h3>{{ title }}</h3>
    </aside>
    <el-form :model="form">
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品序号">
        <el-input v-model="form.sn" type="number"></el-input>
      </el-form-item>

      <el-form-item label="商品价格">
        <el-input v-model="form.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品厂商">
        <el-input v-model="form.author"></el-input>
      </el-form-item>

      <el-form-item label="商品出处">
        <el-input v-model="form.publisher"></el-input>
      </el-form-item>

      <el-form-item label="出厂时间">
        <el-date-picker v-model="form.tpublish" type="date" placeholder="选择时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="商品类型">
        <el-cascader v-model="bookType.type" :options="newList" :props="{ label: 'type', value: 'id', children: 'children' }"></el-cascader>
      </el-form-item>

      <el-form-item label="商品图片">
        <div style="margin-top: 15px; display: flex" class="image">
          <!-- 图片显示的区域 -->
          <el-image :src="`${$Imgurl}/api/public/showImg/${form.picture}`"></el-image>
          <div style="display: flex">
            <el-upload class="avatar-uploader" :multipe="false" :show-file-list="true" :auto-upload="false" :before-upload="beforeUpload" :file-list="fileList" :on-change="handleChange" action="uploadAction" list-type="picture" accept=".jpg, .jpeg, .png, .gif">
              <h3>点击这里{{ clickTip }}图片</h3>
            </el-upload>
          </div>
        </div>
      </el-form-item>

      <hr />
      <el-button type="default" @click="spik()">返回列表</el-button>
      <el-button type="primary" @click="bookadd()">提交</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BookEdit",
  data () {
    return {
      //图片
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false, //弹窗
      form: {
        name: "", //商品名称
        sn: "", //序列号
        author: "", //作者或生产厂商
        price: "", //价格
        tpublish: "", //日期
        publisher: "", //出处
        picture: "",
      },
      pic: "",
      list: [],
      newList: [],
      book_list: [],
      title: "",
      clickTip: "",
      time: "",
      typeid: "",
      bookType: {
        type: [],
      },
    };
  },

  methods: {
    //上传器的方法
    beforeUpload (file) {
      console.log("beforeUplaod");
    },
    handleChange (file, fileList) {
      this.fileList = fileList;
    },

    //添加数据
    bookadd () {
      if (
        (this.form.name != "" &&
          this.$route.query.bookid != "" &&
          this.form.sn != "" &&
          this.form.author != "" &&
          this.form.price != "" &&
          this.form.publisher != "" &&
          this.bookType.type[1]) ||
        this.typeid
      ) {
        let fd = new FormData();
        //获取选择器的日期时间戳
        this.time = new Date(this.form.tpublish).getTime();
        fd.append("name", this.form.name);
        fd.append("id", this.$route.query.bookid);
        fd.append("sn", this.form.sn);
        fd.append("author", this.form.author);
        fd.append("tpublish", this.time);
        fd.append("price", this.form.price);
        fd.append("publisher", this.form.publisher);

        //当bookid大于0时,执行的的是修改[如果select框的值没有被更改过,提交数组查询到的select值,如果select框的值被更改过,提交select框获取到的值]
        if (this.$route.query.bookid > 0) {
          //当typeid的值为true时,继续执行下一层判断
          if (this.typeid) {
            //当select框绑定的数据为真时,提交select框的值
            if (this.bookType.type[1]) {
              fd.append("bookType.id", this.bookType.type[1]);
            } else {
              //当select绑定的值不存在时,提交数组查询到值
              fd.append("bookType.id", this.typeid);
            }
          } else {
            //当typeid的值为false时,提交sleset框的值
            fd.append("bookType.id", this.bookType.type[1]);
          }
        }

        //当bookid小于等于0时,直接提交select框获取到的值
        if (this.$route.query.bookid <= 0) {
          fd.append("bookType.id", this.bookType.type[1]);
        }

        //当执行的是修改操作时,提交查询到的图片
        if (this.$route.query.bookid > 0) {
          fd.append("picture", this.form.picture);
        }

        //判断上传器是否上传了图片,如果提交了,post给后台
        if (this.fileList[0] != null && this.fileList.length > 0) {
          fd.append("pic", this.fileList[0].raw);
        }

        //post提交
        this.axios
          .post("/api/adm/book/addBook", fd, {
            header: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            //添加成功,返回书本管理页面
            if (res.data.code === 200) {
              //书本添加成功和修改成功的提示语
              this.$route.query.bookid == 0 ? this.openTip(0) : this.openTip(1);
              this.$router.push("/admin/book");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    bookedit () {
      //下标
      let index = this.$route.query.index;
      //根据下标查询数据
      this.form.name = this.book_list[index].name;
      this.form.sn = this.book_list[index].sn;
      this.form.price = this.book_list[index].price;
      this.form.author = this.book_list[index].author;
      this.form.publisher = this.book_list[index].publisher;
      this.form.picture = this.book_list[index].picture;

      //获取书本类型的值,赋值给typeid
      let id = this.book_list[index].bookType.id;
      this.typeid = id;
      //把书本类型的值给到select框进行查询
      this.bookType.type = id;
      //将时间过滤为yyyy-mm-dd的格式,然后进行v-model绑定,不过滤,v-model会存在警告
      this.form.tpublish = this.ftime(this.book_list[index].tpublish); //日期
    },

    //跳转回书本管理页面
    spik () {
      this.$router.push("/admin/book");
    },

    //message消息提示
    openTip (id) {
      if (id == 0) {
        this.$message({
          duration: 600,
          message: "书本添加成功",
          type: "success",
        });
      } else {
        this.$message({
          duration: 600,
          message: "书本修改成功",
          type: "success",
        });
      }
    },

    //递归,生成二维数组
    getMenu (id, arr) {
      //判断
      if (id === 0) {
        this.list.forEach((item) => {
          if (item.pid === 0) {
            arr.push(item);
          }
        });

        //在第一级菜单完成之后，从第一级的第一个菜单开始，进入第二季菜单的筛选
        this.getMenu(this.newList[0].id, this.newList);
      } else {
        arr.forEach((item, i) => {
          this.list.forEach((val, k) => {
            if (item.id === val.pid) {
              if (!item.children) item.children = [];
              item.children.push(val);

            }
          });
        });
      }
    },
  },

  computed: {
    //过滤时间yyyy-mm-dd
    ftime () {
      return function (x) {
        let datas = new Date(x);
        let year = datas.getFullYear();
        let month = datas.getMonth() + 1;
        let day = datas.getDate();
        return `${year}-${month}-${day}`;
      };
    },
  },

  created () {
    this.axios
      .get("/api/adm/type/findAll2")
      .then((res) => {
        //获取请求到的数据
        this.list = res.data.data;
        //调用getMenu,传参数
        this.getMenu(0, this.newList);

        if (this.$route.query.bookid == 0) {
          //页面标题
          this.title = "商品添加";
          this.clickTip = "添加";
        } else {
          //图片区提示语
          this.title = "商品修改";
          this.clickTip = "更新";
        }
      })
      .catch((error) => {
        console.log(error);
      });

    //获取当前页数,根据页数请求数据
    let page = this.$route.query.page;
    this.axios
      .get(`/api/adm/book/findByPage/${page}/5`)
      .then((res) => {
        this.book_list = res.data.data.books;
        //当bookid>0时,此时为修改,调用bookEdit()函数,执行查询
        //当bookid<0时,此时为添加,不调用bookEdit()函数执行查询
        if (this.$route.query.bookid > 0) {
          this.bookedit();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
/* 图片显示 */
.image .el-image{
  width: 150px;
  height: 200px;
}

.image h3 {
  margin-left: 50px;
  font-size: 20px;
}
</style>


