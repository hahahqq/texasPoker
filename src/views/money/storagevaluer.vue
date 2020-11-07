<template>
  <el-container>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <sidebarMenu :activePath="activePath" :routesList="routesList" :width="100"></sidebarMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="f-botton-fssock" style="height: 100%">
          <div class="f-botton-fs" style="height: 100%">
            <div
              style="
                position: absolute;
                top: 0px;
                bottom: 0px;
                background: rgb(248, 248, 249);
                left: 100px;
                right: 0px;
              "
            >
              <el-row :gutter="24" style="height: 100%; margin-right: 0px; margin-left: 0px">
                <el-col
                  :span="8"
                  style="height: 100%; position: relative; padding-right: 0px; padding-left: 0px"
                >
                  <div class="commodityc-top">
                    <span class="title">会员清单</span>
                    <span class="commodityc-top-text" @click="closeModal">清空页面</span>
                  </div>
                  <div>
                    <dropdown
                      @changeMemberIDnull="changeMemberIDnull"
                      @getmemberID="getmemberID"
                      :details="Object.keys(selmember).length > 0 ? selmember : new Object()"
                    ></dropdown>
                    <el-form label-width="80px" class="fastc_top">
                      <el-row class="fastc_top_cont">
                        <el-form-item
                          label="充值金额"
                          style="margin-right: 10px; margin-bottom: 10px"
                        >
                          <el-input
                            v-model="payMoney"
                            autocomplete="off"
                            class="full-width"
                            @keyup.native="inputpayMoney"
                            placeholder="请输入充值金额"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item
                          label="赠送金额"
                          style="
                            margin-right: 10px;
                            margin-bottom: 10px;
                            padding-top: 10px;
                            border-top: 1px dashed #ddd;
                          "
                        >
                          <el-input
                            v-model="giveMoney"
                            autocomplete="off"
                            @keyup.native="inputgiveMoney"
                            class="full-width"
                            placeholder="请输入赠送金额"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item
                          label="合计金额"
                          style="
                            margin-right: 10px;
                            margin-bottom: 10px;
                            padding-top: 10px;
                            border-top: 1px dashed #ddd;
                          "
                        >
                          <el-input
                            v-model="totalMoney"
                            autocomplete="off"
                            class="full-width"
                            placeholder="0.00"
                            :disabled="true"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-row>
                    </el-form>
                    <div class="timescountc_left_footer" ref="footer">
                      <div style="position: absolute; bottom: 60px; width: 100%">
                        <div>
                          <el-select
                            class="g-public-multi-select"
                            v-model="value"
                            placeholder="请选择销售员"
                            multiple
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </div>
                        <div style="margin-top: 10px">
                          <el-input
                            v-model="ruleFormsock.Remark"
                            autocomplete="off"
                            :rows="2"
                            placeholder="请输入备注"
                            class="full-width"
                          ></el-input>
                        </div>
                      </div>
                      <div class="footer_top" style="margin-bottom: 10px">
                        <el-row>
                          <el-col :span="24" style="text-align: right">
                            <el-button
                              type="primary"
                              style="margin-right: 10px"
                              @click="Rechargeok"
                              :loading="submitLoading"
                            >
                              收款
                              <i v-if="payMoney != ''">： ¥ {{ payMoney }}</i>
                            </el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="16"
                  style="padding-left: 0px; padding-right: 0px; background: #f4f5fa"
                >
                  <div class="commodity-right">
                    <div class="search_sock">
                      <el-row>
                        <el-col :span="24" class="shop">
                          <span class="name">{{ shopInfo.SHOPNAME }}</span>
                          <span class="">
                            <el-popover
                              placement="bottom"
                              width="140"
                              trigger="hover"
                              popper-class="no-padding"
                            >
                              <el-button
                                style="border: none !important"
                                @click="changeShop()"
                                class="full-width"
                                icon="icon-exchange"
                              >
                                &nbsp;&nbsp;切换店铺
                              </el-button>
                              <el-button
                                style="border: none !important"
                                class="full-width no-m-left border-top"
                                icon="icon-user"
                              >
                                &nbsp;&nbsp; 账号信息
                              </el-button>
                              <el-button
                                style="border: none !important"
                                @click="logout()"
                                class="full-width no-m-left border-top"
                                icon="icon-signout"
                              >
                                &nbsp;&nbsp;退出账号
                              </el-button>
                              <a slot="reference" class="hitem">
                                <i class="icon-reorder"></i>
                              </a>
                            </el-popover>
                          </span>
                        </el-col>
                      </el-row>
                    </div>

                    <div
                      v-if="storagevaluerroyaltyState.data.GiftList.length == 0"
                      :style="`text-align:center; display: table; width: 100%; height: ${clientHeight}px`"
                    >
                      <span style="display: table-cell; padding-top: 200px">
                        <img
                          src="static/images/delf.png"
                          style="width: 180px; height: 170px; display: inline-block"
                          alt=""
                        />
                        <div style="color: #868686; margin-top: 20px">充值多多，优惠多多</div>
                      </span>
                    </div>

                    <div v-else :style="`display: table; width: 100%; height: ${clientHeight}px`">
                      <div class="text-muted margin-sm">
                        <div class="font-16 p-bottom-xs">充值赠送内容:</div>

                        <ul style="width: 600px">
                          <li
                            class="rechargeWayItem"
                            v-for="(item, index) in storagevaluerroyaltyState.data.GiftList"
                            :key="index"
                            @click="choseCurWay(item, index)"
                            :style="`background: ${
                              curtab == index ? '#ecf5ff' : '#ffffff'
                            }; border: 1px solid ${curtab == index ? '#b3d8ff' : '#ddd'} `"
                          >
                            <div class="addMoney" style="">充{{ item.ADDMONEY }} 元</div>
                            <div class="giftMoney" style="">送 {{ item.MONEY }} 元</div>

                            <div
                              v-if="curtab == index"
                              :class="{ 'selected': curtab == index }"
                              style="
                                border-bottom: 30px solid #137deb;
                                width: 0;
                                height: 0;
                                border-left: 30px solid transparent;
                              "
                            >
                              <i class="el-icon-check"></i>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>

          <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="800px">
            <recharge
              @closeModalrecharge="showRecharge = false"
              :totalprice="{ price: payMoney, discount: 0, title: '充值日期' }"
              :isselectvip="VipId ? vipIds : ''"
              @CashRecharge="CashRecharge"
              :rechargestatus="9"
              ref="SurveyForm"
            ></recharge>
          </el-dialog>

          <el-dialog
            title="请选择门店"
            :visible.sync="isShowShop"
            width="300px"
            :before-close="handleClose"
          >
            <div class="shopListClass">
              <ul>
                <li v-for="(item, index) in theshopList" :key="index" @click="setShop(item)">
                  {{ item.SHOPNAME }}
                </li>
              </ul>
            </div>
          </el-dialog>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { GOODS_IMGURL } from "@/util/define";
import { mapState, mapGetters } from "vuex";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getHomeData, getUserInfo } from "@/api/index";
import recharge from "@/components/Recharge/Recharge";
import MIXINS_CHECKOUT from "@/mixins/checkout";
import MIXINS_MONEY from "@/mixins/money";
import MIXINS_CLEAR from "@/mixins/clearAllData";

import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
  mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER, MIXINS_MONEY.MONEY_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      getgoodsIMGURL: "",
      searchText: "",
      payMoney: "",
      giveMoney: "",
      totalMoney: "",
      VipId: "",
      datalistval: {},
      ruleFormsock: {
        getfastcExtract: "",
        Remark: "",
        ExtractMoney: "",
        AllselecteSaleEmpId: ""
      },
      dialogFormVisible: false,
      showRecharge: false,
      options: [],
      value: "",
      isneedsaler: "",
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      shopName: getUserInfo().CompanyName,
      clientHeight: document.body.clientHeight - 50,
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      curtab: -1,
      payName: "",
      checkedreceipt: false,
      submitLoading: false
    };
  },
  computed: {
    ...mapGetters({
      employeeList: "employeeList",
      storagevaluerroyaltyState: "storagevaluerroyaltyState",
      saveVipRechargeState: "saveVipRechargeState",
      marketingRechargedetailed: "marketingRechargeStatus",
      shopList: "shopList",
      shopListState: "shopListState"
    })
  },
  watch: {
    storagevaluerroyaltyState(data) {
      if (data.success) {
        console.log("充值赠送列表", data.data);
      }
    },
    saveVipRechargeState(data) {
       this.submitLoading = false
      if (data.success) {
        this.$message.success("充值成功");

        let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print1");
        let jsonPrintData = JSON.parse(printRules);

        if (jsonPrintData.autoPrint || this.checkedreceipt) {
          this.testPrint(data.data.BillId, jsonPrintData);
        } else {
          this.closeModal();
        }
      } else {
        this.$message(data.message);
      }
    },
    employeeList(data) {
      this.options = [];
      for (var i in data) {
        this.options.push({
          value: data[i].ID,
          label: data[i].NAME
        });
      }
    }
  },
  created() {
    //生命周期里接收参数
    let getInfo = getUserInfo();
    this.isneedsaler = getInfo.CompanyConfig.ISNEEDSALER;
  },
  methods: {
    testPrint(billid, jsonPrintData) {
      let billInfo = [
        {
          label: "充值单号：",
          value: billid
        },
        {
          label: "充值日期：",
          value: dayjs().format("YYYY-MM-DD hh:mm")
        }
      ];

      let saleInfo = [
        {
          label: "充值金额：",
          value: this.payMoney
        },
        {
          label: "赠送金额：",
          value: this.giveMoney
        },
        {
          label: "充值合计：",
          value: Number(this.payMoney) + Number(this.giveMoney)
        },
        {
          label: "支付方式：",
          value: this.payName
        }
      ];

      let vipInfo = jsonPrintData.vipInfo;
      vipInfo[0].value = this.vipIds.CODE;
      vipInfo[1].value = this.vipIds.NAME;
      vipInfo[2].value = this.vipIds.MONEY + Number(this.payMoney) + Number(this.giveMoney);
      if (this.splitIntegral) {
        vipInfo.push({
          label: "竞技积分",
          value: this.vipIds.INTEGRAL,
          isShow: vipInfo[2].isShow
        });
      }

      jsonPrintData.remark.value = this.ruleFormsock.Remark;

      let printData = Object.assign(
        {},
        jsonPrintData,
        { billInfo: billInfo },
        { saleInfo: saleInfo }
      );
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
      getDayindata(printData, "print1", qresurl);

      this.closeModal();
    },
    choseCurWay(item, index) {
      this.payMoney = item.ADDMONEY;
      this.giveMoney = item.MONEY;
      this.curtab = index;
      this.totalMoney = item.ADDMONEY + item.MONEY
    },
    handleClose(done) {
      this.isShowShop = false;
    },
    logout: function () {
      //退出登录
      var _this = this;
      this.$confirm("确认退出吗?", "提示")
        .then(() => {
          _this.$store.dispatch("toLogOut").then(() => {
            _this.clearAllData();
            _this.$router.push("/login");
          });
        })
        .catch(() => {
          console.log("logout");
        });
    },
    setShop(item) {
      //切换店铺
      this.$store.dispatch("choosingShop", item).then(() => {
        this.isShowShop = false;
        this.clearAllData();
        this.defaultData();
        this.$router.push({
          path: "/home"
        });
      });
    },
    defaultData() {
      let homeData = getHomeData();
      if (homeData.shop) {
        this.shopInfo = Object.assign({}, homeData.shop);
      }
      this.UserName = getUserInfo().UserName;
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList", {});
      }
    },
    changeShop() {
      let userInfo = getUserInfo();
      if (userInfo.CODE2 == "boss") {
        this.theshopList = [...this.shopList];
      } else {
        this.theshopList = [];
        for (let i = 0; i < userInfo.ShopList.length; i++) {
          if (userInfo.ShopList[i].ISPURVIEW == 1) {
            this.theshopList.push({
              ID: userInfo.ShopList[i].SHOPID,
              NAME: userInfo.ShopList[i].SHOPNAME
            });
          }
        }
      }
      this.isShowShop = true;
    },
    // 删除会员信息， 子传父事件
    changeMemberIDnull(e) {
      this.VipId = "";
    },
    getmemberID(id, data) {
      this.VipId = id;
      this.vipIds = data;
      console.log(data);
      this.$store.dispatch("selectingMember", { isArr: false, data: data });
    },
    inputpayMoney() {
      //支付金额
      this.giveMoney = 0;

      let gList = [...this.storagevaluerroyaltyState.data.GiftList];
      console.log(gList);
      let maxArr = [];
      for (let i = 0; i < gList.length; i++) {
        if (this.payMoney >= gList[i].ADDMONEY) {
          maxArr.push(gList[i]);
        }
      }

      maxArr.sort(function (a, b) {
        return a.ADDMONEY - b.ADDMONEY;
      });

      if (maxArr[maxArr.length - 1] != undefined) {
        this.giveMoney = maxArr[maxArr.length - 1].MONEY;
      }

      this.payMoney = this.onlyInputnumber(this.payMoney);
      this.totalMoney = Number(this.payMoney) + Number(this.giveMoney);
    },
    inputgiveMoney() {
      //赠送金额
      this.giveMoney = this.onlyInputnumber(this.giveMoney);
      this.totalMoney = Number(this.payMoney) + Number(this.giveMoney);
    },
    closeModal() {
      this.payMoney = "";
      this.payName = "";
      this.giveMoney = "";
      this.totalMoney = "";
      this.value = "";
      this.Remark = "";
      this.ruleFormsock.AllselecteSaleEmpId = "";
      this.ruleFormsock.Remark = "";
      this.VipId = "";
      this.datalistval = {};
      this.$store
        .dispatch("selectingMember", {
          isArr: false,
          data: new Object()
        })
        .then(() => {
          this.VipId = "";
        });
    },
    Rechargeok() {
      if (this.VipId == "") {
        this.$message("请选择会员");
        return;
      }
      if (this.isneedsaler == true) {
        if (this.value.length > 0) {
        } else {
          this.$message("请选择销售员");
          return;
        }
      }
      if (this.payMoney == "") {
        this.$message("请輸入充值金額");
        return;
      }
      nscreenexCodeFun(4, String(this.payMoney));
      this.showRecharge = true;
    },
    CashRecharge(data) {
      console.log(data);
      this.checkedreceipt = data.checkedreceipt;
      let {checkedreceipt, ...newData} = data;

      let param = this.value,
        str = ""; // 销售员
      for (let i in param) {
        str += param[i] + ",";
      }
      if (str.length > 0) {
        //去掉最后一个逗号
        str = str.substring(0, str.length - 1);
      }

      this.submitLoading = true

      this.showRecharge = false;
      this.payName = newData.payName;
      let sendData = {
        VipId: this.VipId,
        Remark: this.ruleFormsock.Remark,
        GiftMoney: this.giveMoney,
        SaleEmpList: str,
        PayTypeID: newData.PaytypeId,
        IsSmd: newData.IsSms,
        AddMoney: this.payMoney,
        BillDate: new Date().getTime()
      };

      this.$store.dispatch("saveVipRecharge", sendData);
    }
  },
  components: {
    recharge
  },
  beforeCreate() {
    let list1 = this.$store.state.employee.employeeList;
    if (list1.length == 0) {
      this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
    }
  },
  mounted() {
    this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
    this.$store.dispatch("getstoragevaluerroyaltyState", {});
  }
};
</script>
<style scoped>
.giftMoney {
  font-size: 12pt;
  color: #aaa;
  margin-top: 10px;
}
.addMoney {
  font-size: 13pt;
  color: #333;
  font-weight: bold;
}
.rechargeWayItem {
  width: 120px;
  text-align: center;
  border-radius: 4px;
  padding: 10px 16px;
  margin: 5px;
  float: left;
  border: 1px solid #fbc4c4;
  background: #f2f2f2;
  position: relative;
}
.rechargeWayItem:hover {
  background: #fef0f0;
  cursor: pointer;
}
.rechargeWayItem .selected {
  position: absolute;
  bottom: 0px;
  right: 0px;
  border-bottom: 30px solid #137deb;
  border-left: 30px solid transparent;
   width: 0;
   height: 0;

}
.rechargeWayItem .selected i {
  position: absolute;
  left: -18px;
  top: 10px;
  color: #fff;
  font-size: 18px;
}

.timescountc_left_footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.employee_ms .el-form-item__content {
  width: 70%;
}

.f-botton-fs .el-form-item__label {
  text-align: left !important;
}

.f-botton-fs .fastc_top {
  margin-top: 10px;
  background: #fff;
}

.f-botton-fssock .el-dialog__body {
  padding: 5px 20px;
}

.employeetitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  overflow: hidden;
  color: #130606;
  text-align: center;
}

.storageTop {
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.fastc_top_cont {
  padding-top: 10px;
}
.commodityc-left {
  height: 50px;
  line-height: 50px;
  width: 100%;
  background: #fff;
  margin-top: 25px;
}
.timescountc_left_footer >>> .el-input__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #444444;
}
.timescountc_left_footer >>> .el-textarea__inner {
  border: 1px solid #fff !important;
  background: #fff;
}
.StorageTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
  cursor: pointer;
}
.search_sock {
  height: 50px;
  line-height: 50px;
  background: #fff;
  width: 100%;
  border-left: solid 1px #ebedf0;
  border-bottom: solid 1px #ebedf0;
}
.priceTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
</style>
