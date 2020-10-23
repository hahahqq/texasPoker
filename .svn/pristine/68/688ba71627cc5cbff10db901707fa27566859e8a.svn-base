<template>
  <div class='formItemStyle'>
    <div>
      <el-form label-width="120px">
        <el-row :gutter="10" class="text-left">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="商品类别：">
              <el-select size="small" v-model="pageData.TypeID" clearable placeholder="请选择商品类别" class="full-width">
                <el-option
                  v-for="item in categoryList"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="编码/名称：">
              <el-input size='small' v-model="pageData.Filter" placeholder="请输入商品编码/名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="商品状态：">
              <el-radio-group size="small" v-model="pageData.Status">
                <el-radio-button size="small" label="-1">全部</el-radio-button>
                <el-radio-button size="small" label="0">停用</el-radio-button>
                <el-radio-button size="small" label="1">启用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item class="text-right full-width">
              <el-button size="small" @click="onSubmit(0)">重设</el-button>
              <el-button size="small" type="primary" @click="onSubmit(1)" :loading="loading">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="singleTable"
      :data="dataList"
      border size='small'
      highlight-current-row
      @current-change="handleCurrentChange"
      header-row-class-name="bg-theme text-white"
      height="230px"
      style="width: 100%"
    >
      <el-table-column prop="NAME" label="商品名称" width="120" fixed></el-table-column>
      <!-- <el-table-column prop="CODE" label="商品编码" width="130"></el-table-column> -->
      <el-table-column prop="TYPENAME" label="商品分类" width="100"></el-table-column>
      <el-table-column prop="PRICE" label="商品价格" width="120"></el-table-column>
      <el-table-column prop="PURPRICE" label="商品成本"></el-table-column>
      <el-table-column prop="STOCKQTY" label="库存"></el-table-column>
      <el-table-column prop='SERVICEMINUTE' label="服务时长"></el-table-column>
      <el-table-column prop="STATUS" label="状态" :formatter="formatStatus"></el-table-column>
      <el-table-column prop="GOODSMODE" label="类型" :formatter="formatMode" fixed="right"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-if="pagination.TotalNumber > 20" class="m-top-sm clearfix elpagination">
      <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page.sync="pagination.PN"
        :page-size="pagination.PageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.TotalNumber"
        class="text-center"
      ></el-pagination>
      <!-- <div class="text-center clearfix">
        <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
      </div> -->
    </div>
    <!-- handle -->
    <div class="text-right m-top-sm">
      <div class="hide">{{currentRow}}</div>
      <div class="m-right-md inline-block pull-left">商品：
        <el-tag size="medium" class="font-16">{{choseText}}</el-tag>
      </div>
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS from "@/mixins/index";
let _ = require("lodash");
export default {
  mixins: [MIXINS.IS_SHOW_POPUP],
  props:{
    chooseServer: Object
  },
  data() {
    return {
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      searchText: "",
      pageData: {
        PN: 1,
        Filter: "",
        Status: -1,
        Mode: -1,  // -1:all  0: 商品  1： 服务
        TypeID: "", //商品类别ID
        DescType: 0
      },
      currentRow: {},
      choseText: "点击商品进行选择"
    };
  },
  computed: {
    ...mapGetters({
      dataList: "goodsList",
      dataListState: "goodsListState",
      selgoods: "selgoods",
      categoryList: "categoryList"
    })
  },
  watch: {
    chooseServer(data){
      console.log(data)
    },
    isShowFirstPopup(value) {
      if (value && this.categoryList.length == 0) {
        this.$store.dispatch("getCategoryList");
      }
      if (value && this.dataList.length == 0) {
        this.getNewData();
      }
    },
    selgoods(data){
      if(data.ID == undefined){
        this.currentRow = {}
        this.choseText = '点击商品进行选择'
      }
      console.log(data)
    },
    dataListState(data) {
      this.loading = false;
      if(data.success){
        this.isFilter = false;
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        }
        this.pageData.PN = data.paying.PN;
      }
    }
  },
  methods: {
    closeModal(type) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    formatStatus: function(row, column) {
      // -1=all  1=启用 0=停用
      return row.STATUS == 0 ? "停用" : row.STATUS == 1 ? "启用" : "未知";
    },
    formatMode: function(row, column) {
      // 0=商品   1=服务项目
      return row.GOODSMODE == 0 ? "商品" : "服务项目";
    },
    getNewData() {
      this.pageData.Mode = this.chooseServer.type == 'server' ? 1 : -1
      this.$store.dispatch("getGoodsList", this.pageData).then(() => {
        this.loading = true;
      });
    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.choseText = this.currentRow.NAME;
    },
    handleSubmit() {
      this.$store.dispatch("selectingGoods", this.currentRow).then(() => {
        this.closeModal();
      });
    },
    onSubmit(v) {
      if (v == 1) {
        this.getNewData();
      } else {
        this.pageData = {
          PN: 1,
          Filter: "",
          Status: -1,
          Mode: -1,
          TypeID: "", //商品类别ID
          DescType: 0
        };
      }
    },
    defaultData() {
      let arr = this.$store.state.category.categoryList;
      if (arr.length == 0) {
        this.$store.dispatch("getCategoryList");
      }
      this.getNewData();
    }
  },
  mounted() {
    this.defaultData()
  }
};
</script>
<style lang="scss" scoped >
  .formItemStyle .el-form-item{
    margin-bottom: 12px;
  }
</style>
