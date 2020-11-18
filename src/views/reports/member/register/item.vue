<template>
   <div v-loading="loading">
      <!-- 会员注册统计详情 -->
      <div v-if="typeData.item && typeData.item.BILLDATE" class="p-bottom-sm">
         时间：{{ typeData.item.dateStr }}
      </div>
      <div>
         <el-table
            border
            :data="tableList"
            :height="tHeight"
            ref="contentTable"
            header-row-class-name="bg-F1F2F3"
         >
            <el-table-column prop="NAME" label="会员名称"></el-table-column>
            <el-table-column prop="CODE" label="会员编号"></el-table-column>

            <el-table-column prop="MOBILENO" label="手机号"></el-table-column>
            <el-table-column label="生日">
               <template slot-scope="scope">
                  <span v-if="scope.row.BIRTHDATE">
                     {{ new Date(scope.row.BIRTHDATE) | time }}
                  </span>
               </template>
            </el-table-column>
            <el-table-column label="性别">
               <template slot-scope="scope">
                  <span>{{ scope.row.SEX == 1 ? "女" : "男" }}</span>
               </template>
            </el-table-column>
            <el-table-column prop="STATUS" label="状态"></el-table-column>
            <el-table-column
               prop="REMARK"
               label="备注"
               width="210px"
               :show-overflow-tooltip="true"
            ></el-table-column>
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
      </div>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
   props: {
      typeData: {
         type: Object,
         default: function() {
            return {
               show: false,
               methodName: "",
               data: {
                  ShopId: "",
                  BeginDate: "",
                  EndDate: "",
                  PN: 1
               },
               item: {}
            };
         }
      }
   },
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
         tHeight: 450
      };
   },
   computed: {
      ...mapGetters({}),
      dataListState() {
         return this.$store.getters.cReportDataState.memberRegisterItem;
      }
   },
   watch: {
      typeData(data) {
         if (data.show) {
            this.defaultData();
         }
      },
      dataListState(data) {
         if (this.loading) {
            if (data.success) {
               this.pagination = Object.assign({}, data.paying);
               this.tableList = [...data.List];
               this.$nextTick(() => {
                  this.$refs.contentTable.doLayout();
               });
            } else {
               this.$message.error(data.message);
            }
         }
         this.loading = false;
      }
   },
   methods: {
      closeModal(v) {
         this.$emit("closeModal", v);
      },
      getNewData() {
         this.loading = true;
         indexQuery.memberRegisterItem(this, "memberRegisterItem", this.formData);
      },
      handlePageChange: function(currentPage) {
         if (this.formData.PN == currentPage || this.loading) {
            return;
         }
         this.formData.PN = parseInt(currentPage);
         this.getNewData();
      },
      defaultData() {
         this.formData = Object.assign({}, this.typeData.data);
         this.getNewData();
      }
   },
   mounted() {
      if (this.typeData.show) {
         this.defaultData();
      }
   }
};
</script>
