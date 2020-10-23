<template>
  <div>
    <el-radio-group v-model="pageData.Type" @change="getNewData">
      <el-radio :label="0">待使用</el-radio>
      <el-radio :label="1">已使用</el-radio>
      <el-radio :label="2">已过期</el-radio>
    </el-radio-group>

    <el-table
      :data="tableData"
      v-loading="loading"
      height="350"
      size="small"
      header-row-class-name="bg-theme2 text-white"
      style="width: 100%; margin-top: 10px"
    >
      <!-- <el-table-column prop="" label="类型"></el-table-column> -->
      <el-table-column label="领取时间">
        <template slot-scope="scope">{{ new Date(scope.row.WRITETIME) | timehf }}</template>
      </el-table-column>
      <el-table-column prop="" label="名称">
        <template slot-scope="scope">
          满{{ scope.row.LIMITMONEY }} 减 {{ scope.row.MONEY }}元
        </template>
      </el-table-column>
      <el-table-column prop="MONEY" label="价值"></el-table-column>
      <el-table-column prop="LIMITMONEY" label="使用条件"></el-table-column>
      <el-table-column prop="ENDDATE" label="有效期"></el-table-column>
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
export default {
  data() {
    return {
      pageData: {
        openID: "",
        vipID: "",
        Type: 0,
        PN: 1
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      tableData: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      dataInfo: "memberItemInfo",
      memberItem: "memberItem",
      couponListState: "couponListState"
    })
  },
  watch: {
    couponListState(data) {
      console.log(data);
      this.loading = false;
      if (data.success) {
        this.tableData = data.paying.DataArr;
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
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

      this.$store.dispatch("getcouponListState", this.pageData).then(() => {
        this.loading = true;
      });
    }
  },
  mounted() {
    this.getNewData();
  }
};
</script>
