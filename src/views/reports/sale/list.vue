<template>
   <!-- 销售分析 -->
   <section v-loading="loading">
      <div class="bg-white paddingTB-md m-bottom-sm" style="min-height: 73px">
         <div class="marginLR-md">
            <filtePage
               :isAll="true"
               :isExport="true"
               @getNewData="getNewData_fun"
               @exportState="exportState_fun"
            ></filtePage>
         </div>
      </div>
      <div class="bg-white m-bottom-sm paddingTB-sm">
         <div class="marginLR-md">
            <div
               v-for="(item, i) in pageList"
               :key="i"
               class="inline-block border padding-sm marginTB-sm m-right-sm"
               style="min-width: 150px"
            >
               <p>{{ item.label }}</p>
               <div class="font-16 font-600">
                  <span v-text="item.value ? parseFloat(item.value) : 0"></span>
               </div>
            </div>
         </div>
      </div>
      <div class="bg-white m-bottom-sm">
         <div class="marginLR-md">
            <echartLine
               ref="saleEchart"
               :idName="'saleEchart'"
               :typeData="echartData"
               class="padding-sm marginTB-sm"
            ></echartLine>
         </div>
      </div>
      <div class="bg-white m-bottom-sm paddingTB-md">
         <div class="marginLR-md">
            <!-- table-->
            <el-table
               border
               :data="tableList"
               header-row-class-name="bg-F1F2F3"
               class="full-width"
               ref="contentTable"
               :height="tableHeight"
               min-height="100px"
            >
               <el-table-column prop="DATESTR" label="日期"></el-table-column>
               <!-- BILLPRICE -->
               <el-table-column prop="BILLCOUNT" label="销售笔数" align="right"></el-table-column>
               <el-table-column prop="QTY" label="销售数" align="right"></el-table-column>
               <el-table-column prop="MONEY" label="销售金额" align="right"></el-table-column>
               <el-table-column prop="GAINMONEY" label="毛利润" align="right"></el-table-column>
               <el-table-column label="操作" align="center" width="70px">
                  <template slot-scope="props">
                     <el-button type="text" @click="getItemData(props.row)" class="no-padding">
                        详情
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
      </div>
      <!-- 详情 -->
      <el-dialog title="销售分析详情" :visible.sync="itemData.show" width="980px">
         <itemPage @closeModal="closeModalFun" :typeData="itemData"></itemPage>
      </el-dialog>
      <!-- 数据导出 -->
      <el-dialog
         append-to-body
         :close-on-click-modal="false"
         :close-on-press-escape="false"
         :show-close="false"
         title="数据导出"
         :visible.sync="exportData.show"
         width="400px"
      >
         <exportPage
            :dataType="exportData"
            :isPage="true"
            @closeModal="exportData.show = false"
         ></exportPage>
      </el-dialog>
   </section>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
   data() {
      return {
         loading: false,
         formData: { ShopId: "", BeginDate: "", EndDate: "" },
         pageList: [
            { label: "销售总额", value: 0 },
            { label: "毛利润", value: 0 },
            { label: "销售笔数", value: 0 },
            { label: "销售数量", value: 0 }
         ],
         tableList: [],
         echartData: {
            show: true,
            data: {
               title: "销售分析",
               legend: ["销售金额", "毛利润"],
               xAxis: [],
               series: [[0], [0]]
            }
         },
         itemData: { show: false },
         exportData: { show: false },
         tableHeight: 300
      };
   },
   computed: {
      ...mapGetters({}),
      dataState() {
         return this.$store.getters.cReportDataState.sale;
      }
   },
   watch: {
      dataState(data) {
         if (this.loading) {
            console.log(11, data);
            if (data.success) {
               // 合计信息 SumInfo(...,MONEY);
               this.pageList[0].value = data.data.SumInfo.BILLPRICE;
               this.pageList[1].value = data.data.SumInfo.GAINMONEY;
               this.pageList[2].value = data.data.SumInfo.BILLCOUNT;
               this.pageList[3].value = data.data.SumInfo.QTY;
               this.tableList = data.data.List;
               this.setEchartNewData(this.tableList);
            } else {
               this.$message.error(data.message);
            }
         }
         this.loading = false;
      }
   },
   methods: {
      exportState_fun(data) {
         this.exportData = {
            show: true,
            data: {},
            index: 1
         };
      },
      getNewData_fun(data) {
         this.formData = Object.assign({}, data);
         this.getNewData();
      },
      getNewData() {
         this.loading = true;
         indexQuery.sale(this, "sale", this.formData);
      },
      getItemData(item) {
         this.itemData = {
            show: true,
            data: {
               PN: 1,
               DateStr: item.DATESTR,
               ShopId: this.formData.ShopId
            }
         };
      },
      closeModalFun(v) {
         if (v) {
            this.getNewData();
         }
         this.itemData.show = false;
      },
      setEchartNewData(arr) {
         let arr1 = [],
            arr2 = [],
            arr3 = [];
         if (arr.length == 0) return;
         arr.forEach(element => {
            arr1.push(element.DATESTR);
            arr2.push(element.MONEY);
            arr3.push(element.GAINMONEY);
         });
         this.echartData.data.xAxis = [...arr1];
         this.echartData.data.series = [arr2, arr3];
         this.$nextTick(() => {
            this.echartData = Object.assign({}, this.echartData, { show: true });
         });
         this.setHeight();
      },

      defaultData() {},
      setHeight() {
         console.log(111, this.tableList);
         if (this.tableList.length > 10) {
            this.tableHeight = window.innerHeight / 2 + 40;
            return;
         }
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
      let homeInfo = getHomeData();
      this.formData = {
         ShopId: homeInfo.shop.ID,
         BeginDate: this.getTimeStamp(),
         EndDate: new Date().getTime()
      };
      this.getNewData();
      // this.setHeight();
   },
   components: {
      filtePage: () => import("@/views/reports/filtePage.vue"),
      echartLine: () => import("@/components/echart/echartLine.vue"),
      itemPage: () => import("./item.vue"),
      exportPage: () => import("@/components/export/common.vue")
   }
};
</script>
<style scoped></style>
