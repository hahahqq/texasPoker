<template>
  <div>
    <!-- 支出报表 支出分析 -->
    <div class="m-bottom-sm">
      <el-select v-model="pageData.ShopId" placeholder="请选择店铺" class style="width:180px;">
        <el-option label="请选择店铺" value></el-option>
        <el-option v-for="item in shopList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
      </el-select>
      <el-date-picker
        v-model="dateBE"
        type="daterange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:290px"
      ></el-date-picker>
      <el-button type="primary" @click="getNewData(1)" size="small" class :loading="loading">查 询</el-button>
    </div>
    <!--列表-->
    <el-table
      border
      :data="dataList"
      v-loading="loading"
      height="300"
      header-row-class-name="bg-theme text-white"
    >
      <el-table-column prop="ITEMNAME" label="名称" width="120" sortable></el-table-column>
      <el-table-column prop="BILLCOUNT" label="数量"></el-table-column>
      <el-table-column prop="FRATE" label="概率"></el-table-column>
      <el-table-column prop="MONEY" label="金额"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="dataList.length>0" class="m-top-sm clearfix elpagination">
      <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page.sync="pagination.PN"
        :page-size="pagination.PageSize"
        layout="prev, pager, next, jumper"
        :total="pagination.TotalNumber"
        class="text-center"
      ></el-pagination>
      <div class="text-center clearfix">
        <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: false,
      pageData: {
        ShopId: "",
        PayTypeId: "",
        PN: 1,
        BeginDate: "",
        EndDate: ""
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      dateBE: [new Date(this.getCustomDay(-7)).getTime(), new Date().getTime()]
    };
  },
  computed: {
    ...mapGetters({
      dataList: "reportList",
      dataListState: "reportListState",
      shopList: "shopList"
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
      } else {
        this.$message.error(data.message);
      }
    }
  },
  methods: {
    getNewData(type) {
      let sendData = Object.assign({}, this.pageData);
      sendData.BeginDate = this.dateBE[0];
      sendData.EndDate = this.dateBE[1];
      if (type == 1) {
        sendData.PN = 1;
      } else {
        delete sendData.PN;
      }
      this.$store
        .dispatch("getReportList", { obj: "defrayReport", data: sendData })
        .then(() => {
          this.loading = true;
        });
    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData(0);
    },
    defaultData() {
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList");
      }
      // this.dateBE = [
      //   this.getToday(),
      //   this.getCustomDay(7)
      // ];
    }
  },
  mounted() {
    this.defaultData();
  }
};
</script>

