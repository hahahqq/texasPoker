<template>
  <div class="roomOrderCheckout">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="订单号">{{theData.BILLNO}}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="会员">{{vipObj.NAME}}</el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="付款方式">
            <el-select v-model="form.PaytypeId" placeholder="请选择" class="full-width">
              <el-option
                v-for="item in paywayList"
                :label="item.NAME"
                :value="item.ID"
                :key="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="短信">
            <el-switch v-model="form.IsSms"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="获得积分">
            <el-input type="number" v-model.number="form.GetIntegral"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="抵现积分">
            <el-input type="number" v-model.number="form.PayIntegral"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="抵现金额">
            <el-input type="number" v-model.number="form.IntegralMoney"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="优惠券号">
            <el-input v-model="form.CouponNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="优惠金额">
            <el-input type="number" v-model.number="form.FavorMoney"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="其它金额">
            <el-input type="number" v-model.number="form.OtherMoney"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.Remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
        <el-button @click="closeModal(false)">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    theData: {
      type: Object,
      default: {}
    },
    GoodsDetail: {
      type: String,
      default: {}
    }
  },
  data() {
    return {
      form: {
        NoteBillId: "",
        VipId: "",
        PaytypeId: "", // 付款方式
        GetIntegral: 0, // 获得积分
        IsSms: false, // 是否发短信
        PayIntegral: 0, // 抵现积分
        IntegralMoney: 0, // 抵现金额
        FavorMoney: 0, // 优惠金额
        CouponNo: "", // 优惠券号
        OtherMoney: 0,
        Remark: ""
      },
      vipObj: {},
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      dataItem: "roomOrderItem",
      dataState: "roomOrderState",
      paywayList: "paywayList",
      selmember: "selmember"
    })
  },
  watch: {
    dataState(data) {
      if (data.success && this.loading) {
        this.$store.dispatch("clearRoomAll", 0).then(() => {
          this.closeModal(true);
        });
      }
      this.loading = false;
      this.$message({
        showClose: true,
        message: data.message,
        type: data.success ? "success" : "error"
      });
    }
  },
  methods: {
    closeModal(status) {
      this.$emit("closeModal", status);
    },
    handleSubmit() {
      if (!this.theData.BILLID) {
        return;
      }
      let sendData = Object.assign({}, this.form, {
        NoteBillId: this.theData.BILLID
      });
      let method = this.GoodsDetail
        ? "checkoutRoomOrder2"
        : "checkoutRoomOrder";
      if (Object.keys(this.vipObj).length > 0) {
        sendData.VipId = this.vipObj.ID;
      }

      this.$store.dispatch(method, sendData).then(() => {
        this.loading = true;
      });
    }
  },
  mounted() { 
    if (this.paywayList.length == 0) {
      this.$store.dispatch("getPaywayList");
    }
    if (this.dataItem.data && this.dataItem.data.VipObj) {
      this.vipObj = Object.assign({}, this.dataItem.data.VipObj);
    } else {
      this.vipObj = {};
    }
    if (this.GoodsDetail) {
      this.vipObj = Object.assign({}, this.selmember);
    }
  }
};
</script>
