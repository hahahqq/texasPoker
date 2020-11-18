<template>
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
         <el-table-column prop="BILLDATE" label="日期"></el-table-column>
         <el-table-column prop="VIPCOUNT" label="会员数" align="right"></el-table-column>
         <el-table-column label="操作" align="center" width="70px">
            <template slot-scope="props">
               <el-button type="text" @click="getItemData(props.row)" class="no-padding">
                  详情
               </el-button>
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
      <!-- 详情 -->
      <el-dialog title="日报详情" :visible.sync="itemData.show" width="980px">
         <itemPage @closeModal="closeModalFun" :typeData="itemData"></itemPage>
      </el-dialog>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
const type = 1;
export default {
   props: {
      pageData: {
         type: Object,
         default: {
            ShopId: "",
            BeginDate: "",
            EndDate: "",
            show: false,
            type: type
         }
      }
   },
   data() {
      return {
         loading: false,
         formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, Type: 0 }, // 0=日报 1=月报
         tableList: [],
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 0
         },
         maxWidth: window.innerWidth - 212,
         itemData: { show: false },
         tableHeight: 300
      };
   },
   computed: {
      ...mapGetters({}),
      dataListState() {
         return this.$store.getters.cReportDataState.memberRegister;
      }
   },
   watch: {
      pageData(data) {
         if (data.show && data.type == type) {
            this.defaultData();
         }
      },
      dataListState(data) {
         if (this.loading) {
            if (data.success) {
               this.pagination = Object.assign({}, data.paying);
               this.tableList = [...data.List];
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
         indexQuery.memberRegister(this, "memberRegister", this.formData);
      },
      handlePageChange: function(currentPage) {
         if (this.formData.PN == currentPage || this.loading) {
            return;
         }
         this.formData.PN = parseInt(currentPage);
         this.getNewData();
      },
      getItemData(item) {
         console.log(item);
         let start = new Date(new Date(item.BILLDATE).toLocaleDateString()).getTime();
         let end = start + 24 * 60 * 60 * 1000 - 1;
         this.itemData = {
            show: true,
            data: {
               ShopId: this.formData.ShopId,
               BeginDate: start,
               EndDate: end,
               PN: 1
            },
            item: Object.assign({ dateStr: item.BILLDATE }, item)
         };
      },
      closeModalFun(v) {
         if (v) {
            this.getNewData();
         }
         this.itemData.show = false;
      },
      defaultData() {
         this.formData = Object.assign({}, this.pageData, { Type: 0, PN: 1 });
         this.getNewData();
      },
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
      if (this.pageData.show && this.pageData.type == type) {
         this.defaultData();
      }
      this.setHeight();
   },
   components: {
      itemPage: () => import("./item.vue")
   }
};
</script>
