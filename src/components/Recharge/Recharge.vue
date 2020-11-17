<template>
  <div class="Recharge">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" style="position: relative">
        <div class="row-flex flex-between flex-items-center border-bottom rleft-li">
          <span class="title">本单合计</span>
          <span class="font-16">{{ totalprice.price | money }}</span>
        </div>
        <div class="row-flex flex-between flex-items-center border-bottom rleft-li">
          <div>
            <span class="title">{{ payName }}</span>
          </div>
          <div v-if="disabled">
            <span class="font-16" style="cursor: no-drop">{{ payprice | money }}</span>
            <span v-if="!isAllowClick" class="p-left-xs text-theme2">(积分不足)</span>
          </div>
          <div v-else>
            <input
              class="cash font-16 no-border text-right block full-width block"
              v-model="payprice"
              @keyup="handleInput3"
              placeholder="0.00"
              ref="cash"
            />
          </div>
        </div>
        <div class="border-bottom rleft-li dateborder" v-if="allowsaledate">
          <el-row>
            <el-col :span="12">
              <span class="title">{{ totalprice.title }}</span>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-date-picker
                style="width: 73px"
                class="datename"
                v-model="value1"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                prefix-icon="1"
                clear-icon="2"
              ></el-date-picker>
            </el-col>
          </el-row>
        </div>
        <div
          v-if="rechargeListList.length > 0"
          class="row-flex flex-between flex-items-center rleft-li"
        >
          <div>
            <span class="font-16">
              找零
              <i class="Givechange">{{ pocketmoney | money }}</i>
            </span>
          </div>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        class="spaceBorder-left p-bottom-sm"
        v-if="rechargeListList.length > 0"
      >
        <div class="rleft-li">选择支付方式</div>
        <div class="rright">
          <div class="showpayList overflowscroll" style="min-height: 200px; max-height: 235px">
            <ul>
              <li
                class="list-group-item"
                v-for="(item, index) in rechargeListList"
                :key="index"
                v-if="isClickRL(item)"
                @click="toggletab(index, item)"
              >
                <div
                  class="paylistsock"
                  :style="`background: ${
                    curtab == index ? '#ecf5ff' : '#ffffff'
                  }; border: 1px solid ${curtab == index ? '#b3d8ff' : '#ddd'} `"
                >
                  <img
                    :src="item.payerIMG"
                    alt=""
                    style="width: 28px; height: 28px; margin-top: 5px"
                  />
                  <p>{{ item.NAME }}</p>

                  <div
                    v-if="curtab == index"
                    :class="{ selected: curtab == index }"
                    style="
                      border-top: 30px solid #137deb;
                      width: 0;
                      height: 0;
                      border-left: 30px solid transparent;
                    "
                  >
                    <i class="el-icon-check"></i>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="Rechargeright_f">
          <el-checkbox v-model="checkedreceipt">打印小票</el-checkbox>
          <el-checkbox v-model="IsSms" class="pull-right">短信通知</el-checkbox>
        </div>
      </el-col>
    </el-row>
    <div style="margin: 0 -20px; border-top: 6px solid rgb(224, 220, 220)"></div>
    <!-- foot -->
    <div class="row-flex flex-between flex-items-center p-top-sm">
      <div class>
        <span>实收</span>
        <strong id="netreceiptsmoney">￥{{ receivableprice | money }}</strong>
      </div>

      <div>
        <el-button type="info" @click="closeModal">取消</el-button>
        <el-button type="danger" @click="onSubmit" v-if="isAllowClick">确认支付</el-button>
        <el-button type="danger" disabled v-else>确认支付</el-button>
      </div>
    </div>
    <div
      class="footersock"
      style="width: 100%; display: table; font-size: 10px"
      v-if="((totalprice - ZEROTYPE) * 1000000000) / 1000000000 != 0"
    >
      已抹零 ￥{{ parseFloat(ZEROTYPE).toFixed(2) }}
    </div>

    <!-- 扫描支付 -->
    <el-dialog
      v-if="showbarCodePay"
      title="扫码支付"
      :visible.sync="showbarCodePay"
      width="550px"
      append-to-body
    >
      <barCodePay
        :paytypeid="PaytypeId"
        :billmoney="receivableprice"
        @barcodePayclick="barcodePaycomback"
      ></barCodePay>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { nscreenexCodeFun } from "@/util/objectivity";
import barCodePay from "@/components/Recharge/barCodePay";
import CouponList from "@/components/Recharge/CouponList";
import { getOthersData, getUserInfo, setOthersData } from "@/api/index";
import CRYPTO from "crypto-js";
export default {
  name: "Recharge",
  props: {
    totalprice: {
      type: Object,
      default: {
        price: 0,
        discount: 0,
        title: ""
      }
    },
    rechargestatus: {
      type: [String, Number],
      default: 0
    },
    isselectvip: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      discountMoney: "",
      paytypeMoney: "0.00",
      checkedreceipt: false,
      IsSms: false,
      value: "",
      payName: "",
      disabled: true,
      curtab: 0,
      receivableprice: parseFloat(this.totalprice.price), // 实收
      payprice: parseFloat(this.totalprice.price), // 支付方式金额
      pocketmoney: "0.00",
      gerintegral: 0, // 积分
      PaytypeId: "",
      showbarCodePay: false,
      barcodepaystatus: "",
      isAllowClick: true,
      value1: "",
      value2: "",
      allowsaledate: "",
      ZEROTYPE: 0,
      rechargeListList: [],
      IsUseVipPassword: getUserInfo().CompanyConfig.ISUSEVIPPASSWORD,
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE
    };
  },
  computed: {
    ...mapGetters({
      selmember: "selmember",
      rechargeListList1: "rechargeListList",
      integraltList: "integraltList",
      barcodepayopenState: "barcodepayopenState",
      gparameterstate: "gparameterstate",
      memberQRcodeurlstate: "memberQRcodeurlstate"
    })
  },
  watch: {
    memberQRcodeurlstate(data) {
      console.log(data.BarCode);
    },
    rechargeListList1(data) {
      console.log(data);
      console.log(this.isselectvip.ID, "this.isselectvip");
      let newData = [];
      if (
        this.rechargestatus == 5 ||
        this.rechargestatus == 4 ||
        this.rechargestatus == 9 ||
        this.isselectvip.ID == undefined
      ) {
        newData = data.filter((item) => item.NAME != "积分支付" && item.NAME != "欠款");
      } else {
        newData = data;
      }
      this.rechargeListList = newData;
      this.payName = newData[0].NAME;
      this.PaytypeId = newData[0].ID;

      this.isAllowClickFun();
    },
    barcodepayopenState(data) {
      if (data.success) {
        let IsCheck = data.data.IsCheck;
        if (IsCheck) {
          this.showbarCodePay = true;
        } else {
          this.$message("请联系客服开通扫码支付");
          return;
        }
      }
    },
    gparameterstate(data) {
      let zeroterpees;
      if (data.success && Object.keys(data.data.CompanyConfig).length > 0) {
        let RATE = data.data.CompanyConfig.INTEGRALTYPERATE;
        this.value = RATE;

        this.allowsaledate = data.data.CompanyConfig.ALLOWSALEDATE;
        console.log("配置信息", data.data.CompanyConfig.ZEROTYPE);
        zeroterpees = data.data.CompanyConfig.ZEROTYPE;
        let autosendpaysms = data.data.CompanyConfig.AUTOSENDPAYSMS;
        console.log(autosendpaysms);
        this.IsSms = autosendpaysms;

        if (zeroterpees == 0) {
          console.log("输出的参数是多少", zeroterpees);
          this.receivableprice = this.totalprice.price;
          this.payprice = this.totalprice.price;
          this.ZEROTYPE = 0;
        } else if (zeroterpees == 1) {
          this.receivableprice = parseInt(this.totalprice.price);
          this.payprice = parseInt(this.totalprice.price);
          this.ZEROTYPE = this.totalprice.price - parseInt(this.totalprice.price);
        } else if (zeroterpees == 2) {
          this.receivableprice = parseInt(this.totalprice.price * 10) / 10;
          this.payprice = parseInt(this.totalprice.price * 10) / 10;
          this.ZEROTYPE = this.totalprice.price - parseInt(this.totalprice.price * 10) / 10;
        } else if (zeroterpees == 3) {
          this.receivableprice = parseInt(Math.round(this.totalprice.price));
          this.payprice = parseInt(Math.round(this.totalprice.price));
          this.ZEROTYPE = this.totalprice.price - parseInt(Math.round(this.totalprice.price));
        } else if (zeroterpees == 4) {
          this.receivableprice = parseFloat(this.totalprice.price).toFixed(1);
          this.payprice = parseFloat(this.totalprice.price).toFixed(1);
          this.ZEROTYPE = this.totalprice.price - parseFloat(this.totalprice.price).toFixed(1);
        }
        console.log("抹零的值是多少的", this.ZEROTYPE, this.payprice);
      }
    }
  },
  methods: {
    showKeXianFun() {
      nscreenexCodeFun(4, String(this.totalprice.price));
    },
    closeModal(type) {
      nscreenexCodeFun(6);
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModalrecharge");
      }
    },
    toggletab(index, item) {
      this.curtab = index;
      this.PaytypeId = item.ID;
      console.log(this.payprice, this.receivableprice);
      this.payName = item.NAME;
      if (item.NAME == "现金") {
        this.disabled = false;
        this.payprice = this.payprice;
        this.$nextTick(() => {
          this.$refs["cash"].focus();
        });
      } else {
        this.payprice = this.receivableprice;
        this.disabled = true;
        this.pocketmoney = "0.00";
      }
      console.log(this.payprice);
      this.isAllowClickFun();
    },
    handleInput2(e) {
      this.discountMoney = this.onlyInputnumber(this.discountMoney);
      let totlePrice = (this.totalprice.price - this.discountMoney - 0).toFixed(2);
      this.receivableprice = parseFloat(totlePrice);
      this.payprice = parseFloat(totlePrice);
      nscreenexCodeFun(4, this.receivableprice);
    },
    handleInput3(e) {
      this.payprice = this.onlyInputnumber(this.payprice);
      this.pocketmoney = parseFloat(this.payprice - this.receivableprice).toFixed(2);
    },
    onSubmit() {
      if (!this.PaytypeId) {
        this.$message.error("请选择支付方式");
        return;
      }
      if (this.IsUseVipPassword == true && this.rechargestatus != 9) {
        let pwd = this.isselectvip.PASSWORD != undefined ? this.isselectvip.PASSWORD : "888888";

        this.$prompt("请输入会员密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "password",
          inputPattern: /^\d{6}$/,
          inputPlaceholder: "请输入六位数的密码",
          inputErrorMessage: "请输入六位数的密码"
        })
          .then(({ value }) => {
            let cvalue = pwd != "888888" ? CRYPTO.MD5(value).toString() : "888888";
            if (pwd == cvalue) {
              this.CashPayok();
            } else {
              this.$message.error("密码错误");
            }
          })
          .catch(() => {});
      } else {
        this.CashPayok();
      }
    },
    CashPayok() {
      let date = new Date();
      let dateHours = date.getHours();
      let dateMinutes = date.getMinutes();
      let dateSeconds = date.getSeconds();
      let logtime = this.value1 + " " + dateHours + ":" + dateMinutes + ":" + dateSeconds;
      let getlogtime = new Date(logtime).getTime();
      this.value2 = getlogtime;

      if (this.checkedreceipt) {
        this.$store.state.recharge.isPrintsatus = true;
      } else {
        this.$store.state.recharge.isPrintsatus = false;
      }

      console.log(this.barcodepaystatus);
      if (this.payName == "扫码支付" && this.barcodepaystatus != 1) {
        this.$store.dispatch("getbarcodepayopenState", {}).then(() => {});
        return;
      }
      nscreenexCodeFun(5);
      this.barcodepaystatus = "";
      let IsSms = this.IsSms == true ? 1 : 0;

      let a = this.receivableprice,
        b = this.isselectvip.INTEGRAL,
        c = this.isselectvip.MONEY,
        d = 0,
        e = 0;
      if (this.payName == "积分支付") {
        if (this.isselectvip.ID != undefined) {
          if (this.splitIntegral) {
            if (b >= a) {
              d = a;
              e = 0;
            } else if (b + c >= a) {
              d = b;
              e = a - b;
            } else if (c >= a) {
              d = 0;
              e = a;
            }
          } else {
            if (c >= a) {
              e = a;
              d = 0;
            }
          }
        } else if (this.isselectvip.ID == undefined) {
          // 不选择会员  直接本单金额
          e = a;
          d = 0;
        }
      } else {
        e = a;
        d = 0;
      }
      console.log("竞技积分：" + d, "储值积分：" + e);
      let payMoney = e,
        payIntegral = d;


      let comdata = {
        PaytypeId: this.PaytypeId,
        payName: this.payName,
        IsSms: IsSms,
        PayIntegral: payIntegral,
        payMoney: payMoney,
        checkedreceipt: this.checkedreceipt
      };

      switch (this.rechargestatus) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          comdata = Object.assign({}, comdata, {
            Money: payMoney,
            DiscountMoney: 0,
            BillDate: this.value2
          });
          break;
        case 4:
          comdata = {
            PayTypeId: this.PaytypeId,
            IsSms: IsSms,
            AddMoney: payMoney,
            BillDate: this.value2
          };
          break;
        case 5:
          comdata = Object.assign({}, comdata, {
            PayMoney: payMoney,
            IsCheck: 1,
            AddMoney: payMoney,
            PayTypeID: this.PaytypeId,
            BillDate: this.value2
          });
          break;
        case 6:
          comdata = {
            PayTypeID: this.PaytypeId,
            IsSmd: IsSms,
            AddMoney: payMoney,
            GiftMoney: 0,
            GetIntegral: 0,
            BillDate: this.value2
          };
          break;
        default:
          comdata = Object.assign({}, comdata, {
            PayMoney: payMoney,
            IsCheck: 1,
            BillDate: this.value2
          });
      }

      this.$emit("CashRecharge", comdata);
    },
    barcodePaycomback(data) {
      this.barcodepaystatus = 1;
      this.CashPayok();
    },
    isClickRL(item) {
      if (this.isselectvip.ID == undefined && item.NAME == "欠款") return false;
      return true;
    },
    isAllowClickFun() {
      this.isAllowClick = true;
      if (this.rechargeListList.length == 0) this.isAllowClick = false;
      let dd = 0;
      console.log(this.splitIntegral);
      if (this.splitIntegral) {
        dd =
          this.isselectvip.ID == undefined
            ? 0
            : Number(this.isselectvip.MONEY) + Number(this.isselectvip.INTEGRAL);
      } else {
        dd = this.isselectvip.ID == undefined ? 0 : Number(this.isselectvip.MONEY);
      }

      if (this.rechargeListList[this.curtab].NAME == "积分支付" && this.payprice > dd) {
        this.isAllowClick = false;
      }
    }
  },
  components: { barCodePay },
  mounted() {
    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = date.getMonth() + 1;
    console.log(dateMonth);
    let dateDate = date.getDate();

    (this.value1 = dateYear + "-" + dateMonth + "-" + dateDate), console.log(this.value1);
    this.$store.dispatch("getrechargeList", {
      codestatus: this.isselectvip.ID != undefined ? 1 : "",
      IsHide: "0"
    });
    this.$store.dispatch("getparameterstate");
  }
};
</script>

<style scoped>
.rleft-li {
  line-height: 40px;
  padding: 0 10px;
}
.rleft-li .title {
  min-width: 90px;
}
.rleft-li > input {
  height: 40px;
}

.rright {
  height: 260px;
  overflow-x: hidden;
  overflow-y: auto;
}
.rright-li {
  position: relative;
  display: inline-block;
  padding: 2px;
  border: 1px solid #f1a027;
  overflow: hidden;
  background: #fffff1;
  border-radius: 5px;
  width: 21%;
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
  cursor: pointer;
}
.rright-li img {
  width: 35px;
  height: 35px;
  margin-top: 5px;
}

.spaceBorder-left {
  border-left: 6px solid rgb(224, 220, 220);
}
.dateborder >>> .el-input__inner {
  border: solid 1px #fff !important;
  padding-right: 0px !important;
  padding-left: 0px !important;
  padding: 0px !important;
}
/* .dateborder{
    position: relative;
}
.datename{
    position: absolute;
    right: 0px;
} */

.showpayList ul li {
  display: inline-block;
  color: #666;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  float: left;
  cursor: pointer;
  padding: 5px 5px;
  font-size: 12px;
  position: relative;
}

.showpayList ul li .paylistsock {
  padding: 6px 6px;
  overflow: hidden;
  background: #fffff1;
  border-radius: 5px;
  height: 76px;
  width: 76px;
  position: relative;
}

.showpayList ul li .paylistsock p {
  margin: 4px 0 0;
  font-size: 14px;
}

.list-group-item .selected {
  position: absolute;
  top: 0px;
  right: 0px;
}
.list-group-item .selected i {
  position: absolute;
  left: -18px;
  top: -32px;
  /* top: 10px; */
  color: #fff;
  font-size: 18px;
}

.isselectPay {
  position: absolute;
  color: #ff5722;
  top: 2px;
  right: 1px;
  font-size: 18px;
}
</style>
