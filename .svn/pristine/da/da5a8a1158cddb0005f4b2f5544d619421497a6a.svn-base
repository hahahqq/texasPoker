<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="支出明细" name="first">
      <defrayPage></defrayPage>
    </el-tab-pane>
    <el-tab-pane label="支出项目" name="second">
      <paymentPage></paymentPage>
    </el-tab-pane>
    <el-tab-pane name="third" :disabled="!isPurViewFun(601050104)">
      <span slot="label" @click="notifyFun(601050104)">支付账户</span>
      <accountPage></accountPage>
    </el-tab-pane>
    <el-tab-pane label="支出分析" name="fourth">
      <reportPage></reportPage>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import defrayPage from "./defray.vue";
import paymentPage from "../selected/payment.vue";
import accountPage from "./account.vue";
import reportPage from "../ReportAnalysis/defrayReport.vue";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    defrayPage,paymentPage,accountPage,reportPage
  },
  methods: {
    handleClick(tab, event) {
    
    },
    notifyFun(number){
      if(!this.isPurViewFun(number)){
         this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
      }
    }
  },
  
};
</script>

