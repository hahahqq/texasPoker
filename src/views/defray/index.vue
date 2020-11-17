<template>
  <el-container>
    <el-header style="height: 50px">
      <headerPage></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="content-new-fex">
          <!-- 支出明细 -->
          <div>
            <div class="content-eighty">
              <div class="content-center">
                <el-row>
                  <el-col :span="6" style="text-align: left">
                    <el-button size="small" type="primary" @click="handleNew">新增支出</el-button>

                    <el-button
                      size="small"
                      class="m-left-sm"
                      plain
                      @click="exportChange"
                    >
                      导 出
                    </el-button>


                  </el-col>
                  <el-col :span="18" style="text-align:right">
                    <el-select
                      v-model="pageData.ItemId"
                      placeholder="请选择支出项目"
                      clearable
                      class="m-bottom-sm"
                      size="small"
                    >
                      <el-option
                        v-for="item in paymentList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="pageData.PayTypeId"
                      placeholder="请选择付款方式"
                      clearable
                      class="m-bottom-sm"
                      size="small"
                    >
                      <el-option
                        v-for="item in paywayList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>

                    <el-date-picker
                      size="small"
                      v-model="dateBE"
                      type="daterange"
                      style="width: 300px"
                      value-format="timestamp"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="m-bottom-sm"
                    ></el-date-picker>
                    <el-button
                      type="primary"
                      @click="getNewData(1)"
                      class="m-bottom-sm"
                      size="small"
                    >
                      查 询
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 列表 -->
            <div class="content-table4">
              <div class="content-table-center">
                <el-table
                  size="small"
                  :data="dataList"
                  v-loading="loading"
                  header-row-class-name="bg-theme2 text-white"
                  style="width: 100%"
                  :height="tableHeight"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="ITEMNAME" label="支出项目"></el-table-column>
                  <el-table-column prop="EXPENDMONEY" label="支出金额"></el-table-column>
                  <el-table-column prop="DATESTR" label="支出时间"></el-table-column>
                  <el-table-column prop="EMPNAME" label="支出人员"></el-table-column>
                  <el-table-column prop="PAYTYPENAME" label="付款方式"></el-table-column>
                  <el-table-column prop="REMARK" label="备注"></el-table-column>
                  <el-table-column label="操作" fixed="right" align="right">
                    <template slot-scope="scope">
                      <el-button-group>
                        <!-- <el-button type="text" size="small">详情</el-button> -->
                        <el-button
                          type="text"
                          size="small"
                          @click="handleCancel(scope.$index, scope.row)"
                          style="margin-left: 20px"
                        >
                          删除
                        </el-button>
                      </el-button-group>
                      <div class="hide">{{ scope.row }}</div>
                    </template>
                  </el-table-column>
                </el-table>

              <!-- 分页 -->
              <div v-show="dataList.length > 0" class="m-top-sm clearfix elpagination">
                <el-pagination
                  background
                  @size-change="handlePageChange"
                  @current-change="handlePageChange"
                  :current-page.sync="pagination.PN"
                  :page-size="pagination.PageSize"
                  layout="total,prev, pager, next, jumper"
                  :total="pagination.TotalNumber"
                  class="text-right"
                ></el-pagination>
              </div>
              </div>
            </div>
            <!-- item -->
            <el-dialog
              :title="dealType == 'add' ? '新增' + title : '编辑' + title"
              :visible.sync="showItem"
              width="600px"
              style="max-width: 100%"
            >
              <itemPage
                @closeModal="showItem = false"
                @resetList="
                  showItem = false;
                  getNewData(1);
                "
                :dealType="{ type: dealType, state: showItem }"
              ></itemPage>
            </el-dialog>
          </div>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_DEFRAY from "@/mixins/defray.js";
import { getHomeData } from "@/api/index";
import dayjs from "dayjs";

export default {
  mixins: [MIXINS_DEFRAY.DEFRAY_MENU, MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
  data() {
    return {
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      showItem: false,
      title: "费用支出",
      dealType: "add",
      pageData: {
        ShopId: "",
        BeginDate: "",
        EndDate: "",
        PayTypeId: "",
        ItemId: "",
        PN: 1
      },
      dateBE: [new Date(this.getCustomDay(-7)).getTime(), new Date().getTime()],
      paywayList: [],
      tableHeight: document.body.clientHeight - 230
    };
  },
  computed: {
    ...mapGetters({
      dataListState: "defrayListState",
      dataList: "defrayList",
      dataState: "defrayState",
      shopList: "shopList",
      paymentList: "paymentList",
      paywayListState: "paywayListState",
      dataExportState: "defrayReportExportState" // 支出分析导出
    })
  },
  watch: {
    dataExportState(data) {
      if (data.success) {
        // 支出分析导出
        this.exportList = [...data.data.List];
        if (this.exportList.length > 0) {
          let list = [...this.exportList];
          for (let i in list) {
            list[i].BILLDATE = new Date(list[i].BILLDATE);
          }
          let head = ["支出项目", "支出金额", "支出时间", "支付方式", "经办人", "备注"];
          let val = ["ITEMNAME", "MONEY", "BILLDATE", "PAYTYPENAME", "EMPNAME", "REMARK"];
          let title = "支出分析表" + this.getNowDateTime();

          this.export2Excel(head, val, list, title);
        }
      } else {
        this.exportList = [];
        this.$message({
          message: "数据有误，导出失败",
          type: "error"
        });
      }
      this.loading = false;
    },
    paywayListState(data) {
      for (var i in data.data.List) {
        if (data.data.List[i].NAME == "积分支付") {
          data.data.List.splice(i, 1);
        }
      }
      this.paywayList = data.data.List;
    },
    dataListState(data) {
      console.log(data);
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
      }
    },
    dataState(data) {
      this.loading = false;
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      if (data.success) {
        this.getNewData(1);
      }
    }
  },
  methods: {
    exportChange() {
      if (this.dataList.length != 0) {
        let sendData = Object.assign({}, this.pageData);
        sendData.BeginDate = new Date(this.dateBE[0]).getTime();
        sendData.EndDate = new Date(this.dateBE[1]).getTime();
        this.$store.dispatch("getdefrayReportData_Export", sendData).then(() => {
          // this.loading = true;
        });
      } else {
        this.$message({ message: "无支出明细 ！", type: "warning" });
      }
    },
    // formatStatus: function(row, column) {
    //   return row.ISSTOP ? "启用" : "作废";
    // },
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData(0);
    },
    getNewData(type) {
      let sendData = Object.assign({}, this.pageData);
      sendData.BeginDate = dayjs(this.dateBE[0]).format("YYYY-MM-DD");
      sendData.EndDate = dayjs(this.dateBE[1]).format("YYYY-MM-DD");
      if (type == 1) {
        sendData.PN = 1;
      }
      this.$store.dispatch("getDefrayList", sendData).then(() => {
        this.loading = true;
      });
    },
    handleNew() {
      this.dealType = "add";
      this.showItem = true;
    },
    handleEdit(index, row) {},
    handleCancel(index, row) {
      if (!this.isPurViewFun(601050207)) {
        this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
        return;
      }
      this.$confirm("作废: " + row.ITEMNAME + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("cancelDefray", {
              type: "del",
              BILLID: row.BILLID
            })
            .then(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消作废"
          });
        });
    },
    defaultData() {
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList",{});
      }
      if (this.paymentList.length == 0) {
        this.$store.dispatch("getPaymentList", {});
      }
      if (this.paywayList.length == 0) {
        this.$store.dispatch("getPaywayList");
      }

      // if (this.dataList.length == 0) {
        this.getNewData(1);
      // }
      this.pageData.ShopId = getHomeData().shop.ID;
    }
  },
  mounted() {
    this.defaultData();
  },
  components: {
    headerPage: () => import("@/components/header"),
    itemPage: () => import("./item.vue")
  }
};
</script>
<style scoped>
.member-header {
  display: flex;
  align-items: center;
  height: 50px;
}
.center-title {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border: solid 1px #edeeee;
}
.center-cont {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.el-header {
  padding: 0 !important;
}
.shop {
  display: flex;
  align-items: center;
  height: 50px;
  position: relative;
}
.shop .name {
  position: absolute;
  right: 50px;
  height: 50px;
  line-height: 50px;
  width: 150px;
  text-align: center;
  top: 0;
  /* background: rebeccapurple; */
}
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #f4f5fa;
  color: #333;
}
.member-main-top {
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 150px;
  background: #fff;
}
.member-main-table {
  margin-top: 8px;
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 600px;
  background: #fff;
}
.member-main-top-buttom {
  height: 70px;
  width: 100%;
  line-height: 70px;
}
.member-main-top-type {
  height: 70px;
  width: 100%;
  line-height: 70px;
}
.defray-index-top {
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  background: #fff;
  height: 80px;
  line-height: 80px;
  margin-top: 5px;
  margin-bottom: 15px;
}
.defray-index-top-cont {
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.defray-table {
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  background: #fff;
}
</style>


