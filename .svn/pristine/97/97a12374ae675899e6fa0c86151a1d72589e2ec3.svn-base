<template>
  <el-container>
    <el-header style="height: 50px; padding: 0">
      <headerPage></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <el-main
          :style="`height:${height}px; padding: 0; margin: 10px; background:#fff`"
          v-loading="loadingTemplate"
          element-loading-text="赛事详情数据加载中..."
          element-loading-background="rgba(242,242,242, 0.8)"
        >
          <div style="padding: 16px; background: #f2f2f2; width: 100%">
            <div style="float: left; width: 100%; line-height: 32px; margin-bottom: 10px">
              <span>
                <span style="padding: 2px 6px; border-radius: 6px; background: #f00; color: #fff">
                  SNG
                </span>
                <span
                  class="MATCHNAME"
                  style="color: #333; font-size: 14px; font-weight: bold; margin-left: 6px"
                >
                  {{ BillObj.MATCHNAME }}
                </span>
              </span>

              <span style="float: right">
                <el-button size="small" @click="editBill()">编辑</el-button>
                <el-button size="small" @click="cancelGame(0)">取消比赛</el-button>
                <el-button
                  size="small"
                  type="primary"
                  :disabled="buyVipList.length == 0"
                  @click="receivePrize()"
                >
                  领奖
                </el-button>
                <el-button size="small" @click="showGameOverDialog = true" type="danger">
                  比赛结束
                </el-button>
              </span>
            </div>
            <div style="font-size: 12px; width: 100%; display: table">
              <el-row :gutter="10" style="line-height: 32px">
                <el-col :span="8">开赛时间：{{ new Date(BillObj.PLAYTIME) | timehf }}</el-col>
                <el-col :span="7">比赛桌号：{{ BillObj.DESKNAME }}</el-col>
                <el-col :span="7">
                  {{ BillObj.CHARGESTYPE == 0 ? "服务费积分：" : "服务费金额：" }}
                  {{
                    BillObj.CHARGESTYPE == 0
                      ? BillObj.TOTALMONEY * BillObj.CHARGESRATE +
                        " ( 比例 " +
                        BillObj.CHARGESRATE * 100 +
                        "% ) "
                      : BillObj.CHARGESMONEY + " 元"
                  }}
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="8">参赛积分：{{ BillObj.BUYINPRICE }}</el-col>
                <el-col :span="7">参赛人数：{{ BillObj.VIPCOUNT }}</el-col>
                <el-col :span="7">总买入积分：{{ BillObj.TOTALMONEY }}</el-col>
              </el-row>
            </div>
          </div>

          <el-tabs
            type="card"
            v-model="tabs"
            @tab-click="selectTabFun(tabs)"
            style="margin-top: 10px"
          >
            <el-tab-pane name="0" label="比赛登记"></el-tab-pane>
            <el-tab-pane name="1" label="参赛人员"></el-tab-pane>
            <el-tab-pane name="2" label="奖池情况"></el-tab-pane>
          </el-tabs>

          <!-- 比赛登记 -->
          <el-form
            :inline="false"
            :model="ruleForm"
            ref="ruleForm"
            label-width="110px"
            v-if="tabs == 0"
            class="ruleFormStyle"
          >
            <!-- 会员选择 -->
            <div class="vue-dropdown default-theme">
              <div class="search-module clearfix" v-if="inputShow == true">
                <input
                  class="search-text"
                  v-model="searchText"
                  @keyup="search_mb"
                  placeholder="输入会员手机号/姓名/卡号"
                />
                <span style="position: absolute; right: 20px; line-height: 80px; color: #aaa">
                  该客人还未办卡,
                  <el-button type="text" @click="showAddNew = true">新建会员</el-button>
                </span>
              </div>

              <div
                class="ssmemberul"
                v-if="inputShow == false"
                style="border: 1px solid #f2f2f2; padding: 10px 0"
              >
                <div class="ssmemberul-cont">
                  <div class="ssmemberul-imgUrl">
                    <img
                      :src="memberdetails.IMAGEURL"
                      onerror="this.src='static/images/merberpic.png'"
                    />
                  </div>
                  <div class="ssmemberul-massge">
                    <div>
                      <span class="ssmemberul-cont-name">{{ memberdetails.NAME }}</span>
                      <span class="ssmemberul-cont-ka">{{ memberdetails.LEVELNAME }}</span>
                    </div>

                    <div class="ssmemberul-cont-text">
                      <span style="width: 120px; float: left">卡号 : {{ memberdetails.CODE }}</span>
                      <span style="margin-left: 20px">手机号 : {{ memberdetails.MOBILENO }}</span>
                    </div>

                    <div class="ssmemberul-cont-text">
                      <span style="width: 120px; float: left">
                        储值积分 :
                        <i style="color: #f00">{{ memberdetails.MONEY }}</i>
                      </span>
                      <span style="margin-left: 20px">
                        竞技积分 :
                        <i style="color: #f00">{{ memberdetails.INTEGRAL }}</i>
                      </span>
                    </div>
                  </div>

                  <i class="el-icon-delete" @click="cancelSignUp"></i>

                  <span
                    class="rechargeMoney"
                    style="position: absolute; right: 15px"
                    @click="rechargeFun()"
                  >
                    充值
                    <i class="el-icon-arrow-right"></i>
                  </span>
                </div>
              </div>

              <ul class="list-module" v-if="datalist.length != 0">
                <li v-for="(item, index) in datalist" @click="appClick(item)" :key="index">
                  <img :src="item.showgoodsimg" onerror="this.src='static/images/merberpic.png'" />
                  <div class="itmeright">
                    <div class="item_dright-left">
                      <div class="name">{{ item.NAME }}</div>
                      <div class="phone">{{ item.MOBILENO }}</div>
                    </div>
                    <div class="item_dright-right" style="line-height: 24px">
                      <div>储值积分：{{ item.MONEY }}</div>
                      <div>竞技积分：{{ item.INTEGRAL }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :xs="24" :sm="12">
                <el-form-item label="报名积分">
                  <el-input
                    v-model="BillObj.BUYINNEEDPRICE"
                    disabled
                    size="small"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="优惠积分">
                  <el-input
                    placeholder="请输入优惠积分或选择优惠券"
                    class="coupons"
                    size="small"
                    v-model="couponIntegral"
                    @input="modifyCouponMoney(couponIntegral)"
                    style="width: 100%"
                  >
                    <el-button slot="append" type="primary" @click="clickCouponNo">
                      优惠券
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :xs="24" :sm="12">
                <el-form-item :label="splitIntegral ? '扣减储值积分' : '扣减积分'">
                  <el-input
                    v-model="formIntegral.money_1"
                    disabled
                    size="small"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item :label="splitIntegral ? '扣减后储值积分' : '扣减后积分'">
                  <el-input
                    v-model="formIntegral.money_2"
                    disabled
                    size="small"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" v-if="splitIntegral">
              <el-col :xs="24" :sm="12">
                <el-form-item label="扣减竞技积分">
                  <el-input
                    v-model="formIntegral.integral_1"
                    disabled
                    size="small"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="12">
                <el-form-item label="扣减后竞技积分">
                  <el-input
                    v-model="formIntegral.integral_2"
                    disabled
                    size="small"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="text-align: right; width: 100%; margin-top: 16px; display: table">
              <el-button @click="$router.push({ path: '/game/match/index' })">取消</el-button>
              <el-button type="primary" @click="startSignUp" :loading="singUpLoading">
                确定报名
              </el-button>
            </div>
          </el-form>

          <!-- 参赛人员 -->
          <div v-show="tabs == 1">
            <el-table
              size="small"
              :data="buyVipList"
              style="width: 100%"
              :height="tableHeight"
              header-row-class-name="bg-F1F2F3"
            >
              <el-table-column label="会员信息">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.IMAGEURL"
                    alt=""
                    style="
                      float: left;
                      border-radius: 8px;
                      width: 40px;
                      height: 40px;
                      margin-right: 8px;
                    "
                  />
                  <span style="height: 40px; width: 112px">
                    <i
                      class="text-3399ff pull-left inline-block"
                      style="
                        color: #2589ff;
                        width: 102px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      {{ scope.row.VIPNAME ? scope.row.VIPNAME : " " }}
                    </i>
                    <i
                      class="text-3399ff pull-left inline-block"
                      style="
                        width: 92px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      {{ scope.row.VIPCODE }}
                    </i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="BUYMODE"
                label="买入方式"
                width="90"
                align="center"
              ></el-table-column>
              <el-table-column prop="QTY" label="手数" align="center"></el-table-column>
              <el-table-column prop="MONEY" label="买入积分" align="center"></el-table-column>
              <el-table-column prop="SIGNMODE" label="报名方式" align="center"></el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="exitMatch(scope.row, scope.$index)">
                    退赛
                  </el-button>
                  <el-button
                    size="small"
                    type="text"
                    @click="receivePrizeVip(scope.row, scope.$index)"
                  >
                    领奖
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 奖池情况 -->
          <div v-show="tabs == 2">
            <el-table
              size="small"
              :data="RewardObj"
              style="width: 100%"
              :height="tableHeight"
              header-row-class-name="bg-F1F2F3"
            >
              <el-table-column prop="REWARDNAME" label="名次"></el-table-column>
              <el-table-column
                prop="INTEGRAL"
                label="获得积分"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column prop="REWARDRATE" label="比例" width="100" align="center">
                <template slot-scope="scope">{{ scope.row.REWARDRATE * 100 }} %</template>
              </el-table-column>
              <el-table-column
                prop="CONTESTQY"
                label="获得大师分"
                width="100"
                align="center"
              ></el-table-column>
              <el-table-column prop="VIPNAME" label="获奖人"></el-table-column>
              <el-table-column prop="VIPCODE" label="获奖卡号"></el-table-column>
              <el-table-column prop="VIPMOBILENO" label="获奖手机号"></el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="text"
                    @click="cancelReward(scope.row, scope.$index)"
                  >
                    取消
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 编辑赛事 -->
          <el-dialog
            title="编辑赛事"
            :visible.sync="showEditDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="60%"
          >
            <editPage
              @closeModal="closeModal()"
              :dataType="{
                info: BillObj,
                RewardList: EventRewardObj,
                RewardNum: RewardObj.length,
                buyVipNum: buyVipList.length
              }"
            ></editPage>
          </el-dialog>

          <!-- 比赛结束 -->
          <el-dialog
            title="比赛结束"
            :visible.sync="showGameOverDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="60%"
          >
            <gameOver
              @closeModalOver="showGameOverDialog = false"
              @resetCloseModalOver="closeAllDialog"
              :dataType="{ BillObj: BillObj, RewardObj: RewardObj }"
            ></gameOver>
          </el-dialog>

          <!-- 领取奖励 -->
          <el-dialog
            title="领取奖励"
            :visible.sync="showRewardVipDialog"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="60%"
            :before-close="closeRewardDialog"
          >
            <reward
              @closeModalReward="showRewardVipDialog = false"
              @resetCloseModalReward="closeAllRewardDialog"
              :dataType="{
                BillObj: BillObj,
                RewardObj: RewardObj,
                EventRewardObj: EventRewardObj,
                vipInfo: vipInfo
              }"
              ref="clearRewardMemberData"
            ></reward>
          </el-dialog>

          <!-- 优惠券 -->
          <el-dialog title="优惠卷" :visible.sync="showCouponList" append-to-body width="54%">
            <couponList
              @CouponListclick="isCouponListclick"
              :money="BillObj.BUYINNEEDPRICE"
              :dealData="{ money: BillObj.BUYINNEEDPRICE, vipID: memberdetails.ID }"
            ></couponList>
          </el-dialog>

          <!-- 会员充值  -->
          <el-dialog
            title="会员充值"
            :visible.sync="showRechargeDialog"
            append-to-body
            width="600px"
          >
            <vipRecharge
              @closeVipRecharge="showRechargeDialog = false"
              @referData="referData"
              :dataType="{ memberdetails: memberdetails }"
            ></vipRecharge>
          </el-dialog>

          <!-- 新增会员 -->
          <el-dialog
            title="新增会员"
            :visible.sync="showAddNew"
            append-to-body
            width="800px"
            style="max-width: 100%"
          >
            <add-new-member
              @closeModal="showAddNew = false"
              @resetList="showAddNew = false"
            ></add-new-member>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>


<script>
let _ = require("lodash");
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import { VIPIMAGESIMG } from "@/util/define";
import MIXINS_GAME from "@/mixins/game.js";
import CRYPTO from "crypto-js";
import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
  mixins: [MIXINS_GAME.GAME_MENU],
  data() {
    return {
      height: window.innerHeight - 70,
      tableHeight: document.body.clientHeight - 280,
      vipInfo: {},
      ruleForm: {},
      tabs: "0",
      BillObj: {
        PLAYTIME: new Date().getTime(),
        CHARGESRATE: 0,
        CHARGESMONEY: 0,
        BUYINPRICE: 0,
        VIPCOUNT: 0,
        TOTALMONEY: 0,
        MATCHNAME: "赛事名称"
      },
      loadingDialog: false,

      couponIntegral: "",
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      IsUseVipPassword: getUserInfo().CompanyConfig.ISUSEVIPPASSWORD,
      buyVipList: [],
      exitVipInfo: {},
      RewardObj: [],
      EventRewardObj: [],
      showEditDialog: false,
      formIntegral: {
        integral_1: "",
        integral_2: "",
        money_1: "",
        money_2: ""
      },
      searchText: "",
      inputShow: true,
      datalist: [],
      pageData: {
        PN: 1,
        Filter: ""
      },
      memberdetails: {},
      isshowtatus: false,
      editType: -1,
      singUpLoading: false,
      showGameOverDialog: false,
      showRewardVipDialog: false,
      showCouponList: false,
      showRechargeDialog: false,
      showAddNew: false,
      loadingTemplate: false
    };
  },
  computed: {
    ...mapGetters({
      getGameDetailsState: "getGameDetailsState",
      sngCancelGameState: "sngCancelGameState",
      sngExitGameState: "sngExitGameState",
      getEventsListAllState: "getEventsListAllState",
      getTableListState: "getTableListState",
      getssmemberdListState: "ssmemberdListState",
      sngStartSignUpState: "sngStartSignUpState",
      sngCancelVipRewardState: "sngCancelVipRewardState",
      memberItemState: "memberState"
    })
  },
  watch: {
    memberItemState(data) {
      console.log(data);
      if (data.success) {
        data.data.obj.LEVELNAME = data.data.obj.DISCOUNTNAME
          ? data.data.obj.DISCOUNTNAME
          : "无折扣";
        this.appClick(data.data.obj);
      }
    },
    sngCancelVipRewardState(data) {
      if (data.success) {
        this.$message({ message: "操作成功！", type: "success" });
        this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });
        this.cancelSignUp();
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    sngStartSignUpState(data) {
      this.singUpLoading = false;
      if (data.success) {
        this.$message({ message: "报名成功！", type: "success" });
        this.testPrint();
        this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });

        this.cancelSignUp();
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    getssmemberdListState(data) {
      if (data.success) {
        if (this.isshowtatus) {
          this.datalist = [...data.data.PageData.DataArr];
          for (let i = 0; i < this.datalist.length; i++) {
            if (this.datalist[i].IMAGEURL == undefined || this.datalist[i].IMAGEURL == "") {
              this.datalist[i].showgoodsimg = VIPIMAGESIMG + this.datalist[i].ID + ".png";
            } else {
              this.datalist[i].showgoodsimg = this.datalist[i].IMAGEURL;
            }
          }
        } else {
          this.datalist = [];
        }
      }
    },
    sngExitGameState(data) {
      if (data.success) {
        this.$message({
          message: "【 " + this.exitVipInfo.name + " 】退赛成功 ！",
          type: "success"
        });
        this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    sngCancelGameState(data) {
      this.loadingDialog = false;
      if (data.success) {
        this.$emit("resetList");
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    getGameDetailsState(data) {
      this.loadingTemplate = false;
      if (data.success) {
        this.BillObj = data.data.BillObj;
        this.buyVipList = data.data.BuyObj;
        this.RewardObj = data.data.RewardObj;
        this.EventRewardObj = data.data.EventRewardObj;
      }
    }
  },
  methods: {
    testPrint() {
      let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print4");
      let jsonPrintData = JSON.parse(printRules);

      if (jsonPrintData.autoPrint) {
        let billInfo = [
          {
            label: "比赛单号：",
            value: this.BillObj.BILLNO
          },
          {
            label: "比赛日期：",
            value: dayjs(this.BillObj.PLAYTIME).format("YYYY-MM-DD hh:ss")
          }
        ];

        let payWayStr = "",
          moneyStr = "",
          IntegralStr = "",
          ishaveDot = false;
        if (this.splitIntegral) {
          if (this.formIntegral.money_1 != 0) {
            moneyStr = "储值积分:" + this.formIntegral.money_1;
          }
          if (this.formIntegral.integral_1 != 0) {
            IntegralStr = "竞技积分:" + this.formIntegral.integral_1;
          }
          if (this.formIntegral.money_1 != 0 && this.formIntegral.integral_1 != 0) {
            ishaveDot = true;
          }
        }

        let addDot = ishaveDot ? "、" : ""

        let saleInfo = [
          { label: "赛事名称：", value: this.BillObj.MATCHNAME },
          { label: "买入方式：", value: "BUYIN" },
          { label: "扣减积分：", value: this.BillObj.BUYINNEEDPRICE },
          { label: "扣减方式：", value: moneyStr + addDot + IntegralStr }
        ];

        let vipInfo = jsonPrintData.vipInfo;
        vipInfo[0].value = this.memberdetails.CODE;
        vipInfo[1].value = this.memberdetails.NAME;

        if (this.splitIntegral) {
          vipInfo[2].value = this.memberdetails.MONEY - this.formIntegral.money_1;
          vipInfo.push({
            label: "竞技积分",
            value: this.memberdetails.INTEGRAL - this.formIntegral.integral_1,
            isShow: vipInfo[2].isShow
          });
        } else {
          vipInfo[2].value = this.memberdetails.MONEY - this.formIntegral.money_1;
        }

        jsonPrintData.remark.value = "";
        let printData = Object.assign(
          {},
          jsonPrintData,
          { billInfo: billInfo },
          { saleInfo: saleInfo },
          { vipInfo: vipInfo }
        );
        let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
        getDayindata(printData, "print4", qresurl);
      }
    },
    rechargeFun() {
      this.showRechargeDialog = true;
      this.$store.dispatch("getstoragevaluerroyaltyState", {});
    },
    referData(data) {
      // 充值成功后，重新获取会员详情
      if (this.memberdetails.ID != data) {
        this.showRechargeDialog = false;
        return;
      }
      this.$store.dispatch("getMemberItem", { ID: data }).then(() => {
        this.showRechargeDialog = false;
      })
    },
    clickCouponNo() {
      if (this.memberdetails.ID != undefined) {
        this.showCouponList = true;
        this.$store.dispatch("getcouponListState", { VipId: this.memberdetails.ID, PN: 1 });
      } else {
        this.$message({ message: "请先选择会员 !", type: "warning" });
      }
    },
    isCouponListclick(data) {
      if (JSON.stringify(data) != "{}") {
        this.couponIntegral = data.couponcodemoney;
      }
      this.showCouponList = false;
    },
    closeRewardDialog() {
      this.showRewardVipDialog = false;
      this.$nextTick(() => {
        this.$refs.clearRewardMemberData.clearDataFun();
      });
    },
    closeModal() {
      this.showEditDialog = false;
      this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });
    },
    closeAllRewardDialog() {
      this.showRewardVipDialog = false;
      this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });
    },
    closeAllDialog() {
      this.showGameOverDialog = false;
      this.$emit("resetList");
    },
    receivePrize() {
      this.showRewardVipDialog = true;
      this.vipInfo = {};
    },
    receivePrizeVip(row, index) {
      // 参赛人员 -- 领奖
      this.showRewardVipDialog = true;
      this.vipInfo = row;
    },
    startSignUp() {
      if (this.memberdetails.ID == undefined) {
        this.$message({ message: "请先选择会员 !", type: "warning" });
        return;
      }

      if (this.IsUseVipPassword == true) {
        let pwd = this.memberdetails.PASSWORD != undefined ? this.memberdetails.PASSWORD : "888888";

        this.$prompt("", "请输入会员密码", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "password",
          inputPattern: /^\d{6}$/,
          inputPlaceholder: "请输入六位数的密码",
          inputErrorMessage: "请输入六位数的密码"
        })
          .then(({ value }) => {
            let cvalue = value != "888888" ? CRYPTO.MD5(value).toString() : "888888";
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
      let sendData = {
        VipId: this.memberdetails.ID,
        BillId: this.BillObj.BILLID,
        DiscountMoney: this.couponIntegral == "" ? 0 : this.couponIntegral,
        BuyinMoney: this.formIntegral.money_1,
        Payintegral: this.formIntegral.integral_1
      };
      this.$store.dispatch("sngStartSignUp", sendData).then(() => {
        this.singUpLoading = true;
      });
    },
    cancelSignUp() {
      this.memberdetails = {};
      this.couponIntegral = "";
      this.searchText = "";
      this.formIntegral = {
        integral_1: "",
        integral_2: "",
        money_1: "",
        money_2: ""
      };
      this.tabs = 0;
      this.inputShow = true;
    },
    search_mb() {
      this.isshowtatus = true;
      this.searchfun2();
    },
    getMemberData() {
      this.$store.dispatch("getSsmemberdList", this.pageData);
    },
    searchfun2() {
      if (!this.searchText) {
        return;
      }
      this.pageData.Filter = this.searchText;
      this.getMemberData();
    },
    appClick(data) {
      this.inputShow = false;
      this.searchText = "";
      this.datalist = [];
      this.memberdetails = data;
      this.integralGroupFun(data, this.BillObj.BUYINNEEDPRICE);
    },
    editBill() {
      this.$store.dispatch("getEventsListAll", { Type: 0 }).then(() => {
        this.$store.dispatch("getTableList", { ShopId: getHomeData().shop.ID }).then(() => {
          console.log(this.BillObj);
          this.showEditDialog = true;
        });
      });
    },
    cancelReward(row, idx) {
      // 取消奖励
      this.$confirm(
        "确认取消" + "【 " + row.VIPNAME + " 】会员奖励 ？ 取消之后获奖积分将退回",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store.dispatch("sngCancelRewardVip", {
            BillId: this.BillObj.BILLID,
            VipId: row.VIPID
          });
        })
        .catch(() => {});
    },
    exitMatch(row, idx) {
      //退出比赛
      this.$confirm("确认将" + "【 " + row.VIPNAME + " 】退出当前比赛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exitVipInfo = {
            idx: idx,
            name: row.VIPNAME
          };
          this.$store.dispatch("sngExitGame", { BillId: this.BillObj.BILLID, VipId: row.VIPID });
        })
        .catch(() => {});
    },

    modifyCouponMoney(couponIntegral) {
      this.integralGroupFun(this.memberdetails, this.BillObj.BUYINNEEDPRICE - couponIntegral);
    },
    integralGroupFun(data, BUYINPRICE) {
      // a: 报名积分， b: 储值积分， c: 竞技积分
      // d1: 扣减储值积分， d2: 扣减后储值积分
      // c1: 扣减竞技积分， c2: 扣减后竞技积分
      // splitIntegral  是否区分竞技积区 和 储值积分   0 : 区分  1 ：不区分
      let a = BUYINPRICE,
        b = data.MONEY,
        c = data.INTEGRAL,
        d1 = 0,
        d2 = 0,
        c1 = 0,
        c2 = 0,
        splitIntegral = this.splitIntegral;
      if (splitIntegral) {
        if (b >= a) {
          d1 = a;
          d2 = b - a;
          c1 = 0;
          c2 = c;
        } else {
          if (c >= a) {
            d1 = 0;
            d2 = 0;
            c1 = a;
            c2 = c - a;
          } else if (b + c >= a) {
            d1 = b;
            d2 = 0;
            c1 = a - b;
            c2 = c - c1;
          } else if (b + c < a) {
            this.$message({
              message: "会员余额不足"
            });
          }
        }
      } else {
        if (b >= a) {
          d1 = a;
          d2 = b - a;
          c1 = 0;
          c2 = 0;
        } else {
          this.$message({
            message: "会员余额不足"
          });
        }
      }

      this.formIntegral = {
        integral_1: c1,
        integral_2: c2,
        money_1: d1,
        money_2: d2
      };
    },
    selectTabFun(tabs) {
      console.log(this.memberdetails);
      if (this.memberdetails.ID == undefined) {
        this.searchText = "";
        this.datalist = [];
      }
    },
    cancelGame(Type) {
      console.log(Type);
      let title = Type == 0 ? "取消" : "结束";
      this.$confirm("确认" + title + "【 " + this.BillObj.MATCHNAME + " 】赛事?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("sngCancelOrGameOver", { BillId: this.BillObj.BILLID, Type: Type })
            .then(() => {
              this.loadingDialog = true;
            });
        })
        .catch(() => {});
    }
  },
  components: {
    editPage: () => import("./edit.vue"),
    gameOver: () => import("./gameOver.vue"),
    reward: () => import("./reward.vue"),
    couponList: () => import("@/components/Recharge/CouponList"),
    vipRecharge: () => import("@/components/Recharge/vipRecharge"),
    addNewMember: () => import("@/components/member/add"),
    headerPage: () => import("@/components/header")
  },
  mounted() {
    console.log(window.location.href.includes("?"));
    let queryUrl = this.getSearchString();
    this.$store.dispatch("getGameDetails", { BillId: queryUrl.BILLID }).then(() => {
      this.loadingTemplate = true;
    });
  }
};
</script>

<style lang="scss" scoped>
.ruleFormStyle >>> .el-form-item {
  margin-bottom: 0;
}
.coupons >>> .el-input-group__append {
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
}
.vue-dropdown.default-theme {
  position: relative;
  &._self-show {
    display: block !important;
  }

  .search-module {
    position: relative;

    .search-text {
      width: 100%;
      height: 80px;
      padding-right: 2em;
      padding-left: 20px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid #f2f2f2;
      border-radius: 6px;
      //   border: none !important;
      font-size: 12px;
      color: rgb(204, 192, 200);

      &:focus {
        border-color: #2198f2;
      }
    }

    .search-icon {
      position: absolute;
      top: 24%;
      right: 0.5em;
      color: #aaa;
    }
  }

  .list-module {
    max-height: 260px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ddd;
    width: 100%;
    z-index: 999;
    border-top: 0;

    li {
      padding: 10px;
      overflow: hidden;
      // border-bottom: 1px solid #ccc;
      position: relative;

      img {
        width: 40px;
        height: 40px;
        float: left;
        margin-right: 6px;
      }
      .itmeright {
        align-items: center;
        display: flex;
        width: 90%;
        position: absolute;
        left: 0;
        box-sizing: border-box;
        padding-left: 50px;
        padding-right: 6px;
      }

      &._self-hide {
        display: none;
      }
      margin-top: 0.5em;
      padding: 0.5em;
      &:hover {
        cursor: pointer;
        color: #fff;
        background: #00a0e9;
      }
    }
  }
}

.ssmemberul {
  width: 100%;
  background: #fff;
  border-radius: 6px;
}
.ssmemberul-cont {
  width: 100%;
  padding-left: 15px;
  display: flex;
  align-items: center;
}
.ssmemberul-imgUrl img {
  height: 40px;
  width: 40px;
  border-radius: 100%;
}
.ssmemberul-massge {
  margin-left: 10px;
  font-size: 12px;
}
.el-icon-delete {
  margin-left: 20px;
  font-size: 16px;
}
.rechargeMoney {
  position: absolute;
  right: 15px;
}
.el-icon-delete:hover,
.rechargeMoney:hover {
  color: #409eff;
  cursor: pointer;
}

.ssmemberul-cont-name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.ssmemberul-cont-ka {
  margin-left: 30px;
  font-size: 8px !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  background: rgba(37, 137, 255, 1);
  border-radius: 2px;
  padding: 2px 4px;
}
.ssmemberul-cont-text {
  font-size: 12px;
  font-family: HelveticaCyr Upright;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin-top: 5px;
}
.ssmemberul-cont-phone {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 300;
  color: rgba(153, 153, 153, 1);
}
.item_dright-left .name {
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 50%;
  overflow: hidden;
  display: inline-block;
  font-weight: bold;
}
.item_dright-left .phone {
  color: #fff;
  font-size: 12px;
}
.item_dright-right {
  width: 30%;
  text-align: left;
  color: #fff;
  font-size: 12px;
}
.item_dright-left {
  width: 40%;
  margin-left: 10px;
}
input::-webkit-input-placeholder {
  color: #c0c4cc;
  font-size: 14px;
  // padding-left: 20px;
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
</style>
