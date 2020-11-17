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
                    <span class="title">快速消费</span>
                    <span class="commodityc-top-text" @click="resetData">清空页面</span>
                  </div>
                  <div>
                    <dropdown
                      @getmemberID="getmemberID"
                      @changeMemberIDnull="changeMemberIDnull"
                      :details="Object.keys(selmember).length > 0 ? selmember : new Object()"
                      :isCloseMemer="closeMember"
                    ></dropdown>
                    <el-form label-width="80px" class="fastc_top">
                      <el-row style="padding-top: 10px">
                        <el-form-item
                          label="消费金额"
                          style="margin-right: 10px; margin-bottom: 10px"
                        >
                          <el-input
                            @input="changeMoney"
                            v-model="form.money"
                            placeholder="0.00"
                            type="number"
                            autocomplete="off"
                            class="full-width"
                          >
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>

                        <el-form-item
                          label="支付方式"
                          style="
                            margin-bottom: 10px;
                            padding-top: 10px;
                            border-top: 1px dashed #ddd;
                          "
                        >
                          <el-radio v-model="payType" label="0">储值积分</el-radio>
                          <el-radio v-if="splitIntegral == true" v-model="payType" label="1">
                            竞技积分
                          </el-radio>
                        </el-form-item>
                      </el-row>
                    </el-form>
                    <div class="fastc-foot" style="position: absolute; bottom: 110px; width: 100%">
                      <div>
                        <el-select
                          class="g-public-multi-select"
                          v-model="form.SaleEmpId"
                          placeholder="请选择销售员"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.slamenid"
                            :label="item.label"
                            :value="item.slamenid"
                          ></el-option>
                        </el-select>
                      </div>
                      <div style="margin-top: 10px">
                        <el-input
                          placeholder="请输入备注"
                          :rows="2"
                          v-model="form.Remark"
                          autocomplete="off"
                          class="full-width"
                        ></el-input>
                      </div>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                      <div class="footer_top" style="margin-bottom: 10px">
                        <div
                          style="
                            margin: 12px 0;
                            width: 100%;
                            height: 40px;
                            background: #fff;
                            line-height: 40px;
                          "
                        >
                          <el-row>
                            <el-col :span="12" style="text-align: center">
                              <el-checkbox v-model="checkedreceipt">打印小票</el-checkbox>
                            </el-col>
                            <el-col :span="12" style="text-align: center">
                              <el-checkbox v-model="IsSms">短信通知</el-checkbox>
                            </el-col>
                          </el-row>
                        </div>

                        <el-row>
                          <el-col :span="24" style="text-align: right">
                            <el-button
                              type="primary"
                              style="margin-right: 10px"
                              @click="submitForm"
                              :loading="submitLoading"
                            >
                              收款
                              <i v-if="form.payMoney != ''">： ￥{{ form.payMoney }}</i>
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
                      :style="`text-align:center; display: table; width: 100%; height: ${clientHeight}px`"
                    >
                      <span style="display: table-cell; padding-top: 200px">
                        <img
                          src="static/images/delf.png"
                          style="width: 180px; height: 170px; display: inline-block"
                          alt=""
                        />
                        <div style="color: #868686; margin-top: 20px">
                          快速输入金额，消费一步到位
                        </div>
                      </span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
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
import { mapState, mapGetters } from "vuex";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";

import MIXINS_CHECKOUT from "@/mixins/checkout";
import MIXINS_MONEY from "@/mixins/money";
import { getUserInfo, getHomeData } from "@/api/index";
import MIXINS_CLEAR from "@/mixins/clearAllData";
import CRYPTO from "crypto-js";
import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
  mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER, MIXINS_MONEY.MONEY_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      closeMember: true,
      payType: "0",
      VipId: "",
      options: [],
      loading: false,
      form: {
        money: "",
        Remark: "",
        payMoney: 0,
        SaleEmpId: ""
      },
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      shopName: getUserInfo().CompanyName,
      clientHeight: document.body.clientHeight - 50,
      IsSms: false,
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      IsUseVipPassword: getUserInfo().CompanyConfig.ISUSEVIPPASSWORD,
      memberInfo: {},
      checkedreceipt: false,
      submitLoading: false
    };
  },
  created() {
    //生命周期里接收参数
  },
  computed: {
    ...mapGetters({
      employeeList: "employeeList",
      shopList: "shopList",
      shopListState: "shopListState",
      fastPayMoneyState: "fastPayMoneyState"
    })
  },
  watch: {
    fastPayMoneyState(data) {
      this.submitLoading = false;
      if (data.success) {
        this.$store.dispatch("selectingMember", {});
        this.$message({ message: "消费成功", type: "success" });
        let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print3");
        let jsonPrintData = JSON.parse(printRules);

        jsonPrintData.autoPrint = this.checkedreceipt ? true : false;
        localStorage.setItem(SYSTEM_INFO.PREFIX + "Print3", JSON.stringify(jsonPrintData));

        if (this.checkedreceipt) {
          this.testPrint(data.data.BillId, jsonPrintData);
        } else {
          this.resetData();
        }
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    //销售员获取数据方法
    employeeList(data) {
      this.options = [];
      let employeemen = data;
      for (var i in employeemen) {
        this.options.push({
          slamenid: employeemen[i].ID,
          label: employeemen[i].NAME
        });
      }
    }
  },
  methods: {
    testPrint(billId, jsonPrintData) {
      let billInfo = [
        {
          label: "结账单号：",
          value: billId
        },
        {
          label: "结账日期：",
          value: dayjs().format("YYYY-MM-DD hh:mm")
        }
      ];

      let saleInfo = [
        {
          label: "消费金额：",
          value: this.form.money
        },
        {
          label: "支付方式：",
          value: this.payType == "0" ? "储值积分" : "竞技积分"
        }
      ];

      let vipInfo = jsonPrintData.vipInfo;
      vipInfo[0].value = this.memberInfo.CODE;
      vipInfo[1].value = this.memberInfo.NAME;
      vipInfo[2].value =
        this.payType == "0"
          ? this.memberInfo.MONEY - Number(this.form.money)
          : this.memberInfo.MONEY;
      if (this.splitIntegral) {
        vipInfo.push({
          label: "竞技积分",
          value:
            this.payType == "1"
              ? this.memberInfo.INTEGRAL - Number(this.form.money)
              : this.memberInfo.INTEGRAL,
          isShow: vipInfo[2].isShow
        });
      }

      jsonPrintData.remark.value = this.form.Remark;

      if (this.form.SaleEmpId != "") {
        let saleEmployName = this.options.filter((item) => item.slamenid == this.form.SaleEmpId);
        jsonPrintData.saleEmploy.value = saleEmployName[0].label;
      }

      let printData = Object.assign(
        {},
        jsonPrintData,
        { billInfo: billInfo },
        { saleInfo: saleInfo }
      );
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
      getDayindata(printData, "Print3", qresurl);

      this.resetData();
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
        console.log([...this.shopList]);
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
    //删除会员信息，子传父事件
    changeMemberIDnull(e) {
      this.VipId = "";
      this.memberInfo = {};
      this.form.payMoney = this.form.money;
    },
    changeMoney() {
      this.form.payMoney = this.form.money;
    },
    //清空页面方法
    resetData() {
      this.VipId = "";
      this.memberInfo = {};
      this.form = {
        money: "",
        Remark: "",
        payMoney: 0,
        SaleEmpId: ""
      };

      this.$store
        .dispatch("selectingMember", {
          isArr: false,
          data: new Object()
        })
        .then(() => {
          this.VipId = "";
        });
    },
    //选择会员信息
    getmemberID(id, data) {
      this.VipId = id;
      this.memberInfo = data;
      this.$store.dispatch("selectingMember", {
        isArr: false,
        data: data
      });
    },
    //提交跳到收银页面
    submitForm() {
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == "210040302");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("您还没有获得相关权限 !");
      } else {
        if (this.form.money == "") {
          this.$message.warning("请输入金额 !");
          return;
        }

        if (this.VipId == "") {
          this.$message.warning("请选择会员 !");
          return;
        }

        nscreenexCodeFun(4, String(this.form.Money));

        if (this.IsUseVipPassword == true) {
          console.log(this.memberInfo);

          let pwd = this.memberInfo.PASSWORD != undefined ? this.memberInfo.PASSWORD : "888888";

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
      }
    },
    CashPayok() {
      this.submitLoading = true;
      let sendData = {
        VipId: this.VipId,
        SaleEmpId: this.form.SaleEmpId,
        Remark: this.form.Remark,
        IsSms: this.IsSms ? 1 : 0,
        PayIntegral: this.payType == 1 ? this.form.money : 0,
        PayMoney: this.payType == 0 ? this.form.money : 0
      };
      this.$store.dispatch("fastPayMoney", sendData);
    }
  },
  beforeCreate() {
    let list1 = this.$store.state.employee.employeeList;
    if (list1.length == 0) {
      this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
    }
  },
  //钩子函数
  mounted() {
    let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print3");
    let jsonPrintData = JSON.parse(printRules);
    this.checkedreceipt = jsonPrintData.autoPrint;

    this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
  }
};
</script>
<style scoped>
.butmoney {
  height: 50px;
  width: 100%;
  background: #fff;
  margin-top: 10px;
  line-height: 50px;
}
.coupont-list-top-money {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  margin-left: 5px;
}
.coupont-list-top-allmoney {
  margin-left: 5px;
  font-size: 5px !important;
  font-family: Microsoft YaHei;
  color: rgba(255, 255, 255, 1);
}

.discount-title {
  margin-left: 5px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background: #3399ff;
  color: #fff;
  border-radius: 100%;
  font-size: 4px;
}
.discount {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  margin-left: 12px;
}
.timescountc_left_footer {
  position: absolute;
  bottom: 0px;
  width: 100%;
  /* left: 10px;
    right: 10px; */
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
  /* height: 150px; */
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
.fastcMoney {
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.selectList {
  height: 50px;
  width: 100%;
  line-height: 50px;
  border-bottom: solid 1px #f9fafc;
}
.selectList ul li {
  float: left;
  width: 50%;
  text-align: center;
}
.selectList-fists {
  width: 70px;
  height: 40px;
  text-align: center;
  border-bottom: solid 1px #3ea9ff;
  margin: 0 auto;
}
.select-list {
  width: 100%;
  margin: 0 auto;
}
.select-list ul li {
  float: left;
  margin-right: 7px;
  /* margin-left: 12px; */
  margin-top: 10px;
}
.secect-border {
  border: solid 2px #f8493b !important;
}
.select-list-cont {
  position: relative;
  height: 400px;
  overflow: auto;
}
.select-list-bottom {
  height: 100px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 100px;
}
.coupont ul li {
  float: left;
  margin-right: 15px;
  margin-top: 8px;
}
.coupont-list {
  height: 100px;
  border: solid 2px #3ea9ff;
  color: #fff;
}
.coupont-list-top {
  height: 64px;
  background: #3ea9ff;
}
.coupont-list-bottom {
  height: 34px;
  width: 160px;
  line-height: 35px;
  margin-left: 15px;
  font-size: 11px;
  color: #666666;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.showEit-input {
  border: none !important;
  margin-left: 30px;
}
.showEit-input1 {
  border: none !important;
  margin-left: 5px;
}
.gright {
  position: absolute;
  right: 5px;
}
.el-icon-close {
  position: absolute;
  right: 0;
  font-size: 20px;
  margin-top: 10px;
}
.fastc-foot >>> .el-input__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #444444;
}
.fastc-foot >>> .el-textarea__inner {
  border: 1px solid #fff !important;
  background: #fff;
}
.commodity-right {
  position: relative;
  width: 100%;
  height: 100%;
}
.search_sock {
  height: 50px;
  line-height: 50px;
  background: #fff;
  width: 100%;
  border-left: solid 1px #ebedf0;
  border-bottom: solid 1px #ebedf0;
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
.FastcTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
.timescountc_left_footer >>> .el-input__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #444444;
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
input::-webkit-input-placeholder {
  color: #c0c4cc;
  font-size: 12px;
}
.priceTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
</style>
