<template>
  <div>
    <div class="full-width pull-left" style="height: 40px; line-height: 40px; margin-bottom: 10px">
      <span class="pull-left">
        累计参赛
        <i class="text-red font-14">{{ MatchCount }}</i>
        次，共消费
        <i class="text-red font-14">{{ MatchMoney }}</i>
        积分
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
      <el-table-column prop="MATCHNAME" label="赛事名称"></el-table-column>
      <el-table-column prop="QTY" label="买入手数"></el-table-column>
      <el-table-column prop="MONEY" label="扣减积分"></el-table-column>
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
      MatchCount: 0,
      MatchMoney: 0
    };
  },
  computed: {
    ...mapGetters({
      dataInfo: "memberItemInfo",
      participateState: "participateState"
    })
  },
  watch: {
    participateState(data) {
      console.log(data);

      this.loading = false;
      if (data.success) {
        this.tableData = data.data.PageData.DataArr;
        this.MatchCount = data.data.MatchCount;
        this.MatchMoney = data.data.MatchMoney;
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

      this.$store.dispatch("getParticipateList", this.pageData).then(() => {
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
