<template>
   <div v-loading="loading">
      <!-- 商品分析 -->
      <div>
         <el-table
            border
            :data="tableList"
            :height="tHeight"
            ref="contentTable"
            header-row-class-name="bg-F1F2F3"
         >
            <el-table-column
               v-for="(item, i) in tableColumn"
               :key="i"
               :prop="item.prop"
               :label="item.label"
               :align="item.align ? 'right' : 'left'"
               :width="item.width ? item.width : ''"
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
import { columnData } from "@/store/modules2/report/tableColumn.js";
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
                  PN: 1,
                  GoodsId: ""
               }
            };
         }
      }
   },
   data() {
      return {
         loading: false,
         formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, GoodsId: "" },
         tableList: [],
         tableColumn: [],
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
         return this.$store.getters.cReportDataState.goodsItem;
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
         indexQuery.goodsItem(this, "goodsItem", this.formData);
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
         this.tableColumn = columnData.goods.item;
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
