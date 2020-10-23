<template>
  <div >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="商品服务" prop="GoodsID">
        <a @click="isShowFirstPopup=true" class="inline-block paddingTB-sm paddingLR-xs pointer"
          style="line-height:1.3;min-width:100px">
          <span v-text="Object.keys(selgoods).length>0?selgoods.NAME:'请选择商品服务'"></span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </a>
      </el-form-item>
      
      <el-form-item label="单价">
        <el-input size='small' v-model.number="ruleForm.Price" type="number" min=1></el-input>
      </el-form-item>

      <el-form-item label="预定数量">
        <el-input size='small' v-model.number="ruleForm.ServiceQty" type="number" min=1></el-input>
      </el-form-item>

      <el-form-item label="限定数量">
        <el-input size='small' v-model.number="ruleForm.LimitQty" type="number" min=1></el-input>
      </el-form-item>

      <el-form-item label="预约时间">
        <el-date-picker size='small' v-model="dateBE" type="daterange" value-format="timestamp" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="是否停用" v-if='dealType.type == "edit"'>
        <el-switch size='small' v-model="ruleForm.IsStop"></el-switch>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.Remark">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
        <el-button @click="closeModal('resetList')">取 消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog width="700px" title="选择商品服务" :visible.sync="isShowFirstPopup" append-to-body style="max-width:100%;">
      <selGoods @closeModal="isShowFirstPopup=false" :chooseServer='{ type: ""}'></selGoods>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS from "@/mixins/index";
export default {
  props: {
    dealType: {
      type: Object,
      default: function() {
        return {
          type: "add",
          state: false
        };
      }
    }
  },
  mixins: [MIXINS.IS_SHOW_POPUP],
  data() {
    var checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
          if (!myreg.test(value)) {
            callback(new Error("请输入正确的手机号码"));
          } else {
            callback();
          }
        }
      }, 800);
    };
    var checkTitme = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("预约时间不能为空"));
      }
      setTimeout(() => {
        if (value >= new Date().getTime()) {
          callback();
        } else {
          callback(new Error("请选择正确的时间"));
        }
      }, 800);
    };
    return {
      ruleForm: {
        BeginTime: "",
        EndTime: "",
        Price: "",
        ServiceQty: "",
        LimitQty: "",
        Remark: "",
        GoodsID: "",
        BillID: "",
        IsStop: false
      },
      rules: {
        GoodsID: [{}]
      },
      loading: false,
      componentName: "",
      dateBE: []
    };
  },
  computed: {
    ...mapGetters({
      dataItem: "wechatItem",
      dataState: "bespeakState",
      selgoods: "selgoods"
    })
  },
  watch: {
    dealType(data) {
      this.defaultData();
    },
    dataState(data) {
      this.loading = false;
      this.$message({
        message: data.message, type: data.success ? "success" : "error"
      });
      if (data.success) {
        this.closeModal('closeModal')
      }
    }
  },
  methods: {
    closeModal(type) {
      if (this.$refs.ruleForm) { 
        this.ruleForm = {
          BeginTime: "",
          EndTime: "",
          Price: "",
          ServiceQty: "",
          LimitQty: "",
          Remark: "",
          GoodsID: "",
          BillID: "",
          IsStop: false
        }
      }
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    handleSubmit() {
      if (Object.keys(this.selgoods).length > 0) {
        this.ruleForm.GoodsID = this.selgoods.ID;
      }
      let sendData = Object.assign({}, this.ruleForm, {
        IsStop: this.ruleForm.IsStop==false ? 0 : 1
      });
      if (this.dealType.type == "add") {
        delete sendData.BillID;
      } else {
        sendData.BillID = this.dataItem.BILLID;
      }
      if (this.dateBE.length > 0) {
        sendData.BeginTime = this.dateBE[0];
        sendData.EndTime = this.dateBE[1];
      }
      // console.log(sendData);return;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("dealWechatItem", {
            type: this.dealType.type,
            data: sendData
          }).then(() => {
            this.loading = true
          })
        }
      })
    },
    defaultData() {
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      if (this.dealType.type == "add") {
        this.dateBE = [
          new Date().getTime(),
          new Date(this.getCustomDay(7)).getTime()
        ];
        this.ruleForm = {
          BeginTime: "",
          EndTime: "",
          Price: "",
          ServiceQty: "",
          LimitQty: "",
          Remark: "",
          GoodsID: "",
          BillID: "",
          IsStop: false
        }
        this.$store.dispatch("selectingGoods",{})
      }
      if (this.dealType.type == "edit") {
        for (let key in this.ruleForm) {
          let kk = key.toUpperCase();
          this.ruleForm[key] = this.dataItem[kk]
        }
        if (this.dataItem.BEGINTIME != 1) {
          this.dateBE = [this.dataItem.BEGINTIME, this.dataItem.ENDTIME]
        }
        if (this.dataItem.GOODSID) {
          this.$store.dispatch("selectingGoods", {
            ID: this.dataItem.GOODSID,
            NAME: this.dataItem.GOODSNAME
          })
        }
      }
    }
  },
  mounted() {
    this.defaultData()
  },
  components: {
    selGoods: () => import("@/components/selected/selgoods")
  }
}
</script>