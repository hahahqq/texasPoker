<template>
  <el-tabs v-model="activeName">
    <el-tab-pane name="first" :disabled="!isPurViewFun(601050401)">
        <span slot="label" @click="notifyFun(601050401)">会员回访</span>
      <!-- 会员消费回访列表 -->
      <revisitPage></revisitPage>
    </el-tab-pane>
    <el-tab-pane  name="second" :disabled="!isPurViewFun(601050405)">
     <span slot="label" @click="notifyFun(601050405)">护理周期</span>
      <nourishingPage></nourishingPage>
    </el-tab-pane>
    <el-tab-pane name="third" :disabled="!isPurViewFun(601050402)">
        <span slot="label" @click="notifyFun(601050402)">意向会员</span>
      <intentionPage></intentionPage>
    </el-tab-pane>
    <el-tab-pane  name="fourth" :disabled="!isPurViewFun(601050404)">
        <span slot="label" @click="notifyFun(601050404)">意见受理</span>
      <opinionPage></opinionPage>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import revisitPage from "./revisit.vue";
import nourishingPage from "./nourishing.vue";
import intentionPage from "./intention.vue";
import opinionPage from "./opinion.vue";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  methods:{
    notifyFun(number) {
      if (!this.isPurViewFun(number)) {
        this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
      }
    }
  },
  components: {
    revisitPage,
    nourishingPage,
    intentionPage,
    opinionPage
  },
};
</script>


