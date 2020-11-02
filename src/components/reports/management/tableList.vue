<template>
  <div>
    <slot></slot>
    <div class="hide">{{pagelist}}</div>
    <!--列表-->
    <el-table
      border
      :data="pagelist"
      :span-method="arraySpanMethod"
      v-loading="loading"
      max-height="500"
      header-row-class-name="bg-theme2 text-white"
      style="width: 100%;"
    >
      <el-table-column v-for="(item,i) in tableColumn" :key="i" :label="item.label">
        <template slot-scope="scope">
          <div v-if="dataObj.obj=='business'">
            <img
              v-if="item.prop=='IMAGEURL'"
              :src="scope.row[item.prop]"
              style="width:78px;"
              alt="图片"
            >
            <span v-else-if="item.prop=='ISCANCEL'">{{scope.row[item.prop]?'启用':'作废'}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </div>
          <div v-else>
            <img
              v-if="item.prop=='IMAGEURL'"
              :src="scope.row[item.prop]"
              style="width:78px;"
              alt="图片"
            >
            <span v-else-if="item.prop=='STATUS'">{{scope.row[item.prop]?'启用':'作废'}}</span>
            <span v-else-if="item.prop=='BILLDATE'">{{new Date(scope.row[item.prop])| time}}</span>
            <span v-else-if="item.prop=='CREATEDATE'">{{new Date(scope.row[item.prop])| time}}</span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        v-if="dataObj.obj=='business'&&dataListArr[dataObj.index].caneclCode"
      >
        <template slot-scope="props">
          <div v-if="props.row.BILLID||props.row.ID">{{props.row.ISCANCEL?'已作废':'已启用'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="更多"
        v-if="dataObj.obj=='business'"
        :width="dataListArr[dataObj.index].caneclCode?150:80"
      >
        <template slot-scope="props">
          <div v-if="props.row.BILLID||props.row.ID||props.row.GOODSID">
            <el-button-group v-if="dataListArr[dataObj.index].caneclCode">
              <el-button type="info" plain @click="toCancelFun(props.row)" size="small">作废</el-button>
              <!-- <el-button type="primary" @click="toPrintFun(props.row)" size="small">打印</el-button> -->
            </el-button-group>
            <div v-else>
              <el-button
                v-if="
              dataObj.index==6||
              dataObj.index==7||
              dataObj.index==10||
              dataObj.index==11||
              dataObj.index==12"
                type="primary"
                plain
                size="small"
                @click="getItemFun(props.row)"
              >详情</el-button>
              <!-- <el-button v-else type="prmary" @click="toPrintFun(props.row)" size="small">打印</el-button> -->
            </div>
          </div>
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
    <el-dialog width="800px" :title="title" :visible.sync="isShowItem" append-to-body>
      <components
        :is="componentName"
        @closeModal="isShowItem=false"
        :pageState="isShowItem"
        :isReport="componentName=='memberItem'?true:false"
      ></components>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { columnData } from "./Table";
import { getUserInfo} from '@/api/index'
export default {
  props: {
    dataType: {
      type: Object,
      default: {
        obj: { index: 1, obj: "surplus" },
        data: { ShopId: "", BeginDate: "1", EndDate: "9999999999999" }
      }
    }
  },
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
      pageData: { PN: 0 },
      tableColumn: [],
      dataObj: {},
      mothed: "",
      isShowItem: false,
      componentName: "",
      title: ""
    };
  },
  computed: {
    ...mapGetters({
        dataList: "surplusReportList",
        dataListState: "businessReportListState",
        dataListArr: "businessReportListARR",
        selshop: "selshop",
        cancelState: "cancelbusinessState"
    }),
    dataList: function() {
      let name = this.$route.meta.name;
      if (name == "balance") {
        return this.$store.state["report_" + name].integralBalanceList;
      }
      let data = this.$store.state["report_" + name][name + "ReportList"];
      return data;
    },
    dataListState: function() {
      let name = this.$route.meta.name;
      if (name == "balance") {
        return this.$store.state["report_" + name].integralBalanceListState;
      }
      let data = this.$store.state["report_" + name][name + "ReportListState"];
      return data;
    }
  },
  watch: {
    dataLists(data){
      console.log("88888888888888889",data)

    },
    dataType(data) {
      this.pagelist = [];
      if (data.state) {
        this.defaultData();
      }
    },
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.defaultData();
      } else {
        // this.pagelist = [];
      }
    },
    isShowItem(v) {
      this.loading = false;
    },
    cancelState(data) {
      this.$message({
        message: data.success ? "作废成功" : data.message,
        type: data.success ? "success" : "error"
      });
      if (data.success) {
        this.$emit("resetModel", this.dataObj);
      }
    }
  },
  methods: {
    getNewData() {
      let sendData = Object.assign({}, this.dataType.data);
      if (this.pageData.PN > 0) {
        sendData.data.PN = this.pageData.PN;
      }
      console.log(sendData)
      this.$store.dispatch(this.mothed, sendData).then(() => {
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

    defaultData() {
      this.dataObj = this.dataType.data.obj;
      this.tableColumn = columnData[this.dataObj.obj][this.dataObj.index];
      this.mothed = "get" + this.$route.meta.name + "ReportList";
      let setDate = [...this.dataList];
      console.log("中国和否否佛苏打粉",setDate)
      let agentPermission = getUserInfo().List
      let arr = agentPermission.filter(element => element.MODULENAME == "查看成本价");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
      for(var i in setDate){
          setDate[i].GAINMONEY='***'
      }
      this.pagelist = setDate;
      console.log("数据出来佛士大夫",this.pagelist)
      } else {
          this.pagelist = setDate;
          console.log("数据出来佛士大夫1122222222222222",this.pagelist)
      }
      this.pagination = {
        TotalNumber: this.dataListState.paying.TotalNumber,
        PageNumber: this.dataListState.paying.PageNumber,
        PageSize: this.dataListState.paying.PageSize,
        PN: this.dataListState.paying.PN
      };
      this.pageData.PN = this.dataListState.paying.PN;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(columnIndex )
      // if (!row.ID && !row.BILLID) {
      //   if (columnIndex === 0) {
      //       return [1, 2];
      //     } else if (columnIndex === 1) {
      //       return [0, 0];
      //     }
      // }
    },
    getItemFun(item) {
      // 详情
      console.log('tableList get item',item);
      this.loading = true;
      if (this.dataObj.obj == "achievement") { // 业绩统计
        //   [
        //   { label: "售卡提成", value: "EmpMoney1", index: 1 },
        //   { label: "充值提成", value: "EmpMoney2", index: 2 },
        //   { label: "快速消费提成", value: "EmpMoney3", index: 3 },
        //   { label: "商品消费提成", value: "EmpMoney4", index: 4 },
        //   { label: "计次消费提成", value: "EmpMoney5", index: 5 }
        // ]
      }
      if (this.dataObj.obj == "business") {
        if (this.dataObj.index == 6) {
          this.componentName = "goodsItem";
          this.title = "商品消费单号：" + item.BILLNO;
          this.$store.dispatch("getCCGoodsItem", {
            BillId: item.BILLID,
            ShopId: item.SHOPID
          });
        }
        if (this.dataObj.index == 7) {
          this.componentName = "numberItem";
          this.title = "计次消费单号：" + item.BILLNO;
          this.$store.dispatch("getCCNumberItem", {
            BillId: item.BILLID,
            ShopId: item.SHOPID
          });
        }
        if (this.dataObj.index == 10) {
          this.componentName = "memberItem";
          this.title = "会员详情";
          this.$store.dispatch("getMemberItem", item)
        }
        if (this.dataObj.index == 11) {
          this.componentName = "goodsItemIO";
          this.title = "商品出入记录：" + item.GOODSNAME;
          this.$store.dispatch('getSalesDetails',item);
        }
        if (this.dataObj.index == 12) {
          this.componentName = "roomOrderItem";
          this.title = "房台消费记录：" + item.BILLNO;
          this.$store.dispatch('getRoomOrderItem',{RoomId:'',BillId:item.BILLID}).then(()=>{
            this.$store.dispatch("selectingRoomorder", item);
          })
        }
      }
      setTimeout(() => {
        this.isShowItem = true;
      }, 500);
    },
    toCancelFun(item) {
      if (!this.isPurViewFun(601050207)) {
        this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
        return;
      }
      // 作废 营业概况 this.dataObj.obj=='business'
      console.log(item);
      if (!this.dataListArr[this.dataObj.index].caneclCode) return;
      let title = this.dataListArr[this.dataObj.index].caneclTitle;
      title += "：" + item.BILLNO;
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let sendData = {
            obj: this.dataObj,
            data: { BillId: item.BILLID }
          };
          if (this.dataObj.index == 8) {
            sendData.ShopId = item.SHOPID;
          }
          this.$store.dispatch("cancelbusinessBills", sendData);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    },
    toPrintFun(item) {
      // 打印
      console.log(item);
    }
  },
  mounted() {
    this.defaultData();
  },
  components: {
    goodsItem: () => import("@/components/consumptionCheckout/CCGoodsItem.vue"),
    numberItem: () =>
      import("@/components/consumptionCheckout/CCNumberItem.vue"),
    memberItem: () => import("@/views/member/item.vue"),
    'goodsItemIO':() => import("@/components/reports/management/goods.vue"),
    roomOrderItem:()=>import("@/components/room/order/item.vue"),
  }
};
</script>

