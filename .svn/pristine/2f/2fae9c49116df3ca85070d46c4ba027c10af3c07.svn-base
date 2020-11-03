<template>
  <div>
    <div class="full-width pull-left" style="height: 40px; line-height: 40px; margin-bottom: 10px">
      <span class="pull-left">
        累计消费
        <i class="text-red font-14">{{ SaleCount }}</i>
        笔，共
        <i class="text-red font-14">{{ SaleMoney }}</i>
        元
      </span>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      height="340"
      size="small"
      header-row-class-name="bg-theme2 text-white"
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">{{ new Date(scope.row.BILLDATE) | timehf }}</template>
      </el-table-column>
      <el-table-column prop="GOODSNAME" label="商品名称"></el-table-column>
      <el-table-column prop="QTY" label="单价"></el-table-column>
      <el-table-column prop="PRICE" label="数量"></el-table-column>
      <el-table-column prop="MONEY" label="消费金额"></el-table-column>
      <el-table-column prop="SHOPNAME" label="消费店铺"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-show="tableData.length > 0" class="m-top-sm clearfix elpagination">
      <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page.sync="pagination.PN"
        :page-size="pagination.PageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.TotalNumber"
        class="text-center"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import dayjs from "dayjs";
export default {
  data() {
    return {
      pageData: {
        VipId: "",
        PN: 1
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      tableData: [],
      loading: false,
      SaleCount: 0,
      SaleMoney: 0
    };
  },
  computed: {
    ...mapGetters({
      dataInfo: "memberItemInfo",
      consumeState: "consumeState"
    })
  },
  watch: {
    consumeState(data) {
      this.loading = false;
      if (data.success) {
        this.tableData = data.data.PageData.DataArr;
        this.SaleCount = data.data.SaleCount;
        this.SaleMoney = data.data.SaleMoney;
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    }
  },
  methods: {
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    getNewData() {
      if (Object.keys(this.dataInfo).length == 0) {
        this.$message.error("会员信息出错！");
        return;
      }
      this.pageData.VipId = this.dataInfo.ID;

      this.$store.dispatch("getConsumeList", this.pageData).then(() => {
        this.loading = true;
      });
    }
  },
  mounted() {
    this.pageData.PN = 1
    this.getNewData();
  }
};
</script>
