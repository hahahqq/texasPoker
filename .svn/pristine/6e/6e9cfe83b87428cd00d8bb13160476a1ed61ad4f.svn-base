<template>
  <div>
    <!-- 积分调整 -->
    <div class="m-bottom-sm clearfix">
            <span v-if="pagelist.length>0">{{pagelist[0].CAPTION1}}</span>
            <el-button-group v-if="pagelist.length>0" class="m-left-sm">
                <el-button
                    size="mini"
                    class="m-left-sm"
                    type="primary"
                    @click="changeFun(601050204)"
                >调整</el-button>
            </el-button-group>
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-refresh"
                plain
                class="pull-right"
                @click="pageData.PN=1;getNewData()"
            >刷新</el-button>
        </div>
    <!--列表-->
    <el-table
      border
      :data="pagelist"
      v-loading="loading"
      height="350"
      header-row-class-name="bg-theme2 text-white"
      style="width: 100%;"
    >
      <el-table-column prop="BILLDATE" label="时间" width="140" sortable :formatter="formatDate"></el-table-column>
      <el-table-column prop="SM" label="说明" width="270"></el-table-column>
      <el-table-column prop="GETINTEGRAL" label="获得积分"></el-table-column>
      <el-table-column prop="CURRINTEGRAL" label="获得后积分"></el-table-column>
      <el-table-column prop="SHOPNAME" label="消费店铺"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
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
    <el-dialog width="500px" title="积分调整" :visible.sync="isShowDeal" append-to-body>
      <adjust
        @closeModal="isShowDeal=false"
        @resetData="getNewData();isShowDeal=false"
        :theState="isShowDeal"
        :theData="dataInfo"
      ></adjust>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: ["pageState"],
  data() {
    return {
      pagelist: [],
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      SumBillCount: 0,
      SumMoney: 0,
      pageData: { PN: 1 },
      isShowDeal: false
    };
  },
  computed: {
    ...mapGetters({
      dataList: "memberIntegralList",
      dataListState: "memberIntegralState",
      dataInfo: "memberItemInfo"
    })
  },
  watch: {
    pageState(value) {
      if (!value) return;
      if (this.dataList.length == 0) {
        this.getNewData();
      } else {
        this.pagelist = [...this.dataList];
      }
    },
    dataListState(data) {
      this.loading = false;
      this.pagelist = [...this.dataList];
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
        this.SumBillCount = data.SumBillCount ? parseInt(data.SumBillCount) : 0;
        this.SumMoney = data.SumMoney ? parseInt(data.SumMoney) : 0;
      }
    }
  },
  methods: {
    formatDate: function(row, column) {
      return this.filterTime(new Date(row.BILLDATE));
    },
    getNewData() {
      if (Object.keys(this.dataInfo).length == 0) {
        this.$message.error("会员信息出错！");
        return;
      }
      this.pageData.ID = this.dataInfo.ID;
      this.$store.dispatch("getMemberIntegral", this.pageData).then(() => {
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
    changeFun(number) {
      if (!this.isPurViewFun(number)) {
        this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
      } else {
        this.isShowDeal = true;
      }
    }
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.getNewData();
    } else {
      this.pagelist = [...this.dataList];
    }
  },
  components: {
    adjust: () => import("@/components/member/integralAdjust.vue")
  }
};
</script>

