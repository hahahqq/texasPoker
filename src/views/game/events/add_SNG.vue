<template>
  <div>
    <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24">
          <el-form-item label="项目名称" prop="Name">
            <el-input
              placeholder="请输入SNG项目名称"
              v-model.trim="ruleForm.Name"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="Buyin积分" prop="BuyinMoney">
            <el-input
              placeholder="请输入参赛报名积分"
              size="small"
              oninput="value=value.replace(/\D/g,'')"
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
              size="small"
              oninput="value=value.replace(/\D/g,'')"
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
              oninput="value=value.replace(/\D/g,'')"
              v-model="ruleForm.ChargesRate"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item label="服务费金额" v-if="ruleForm.ChargesType == 1">
            <el-input
              placeholder="请输入服务费金额"
              size="small"
              oninput="value=value.replace(/\D/g,'')"
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

      <el-row>
        <el-col :xs="24" :sm="224">
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
                  <el-select
                    v-model="scope.row.Name"
                    size="small"
                    @change="selectLevelFun"
                    placeholder="请选择比赛名次"
                  >
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
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
  props: {
    dataType: {
      type: Object,
      default: function () {
        return { EventId: 1, dealState: "add", info: {} };
      }
    }
  },
  data() {
    return {
      ruleForm: {
        Id: "",
        Name: "",
        BuyinMoney: "",
        ChipsQty: "",
        ChargesType: 0,
        ChargesRate: "",
        ChargesMoney: "",
        Remark: "",
        RewardType: 0
      },
      rewardWayList: [],
      serviceChargeMethod: [
        { value: 0, label: "从报名费按比例扣除" },
        { value: 1, label: "服务费不计入奖池" }
      ],
      DelArr: [],
      loadingBtn: false,
      rules: {
        Name: [{ required: true, message: "请输入SNG赛事项目名称", trigger: "blur" }],
        BuyinMoney: [{ required: true, message: "请输入参赛报名积分", trigger: "blur" }]
      },
      levelList: []
    };
  },
  computed: {
    ...mapGetters({
      saveEventsState: "saveEventsState",
      saveRewardWayState: "saveRewardWayState"
    })
  },
  watch: {
    saveEventsState(data) {
      if (data.success) {
        let arr = this.rewardWayList.concat(this.DelArr);
        let newArr = arr.filter((item) => item.Name != "" && item.RewardRate != "");

        if (arr.length != 0) {
          this.$store.dispatch("saveRewardWay", {
            RewardList: newArr,
            EventId: this.ruleForm.Id == "" ? data.data.OutId : this.ruleForm.Id,
            RewardType: 0
          });
        } else {
          this.loadingBtn = false;
          this.cleanData();
          this.$refs["ruleForm"].resetFields();
          this.$emit("resetList");
        }
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    saveRewardWayState(data) {
      this.loadingBtn = false;
      if (data.success) {
        this.cleanData();
        this.$refs["ruleForm"].resetFields();
        this.$emit("resetList");
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    dataType(data) {
      this.cleanData();

      if (this.dataType.dealState == "edit") {
        let obj = this.dataType.info.EventObj;
        this.ruleForm = {
          Id: obj.ID,
          Name: obj.NAME,
          BuyinMoney: obj.BUYINMONEY,
          ChipsQty: obj.CHIPSQTY,
          ChargesType: obj.CHARGESTYPE,
          ChargesRate: Number(obj.CHARGESRATE) * 100,
          ChargesMoney: obj.CHARGESMONEY,
          Remark: obj.REMARK != undefined ? obj.REMARK : "",
          RewardType: 0
        };

        this.rewardWayList = this.dataType.info.RewardObj.map((item) => ({
          Id: item.ID,
          Name: "第" + item.NAME + "名",
          ContestQty: item.CONTESTQTY,
          RewardRate: Number(item.REWARDRATE) * 100,
          Integral: 0,
          Remark: item.REMARK != undefined ? item.REMARK : "",
          IsCancel: 0
        }));

      } else {
        this.cleanData();
      }
    }
  },
  methods: {
    selectLevelFun() {},
    addRanking() {
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
          let sendData = {
            Id: this.ruleForm.Id,
            Type: 0,
            Name: this.ruleForm.Name,
            Status: 0,
            Category: "",
            Remark: this.ruleForm.Remark,
            BuyinMoney: this.ruleForm.BuyinMoney,
            ChipsQty: Number(this.ruleForm.ChipsQty),
            ChargesType: this.ruleForm.ChargesType,
            ChargesMoney: this.ruleForm.ChargesType == 0 ? "" : this.ruleForm.ChargesMoney,
            ChargesRate:
              this.ruleForm.ChargesType == 1 ? "" : Number(this.ruleForm.ChargesRate) / 100,
            RewardType: 0
          };
          this.$store.dispatch("saveEvents", sendData).then(() => {
            this.loadingBtn = true;
          });
        }
      });
    }
  },
  mounted() {
    let levelList = [];
    for (var i = 1; i <= 30; i++) {
      levelList.push({ name: "第" + i + "名" });
    }
    this.levelList = levelList;

    this.defaultRewardWayList();
  }
};
</script>

<style scoped>
.textCenter >>> .el-input__inner {
  text-align: center !important;
}
</style>
