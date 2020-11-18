<template>
   <div v-loading="loading" class="mallGoods bg-white p-bottom-sm">
      <div class="content-center paddingTB-sm text-right">
         <div class="pull-left">
            <el-button type="primary" size="small" @click="handleAdd">
               添加商品
            </el-button>
         </div>
         <div class="inline-block text-right">
            <span>分类：</span>
            <el-dropdown @command="IsSaleFun">
               <el-button type="default" size="small" style="width: 120px" class="text-left">
                  <span v-if="pageData.IsSale == -1">全部</span>
                  <span v-if="pageData.IsSale == 1">上架</span>
                  <span v-if="pageData.IsSale == 0">下架</span>
                  <i class="el-icon-arrow-down el-icon--right pull-right"></i>
               </el-button>
               <el-dropdown-menu slot="dropdown" size="small" style="width: 120px">
                  <el-dropdown-item command="-1">全部</el-dropdown-item>
                  <el-dropdown-item command="1">上架</el-dropdown-item>
                  <el-dropdown-item command="0">下架</el-dropdown-item>
               </el-dropdown-menu>
            </el-dropdown>
            <!-- search -->
            <el-input
               size="small"
               v-model="pageData.Filter"
               placeholder="请输入商品名称或编码"
               clearable
               style="width: 300px"
            >
               <template slot="append">
                  <!-- <el-button size="small" type="primary" @click="getNewData">
                     搜索
                  </el-button> -->
                  <span @click="getNewData" class="inline-block pointer">搜索</span>
               </template>
            </el-input>
         </div>
      </div>
      <div class="bg-elMain padding-xs" @click="setHeight"></div>
      <div class="content-table-center">
         <div class="m-bottom-sm">
            <el-radio-group v-model="pageData.state" size="small" @change="changeRadioFun">
               <el-radio-button v-for="(item, i) in pageList" :key="i" :label="item.value">
                  {{ item.label }}
               </el-radio-button>
            </el-radio-group>
         </div>

         <!--列表-->
         <el-table
            border
            :data="tableList"
            v-loading="loading"
            @selection-change="handleSelectionChange"
            header-row-class-name="bg-f8 text-4e"
            style="width: 100%"
            ref="contentTable"
            :height="tableHeight"
         >
            <el-table-column type="selection" width="50" fixed="left"></el-table-column>
            <el-table-column label="商品名称" width="200">
               <template slot-scope="scope">
                  <div class="row-flex ">
                     <div style="min-width: 36px;">
                        <img
                           :src="scope.row.src"
                           :onerror="imgError"
                           class="pull-left vertical-middle"
                           style="width: 36px; height: 36px; margin-right: 2px"
                        />
                     </div>
                     <div class="full-width p-left-sm" style="line-height:1.6">
                        <span class="block">{{ scope.row.NAME }}</span>
                        <span class="block">{{ scope.row.CODE }}</span>
                     </div>
                  </div>
               </template>
            </el-table-column>
            <el-table-column prop="TYPENAME" label="商品分类"></el-table-column>
            <el-table-column prop="" label="积分" align="right"></el-table-column>
            <el-table-column prop="" label="销量" align="right"></el-table-column>
            <el-table-column prop="STOCKQTY" label="库存" align="right"></el-table-column>
            <el-table-column prop="STATUS" label="状态" :formatter="formatStatus"></el-table-column>

            <el-table-column label="操作" width="100" align="center" fixed="right">
               <template slot-scope="scope">
                  <el-button
                     size="small"
                     type="text"
                     v-if="scope.row.ISSALE == 0"
                     @click="changeShelf_oneFun(1, scope.row.ID)"
                  >
                     上架
                  </el-button>
                  <el-button
                     size="small"
                     type="text"
                     v-if="scope.row.ISSALE == 1"
                     @click="changeShelf_oneFun(0, scope.row.ID)"
                  >
                     下架
                  </el-button>
                  <el-button
                     size="small"
                     type="text"
                     @click="handleEdit(scope.$index, scope.row)"
                     class="m-left-sm"
                  >
                     编辑
                  </el-button>
               </template>
            </el-table-column>
         </el-table>
         <!-- 分页 -->
         <div v-if="tableList.length > 0" class="m-top-sm clearfix elpagination">
            <div class="pull-left">
               <el-button
                  type="default"
                  size="small"
                  icon
                  @click="changeShelfFun(1)"
                  class="m-left-sm"
               >
                  批量上架
               </el-button>
               <el-button type="default" size="small" icon @click="changeShelfFun(0)">
                  批量下架
               </el-button>
            </div>
            <el-pagination
               @size-change="handlePageChange"
               @current-change="handlePageChange"
               :current-page.sync="pagination.PN"
               :page-size="pagination.PageSize"
               layout="total, prev, pager, next, jumper"
               :total="pagination.TotalNumber"
               class="text-right"
            ></el-pagination>
         </div>
         <div v-else style="height: 42px"></div>
      </div>

      <!-- 商品详情 -->
      <el-dialog append-to-body title="商品详情" :visible.sync="goodsData.isShow" width="980px">
         <goods-deal-page @closeModal="closeModalFun" :pageState="goodsData"></goods-deal-page>
      </el-dialog>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import goodsDealPage from "./deal.vue";
import { GOODS_IMGURL } from "@/util/define.js";
let _ = require("lodash");
export default {
   components: {
      goodsDealPage
   },
   data() {
      return {
         tableList: [],
         loading: false,
         pageData: {
            PN: 1,
            Filter: "",
            IsSale: -1,
            IsGift: -1,
            state: 0
         },
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 0
         },
         multipleSelection: [], // 选择的商品
         pageList: [
            { label: "全部", value: 0 },
            { label: "出售中", value: 1 },
            { label: "已售完", value: 2 },
            { label: "未上架", value: 3 }
         ],
         tableHeight: 0,
         goodsData: {
            isShow: false,
            data: {}
         },
         imgError: "static/images/default.png"
      };
   },
   computed: {
      ...mapGetters({
         dataState: "mallGoodsState",
         dataList: "mallGoodsList",
         dataListState: "mallGoodsListState",
         mallData: "mallData",
         dataItem: "mallGoodsItem"
      })
   },
   watch: {
      dataListState(data) {
         if (data.success) {
            this.pagination = {
               TotalNumber: data.paying.TotalNumber,
               PageNumber: data.paying.PageNumber,
               PageSize: data.paying.PageSize,
               PN: data.paying.PN
            };
            let arr = [],
               v = ".png?v=" + Math.random();
            this.dataList.forEach(element => {
               arr.push(Object.assign({ src: GOODS_IMGURL + element.ID + v }, element));
            });
            this.tableList = [...arr];
         } else {
            this.tableList = [];
         }
         this.loading = false;
         this.setHeight();
      },
      dataState(data) {
         if (data.success && this.loading) {
            this.$message({
               message: data.message,
               type: "success"
            });
            this.multipleSelection = [];
            this.getNewData();
         }
         if (!data.success && this.loading) {
            this.$message({
               message: data.message,
               type: "error"
            });
         }
         this.loading = false;
      }
   },
   methods: {
      getNewData() {
         let sendData = Object.assign({ shopId: this.mallData.STOCKSHOPID }, this.pageData);
         this.$store.dispatch("getMallGoodsList", sendData).then(() => {
            this.loading = true;
         });
      },
      formatPurprice: function(row, column) {
         return this.isPurViewFun(210040601) ? row.PURPRICE : "******";
      },
      formatStatus: function(row, column) {
         //// -1=全部，0=未上架，1=上架
         return row.ISSALE == 0 ? "下架" : "上架";
      },
      formatMode: function(row, column) {
         // 0=商品   1=服务项目
         return row.GOODSMODE == 0 ? "商品" : "服务项目";
      },
      handleSelectionChange(val) {
         this.multipleSelection = val;
      },
      handlePageChange: function(currentPage) {
         if (this.pageData.PN == currentPage || this.loading) {
            return;
         }
         this.pageData.PN = parseInt(currentPage);
         this.getNewData();
      },
      IsSaleFun: function(val) {
         this.pageData.PN = 1;
         this.pageData.IsSale = val;
         this.getNewData();
      },
      changeShelf_oneFun(type, id) {
         this.multipleSelection = [{ ID: id }];
         this.changeShelfFun(type);
      },
      changeShelfFun(type) {
         // 上下架
         let arr = [];
         this.multipleSelection.forEach(element => {
            arr.push({
               GoodsId: element.ID,
               IsSale: type
            });
         });
         if (arr.length == 0) {
            this.$message.error("请选择商品");
            return;
         }
         this.$store.dispatch("changeGoodsState", arr).then(() => {
            this.loading = true;
            this.pageData.IsSale = type;
            this.pageData.PN = 1;
         });
      },
      changeRadioFun: function(v) {
         this.getNewData();
      },
      handleAdd() {
         this.$router.push({ path: "/mall/goodsItem", query: {} });
      },
      handleEdit(idx, item) {
         this.$router.push({
            path: "/mall/goodsItem",
            query: { sid: this.mallData.STOCKSHOPID, id: item.ID }
         });
         // let sendData = Object.assign({ shopId: this.mallData.STOCKSHOPID, id: item.ID }, item);
         // this.goodsData = {
         //    isShow: true,
         //    data: sendData
         // };
      },
      closeModalFun(v) {
         if (v == 1) {
            this.goodsData = {
               isShow: false,
               data: {}
            };
            this.getNewData();
         } else if (v == 2) {
            let idx = this.tableList.findIndex(item => item.ID == this.dataItem.ID);
            if (idx > -1) {
               this.tableList[idx].src =
                  GOODS_IMGURL + this.dataItem.ID + ".png?v=" + Math.random();
            }
         } else {
            this.goodsData = {
               isShow: false,
               data: {}
            };
            console.log(v);
         }
      },
      setHeight() {
         if (this.$refs.contentTable) {
            let top = this.$refs.contentTable.$el.getBoundingClientRect().top;
            let marginSpace = 10 * 2,
               pager = 42;
            this.$nextTick(() => {
               this.tableHeight = window.innerHeight - top - marginSpace - pager;
               this.$refs.contentTable.doLayout();
            });
         }
      }
   },
   mounted() {
      this.getNewData();
   }
};
</script>
<style scoped>
.mallGoods .el-table thead th > .cell {
   text-align: center !important;
}
</style>
