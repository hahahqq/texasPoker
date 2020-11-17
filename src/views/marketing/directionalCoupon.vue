<template>
  <!-- 定向优惠券 -->
  <el-container>
    <el-header style="height: 50px; padding: 0">
      <headerPage :pageList="buttonGroup"></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <el-main style="padding: 10px; background: #fff; margin: 10px">
          <div>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-row :gutter="10">
                  <el-col :span="24" class="colLineHeight">
                    <span>赠送会员</span>
                    <el-button
                      @click="
                        isShowFirstPopup = true;
                        showChoseShop = false;
                      "
                      size="small"
                      style="float: left"
                    >
                      选择会员
                    </el-button>

                    <div style="float: left; margin-left: 20px">
                      <el-button size="small" style="float: left" @click="showChoseShop = true">
                        按店铺选择会员
                      </el-button>
                      <el-checkbox-group
                        v-model="checkList"
                        @change="choseShopFun"
                        v-if="showChoseShop"
                      >
                        <el-checkbox
                          v-for="(item, index) in shopVipQtyList"
                          :key="index"
                          style="display: table"
                          :label="item.SHOPID"
                        >
                          {{ item.SHOPNAME + "（会员数：" + item.VIPQTY + ")" }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>

                    <span
                      style="float: left; width: 80px; margin-right: 10px"
                      v-if="Object.keys(selmemberArr).length != 0"
                    >
                      已选
                      <i style="color: #409eff; font-size: 14px; font-weight: bold">
                        {{ Object.keys(selmemberArr).length }}
                      </i>
                      人
                    </span>
                    <el-button
                      style="font-size: 14px; font-weight: bold"
                      type="text"
                      v-if="Object.keys(selmemberArr).length != 0"
                      @click="isShowFirstPopup = true"
                      size="small"
                    >
                      查看
                    </el-button>
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>
                      优惠券类型
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="赛事券用于选手参加赛事报名时使用；商品券用于购买商品时使用"
                        placement="right"
                      >
                        <i class="el-icon-question font-14" style="color: #409eff"></i>
                      </el-tooltip>
                    </span>
                    <el-radio-group v-model="ruleForm.Type">
                      <el-radio size="small" :label="0">商品券</el-radio>
                      <el-radio size="small" :label="2">赛事券</el-radio>
                    </el-radio-group>
                  </el-col>
                  <el-col :span="24" class="colLineHeight">
                    <span>优惠券面值</span>
                    <el-input
                      type="number"
                      size="small"
                      style="width: 300px"
                      v-model.trim="ruleForm.Money"
                      placeholder="请输入优惠券面值"
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>使用规则</span>
                    满 &nbsp;
                    <el-input
                      type="number"
                      size="small"
                      style="width: 220px"
                      v-model="ruleForm.LimitMoney"
                      placeholder="使用规则： 例： 100"
                    ></el-input>
                    &nbsp; 元可用
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>开始日期</span>
                    <el-date-picker
                      v-model="ruleForm.BeginDate"
                      type="date"
                      size="small"
                      value-format="timestamp"
                      style="width: 300px"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>结束日期</span>
                    <el-date-picker
                      v-model="ruleForm.EndDate"
                      type="date"
                      size="small"
                      value-format="timestamp"
                      style="width: 300px"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>使用说明</span>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      v-model="ruleForm.Remark"
                      style="width: 300px"
                      placeholder="请输入优惠券使用说明"
                    ></el-input>
                  </el-col>

                  <el-col :span="24" class="colLineHeight">
                    <span>是否发送短信</span>
                    <el-radio-group v-model="ruleForm.IsSMS">
                      <el-radio size="small" :label="1">发送</el-radio>
                      <el-radio size="small" :label="0">不发送</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" style="text-align: center; margin-top: 30px">
                <el-button plain @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loadingBtn">
                  保 存
                </el-button>
              </el-col>
            </el-row>

            <el-dialog width="70%" title="选择会员" :visible.sync="isShowFirstPopup" append-to-body>
              <selMember
                @closeModal="
                  isShowFirstPopup = false;
                  isEmptyData();
                "
                :isArr="true"
                ref="clearMultVip"
              ></selMember>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MARKETING from "@/mixins/marketing.js";
import MIXINS from "@/mixins/index";
import { getHomeData } from "@/api/index";
export default {
  mixins: [MIXINS.IS_SHOW_POPUP, MIXINS_MARKETING.MARKETING_MENU],
  data() {
    return {
      checkList: [],
      showChoseShop: false,
      ruleForm: {
        ImgName: "",
        ShopList: "",
        Money: "",
        Remark: "",
        BeginDate: "",
        EndDate: "",
        Tel: null,
        Address: "",
        SaleEmpId: "",
        LimitMoney: "",
        LitmitVipList: "",
        IsSMS: 0,
        Type: 0,
        Qty: 1
      },
      showChoseShop: false,
      rules: {},
      ShopList: [], //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空 . add
      buttonGroup: [
        { label: "拓客工具", value: "/marketing/bespeakList" },
        { label: "定向优惠券", value: "" }
      ],
      loadingBtn: false,
      shopVipQtyList: []
    };
  },
  computed: {
    ...mapGetters({
      dataState: "dealMarketingState",
      shopList: "shopList",
      selmemberArr: "selmemberArr",
      getShopVipQtyState: "getShopVipQtyState"
    })
  },
  watch: {
    getShopVipQtyState(data) {
      console.log(data);
      if (data.success) {
        this.shopVipQtyList = data.data.List;
      }
    },
    dataState(data) {
      this.loadingBtn = false;
      if (data.success) {
        this.$message({
          type: "success",
          message: data.message
        });

        this.ruleForm = {
          ImgName: "",
          ShopList: "",
          Money: "",
          Remark: "",
          BeginDate: "",
          EndDate: "",
          Tel: null,
          Address: "",
          SaleEmpId: "",
          LimitMoney: "",
          LitmitVipList: "",
          IsSMS: 0,
          Type: 0,
          Qty: 1
        };
        this.checkList = [];

        this.$store.dispatch("clearMarketingData", 0);
      } else {
        this.$message({
          type: "error",
          message: data.message
        });
      }
    }
  },
  mounted() {
    this.$store.dispatch("getShopsVipQty", {});
    this.defaultData();
  },
  methods: {
    isEmptyData() {
      if (this.selmemberArr.length != 0) {
        this.checkList = [];
      }
    },
    choseShopFun() {
      if (this.checkList.length != 0) {
        this.$store.dispatch("selectingMember", {
          isArr: false,
          data: []
        });
      }
    },
    closeDialog() {},
    handleSubmit(type) {
      if (this.ruleForm.Money == "") {
        this.$message.warning("优惠券面值不能为空 ！");
        return;
      } else if (this.ruleForm.BeginDate == "" || this.ruleForm.EndDate == "") {
        this.$message.warning("请选择开始、结束时间 ！");
        return;
      } else if (this.checkList.length == 0 && this.selmemberArr.length == 0) {
        this.$message.warning("请选择会员或店铺 ！");
        return;
      }

      let sendData = Object.assign({}, this.ruleForm, {
        IsSMS: this.ruleForm.IsSMS == 0 ? "false" : "true"
      });

      let marr = this.selmemberArr.map((item) => ({
        VipId: item.ID,
        MobileNo: item.MOBILENO,
        MobileName: item.NAME
      }));

      sendData.ShopList = this.checkList.length != 0 ? this.checkList.join(",") : "";
      sendData.LitmitVipList = this.checkList.length == 0 ? JSON.stringify(marr) : "[]";
      sendData.AllVip = this.checkList.length != 0 ? 1 : 0;
      sendData.AllVipType = this.checkList.length != 0 ? 1 : 0;
      sendData.ShopId = this.checkList.length != 0 ? this.checkList.join(",") : getHomeData().shop.ID;

      if (this.checkList.length != 0) {
        let sameData = this.shopVipQtyList.filter(
          (item) => this.checkList.indexOf(item.SHOPID) > -1
        );

        let totalQty = sameData.map((item1) => {
          return item1.VIPQTY;
        });
        totalQty = totalQty.reduce((n, m) => n + m);
        sendData.VipQty = totalQty;
      } else {
        sendData.VipQty = this.selmemberArr.length;
      }

      this.$store.dispatch("addMCoyponAction", sendData).then(() => {
        this.loadingBtn = true;
      });
    },
    defaultData() {
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList", {});
      }
    }
  },
  components: {
    selMember: () => import("@/components/selected/selmember"),
    headerPage: () => import("@/components/header/headBC")
  }
};
</script>
<style scoped>
.ruleForm {
  max-width: 900px;
}

.ruleForm .el-form-item.full-width {
  width: 100%;
}

.colLineHeight {
  line-height: 32px;
  margin-bottom: 15px;
}

.colLineHeight span {
  width: 110px;
  float: left;
  text-align: right;
  margin-right: 30px;
}
.whiteCircle1,
.whiteCircle2 {
  width: 14px;
  height: 14px;
  margin-top: 60px;
  position: absolute;
  border-radius: 50%;
  background: #fff;
}
.whiteCircle1 {
  border-right: 1px solid #fff;
  left: -10px;
}
.whiteCircle2 {
  border-left: 1px solid #fff;
  right: -10px;
}
.whiteLine {
  height: 1px;
  width: 100%;
  border-bottom: 1px dashed #fff;
  position: absolute;
  margin-top: 67px;
}
.moneyClass {
  position: absolute;
  line-height: 60px;
  text-align: center;
  width: 100%;
  color: #fff;
  font-size: 24px;
}
.moneyClass i {
  font-size: 16px;
}
.couponTop {
  width: 100%;
  float: left;
  height: 70px;
  position: relative;
}
.couponBottom {
  width: 100%;
  float: left;
  line-height: 30px;
  text-align: center;
  color: #fff;
}
</style>

