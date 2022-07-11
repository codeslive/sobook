<template>
  <div class="pay">
    <h3>准备付款</h3>
    <el-form :model="form">
      <el-input v-model="form.ordid" class="info" readonly>
        <template #prepend>订单号码</template>
      </el-input>
      <el-input v-model="form.addr" class="infos" readonly>
        <template #prepend>收货地址</template>
      </el-input>
      <el-input v-model="form.phone" class="infos" readonly>
        <template #prepend>收获电话</template>
      </el-input>
      <div class="btn">
        <el-button type="default">付款状态</el-button>
        <el-button type="danger" @click="dialogFormVisible = true" v-show="show"
          >未付款，点击这里扫码付款</el-button
        >
        <el-button type="success" v-show="!show">已经付款</el-button>
      </div>
    </el-form>

    <el-table :data="goods" border>
      <el-table-column prop="picture" label="图片">
        <template #default="scope">
          <img
            :src="`${$Imgurl}/api/public/showImg/${scope.row.picture}`"
            style="width: 40px; height: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="商品价钱" prop="price"></el-table-column>
      <el-table-column label="商品数量" prop="num"> </el-table-column>
      <el-table-column label="商品总价">
        <template #default="scope">
          {{ scope.row.price * scope.row.num }}
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="footer" @click="goCart()"
      >我已支付成功，返回购物车</el-button
    >
    <el-dialog
      v-model="dialogFormVisible"
      :title="`支付金额${sumPrice}元`"
      width="360px"
      center
    >
      <!-- <el-image src="img/wechatPay.jpg"></el-image> -->
      <el-image src="http://120.76.133.119/booksrc/image/wechatPay.jpg"></el-image>
      <div style="width: 100%" class="paybtn">
        <span @click="dialogFormVisible = false">取消</span>
        <span @click="Pay()">确认支付</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { $get, $postJson } from "@/ajax";
export default {
  name: "Pay",
  data() {
    return {
      goods: [],
      dialogFormVisible: false,
      form: {
        ordid: "",
        addr: "",
        phone: "",
        ispay: "",
      },
      sumPrice: 0,
      show: true,
    };
  },
  methods: {
    getOrder() {
      //获取订单号
      let ordid = this.$route.query.ordid;
      $get(`/api/fore/ord/findInfoByOrdid/${ordid}`)
        .then((res) => {
          if (res.status === 200) {
            //订单数据
            this.goods = res.data.data.items;
            //计算总价
            let sum = 0;
            for (let i = 0; i < this.goods.length; i++) {
              sum += this.goods[i].num * this.goods[i].price;
            }
            //总价
            this.sumPrice = sum.toFixed(2);
            //订单信息
            this.form.ordid = res.data.data.ord.ordid;
            this.form.addr = res.data.data.ord.addr;
            this.form.phone = res.data.data.ord.phone;
            this.form.ispay = 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    Pay() {
      let payList = {
        ordid: this.form.ordid,
        ispay: this.form.ispay,
      };
      $postJson("/api/fore/ord/addPay", payList)
        .then((res) => {
          if (res.status === 200) {
            this.openTip();
            this.dialogFormVisible = false;
            this.show = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    openTip() {
      this.$message({
        message: "支付成功",
        type: "success",
      });
    },

    goCart() {
      this.$router.push("/home/cart");
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

h3 {
  margin: 20px;
  font-size: 25px;
}

.btn {
  margin: 10px 0;
}

.orderInfo img {
  width: 40px;
  height: 40px;
}


.pay .el-image {
  width: 230px;
  height: 250px;
  display: inline-block;
  margin-left: 45px;
  
}

.paybtn {
 text-align: center;
}

.paybtn span{
  display: inline-block;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  border: 1px solid gainsboro;
  margin: 0 3px;
}

.paybtn span:first-child{
  width: 50px;
  border: 1px solid gainsboro;
  background-color: rgb(255, 255, 255);
}

.paybtn span:last-child{
    width: 80px;
    background-color: rgb(236, 245, 255);
    color: rgb(64, 158, 255);
}

.footer {
  width: 300px;
  margin: 20px 520px;
}
</style>
