<template>
   <!-- 消费时段分析 -->
   <div class="bg-white paddingTB-md" v-loading="loading">
      <!-- table-->
      <el-table
         border
         :data="tableList"
         header-row-class-name="bg-F1F2F3"
         class="full-width"
         ref="contentTable"
         :height="tableHeight"
      >
         <el-table-column prop="" label="" align="center">
            <el-table-column prop="TIMENAME" label="星期段"></el-table-column>
            <el-table-column prop="ADDVIPCOUNT" label="会员注册" align="right"></el-table-column>
         </el-table-column>
         <el-table-column label="会员充值" align="center">
            <el-table-column prop="BUYQTY" label="次数" align="right"></el-table-column>
            <el-table-column prop="BUYMONEY" label="金额" align="right"></el-table-column>
         </el-table-column>
         <el-table-column label="比赛登记" align="center">
            <el-table-column
               prop="ADDMONEYBILLCOUNT"
               label="买入手数"
               align="right"
            ></el-table-column>
            <el-table-column prop="ADDMONEY" label="买入金额" align="right"></el-table-column>
            <el-table-column prop="REWARDCOUNT" label="奖励次数" align="right"></el-table-column>
            <el-table-column prop="REWARDMONEY" label="奖励金额" align="right"></el-table-column>
         </el-table-column>
         <el-table-column label="商品销售" align="center">
            <el-table-column prop="SALEBILLCOUNT" label="次数" align="right"></el-table-column>
            <el-table-column prop="SALEQTY" label="数量" align="right"></el-table-column>
            <el-table-column prop="SALEMONEY" label="金额" align="right"></el-table-column>
         </el-table-column>
      </el-table>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
   props: {
      pageData: {
         type: Object,
         default: function() {
            return {
               ShopId: "",
               BeginDate: "",
               EndDate: "",
               show: false,
               type: 2
            };
         }
      }
   },
   data() {
      return {
         loading: false,
         formData: { ShopId: "", BeginDate: "", EndDate: "" },
         tableList: [],
         tableHeight: 300
      };
   },
   computed: {
      ...mapGetters({}),
      dataState() {
         return this.$store.getters.cReportDataState.week;
      }
   },
   watch: {
      pageData(data) {
         if (data.show && data.type == 2) {
            this.defaultData();
         }
      },
      dataState(data) {
         if (this.loading) {
            if (data.success) {
               this.tableList = data.data.List;
            } else {
               this.$message.error(data.message);
            }
         }
         this.loading = false;
      }
   },
   methods: {
      getNewData() {
         this.loading = true;
         indexQuery.consume(this, "week", this.formData);
      },
      defaultData() {
         this.formData = Object.assign({}, this.pageData);
         this.getNewData();
      },
      setHeight() {
         if (this.$refs.contentTable) {
            let top = this.$refs.contentTable.$el.getBoundingClientRect().top;
            let marginSpace = 10 * 3,
               pager = 42;
            this.$nextTick(() => {
               this.tableHeight = window.innerHeight - top - marginSpace;
               this.$refs.contentTable.doLayout();
            });
         }
      }
   },
   mounted() {
      if (this.pageData.show && this.pageData.type == 2) {
         this.defaultData();
      }
      this.setHeight();
   }
};
</script>
<style scoped>
.aa >>> .cell {
   text-align: center;
}
</style>
