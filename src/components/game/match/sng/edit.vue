<template>
  <div>
    <div style="display: none">{{ dataType }}</div>
    <el-form
      :inline="false"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      v-loading="pageLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="数据加载中..."
    >
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24">
          <el-form-item label="赛事名称" prop="Name">
            <el-input
              placeholder="请输入SNG赛事名称"
              v-model.trim="ruleForm.Name"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="比赛项目" prop="EventId">
            <el-select
              size="small"
              v-model="ruleForm.EventId"
              @change="selectEventFun(ruleForm.EventId)"
              placeholder="请选择比赛项目"
              :disabled="dataType.buyVipNum != 0"
              style="width: 100%"
            >
              <el-option
                v-for="item in eventsList"
                :key="item.ID"
                :value="item.ID"
                :label="item.NAME"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="开赛时间" prop="PlayTime">
            <el-date-picker
              v-model="ruleForm.PlayTime"
              size="small"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="比赛桌号" prop="DeskId">
            <el-select
              size="small"
              v-model="ruleForm.DeskId"
              placeholder="请选择比赛桌号"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in tableList"
                :key="index"
                :value="item.ID"
                :label="item.NAME"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="启动线上报名">
            <el-switch
              v-model="ruleForm.IsOnLine"
              active-color="#409eff"
              inactive-color="#ccc"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="Buyin积分" prop="BuyinMoney">
            <el-input
              placeholder="请输入参赛报名积分"
              :disabled="dataType.buyVipNum != 0"
              size="small"
              v-model.trim="ruleForm.BuyinMoney"
            >
              <template slot="append">积分</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="记分牌">
            <el-input
              placeholder="请输入Buyin记分牌"
              :disabled="dataType.buyVipNum != 0"
              size="small"
              v-model="ruleForm.ChipsQty"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="服务费方式">
            <el-select
              size="small"
              v-model="ruleForm.ChargesType"
              :disabled="dataType.buyVipNum != 0"
              placeholder="请选择服务费方式"
              style="width: 100%"
            >
              <el-option
                v-for="item in serviceChargeMethod"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="服务费比例" v-if="ruleForm.ChargesType == 0">
            <el-input
              placeholder="请输入服务费比例"
              size="small"
              :disabled="dataType.buyVipNum != 0"
              v-model="ruleForm.ChargesRate"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item label="服务费金额" v-if="ruleForm.ChargesType == 1">
            <el-input
              placeholder="请输入服务费金额"
              size="small"
              :disabled="dataType.buyVipNum != 0"
              v-model="ruleForm.ChargesMoney"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="24">
          <el-form-item label="备注说明">
            <el-input
              size="small"
              placeholder="请输入备注说明"
              v-model="ruleForm.Remark"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="dataType.RewardNum == 0">
        <el-col :xs="24" :sm="24">
          <el-form-item label="奖池分配方案">
            <div>
              <el-button type="text" @click="addRanking">添加名次</el-button>
              <span style="color: #aaa; margin-left: 6px">设置比赛选手奖池分配方案</span>
            </div>
            <el-table
              v-if="rewardWayList.length > 0"
              size="small"
              border
              :data="rewardWayList"
              header-row-class-name="bg-F1F2F3"
            >
              <el-table-column label="比赛名次" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Name" size="small" placeholder="请选择比赛名称">
                    <el-option
                      v-for="item in levelList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="奖金比例" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RewardRate"
                    size="small"
                    oninput="value=value.replace(/\D/g,'')"
                    placeholder="请输入奖金比例"
                    class="textCenter"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column label="大师分" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ContestQty"
                    placeholder="请输入大师分"
                    oninput="value=value.replace(/\D/g,'')"
                    size="small"
                    class="textCenter"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="delCurItem(scope.row, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="24">
          <el-form-item label="">
            <el-button plain @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submitBtn" :loading="loadingBtn">确认</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Vue from "vue";
import dayjs from "dayjs";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
  props: ["dataType"],
  data() {
    return {
      ruleForm: {
        PlayTime: "",
        IsOnLine: false,
        Name: "",
        BuyinMoney: "",
        ChipsQty: "",
        ChargesType: 0,
        ChargesRate: "",
        ChargesMoney: "",
        Remark: "",
        RewardType: 0,
        EventId: "",
        DeskId: "",
        BillId: ""
      },
      rewardWayList: [],
      serviceChargeMethod: [
        { value: 0, label: "从报名费按比例扣除" },
        { value: 1, label: "服务费不计入奖池" }
      ],
      DelArr: [],
      loadingBtn: false,
      rules: {
        Name: [{ required: true, message: "请输入SNG赛事名称", trigger: "blur" }],
        BuyinMoney: [{ required: true, message: "请输入参赛报名积分", trigger: "blur" }],
        EventId: [{ required: true, message: "请选择比赛项目", trigger: "change" }],
        PlayTime: [{ type: "date", required: true, message: "请选择日期", trigger: "change" }],
        DeskId: [{ required: true, message: "请选择比赛桌号", trigger: "change" }]
      },
      eventsList: [],
      tableList: [],
      pageLoading: false,
      levelList: [],
      loadingDefault: true
    };
  },
  computed: {
    ...mapGetters({
      sngEditGameState: "sngEditGameState",
      getEventsListAllState: "getEventsListAllState",
      getEventsDetailsState: "getEventsDetailsState",
      getTableListState: "getTableListState"
    })
  },
  watch: {
    dataType(data) {
      if (this.loadingDefault) {
        this.defaultItem();
      }
    },
    getTableListState(data) {
      console.log(data);
      if (data.success) {
        this.tableList = data.data.List;
      }
    },
    getEventsListAllState(data) {
      if (data.success) {
        this.eventsList = data.data.List;
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    getEventsDetailsState(data) {
      this.pageLoading = false;
      if (data.success) {
        console.log(data.data);
        let obj = data.data.EventObj;
        this.ruleForm.EventId = obj.ID;
        this.ruleForm.BuyinMoney = obj.BUYINMONEY;
        this.ruleForm.ChipsQty = obj.CHIPSQTY;
        this.ruleForm.ChargesType = obj.CHARGESTYPE;
        this.ruleForm.ChargesRate = Number(obj.CHARGESRATE) * 100;
        this.ruleForm.ChargesMoney = obj.CHARGESMONEY;
        this.ruleForm.RewardType = 0;

        this.rewardWayList = data.data.RewardObj.map((item) => ({
          Id: item.ID,
          Name: "第" + item.NAME + "名",
          ContestQty: item.CONTESTQTY,
          RewardRate: Number(item.REWARDRATE) * 100,
          Integral: 0,
          Remark: item.REMARK != undefined ? item.REMARK : "",
          IsCancel: 0
        }));
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    sngEditGameState(data) {
      this.loadingBtn = false;
      if (data.success) {
        this.cleanData();
        this.$refs["ruleForm"].resetFields();
        this.$emit("closeModal");
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    }
  },
  methods: {
    defaultItem() {
      let obj = this.dataType.info;
      this.ruleForm.Name = obj.MATCHNAME;
      this.ruleForm.EventId = obj.EVENTID;
      this.ruleForm.BuyinMoney = obj.BUYINPRICE;
      this.ruleForm.ChipsQty = obj.CHIPSQTY;
      this.ruleForm.ChargesType = obj.CHARGESTYPE;
      this.ruleForm.ChargesPrice = obj.CHARGESPRICE;
      this.ruleForm.ChargesRate = Number(obj.CHARGESRATE) * 100;
      this.ruleForm.ChargesMoney = obj.CHARGESPRICE;
      this.ruleForm.RewardType = 0;
      this.ruleForm.PlayTime = obj.PLAYTIME;
      this.ruleForm.DeskId = obj.DESKID;
      this.ruleForm.BillId = obj.BILLID;
      this.ruleForm.IsOnLine = obj.ISONLINE;

      let param = this.dataType.RewardList;
      if (param.length != 0) {
        this.rewardWayList = param.map((item) => ({
          Id: item.ID,
          Name: "第" + item.NAME + "名",
          ContestQty: item.CONTESTQTY,
          RewardRate: Number(item.REWARDRATE) * 100,
          Integral: 0,
          Remark: item.REMARK != undefined ? item.REMARK : "",
          IsCancel: 0
        }));
      } else {
        this.rewardWayList = [];
      }
      console.log(this.rewardWayList);
    },
    addRanking() {
      this.loadingDefault = false;
      this.rewardWayList = this.rewardWayList.concat({
        Id: "",
        Name: "第" + Number(this.rewardWayList.length + 1) + "名",
        Rate: 0,
        RewardRate: "",
        Integral: 0,
        ContestQty: "",
        Remark: "",
        IsCancel: 0
      });
    },
    selectEventFun(ID) {
      this.$store.dispatch("getEventsDetails", { Id: ID }).then(() => {
        this.pageLoading = true;
      });
    },
    cleanData() {
      Object.assign(this.$data, this.$options.data());
      this.defaultRewardWayList();
    },
    defaultRewardWayList() {
      this.rewardWayList = [
        {
          Id: "",
          Name: "第1名",
          Rate: 0,
          RewardRate: "",
          Integral: 0,
          ContestQty: "",
          Remark: "",
          IsCancel: 0
        }
      ];
    },
    closeDialog() {
      this.cleanData();
      this.$refs["ruleForm"].resetFields();
      this.$emit("closeModal");
    },
    delCurItem(row, idx) {
      if (row.Id != "") {
        row.IsCancel = 1;
        this.DelArr.push(row);
      }
      this.rewardWayList.splice(idx, 1);

      let rewardWayList = this.rewardWayList;
      for (var i = 0; i < rewardWayList.length; i++) {
        rewardWayList[i].Name = "第" + Number(i + 1) + "名";
      }
      this.rewardWayList = rewardWayList;
      this.$forceUpdate();
    },
    submitBtn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let arr = this.rewardWayList.concat(this.DelArr);
          let newArr = arr.filter((item) => item.Name != "" && item.RewardRate != "");

          let sendData = {
            Name: this.ruleForm.Name,
            Status: 0,

            EventId: this.ruleForm.EventId,
            DeskId: this.ruleForm.DeskId,
            PlayTime: dayjs(this.ruleForm.PlayTime).valueOf(),
            IsOnLine: this.ruleForm.IsOnLine ? 1 : 0,
            Remark: this.ruleForm.Remark,
            RewardType: 0,
            RewardList: newArr,

            ChipsQty: this.ruleForm.ChipsQty,
            BuyinMoney: this.ruleForm.BuyinMoney,
            ChargesType: this.ruleForm.ChargesType,
            ChargesMoney: this.ruleForm.ChargesType == 0 ? "" : this.ruleForm.ChargesMoney,
            ChargesRate:
              this.ruleForm.ChargesType == 1 ? "" : Number(this.ruleForm.ChargesRate) / 100,
            BillId: this.ruleForm.BillId
          };
          this.$store.dispatch("editSngGame", sendData).then(() => {
            this.loadingBtn = true;
          });
        }
      });
    }
  },
  mounted() {
    this.loadingDefault = true;
    this.defaultItem();

    let levelList = [];
    for (var i = 1; i <= 30; i++) {
      levelList.push({ name: "第" + i + "名", disabled: false });
    }
    this.levelList = levelList;
  }
};
</script>

<style scoped>
.textCenter >>> .el-input__inner {
  text-align: center !important;
}
</style>
