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

          <el-col :span="7">
            参赛情况：{{ BillObj.VIPCOUNT }} 人 * {{ BillObj.BUYINPRICE }} 积分
          </el-col>
        </el-row>

        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col :span="8">买入总积分：{{ BillObj.TOTALMONEY }}</el-col>

          <el-col :span="8">
            {{ BillObj.CHARGESTYPE == 0 ? "服务费积分：" : "服务费金额：" }}
            {{
              BillObj.CHARGESTYPE == 0
                ? BillObj.CHARGESMONEY + " ( 比例 " + BillObj.CHARGESRATE * 100 + "% ) "
                : BillObj.CHARGESMONEY + " 元"
            }}
          </el-col>

          <el-col :span="7">
            奖池总积分：{{ BillObj.EXCHANGEINTEGRAL + BillObj.NOTEXCHANGEINTEGRAL }}
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">已兑换积分：{{ BillObj.EXCHANGEINTEGRAL }}</el-col>

          <el-col :span="8">未兑换积分：{{ BillObj.NOTEXCHANGEINTEGRAL }}</el-col>
        </el-row>
      </div>
    </div>

    <el-table
      size="small"
      :data="buyVipList"
      style="width: 100%; margin-top: 10px"
      height="360"
      header-row-class-name="bg-F1F2F3"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="REWARDMONEY" label="获得积分"></el-table-column>
      <el-table-column prop="REWARDRATE" label="比例">
        <template slot-scope="scope">{{ scope.row.REWARDRATE * 100 }} %</template>
      </el-table-column>
      <el-table-column prop="VIPNAME" label="兑换人"></el-table-column>
      <el-table-column prop="VIPCODE" label="兑换人卡号"></el-table-column>
      <el-table-column prop="VIPMOBILENO" label="兑换人手机"></el-table-column>
    </el-table>

    <div style="text-align: right; width: 100%; margin-top: 10px; display: table">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="gameoverFun()" :loading="gameoverLoading">
        确认结束
      </el-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
  props: ["dataType"],
  data() {
    return {
      BillObj: {
        MATCHNAME: ""
      },
      gameoverLoading: false,
      RewardObj: []
    };
  },
  computed: {
    ...mapGetters({
      integralCancelGameState: "integralCancelGameState"
    })
  },
  watch: {
    integralCancelGameState(data) {
      this.gameoverLoading = false;
      if (data.success) {
        this.$message({
          message: "结束【" + this.BillObj.MATCHNAME + "】赛事成功",
          type: "success"
        });
        this.$router.push({ path: "/game/match/index" });
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    dataType(data) {
      this.defaultItem();
    }
  },
  methods: {
    closeDialog() {
      this.$emit("closeModalOver");
    },
    defaultItem() {
      console.log(this.dataType);
      this.BillObj = this.dataType.BillObj;
      this.RewardObj = this.dataType.RewardObj;
      this.buyVipList = this.dataType.buyVipList;
    },
    gameoverFun() {
      this.$confirm("确认结束当前比赛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("integralCancelOrGameOver", { Type: 1, BillId: this.BillObj.BILLID })
            .then(() => {
              this.gameoverLoading = true;
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.defaultItem();
  }
};
</script>
