<template>
  <div>
    <div class="detailed">
      <el-row class="detailed-massage">
        <div class="detailed-massage-title">
          <div class="dmt"></div>
          <div class="text">单据信息</div>
        </div>
        <div class="detailed-massage-member">
          <el-row :class="billGoods.data.ISCANCEL == false ? 'title' : 'title1'">
            {{ billGoods.data.ISCANCEL == false ? "已完成" : "已作废" }}
          </el-row>
          <el-row class="content">
            <el-col :span="8">
              <span>单据编号:</span>
              <span>{{ billlist.BILLNO }}</span>
            </el-col>
            <el-col :span="8">
              <span>单据时间:</span>
              <span>{{ billlist.BILLDATE }}</span>
            </el-col>
            <el-col :span="8">
              <span>店 铺:</span>
              <span>{{ billlist.SHOPNAME }}</span>
            </el-col>

          </el-row>

          <el-row class="content">
             <el-col :span="8">
              <span>制单人: {{ billlist.USERNAME }}</span>
              <span></span>
            </el-col>
            <el-col :span="8">
              <span>销售员:</span>
              <span>{{ billlist.SALEEMPNAME ? billlist.SALEEMPNAME : '--' }}</span>
            </el-col>
             <el-col :span="8">
              <span>会 员:</span>
              <span>{{ billlist.VIPNAME }}</span>
            </el-col>
          </el-row>
          <el-row class="content">
            <el-col :span="8">
              <span>付款方式:</span>
              <span> {{billGoods.data.BILLTYPE == '会员领奖' ? '竞技积分' : billlist.PAYTYPENAME}}</span>
            </el-col>
            <el-col :span="8">
              <span>备注:</span>
              <span>{{ billlist.REMARK ? billlist.REMARK : '--' }}</span>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-row class="detailed-goods">
        <div class="detailed-massage-title">
          <div class="dmt"></div>
          <div class="text">消费信息</div>
        </div>
        <!-- 商品消费-->
        <div class="detailed-goods-list" v-if="billGoods.data.BILLTYPE == '商品消费'">
          <table
            class="tableStock"
            border="0"
            cellspacing="0"
            cellpadding="10"
            width="100%"
            style="height: auto"
          >
            <thead>
              <tr>
                 <th align="left" style="width: 140px">商品</th>
                 <th align="center" style="width: 140px">售价</th>
                 <th align="center" style="width: 140px">折扣 %</th>
                 <th align="center" style="width: 140px">单价</th>
                 <th align="center" style="width: 140px">数量</th>
                 <th align="center" style="width: 140px">小计</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in goodsList" :key="index">
                <td align="center" style="width: 500px">
                  <div class="imggood">
                        <img
                          :src="item.goodsimg"
                          width="55"
                          height="55"
                          onerror="this.src='static/images/shopmore.png'"
                          style="float:left"
                        />
                        <span style="float:left">{{ item.GOODSNAME }}</span>
                   </div>
                </td>
                <td align="center" style="width: 200px">￥{{ item.PRICE }}</td>
                <td align="center" style="width: 200px">{{ item.DISCOUNT }}</td>
                <td align="center" style="width: 200px">￥{{ item.MONEY }}</td>
                <td align="center" style="width: 200px">x {{ item.QTY }}</td>
                <td align="center" style="width: 200px">
                 ￥ {{ item.QTY * item.PRICE }}
                </td>
              </tr>
              <tr>
                <td colspan="6" align="right">
                   <div style="width: 150px; margin-top: 10px">
                      <i style='float:left'>合计：</i> <i style="margin-left: 20px">  ￥{{ billlist.SUMSALEMONEY }} </i>
                   </div>
                   <div style="width: 150px; margin-top: 10px">
                      <i style='float:left'>优惠：</i> <i style="margin-left: 20px"> ￥{{ billlist.FAVORMONEY }} </i>
                     </div>
                     <div style="width: 150px; margin-top: 10px">
                        <i style='float:left'>付款：</i> <i style="margin-left: 20px; color:#f00"> ￥{{ billlist.PAYMONEY }} </i>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 快速消费-->
        <div class="detailed-goods-list" v-if="billGoods.data.BILLTYPE == '快速消费'">
          <table
            class="tableStock"
            border="0"
            cellspacing="0"
            cellpadding="10"
            width="100%"
            style="height: auto"
          >
            <thead>
              <tr>
                <th align="left" style="width: 25%">商品</th>
                 <th align="center" style="width: 25%">消费金额</th>
                 <th align="center" style="width: 50%; text-align:right;">小计</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="left" style="width: 25%">快速消费</td>
                <td align="center" style="width: 25%">{{ billlist.PAYMONEY }}</td>
                <td align="center" style="width: 50%; text-align:right">{{ billlist.SUMSALEMONEY }}</td>
              </tr>
              <tr>
                <td colspan="3" align="right">
                   <div style="margin-top: 20px">
                      付款 :
                      <i style="margin-left: 20px; color:#f00"> ￥{{ billlist.PAYMONEY }} </i>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 储值充值-->
        <div class="detailed-goods-list" v-if="billGoods.data.BILLTYPE == '储值充值'">
          <table
            class="tableStock"
            border="0"
            cellspacing="0"
            cellpadding="10"
            width="100%"
            style="height: auto"
          >
            <thead>
              <tr>
                <th align="left" style="width: 25%">商品</th>
                 <th align="center" style="width: 25%">充值金额</th>
                 <th align="center" style="width: 25%">赠送金额</th>
                 <th align="center" style="width: 25%; text-align:right;">小计</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" style="width: 25%">
                  <div class="imggood">
                        <img
                          src="static/images/shopmore.png"
                          width="55"
                          height="55"
                          onerror="this.src='static/images/shopmore.png'"
                          style="float:left"
                        />
                        <span style="float:left">{{ billlist.BILLTYPENAME }}</span>
                   </div>
                </td>
                <td align="center" style="width: 25%">￥{{ billlist.ADDMONEY }}</td>
                <td align="center" style="width: 25%">￥{{ billlist.GIFTMONEY}}</td>
                <td align="center" style="width: 25%; text-align:right">￥{{ billlist.ADDSUMMONEY }}</td>
              </tr>
              <tr>
                 <td colspan="4" align="right">
                   <div style="margin-top: 20px">
                      付款 :
                      <i style="margin-left: 20px; color:#f00"> ￥{{ billlist.ADDMONEY }} </i>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

         <!-- 会员领奖 -->
        <div class="detailed-goods-list" v-if="billGoods.data.BILLTYPE == '会员领奖'">
          <table
            class="tableStock"
            border="0"
            cellspacing="0"
            cellpadding="10"
            width="100%"
            style="height: auto"
          >
            <thead>
              <tr>
                 <th align="left" style="width: 25%">商品</th>
                 <th align="center" style="width: 25%">单价</th>
                 <th align="center" style="width: 25%">数量</th>
                 <th align="center" style="width: 25%">小计</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in goodsList" :key="index">
                <td align="center" style="width: 25%">
                   <div class="imggood">
                        <img
                          :src="item.goodsimg"
                          width="55"
                          height="55"
                          onerror="this.src='static/images/shopmore.png'"
                          style="float:left"
                        />
                        <span style="float:left">{{ item.GOODSNAME }}</span>
                   </div>
                </td>
                <td align="center" style="width: 25%">￥{{ item.PAYINTEGRAL / item.QTY }}</td>
                <td align="center" style="width: 25%">x{{ item.QTY }}</td>
                <td align="center" style="width: 25%">
                  {{ item.PAYINTEGRAL }}
                </td>
              </tr>
              <tr>
                <td colspan="6" align="right">
                   <div style="margin-top: 20px">
                      付款 :
                      <i style="margin-left: 20px; color:#f00"> ￥{{ billlist.PAYINTEGRAL + billlist.PAYMONEY }} </i>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-row>
    </div>

    <el-row class="total" style="margin-top: 20px; padding-right: 30px">
      <el-col style="text-align: right" :span="24">
        <el-button
          size="medium"
          @click="gooodsChange(billlist)"
          v-if="billGoods.data.BILLTYPE == '商品消费'"
        >
          打印
        </el-button>

        <el-button
          size="medium"
          @click="integralExchange(billlist)"
          v-if="billGoods.data.BILLTYPE == '会员领奖'"
        >
          打印
        </el-button>

        <el-button
          size="medium"
          @click="fastChange(billlist)"
          v-if="billGoods.data.BILLTYPE == '快速消费'"
        >
          打印
        </el-button>
        <el-button size="medium" @click="toCancelFun(billlist)">作废</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
var QRCode = require("qrcode");
import { mapState, mapGetters } from "vuex";
import { GOODS_IMGURL } from "@/util/define";
import { getDayindate } from "@/util/Printing";
export default {
  props: {
    billGoods: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {
      goodsListTime: [],
      goodsList: [],
      billlist: {},
      getgoodsIMGURL: "",
      commoditycname: ["商品", "售价", "折扣 %", "单价", "数量", "小计"],
      timesconttr: ["商品", "售价", "折扣", "单价", "次数", "有效期", "小计"]
    };
  },
  computed: {
    ...mapGetters({
      businesstabledetailed: "businesstabledetailed",
      memberQRcodeurlstate: "memberQRcodeurlstate",
      investCancelState: "investCancelState"
    })
  },
  watch: {
     billGoods(data){
        console.log(data)
     },
    businesstabledetailed(data) {
      let Obj = [];
      Obj = data.GoodsObj;
      this.billlist = data.Obj;
      this.getgoodsIMGURL = GOODS_IMGURL;
      for (var j in Obj) {
        Obj[j].goodsimg = this.getgoodsIMGURL + Obj[j].GOODSID + ".png";
      }
      this.goodsList = Obj;
      this.goodsListTime = data.GoodsList;
      for (var i in this.goodsListTime) {
        this.goodsListTime[i].goodsimg =
          this.getgoodsIMGURL + this.goodsListTime[i].GOODSID + ".png";
      }
    },
    memberQRcodeurlstate(data) {
      QRCode.toDataURL(data.data.BarCode)
        .then((url) => {
          this.$store.state.commodityc.saveQRcodeIMG = url;
        })
        .catch((err) => {});
    },
    investCancelState(data) {
      if (data.success) {
        this.$message({
          message: "操作成功",
          type: "success"
        });

        this.$emit("closeModal");
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    }
  },
  methods: {
    gooodsChange(item) {
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG; // 注意获取图片
      getDayindate("210020531", item.BILLID, 1, qresurl);
    },
    integralExchange(item){
       let qresurl = this.$store.state.commodityc.saveQRcodeIMG; // 注意获取图片
      getDayindate("920332", item.BILLID, 6, qresurl);
    },
    fastChange(items) {
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG; // 注意获取图片
      getDayindate("210020530", items.BILLID, 3, qresurl);
    },
    storagevaluerChange() {
      // getDayindate("210020150", data.data.BillId, 4, qresurl);
    },
    toCancelFun(item) {
      console.log(item);
      console.log(this.billGoods.data.BILLTYPE);
      let billType = this.billGoods.data.BILLTYPE;
      let InterfaceCode = "210020534";
      if (billType == "计次充值" || billType == "储值充值") {
        InterfaceCode = "210020151A";
      }
      this.$confirm("是否作废单号：" + item.BILLNO + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("getinvestCancelTableState", {
              BillId: item.BILLID,
              InterfaceCode: InterfaceCode
            })
            .then(() => {
              // this.loading = true;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    }
  },
  mounted() {
     console.log(this.billGoods)
     this.$store.dispatch("getBusinesstableDetailed", this.billGoods.setDate).then(() => {});

    this.$store.dispatch("getmemberQRcodeurlstate");
  }
};
</script>
<style scoped>
.detailed {
  height: 500px;
  overflow-y: auto;
}
.detailed-massage {
  width: 100%;
}
.detailed-massage-title {
  display: flex;
  align-items: center;
  height: 35px;
  width: 100%;
  background: #f7f8fa;
  line-height: 35px;
}
.detailed-massage-title .dmt {
  margin-left: 15px;
  height: 16px;
  width: 5px;
  background: #3399ff;
}
.detailed-massage-title .text {
  margin-left: 6px;
}
.detailed-massage-member {
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 10px;
}
.detailed-massage-member .title {
  height: 50px;
  line-height: 50px;
  color: #3399ff;
  font-size: 20px;
  font-weight: bold;
  /* background: fuchsia; */
}

.detailed-massage-member .title1 {
  height: 50px;
  line-height: 50px;
  color: #fa1f38;
  font-size: 20px;
  font-weight: bold;
  /* background: fuchsia; */
}

.detailed-massage-member .content {
  position: relative;
  height: 35px;
  line-height: 35px;
  display: flex;
}
.detailed-goods {
  width: 100%;
}
.detailed-goods-list {
  margin-top: 20px;
  width: 100%;
  padding: 0 30px
}
.detailed-goods-list .content {
  width: 92%;
  margin-left: 4%;
  margin-right: 4%;
  margin-top: 15px;
}
.detailed-goods-list .total {
  display: flex;
  height: 30px;
  align-items: center;
}
.content-money {
  position: absolute;
  margin-top: 20px;
  text-align: right;
  /* background: #3399FF; */
  width: 25%;
  right: 60px;
}
.good-shop {
  width: 100%;
  display: flex;
  align-items: center;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  background-color: #e3e3e5;
}
::-webkit-scrollbar-thumb {
  background-color: #979799;
}

.tableStock thead {
  height: 36px;
  line-height: 36px;
}
.tableStock tr td, .tableStock tr th {
   border-bottom: 1px solid #EBEEF5;
   padding: 6px
}
.tableStock tr:last-child td{
   border-bottom: none;
}
.imggood{
   display: flex;
  align-items: center;
}
.imggood img{
   border-radius: 6px;
   vertical-align: middle;
   width: 40px;
   height: 40px;
   margin-right: 10px;
}
</style>
