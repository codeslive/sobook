<template>
  <div class="orderpay">
    <h3>待订单确认详情</h3>
    <el-table :data="orderList" border>
      <el-table-column prop="picture" label="图片">
        <template #default="scope">
          <img
            :src="`${$Imgurl}/api/public/showImg/${scope.row.book.picture}`"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="book.name"></el-table-column>
      <el-table-column label="商品价钱" prop="book.price"></el-table-column>
      <el-table-column label="商品数量" prop="cart.num"> </el-table-column>
      <el-table-column label="商品总价">
        <template #default="scope">
          {{ scope.row.book.price * scope.row.cart.num }}
        </template>
      </el-table-column>
    </el-table>
  
      <button class="batons">总价钱:</button>
    &nbsp;{{ getSum }}
    <br />
    <el-input v-model="form.addr" class="info">
      <template #prepend>请输入收货地址</template>
    </el-input>
    <el-input v-model="form.phone" class="infos">
      <template #prepend>请输入收获号码</template>
    </el-input>
    <br />
    <div class="payBtn">
      <button @click="goCart()" v-show="showOrdid">重新选择</button>
      <button v-show="showOrdid" @click="getOrdid()">下单</button>
      <button @click="goCart()" v-show="showPay">订单下单成功{{ form.ordid }}</button>
      <button v-show="showPay" @click="goPay()">去付款</button>
    </div>
  </div>
</template>

<script>
import { $postJson } from "@/ajax";
export default {
  name: "OrderPay",
  data() {
    return {
      orderList: [],
      form: {
        addr: "",
        phone: "",
        ordid: "",
      },
      showOrdid: true,
      showPay: false,
    };
  },

  computed: {
    getSum() {
      let sumPrice = 0;
      for (let i = 0; i < this.orderList.length; i++) {
        sumPrice += this.orderList[i].book.price * this.orderList[i].cart.num;
      }
      return `${sumPrice}元`;
    },
  },
  methods: {
    getOrdid() {
      //获取bookid num price
      let payList = [];
      for (let i = 0; i < this.orderList.length; i++) {
        let order = {};
        order.bookid = this.orderList[i];
        order.bookid = this.orderList[i].cart.bookid;
        order.num = this.orderList[i].cart.num;
        order.price = this.orderList[i].book.price;

        //得到的值不为空,push进数组
        if (order.bookid != "" && order.num != "" && order.price != "") {
          payList.push(order);
        }
      }
      //数据不为空,提交数据
      if (payList.length > 0 && this.form.addr != "" && this.form.phone != "") {
        $postJson("/api/fore/cart/addCart2Order", payList)
          .then((res) => {
            if (res.status === 200) {
              this.form.ordid = res.data.data.ordid;
              this.showOrdid = false;
              this.showPay = true;

              $postJson("/api/fore/ord/addAddr", this.form)
                .then((res) => {
                  if (res.status === 200) {
                    console.log(res.data);
                    this.openTip(0);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });

              
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }else{
          this.openTip(1);
      }
    },

    //跳转至支付页面
    goPay() {
      this.$router.push({
        path: "/home/pay",
        query: {
          ordid: this.form.ordid,
        },
      });
    },

    //message提示
    openTip(id) {
      if (id == 0) {
        this.$message({
          duration: 600,
          message: `下单成功,订单号为：${this.form.ordid}`,
          type: "success",
        });
      } else {
        this.$message.error({
          duration: 600,
          grouping: true,
          message: `请填写收货信息`,
        });
      }
    },

    //返回购物车
    goCart() {
      this.$router.push("/home/cart");
    },
  },
  mounted() {},
  created() {
    //去拿vuex里面的购物车订单的数据
    this.orderList = this.$store.state.orderList;
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

img {
  width: 40px;
  height: 40px;
}

h3 {
  margin: 20px 0;
  font-size: 25px;
  font-weight: 600;
}

.info {
  margin-top: 10px;
  margin-bottom: 5px;
  width: 60%;
}

.infos {
  width: 60%;
}

.batons {
  width: 60px;
  height: 30px;
  color: rgb(72, 161, 255);
  border: none;
  background-color: rgb(236, 245, 255);
  border-radius: 5px;
  margin-top: 10px;
}

.batons:hover{
  background-color: rgb(72, 161, 255);
  color: white;
}


.payBtn button:first-child{
  width: 100px;
  height: 40px;
  color: white;
  border: none;
  background-color: rgb(230, 162, 60);
  border-radius: 5px;
  margin: 10px 10px;
}

.payBtn button:first-child:hover{
  background-color: rgb(235, 181, 99);
}

.payBtn button:last-child  , .payBtn button:nth-child(2){
  width: 60px;
  height: 40px;
  color: white;
  border: none;
  background-color: rgb(245, 108, 108);
  border-radius: 5px;
}

.payBtn button:last-child:hover , .payBtn button:nth-child(2):hover{
  background-color: rgb(247, 137, 137);
}

.payBtn button:nth-child(3){
  background-color: rgb(103, 194, 58);
  width: 120px;
  height: 40px;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 10px 10px;
}

.payBtn button:nth-child(3):hover{
  background-color: rgb(133, 206, 97);
}





</style>
