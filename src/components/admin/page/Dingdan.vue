<template>
  <div class="dingdan">
    <h3>
      所有客户的订单详情<span>
        <el-button type="primary" @click="dialogTwo = true">
          <el-icon> <ZoomIn /> </el-icon>按条件查询
        </el-button>
      </span>
    </h3>
    <hr />
    <el-table :data="dingdan" border style="width: 100%" class="tab_list">
      <el-table-column prop="ordid" label="订单号" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="nickname" label="收货人" />
      <el-table-column prop="amount" label="总价" />
      <el-table-column label="是否付款">
        <template #default="scope">
          <span :class="{ nopay: scope.row.ispay == 0 }">{{
            ftpay(scope.row.ispay)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="shipno" label="发货单号" />
      <el-table-column prop="addr" label="发货地址" />
      <el-table-column label="下单时间">
        <template #default="scope">
          {{ ftime(scope.row.tcreate) }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-popover placement="left" :width="800" trigger="click">
            <template #reference>
              <el-button type="default" @click="detail(scope.row.ordid)"
                class="def">明细</el-button
              >
            </template>

            <el-aside>
              {{ scope.row.ordid }}#订单详情&nbsp;&nbsp;发往:{{
                scope.row.addr
              }}
            </el-aside>
            <el-table :data="ordid_list">
              <el-table-column label="图片">
                <template #default="scope">
                  <img
                    :src="`${$Imgurl}/api/public/showImg/${scope.row.picture}`"
                  />
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="name" />
              <el-table-column label="商品价钱" prop="price" />
              <el-table-column label="商品数量" prop="num" />
              <el-table-column label="小计">
                <template #default="scope">
                  {{ scope.row.price * scope.row.num }}
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
          <el-button
            type="success"
            v-if="scope.row.ispay == 1"
            @click="btn(scope.row.ordid)"
            class="goods">发货</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 条件查询 -->
    <el-dialog v-model="dialogTwo" width="500px" title="按条件查询订单" center>
      <el-date-picker v-model="startTime"> </el-date-picker>
      <el-date-picker v-model="endTime" class="endTime"> </el-date-picker>

      <el-input v-model="phone" placeholder="收货电话"></el-input>
      <el-input v-model="consignee" placeholder="收货人"></el-input>
      <div class="btn">
        <el-button type="default" @click="dialogTwo = false" class="def">取消</el-button>
      <el-button type="default" @click="(dialogTwo = false), serchOrder()"
         class="def">确定</el-button
      >
      </div>
    </el-dialog>

    <!-- 订单发货 -->
    <el-dialog
      v-model="dialogFormVisible"
      width="500px"
      title="发货确认"
      center
    >
      <h4>请输入发货单号:</h4>
      <el-input v-model="shipno" readonly></el-input>
      <el-button type="default" @click="dialogFormVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        @click="shipments(), (dialogFormVisible = false)"
        >确认发货</el-button
      >
    </el-dialog>

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
import { $postJson, $get, $post } from "@/ajax";
import { ZoomIn } from "@element-plus/icons-vue";
export default {
  name: "Dingdan",
  components: {
    ZoomIn,
  },
  data() {
    return {
      dingdan: [],
      ordid_list: [],
      num: 10, //每页条数
      total: 0, //总条数
      page: 1, //页数
      id: "",
      ordid: "",
      shipno: "",
      phone: "",
      startTime: new Date(),
      endTime: new Date(),
      consignee: "", //收货人
      dialogFormVisible: false,
      dialogTwo: false,
    };
  },

  watch: {
    // 请求地址
    page() {
      let pages = `/api/adm/ord/findOrdInfo/${this.page - 1}/10`;
      $postJson(pages)
        .then((res) => {
          this.dingdan = res.data.data.orders;
          this.total = res.data.data.total;
        })
        .catch((error) => {
          console.log(error);
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
    //过滤付款
    ftpay() {
      return function (x) {
        return x == 0 ? (x = "未付") : (x = "已付");
      };
    },
  },

  methods: {
    //订单数据
    getData() {
      let start = 0;
      let num = 10;
      $postJson(`/api/adm/ord/findOrdInfo/${start}/${num}`)
        .then((res) => {
          if (res.status === 200) {
            this.dingdan = res.data.data.orders;
            this.total = res.data.data.total;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //订单查询
    serchOrder() {
      let num = 10;
      let ispay = 0;
      //转换成日期时间戳
      let startTime = new Date(this.startTime).getTime();
      let endTime = new Date(this.endTime).getTime();

      //日期不为空,发起post请求
      if (startTime != "" && endTime != "") {
        //数据打包
        let data = {
          ispay: ispay,
          tstart: startTime,
          tend: endTime,
          phone: this.phone,
          nickname: this.consignee,
        };

        $post(`/api/adm/ord/findOrdInfo/${this.page - 1}/${num}`, data)
          .then((res) => {
            if (res.status === 200) {
              this.dingdan = res.data.data.orders;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //订单明细
    detail(id) {
      this.id = id;

      $get(`/api/adm/ord/findItemInfoByOrdid/${this.id}`)
        .then((res) => {
          if (res.status === 200) {
            this.ordid_list = res.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //订单发货
    shipments() {
      console.log(this.ordid);
      if (this.shipno != "") {
        let data = {
          ordid: this.ordid,
          shipno: this.shipno,
        };

        console.log(data);

        $postJson(`/api/adm/ord/addShip`, data)
          .then((res) => {
            if (res.status === 200) {
              //消息提示
              this.openTip();
              //post成功,重新查询数据
              this.getData();

            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    btn(x) {
      this.ordid = x;
      console.log(this.ordid);
      //随机生成发货单号
      let num = "";
      for (var i = 0; i < 12; i++) {
        num += Math.floor(Math.random() * 10);
      }
      this.shipno = num;
      this.dialogFormVisible = true;
    },

    openTip() {
      this.$message({
        duration: 600,
        message: "发货成功，已添加到快递~",
        type: "success",
      });
    },
  },
  mounted() {},
  created() {
    this.getData();  
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

.el-popover img {
  width: 40px;
  height: 40px;
}

.el-dialog h4 {
  margin: 15px 0;
}

h3 {
  height: 60px;
  line-height: 60px;
}

span {
  float: right;
}

.serch .el-input {
  margin: 0 0;
}

.serch .el-button {
  margin-top: 10px;
}

.tab_list span {
  color: green;
}

/* 未付款,加载该样式 */
.nopay {
  color: rgb(139, 0, 0) !important;
}

hr {
  margin: 30px 0;
  border: 0.6px solid gray;
}

.dingdan h3 .el-button{
  width: 130px;
}

.def{
  width: 80px;
}

.goods{
  width: 60px;
  display: inline-block;
  margin: 5px 0;
}

.def{
  width: 80px;
}

.el-input{
  margin: 5px 0;
}

.btn{
  display: flex;
  justify-content: center;
}

</style>
