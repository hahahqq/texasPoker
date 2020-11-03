<template>
  <div>
    <!-- <el-radio-group v-model="pageData.Type" @change="getNewData">
      <el-radio :label="0">待使用</el-radio>
      <el-radio :label="1">已使用</el-radio>
      <el-radio :label="2">已过期</el-radio>
    </el-radio-group> -->
    <div class="full-width pull-left" style="height: 40px; line-height: 40px; margin-bottom: 10px">
      <span class="pull-left">
        累计获得
        <i class="text-red font-14">{{ SumCount }}</i>
        次，共
        <i class="text-red font-14">{{ SumQty }}</i>
        大师分
      </span>

      <span class="pull-right">
        <el-radio-group size="small" v-model="radio1" @change="selectDateFun">
          <el-radio-button label="近30天"></el-radio-button>
          <el-radio-button label="近3个月"></el-radio-button>
          <el-radio-button label="近1年"></el-radio-button>
        </el-radio-group>
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
      <el-table-column prop="CONTESTQTY" label="大师分"></el-table-column>
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
      radio1: "近30天",
      pageData: {
        VipId: "",
        PN: 1,
        BeginDate: 1,
        EndDate: new Date().getTime()
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      tableData: [],
      loading: false,
      SumCount: 0,
      SumQty: 0
    };
  },
  computed: {
    ...mapGetters({
      dataInfo: "memberItemInfo",
      contestState: "contestState"
    })
  },
  watch: {
    contestState(data) {
      console.log(data);

      this.loading = false;
      if (data.success) {
        this.tableData = data.data.PageData.DataArr;
        this.SumCount = data.data.SumCount;
        this.SumQty = data.data.SumQty;
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
    selectDateFun() {
      let beginDateYMD = "";
      if (this.radio1 == "近30天") {
        beginDateYMD = dayjs().subtract(30, "day").format("YYYY-MM-DD");
      } else if (this.radio1 == "近3个月") {
        beginDateYMD = dayjs().subtract(90, "day").format("YYYY-MM-DD");
      } else if (this.radio1 == "近1年") {
        beginDateYMD = dayjs().subtract(365, "day").format("YYYY-MM-DD");
      }
      this.pageData.BeginDate = new Date(beginDateYMD).getTime();
      this.pageData.EndDate = new Date().getTime();
      this.pageData.PN = 1;
      this.pageData.VipId = this.dataInfo.ID;
      this.$store.dispatch("getConTestList", this.pageData).then(() => {
        this.loading = true;
      });
    },
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

      this.$store.dispatch("getConTestList", this.pageData).then(() => {
        this.loading = true;
      });
    }
  },
  mounted() {
    this.radio1 = "近30天";
    this.pageData.PN = 1
    this.pageData.BeginDate = new Date(dayjs().subtract(30, "day").format("YYYY-MM-DD")).getTime();
    this.getNewData();
  }
};
</script>
