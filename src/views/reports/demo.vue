<template>
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
      <div class="bg-white m-bottom-sm">
         <div class="bg-white m-bottom-sm- paddingTB-md">
            <div class="marginLR-md">
               <!-- table-->
               <el-table
                  border
                  :data="tableList"
                  header-row-class-name="bg-F1F2F3"
                  class="full-width"
                  :style="{ maxWidth: maxWidth + 'px' }"
                  ref="contentTable"
                  :height="tableHeight"
               >
                  <el-table-column
                     type="index"
                     label="序号"
                     align="right"
                     width="50"
                  ></el-table-column>
                  <el-table-column prop="" label=""></el-table-column>
                  <!--
                     :align="item.align ? 'right' : 'left'"
                     :width="item.width ? item.width : ''"
                     -->
               </el-table>
               <!-- 分页 -->
               <div v-if="tableList.length > 0" class="m-top-sm clearfix">
                  <el-pagination
                     @size-change="handlePageChange"
                     @current-change="handlePageChange"
                     :current-page.sync="pagination.PN"
                     :page-size="pagination.PageSize"
                     layout="prev, pager, next, jumper"
                     :total="pagination.TotalNumber"
                     class="text-center"
                  ></el-pagination>
               </div>
               <div v-else style="height: 42px"></div>
            </div>
         </div>
      </div>
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
         formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1 },
         tableList: [],
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 0
         },
         maxWidth: window.innerWidth - 210,
         tableHeight: 300
      };
   },
   computed: {
      ...mapGetters({
         // 	dataState: "actionsDataState",
         // 	dataListState: "commonListState"
      }),
      dataListState() {
         return this.$store.getters.cReportDataState.memberRecharge;
      }
   },
   watch: {
      dataState(data) {
         if (this.loading) {
            if (data.success) {
            } else {
               this.$message.error(data.message);
            }
         }
         this.loading = false;
      },
      dataListState(data) {
         if (this.loading) {
            if (data.success) {
               this.pagination = Object.assign({}, data.paying);
               this.tableList = [...data.List];
               console.log(111, this.tableList);
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
         this.formData = Object.assign({}, this.formData, data);
         this.getNewData();
      },
      getNewData() {
         this.loading = true;
         indexQuery.memberRecharge(this, "memberRecharge", this.formData);
      },
      handlePageChange: function(currentPage) {
         if (this.formData.PN == currentPage || this.loading) {
            return;
         }
         this.formData.PN = parseInt(currentPage);
         this.getNewData();
      },
      printFun(item) {
         this.$message({
            type: "info",
            message: "开发中..."
         });
      },
      defaultData() {},
      setHeight() {
         if (this.$refs.contentTable) {
            let top = this.$refs.contentTable.$el.getBoundingClientRect().top;
            let marginSpace = 10 * 3,
               pager = 42;
            this.$nextTick(() => {
               this.tableHeight = window.innerHeight - top - marginSpace;
               this.$refs.contentTable.doLayout(); // 表格错位问题
            });
         }
      }
   },

   mounted() {
      let homeInfo = getHomeData();
      this.formData = Object.assign(
         {},
         this.formData,
         {
            ShopId: homeInfo.shop.ID,
            BeginDate: this.getTimeStamp(),
            EndDate: new Date().getTime()
         },
         { PN: 1 }
      );
      this.getNewData();
      this.setHeight();
   },
   components: {
      filtePage: () => import("@/views/reports/filtePage.vue")
   }
};
</script>
<style scoped></style>
