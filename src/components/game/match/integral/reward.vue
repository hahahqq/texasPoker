<template>
  <div>
    <div style="padding: 16px; background: #f8f8f8; width: 100%">
      <div style="float: left; width: 100%; margin-bottom: 10px">
        <span>
          <span style="padding: 2px 6px; border-radius: 6px; background: #f00; color: #fff">
            积分
          </span>
          <span
            class="MATCHNAME"
            style="color: #333; font-size: 14px; font-weight: bold; margin-left: 6px"
          >
            {{ BillObj.MATCHNAME }}
          </span>
        </span>
      </div>
      <div style="font-size: 12px; width: 100%; display: table">
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="8">开赛时间：{{ new Date(BillObj.PLAYTIME) | timehf }}</el-col>
          <el-col :span="8">比赛桌号：{{ BillObj.DESKNAME }}</el-col>

          <el-col :span="7">参赛情况：{{ BillObj.VIPCOUNT }} 人</el-col>
        </el-row>

        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="8">买入总积分：{{ BillObj.TOTALMONEY }}</el-col>

          <el-col :span="8">
            {{ BillObj.CHARGESTYPE == 0 ? "服务费积分：" : "服务费金额：" }}
            {{
              BillObj.CHARGESTYPE == 0
                ? BillObj.CHARGESMONEY +
                  " ( 比例 " +
                  BillObj.CHARGESRATE * 100 +
                  "% ) "
                : BillObj.CHARGESMONEY + " 元"
            }}
          </el-col>

          <el-col :span="7">奖池总积分：{{ BillObj.REWARDMONEY }}</el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">已兑换积分：{{ BillObj.EXCHANGEINTEGRAL }}</el-col>

          <el-col :span="7">未兑换积分：{{ BillObj.NOTEXCHANGEINTEGRAL }}</el-col>
        </el-row>
      </div>
    </div>

    <!-- 会员选择 -->
    <div
      class="ssmemberul"
      v-if="!inputShow"
      style="
        border: 1px solid #f2f2f2;
        height: 80px;
        padding: 10px 0;
        margin-top: 20px;
        width: 100%;
        position: relative;
      "
    >
      <div class="ssmemberul-cont" style="padding-left: 20px">
        <div class="ssmemberul-imgUrl">
          <img
            :src="memberdetails.IMAGEURL"
            style="height: 45px; width: 45px"
            onerror="this.src='static/images/merberpic.png'"
          />
        </div>
        <div class="ssmemberul-massge">
          <span class="ssmemberul-cont-name">{{ memberdetails.VIPNAME }}</span>

          <div class="ssmemberul-cont-text">
            <span style="width: 120px; float: left">卡号 : {{ memberdetails.VIPCODE }}</span>
            <span style="margin-left: 20px">手机号 : {{ memberdetails.VIPMOBILENO }}</span>
          </div>
          <div class="ssmemberul-cont-text">
            <span style="width: 120px; float: left">
              储值积分 :
              <i style="color: #f00">{{ memberdetails.MONEY }}</i>
            </span>
          </div>
        </div>
        <i class="el-icon-delete" style="position: absolute; right: 15px" @click="clearDataFun"></i>
      </div>
    </div>

    <div v-else v-clickOutSide="handleClose">
      <el-select
        v-model="memberdetails"
        v-if="inputShow"
        filterable
        remote
        reserve-keyword
        :remote-method="remoteMethod"
        :loading="loadingMember"
        loading-text="数据加载中..."
        :default-first-option="true"
        @change="searchTextFun(memberdetails)"
        placeholder="请输入会员手机号"
        popper-class="selectWidth"
        class="selectStyle"
        style="width: 100%"
      >
        <el-option
          v-for="(item, index) in noPrizeList"
          :key="index"
          :value="item"
          style="height: auto; line-height: normal; border-bottom: 1px solid #ddd"
          class="ssmemberul"
        >
          <div style="padding: 10px 0">
            <div class="ssmemberul-cont">
              <div class="ssmemberul-imgUrl">
                <img :src="item.IMAGEURL" onerror="this.src='static/images/merberpic.png'" />
              </div>

              <div class="newItmeright">
                <div class="item_dright-left">
                  <div class="name">{{ item.VIPNAME }}</div>
                  <div class="phone">{{ item.VIPMOBILENO }}</div>
                </div>

                <div class="item_dright-right">
                  <div style="line-height: 48px">储值积分：{{ item.MONEY }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-option>

        <div slot="empty" v-if="isEmptyData">
          <div style="line-height: 60px; width: 100%; color: #888; text-align: center">
            暂无搜索结果，
            <i style="color: #409eff; cursor: pointer">添加为会员</i>
          </div>
        </div>
      </el-select>
    </div>

    <el-form
      :inline="false"
      :model="ruleForm"
      ref="ruleForm"
      label-width="110px"
      class="ruleFormStyle"
    >
      <el-row :gutter="10" style="margin-top: 20px">
        <el-col :xs="24" :sm="11">
          <el-form-item label="买入积分">
            <el-input
              v-model="ruleForm.buyInPrice"
              disabled
              placeholder="买入积分"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="2">&nbsp;</el-col>
        <el-col :xs="24" :sm="11">
          <el-form-item label="已兑积分">
            <el-input
              v-model="ruleForm.ContestQty"
              disabled
              placeholder="已兑积分"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :xs="24" :sm="11">
          <el-form-item label="退还记分牌">
            <el-input
              v-model="ruleForm.returnChipsQty"
              @input="getRateFun(ruleForm.returnChipsQty)"
              placeholder="请输入退还记分牌"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="2">&nbsp;</el-col>
        <el-col :xs="24" :sm="11">
          <el-form-item label="返还积分">
            <el-input
              v-model="ruleForm.RewardMoney"
              @input="getIntegralFun(ruleForm.RewardMoney)"
              placeholder="请输入兑换比例"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="24">
          <el-form-item label="备注说明">
            <el-input
              v-model="ruleForm.Remark"
              placeholder="请输入备注"
              class="coupons"
              size="small"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div style="text-align: right; width: 100%; margin-top: 10px; display: table">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="success" :lading="loadingReward" @click="submitReward(1)">
        确定并继续兑换
      </el-button>
      <el-button type="primary" :lading="loadingReward" @click="submitReward(0)">
        确定兑换
      </el-button>
    </div>

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
        :dealType="{ type: 'add', searchText: searchText }"
      ></add-new-member>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import { VIPIMAGESIMG } from "@/util/define";

import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
  props: ["dataType"],
  data() {
    return {
       showAddNew: false,
      BillObj: {
        MATCHNAME: ""
      },
      levelList: [],
      ruleForm: {
        RewardName: "",
        buyInPrice: "",
        ContestQty: "",
        RewardIntegral: "",
        REWARDRATE: "",
        returnChipsQty: "",
        Remark: ""
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
      loadingReward: false,
      rewardType: 0,
      rechargeRate: 1,
      buyVipList: [],
      loadingMember: false,
      isEmptyData: false,
      noPrizeList: []
    };
  },
  computed: {
    ...mapGetters({
      integralSubmitRewardState: "integralSubmitRewardState",
      getGameDetailsState: "getGameDetailsState",
      integralBuyObjState: "integralBuyObjState",
      getNoPrizeListState: "getNoPrizeListState"
    })
  },
  watch: {
    getNoPrizeListState(data) {
      console.log(data);
      this.loadingMember = false;
      if (data.success) {
        this.noPrizeList = data.data.BuyObj;
        this.isEmptyData = data.data.BuyObj.length == 0 ? true : false;
      }
    },
    getGameDetailsState(data) {
      if (data.success) {
        this.BillObj = data.data.BillObj;
        this.rechargeRate = this.BillObj.CHIPSQTY / this.BillObj.BUYINPRICE;
        this.$store.dispatch("integralBuyObj", { BillId: this.BillObj.BILLID });
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    integralSubmitRewardState(data) {
      this.loadingReward = false;
      if (data.success) {
        this.$message({ message: "领奖成功 ！", type: "success" });

        this.clearDataFun();
        if (this.rewardType == 0) {
          this.$emit("resetCloseModalReward");
        } else {
          this.$store.dispatch("getGameDetails", { BillId: this.BillObj.BILLID });
        }
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    dataType(data) {
      this.defaultItem();
    },
    integralBuyObjState(data) {
      if (data.success) {
        this.buyVipList = data.data.BuyObj;
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    }
  },
  methods: {
    handleClose() {
      this.noPrizeList = [];
    },
    remoteMethod(query) {
      this.searchText = query;
      this.$store
        .dispatch("getNoPrizeList", {
          VipFilter: query,
          IsReward: -1,
          BillId: this.BillObj.BILLID
        })
        .then(() => {
          this.loadingMember = true;
        });
    },
    searchTextFun(item) {
      this.inputShow = false;
      this.ruleForm.buyInPrice = item.BUYINMONEY;
      this.ruleForm.ContestQty = item.REWARDMONEY;
    },
    testPrint() {
      let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print6");
      let jsonPrintData = JSON.parse(printRules);

      if (jsonPrintData.autoPrint) {
        let billInfo = [
          {
            label: "领奖单号：",
            value: this.BillObj.BILLNO
          },
          {
            label: "领奖日期：",
            value: dayjs(this.BillObj.PLAYTIME).format("YYYY-MM-DD hh:ss")
          }
        ];

        let saleInfo = [
          { label: "赛事名称：", value: this.BillObj.MATCHNAME },
          { label: "比赛名次：", value: this.buyTypeName },
          { label: "扣减积分：", value: this.signUpIntegral }
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
        getDayindata(printData, "Print6", qresurl);
      }
    },
    getRateFun(returnChipsQty) {
      this.ruleForm.RewardMoney = (this.ruleForm.returnChipsQty / this.rechargeRate).toFixed(2);
    },
    getIntegralFun(rate) {
      console.log(this.rechargeRate);
      this.ruleForm.returnChipsQty = this.ruleForm.RewardMoney * this.rechargeRate;
    },
    submitReward(type) {
      this.rewardType = type;
      if (this.memberdetails.VIPID == undefined) {
        this.$message({ message: "请先选择要兑换的会员 ！", type: "warning" });
        return;
      }

      let sendData = {
        VipId: this.memberdetails.VIPID,
        BillId: this.BillObj.BILLID,
        Remark: this.ruleForm.Remark,
        RewardMoney: this.ruleForm.RewardMoney,
        ContestQty: 0
      };
      this.$store.dispatch("integralSubmitReward", sendData).then(() => {
        this.loadingReward = true;
      });
    },
    clearDataFun() {
      this.ruleForm = {
        RewardName: "",
        ContestQty: "",
        RewardIntegral: "",
        REWARDRATE: "",
        Remark: ""
      };
      this.memberdetails = {};
      this.noPrizeList = []
      this.inputShow = true;
      this.searchText = "";
    },
    closeDialog() {
      this.clearDataFun();
      this.$emit("closeModalReward");
    },
    defaultItem() {
      this.BillObj = this.dataType.BillObj;
      this.buyVipList = this.dataType.buyVipList;
      this.rechargeRate = this.BillObj.CHIPSQTY / this.BillObj.BUYINPRICE;
      let vipInfo = this.dataType.vipInfo;
      if (vipInfo.VIPID != undefined) {
        this.memberdetails = vipInfo;
        this.ruleForm.buyInPrice = vipInfo.BUYINMONEY;
        this.ruleForm.ContestQty = vipInfo.REWARDMONEY;
        this.inputShow = false;
      }
    }
  },
  components: {
    addNewMember: () => import("@/components/member/add")
  },
  mounted() {
    let levelList = [];
    for (var i = 1; i <= 30; i++) {
      levelList.push({ name: "第" + i + "名", disabled: false });
    }
    this.levelList = levelList;

    this.defaultItem();
  }
};
</script>


<style lang="scss" scoped>
.selectStyle >>> .el-input__inner {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background: #fff;
  margin-top: 20px;
}
.selectStyle >>> .el-input__suffix {
  display: none;
}

.ruleFormStyle >>> .el-form-item {
  margin-bottom: 0;
}

.newItmeright {
  align-items: center;
  display: flex;
  width: 90%;
  position: absolute;
  left: 0;
  box-sizing: border-box;
  padding-left: 56px;
}

.ssmemberul {
  width: 100%;
  border-radius: 6px;
}
.ssmemberul-cont {
  width: 100%;
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
  border-radius: 4px;
  padding: 3px 6px;
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
}
.item_dright-left .phone {
  color: #a7a7a8;
  font-size: 12px;
}
.item_dright-right {
  width: 30%;
  text-align: left;
  color: #a7a7a8;
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
