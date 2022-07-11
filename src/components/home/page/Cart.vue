<template>
  <div class="content">
    <div class="cart">
      <el-table :data="cartList" border style="width: 100%">
        <el-table-column prop="picture" label="图片">
          <template #default="scope">
            <el-image
              :src="`${$Imgurl}/api/public/showImg/${scope.row.book.picture}`"
              lazy
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="book.name" label="名称" />
        <el-table-column prop="book.price" label="价钱" />
        <el-table-column width="230" label="商品数量">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.cart.num"
              :min="1"
              :max="999"
              controls-position="right"
            />
          </template>
        </el-table-column>

        <el-table-column label="商品总价">
          <template #default="scope">
            {{ scope.row.book.price * scope.row.cart.num }}
          </template>
        </el-table-column>

        <el-table-column label="复选框">
          <template #default="scope">
            <el-checkbox border v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="default">总价钱</el-button>&nbsp;{{ getSum }}
      <hr />
      <el-button type="primary" @click="getCart()">去下单</el-button>
    </div>
  </div>
</template>

<script>
import { $get } from "@/ajax";
// import { ElLoading } from "element-plus";
export default {
  name: "Cart",
  data() {
    return {
      cartList: [],
      sum: 0,
      order: [],
      loading: "",
    };
  },

  computed: {
    //计算总价
    getSum() {
      let sumPrice = 0;
      for (let i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].checked == true) {
          sumPrice += this.cartList[i].book.price * this.cartList[i].cart.num;
        }
      }
      return sumPrice;
    },
  },

  methods: {
    //判断复选框勾选状态,获取数据
    getCart() {
      let order = [];
      for (let i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].checked == true) {
          order.push(this.cartList[i]);
        }
      }

      if (order.length > 0) {
        //把数据放到共享空间
        this.$store.commit("getOrder", order);
        //跳转至支付页面
        this.$router.push("/home/orderpay");
      }
    },
  },

  created() {
    //请求购物车的数据
    $get("/api/fore/cart/findAll")
      .then((res) => {
        if (res.status === 200) {
          this.cartList = res.data.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>


.cart .el-image {
  width: 40px;
  height: 40px;
}
</style>
