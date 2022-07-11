<template>
  <div>
    <div class="order">
      <el-aside>
        <span>我的订单详情</span>
        <div class="right">
          <em :class="{ default: isOpen === false }">未付款</em
          ><el-switch
            v-model="isOpen"
            active-color="#13ce66"
            inactive-color="#ff4949"
          /><em :class="{ default: isOpen === true }">已付款</em>
          <el-date-picker v-model="startTime"> </el-date-picker>
          <el-date-picker v-model="endTime"> </el-date-picker>
          <button @click="serchContent()">查询</button>
        </div>
      </el-aside>
      <hr />

      <el-table :data="orderList" border v-show="showEntry">
        <el-table-column label="订单号" prop="ordid"></el-table-column> 
        <el-table-column label="收货地址" prop="addr"></el-table-column>
        <el-table-column label="电话" prop="phone"> </el-table-column>
        <el-table-column label="发货单号">
          <template #default="scope">
            <p :class="{ nopay: scope.row.shipno == '' }">{{ fshipno(scope.row.shipno) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="总价" prop="amount"></el-table-column>
        <el-table-column label="是否付款">
          <template #default="scope">
            <p :class="{ nopay: scope.row.ispay == 0 }" class="pays">
              {{ ftpay(scope.row.ispay) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template #default="scope">
            {{ ftime(scope.row.tcreate) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-popover placement="left" :width="800" trigger="click">
              <template #reference>
                  <button class="showinfo" @click="getDetail(scope.row.ordid)">明细</button>
                >
              </template>
              <el-aside>
                {{ scope.row.ordid }}#订单详情&nbsp;&nbsp;发往:{{
                  scope.row.addr
                }}
              </el-aside>
              <el-table :data="datailList" border class="img">
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
          </template>
        </el-table-column>
      </el-table>
      <hr v-show="showEntry"/>
      <div class="btn" v-show="showEntry">
        <button @click="getPage()">显示更多</button>
      </div>
    </div>

    <!-- 购物车没有数据显示 -->
    <div v-show="!showEntry">
      <el-empty :description="entry"></el-empty>
    </div>
  </div>
</template>

<script>
import { $get, $post } from "@/ajax";

export default {
  name: "Order",
  data() {
    return {
      isOpen: false,
      orderList: [],
      datailList: [],
      start: 0,
      num: 5,
      total: 0,
      ispay: "",
      startTime: new Date(),
      endTime: new Date(),
      showEntry: true,
      entry: "",
    };
  },

  computed: {
    //时间过滤
    ftime() {
      return function (x) {
        let datas = new Date(x);
        let year = datas.getFullYear();
        let month = datas.getMonth() + 1;
        let day = datas.getDate();
        return `${year}-${month}-${day}`;
      };
    },
    // 过滤付款
    ftpay() {
      return function (x) {
        return x == 0 ? (x = "未付款") : (x = "已付款");
      };
    },

    fshipno() {
      return function (x) {
        return x == "" ? (x = "商家还在发货中……") : x;
      };
    },
  },

  methods: {
    //请求数据
    getOrder() {
      $get(`/api/fore/ord/findOrdLineByPage/${this.start}/${this.num}`)
        .then((res) => {

          if (res.status === 200) {
            //获取没添加之前的数组长度
            let oldLenght = this.orderList.length;
            
            for (let i in res.data.data.orders) {
              this.orderList.push(res.data.data.orders[i]);
            }
            //获取没添加之后的数组长度
            let newLenght = this.orderList.length

            //当旧数组
            if(newLenght - oldLenght == 0){
              this.openTip();
            }
            
            if (this.orderList.length <= 0) {
              this.showEntry = false;
              this.entry = "空空如也~";
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //点击页数自增
    getPage() {
      this.start++;
      this.getOrder();
    },

    //获取明细数据
    getDetail(id) {
      let ordid = id;
      $get(`/api/fore/ord/findInfoByOrdid/${ordid}`)
        .then((res) => {
          if (res.status === 200) {
            this.datailList = res.data.data.items;
            console.log(this.datailList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(ordid);
    },

    //查询订单
    serchContent() {
      //获取日期时间戳
      let startTime = new Date(this.startTime).getTime();
      let endTime = new Date(this.endTime).getTime();
      //按钮
      this.isOpen === true ? (this.ispay = 1) : (this.ispay = 0);

      let data = {
        ispay: this.ispay,
        tstart: startTime,
        tend: endTime,
      };

      if (startTime && this.endTime) {
        
        $post(`/api/fore/ord/findOrdLineByPage/${this.start}/${this.num}`, data)
          .then((res) => {
            if (res.status === 200) {
              this.orderList = res.data.data.orders;
              this.showEntry = true;
              console.log(this.orderList);
              
             
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //消息提示
    openTip() {
      this.$message({
        duration: 1500,
        message: "没有更多记录了",
        type: "warning",
      });
    },
  },
  mounted() {},
  created() {
    this.getOrder();
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

.img img {
  width: 40px;
  height: 40px;
}

.btn{
  display: flex;
  justify-content: center;
}

.btn button{
  background-color: rgb(103, 194, 58);
  width: 120px;
  height: 40px;
  color: white;
  border: none;
  border-radius: 5px;
}

.btn button:hover{
  background-color: rgb(133, 206, 97);
}
.order .el-aside {
  margin: 20px;
}

.right {
  float: right;
}

.right em {
  font-style: normal;
  margin: 0 10px;
}

.right button{
   width: 55px;
  height: 40px;
  border: 1px solid gainsboro;
  border-radius: 5px;
  color: rgb(101, 102, 102);
  background-color: white;
  margin-right: 20px;

}

.right button:hover{
  background-color: rgb(236, 245, 255);
  color: rgb(93, 169, 255);
}

.order span {
  font-size: 20px;
  font-weight: bold;
  float: left;
}

.order .el-aside {
  width: 100%;
}

.order .el-aside .el-button {
  margin-right: 25px;
}
hr {
  margin: 20px 0;
}

.default {
  color: rgb(89, 166, 255) !important;
}

.nopay {
  color: rgb(139, 0, 0) !important;
}

.pays {
  color: green;
}


.showinfo{
  width: 60px;
  height: 40px;
  border: 1px solid gainsboro;
  border-radius: 5px;
  color: rgb(101, 102, 102);
  background-color: white;
  margin-right: 20px;
}

.showinfo:hover{
  background-color: rgb(236, 245, 255);
  color: rgb(93, 169, 255);
}
</style>
