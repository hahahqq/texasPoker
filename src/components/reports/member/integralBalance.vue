<template>
  <div class>
    <div class="m-bottom-md">
      <!-- search -->
      <el-input
        type="default" size="small"
        v-model="searchText"
        placeholder="会员手机号/卡号/姓名"
        class="pull-right-"
        style="width: 300px;"
      >
        <el-button
          slot="append"
          type="default" size="small"
          @click="pageData.Filter=searchText;pageData.PN=1;getNewData()"
        >查询</el-button>
      </el-input>

      <el-dropdown @command="shopCheckfun" class="m-left-sm pull-right">
        <el-button type="primary" size="small">
          <span v-text="shopCheckText?shopCheckText:'请选择店铺'"></span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item :command="-1">全部</el-dropdown-item> -->
          <el-dropdown-item v-for="(item,i) in shopList" :key="i" :command="i">{{item.NAME}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--列表-->
    <el-table
      border
      :data="pagelist"
      max-height="500"
      header-row-class-name="bg-theme text-white"
      class="full-width"
    >
      <el-table-column prop="NAME" label="会员" width="120" sortable></el-table-column> 
      <el-table-column prop="MOBILENO" label="手机号" width="120"></el-table-column>
      <el-table-column prop="INTEGRAL" label="积分"></el-table-column>
      <el-table-column prop="MONEY" label="余额"></el-table-column>
      <el-table-column prop="DISCOUNT" label="剩余次卡"></el-table-column>
      <el-table-column label="最近消费日期">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.LASTTIME) | time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更多" width="70">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="getNewIBList(scope.row.CODE)" >详情</el-button>
          <div class="hide">{{scope.row}}</div>
        </template>
      </el-table-column>
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
    <!-- item -->
    <el-dialog :title="title" :visible.sync="isShowList" width="90%" style="max-width:100%;">
      <listPage @closeModal="isShowList=false" :dataType="{'data':ruleFrom2,'state':isShowList}"></listPage>
    </el-dialog>
  </div>
  <!-- 余额积分 -->
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_REPORT from "@/mixins/report";
import MIXINS_INDEX from "@/mixins/index";
import { getHomeData } from "@/api/index";
export default {
  mixins: [
    MIXINS_REPORT.SIDERBAR_MENU,
    MIXINS_REPORT.COMMOM_PAGE,
    MIXINS_INDEX.IS_SHOW_POPUP
  ],
  props: {
    pageState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagelist: [],
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
        LevelName: "",
        VipFlag: ""
      },
      shopCheckText: "",
      shopCheckidx: ""
    };
  },
  computed: {
    ...mapGetters({
      memberList: "memberList",
      memberListState: "memberListState",
      dataList: "integralBalanceList",
      dataListState: "integralBalanceListState",
      dataListArr: "integralBalanceListARR",
       shopList: "shopList",
    })
  },
  watch: {
    pageState(v) {
      if (this.dataList.length == 0) {
        this.getNewData();
      }
    },
    memberListState(data) {
      this.loading = false;
      if (data.success) {
        this.defaultData();
      }
    },
  },
  methods: {
    getNewData() {
      let sendData = Object.assign({},this.ruleFrom,this.pageData);
      this.$store.dispatch("clearMemberList").then(() => {
        this.pageData.PN = 1;
        this.$store.dispatch("getMemberList", sendData);
        this.loading = true;
      });
    },
    getNewIBList(code) { // 详细
      let index = 0;
      let sendData = {
        obj: { index: index, obj: "balance" },
        data: Object.assign({},this.ruleFrom,{'code':code})
      };
      this.ruleFrom2 = Object.assign({}, sendData);
      this.$store.dispatch("clearBalanceList", 1).then(() => {
        this.$store.dispatch("getintegralBalanceList", sendData);
        this.title = this.dataListArr[index].title;
      });
    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.$store
        .dispatch(
          "getMemberList",
          Object.assign({}, this.ruleFrom, this.pageData)
        )
        .then(() => {
          this.loading = true;
        });
    },
    shopCheckfun(index) { 
      if (index == -1) {
        this.shopCheckidx = -1;
        this.shopCheckText = "全部店铺";
        this.ruleFrom.ShopId = "";
      } else {
        this.shopCheckidx = index;
        this.shopCheckText = this.shopList[index].NAME;
        this.ruleFrom.ShopId = this.shopList[index].ID;
      }
      this.getNewData();
    },
    defaultData() {
      this.pagelist = [...this.memberList];
      this.pagination = {
        TotalNumber: this.memberListState.paying.TotalNumber,
        PageNumber: this.memberListState.paying.PageNumber,
        PageSize: this.memberListState.paying.PageSize,
        PN: this.memberListState.paying.PN
      };
      this.pageData.PN = this.memberListState.paying.PN;
    }
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.ruleFrom.ShopId = getHomeData().shop.ID;
      this.shopCheckText = getHomeData().shop.NAME
      this.getNewData();
    } else {
      this.defaultData();
    }
  },
  components: {
    'listPage': () => import("@/components/reports/management/tableList")
  }
};
</script>
<style scoped>
</style>
