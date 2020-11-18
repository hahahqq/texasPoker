<template>
   <!-- 积分奖励 -->
   <section v-loading="loading">
      <div class="bg-white paddingTB-md m-bottom-sm" style="min-height: 115px">
         <div class="marginLR-md">
            <filtePage
               :isAll="true"
               :isExport="true"
               @getNewData="getNewData_fun"
               @exportState="exportState_fun"
            ></filtePage>
            <div class="m-top-sm block">
               <el-input
                  placeholder="请输入会员卡号/姓名"
                  size="small"
                  v-model="formData.VipCode"
                  clearable
                  style="width: 401px"
               >
                  <template slot="append">
                     <el-button size="small" type="primary" @click="getNewData">
                        搜索
                     </el-button>
                  </template>
               </el-input>
            </div>
         </div>
      </div>
      <div class="bg-white paddingTB-md">
         <div class="marginLR-md">
            <!-- table-->
            <el-table
               border
               :data="tableList"
               header-row-class-name="bg-F1F2F3"
               class="full-width"
               ref="contentTable"
               :height="tableHeight"
            >
               <el-table-column
                  prop="BILLNO"
                  label="单号"
                  width="130px"
                  fixed="left"
               ></el-table-column>
               <el-table-column prop="" label="日期" width="140px">
                  <template slot-scope="scope">
                     <span>{{ new Date(scope.row.BILLDATE) | formatTime }}</span>
                  </template>
               </el-table-column>
               <el-table-column
                  prop="SHOPNAME"
                  label="店铺"
                  width="175px"
                  :show-overflow-tooltip="true"
               ></el-table-column>
               <el-table-column
                  prop="MATCHNAME"
                  label="赛事名称"
                  width="175px"
                  :show-overflow-tooltip="true"
               ></el-table-column>
               <el-table-column prop="TYPENAME" label="比赛类型" width="100px"></el-table-column>
               <el-table-column prop="DESKNAME" label="比赛桌号"></el-table-column>
               <el-table-column prop="VIPCODE" label="会员卡号" width="110px"></el-table-column>
               <el-table-column
                  prop="VIPNAME"
                  label="会员姓名"
                  width="90px"
                  :show-overflow-tooltip="true"
               ></el-table-column>
               <el-table-column prop="VIPMOBILENO" label="手机号" width="110px"></el-table-column>
               <el-table-column prop="REWARDNAME" label="比赛名次" align="left"></el-table-column>
               <el-table-column
                  prop="MONEY"
                  label="增加储值积分"
                  width="100px"
                  align="right"
               ></el-table-column>
               <!-- <el-table-column
						prop="INTEGRAL"
						label="增加竞技积分"
						width="100px"
						align="right"
					></el-table-column> -->
               <el-table-column prop="ENDTIME" label="结束时间" width="140px">
                  <template slot-scope="scope">
                     <span v-if="scope.row.ENDTIME">
                        {{ new Date(scope.row.ENDTIME) | formatTime }}
                     </span>
                  </template>
               </el-table-column>
               <el-table-column prop="USERNAME" label="制单人"></el-table-column>
               <el-table-column prop="" label="领取时间" width="140px">
                  <template slot-scope="scope">
                     <span>{{ new Date(scope.row.BILLDATE) | formatTime }}</span>
                  </template>
               </el-table-column>
               <el-table-column
                  prop="REMARK"
                  label="备注"
                  width="210px"
                  :show-overflow-tooltip="true"
               ></el-table-column>
               <el-table-column prop="" label="操作" align="center" fixed="right" width="70px">
                  <template slot-scope="scope">
                     <el-button-group>
                        <el-button type="text" size="small" @click="printFun(scope.row)">
                           打印
                        </el-button>
                     </el-button-group>
                  </template>
               </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div v-if="tableList.length > 0" class="m-top-sm clearfix">
               <el-pagination
                  @size-change="handlePageChange"
                  @current-change="handlePageChange"
                  :current-page.sync="pagination.PN"
                  :page-size="pagination.PageSize"
                  layout="total,prev, pager, next, jumper"
                  :total="pagination.TotalNumber"
                  class="text-right"
               ></el-pagination>
            </div>
            <div v-else style="height: 42px"></div>
         </div>
      </div>
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
         formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, VipCode: "" },
         tableList: [],
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 0
         },
         exportData: { show: false },
         tableHeight: 300
      };
   },
   computed: {
      ...mapGetters({}),
      dataListState() {
         return this.$store.getters.cReportDataState.award;
      }
   },
   watch: {
      dataListState(data) {
         if (this.loading) {
            if (data.success) {
               this.pagination = Object.assign({}, data.paying);
               this.tableList = [...data.List];
               console.log(11, data);
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
         this.formData = Object.assign(this.formData, data);
         this.getNewData();
      },
      getNewData() {
         this.loading = true;
         indexQuery.integral(this, "award", this.formData);
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
               this.tableHeight = window.innerHeight - top - marginSpace - pager;
               this.$refs.contentTable.doLayout();
            });
         }
      }
   },
   mounted() {
      let homeInfo = getHomeData();
      this.formData = Object.assign(
         this.formData,
         {
            ShopId: homeInfo.shop.ID,
            BeginDate: this.getTimeStamp(),
            EndDate: new Date().getTime()
         },
         {
            PN: 1,
            VipCode: ""
         }
      );
      this.getNewData();
      this.setHeight();
   },
   components: {
      filtePage: () => import("@/views/reports/filtePage.vue"),
      exportPage: () => import("@/components/export/common.vue")
   }
};
</script>
