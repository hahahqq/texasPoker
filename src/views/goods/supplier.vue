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
          <div class="integral">
            <div class="content-eighty">
              <div class="content-center">
                <el-row>
                  <el-col :span="12">
                    <el-button size="small" @click="handleAdd()" type='primary'>
                      新增供应商
                    </el-button>
                  </el-col>

                  <el-col :span="12" style="text-align: right">
                    <el-input
                      type="default"
                      size="small"
                      v-model="Filter"
                      placeholder="请输入供应商名称"
                      clearable
                      style="width: 250px"
                      @keyup.enter.native="getNewData()"
                    >
                      <el-button
                        slot="append"
                        type="default"
                        icon="el-icon-search"
                        @click="getNewData()"
                      ></el-button>
                    </el-input>
                    <div class="hide">{{ dataList }}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!--列表-->
            <div class="content-table4">
              <div class="content-table-center">
                <el-table
                  :data="pagelist"
                  v-loading="loading"
                  element-loading-text="数据加载中..."
                  size="small"
                  :height="tableHeight"
                  header-row-class-name="bg-theme2 text-white"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="NAME" label="供应商名称"></el-table-column>
                  <el-table-column prop="LINKER" label="联系人" width="100"></el-table-column>
                  <el-table-column prop="PHONENO" label="手机号" width="100"></el-table-column>
                  <el-table-column
                    prop="FIRSTMONEY"
                    label="期初欠款"
                    align="right"
                  ></el-table-column>
                  <el-table-column
                    prop="CURRMONEY"
                    label="欠供应商款"
                    align="right"
                  ></el-table-column>
                  <el-table-column label="操作" align="right">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="text"
                        @click="handlePayMoney(scope.$index, scope.row)"
                      >
                        还款
                      </el-button>

                      <el-button
                        size="small"
                        type="text"
                        @click="handleView(scope.$index, scope.row)"
                      >
                        对账
                      </el-button>

                      <el-button size="small" type="text" @click="handleDeal(scope.row)">
                        详情
                      </el-button>

                      <el-button
                        size="small"
                        type="text"
                        @click="handleDel(scope.$index, scope.row)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

          <!-- 供应商对账详情 -->
          <el-dialog title="对账详情" :visible.sync="showDialog" width="80%" append-to-body>
            <el-row :gutter="24">
              <el-col :span="3">期初结存 : {{ itemObj.FIRSTMONEY }}</el-col>
              <el-col :span="4">增加应付款 : {{ itemObj.ADDMONEY }}</el-col>
              <el-col :span="4">支付合计 : {{ itemObj.PAYMONEY }}</el-col>
              <el-col :span="4">期末欠款 : {{ itemObj.EndMONEY }}</el-col>
              <el-col :span="8" class="pull-right">
                <el-date-picker
                  size="small"
                  v-model="dateChoose"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  class="full-width pull-right"
                  @change="chooseDateFun"
                ></el-date-picker>
              </el-col>
            </el-row>

            <el-table
              border
              size="small"
              :data="tableItem"
              v-loading="ItemLoading"
              element-loading-text="数据加载中..."
              height="400"
              header-row-class-name="bg-f1f2f3"
              class="full-width m-top-sm"
            >
              <el-table-column label="时间" align="center">
                <template slot-scope="scope">
                  <span>{{ new Date(scope.row.BILLDATE) | timehf }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="BILLNO" label="单号" align="center"></el-table-column>
              <el-table-column prop="BILLTYPE" label="单据类型" align="center"></el-table-column>
              <el-table-column prop="ADDMONEY" label="增加金额" align="center"></el-table-column>
              <el-table-column prop="PAYMONEY" label="实付金额" align="center"></el-table-column>
              <el-table-column
                prop="CURMONEY"
                label="累计应付金额"
                align="center"
              ></el-table-column>
            </el-table>

            <div class="m-top-sm clearfix elpagination" v-if="pagination.TotalNumber > 20">
              <el-pagination
                background
                @size-change="handlePageChange"
                @current-change="handlePageChange"
                :current-page.sync="pagination.PN"
                :page-size="pagination.PageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.TotalNumber"
                class="text-center"
              ></el-pagination>
            </div>
          </el-dialog>

          <el-dialog
            :title="titleName"
            width="770px"
            :visible.sync="showAddSupplier"
            :close-on-click-modal="false"
            :before-close="handleDialogClose"
            append-to-body
          >
            <add-new-supplier
              @closeModal="showAddSupplier = false"
              @resetList="
                showAddSupplier = false;
                handleDialogClose();
              "
              :dealSupplier="{ value: 1, dealState: isAddSupplier ? 'add' : 'edit' }"
            ></add-new-supplier>
          </el-dialog>

          <el-dialog
            title="供应商还款"
            :visible.sync="showPayMoneyDialog"
            width="500px"
            append-to-body
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              :hide-required-asterisk="true"
              label-width="100px"
            >
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="供应商名称：" prop="SupplierId" style="margin-bottom: 15px">
                    {{ ruleForm.NAME }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="应付金额：" style="margin-bottom: 15px">
                    {{ ruleForm.CURRMONEY }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="业务时间：" style="margin-bottom: 15px">
                    {{ new Date(BillDate) | time }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="付款账户：" prop="PayTypeId" style="margin-bottom: 15px">
                    <el-select
                      size="small"
                      v-model="ruleForm.PayTypeId"
                      @change="referData"
                      clearable
                      style="width: 80%"
                      placeholder="选择账户"
                    >
                      <el-option
                        v-for="item in SelectPaywayList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="实付金额：" prop="PayMoney" style="margin-bottom: 15px">
                    <el-input
                      type="number"
                      size="small"
                      placeholder="请输入实付金额"
                      style="width: 80%"
                      v-model="ruleForm.PayMoney"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注：" style="margin-bottom: 15px">
                    <el-input
                      size="small"
                      type="textarea"
                      placeholder="请输入备注"
                      style="width: 80%"
                      v-model="ruleForm.Remark"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" style="text-align: center; margin-top: 20px">
                  <el-button
                    @click="
                      showPayMoneyDialog = false;
                      $refs.ruleForm.resetFields();
                    "
                  >
                    取消
                  </el-button>
                  <el-button type="primary" @click="submitForm">保存</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-dialog>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
// import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_GOOD from "@/mixins/good.js";
import dayjs from "dayjs";
export default {
  mixins: [MIXINS_GOOD.GOOD_MENU],
  data() {
    return {
      pagelist: [],
      loading: false,
      dialogVisible: false,
      showAddSupplier: false,
      Filter: "",
      isAddSupplier: false,
      form: { Name: "", Money: 0, Integral: 0, Rate: 0 },
      rules: { Name: [{ required: true, message: "请输入等级名称", trigger: "blur" }] },
      dealType: "add",
      delIndex: "",
      titleName: "",
      tableHeight: document.body.clientHeight - 200,
      ruleForm: { SupplierId: "" },
      BillDate: dayjs(),
      rules: {
        SupplierId: [{ required: true, message: "请选择供应商", trigger: "change" }],
        PayTypeId: [{ required: true, message: "请选择付款方式", trigger: "change" }],
        PayMoney: [{ required: true, message: "请输入实付金额", trigger: "blur" }]
      },
      showPayMoneyDialog: false,
      SelectPaywayList: [],
      showDialog: false,
      ItemLoading: false,
      dateChoose: "",
      pageData: {
        BeginDate: 1,
        EndDate: 9999999999999,
        SupplierId: "",
        PN: 1
      },
      itemObj: {},
      tableItem: [],
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      }
    };
  },
  computed: {
    ...mapGetters({
      dataList: "supplierList",
      dataListState: "supplierListState",
      paywayList: "paywayList",
      dealState: "dealIntegralState",
      cancelSupplierState: "cancelSupplierState",
      dataItem: "supplierItem",
      payMoneySupplierState: "payMoneySupplierState",
      supplierReportItem: "supplierReportItem"
    })
  },

  watch: {
    supplierReportItem(data) {
      this.ItemLoading = false;
      if (data.success) {
        this.tableItem = [...data.data.PageData.DataArr];
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
        this.itemObj = data.data.Obj;
      } else {
        this.$message.error(data.message);
      }
    },
    payMoneySupplierState(data) {
      this.Filter = "";
      this.ruleForm.SupplierId = "";
      this.$refs.ruleForm.resetFields();
      if (data.success) {
        this.getNewData();
      }
      this.$message({ type: data.success ? "success" : "error", message: data.message });
    },
    paywayList(data) {
      let param = data,
        newParam = [];
      for (var i in param) {
        if (param[i].NAME != "积分支付" && param[i].NAME != "欠款" && param[i].NAME != "扫码支付") {
          newParam.push(param[i]);
        }
      }
      this.SelectPaywayList = newParam;
    },
    dataItem(data) {
      console.log(data);
    },
    cancelSupplierState(data) {
      this.loading = false;
      if (data.success) {
        this.pagelist.splice(this.delIndex, 1);
      }
      this.$message({
        type: data.success ? "success" : "error",
        message: data.message
      });
    },
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagelist = [...this.dataList];
      }
    },
    dealState(data) {
      if (data.success) {
        this.getNewData();
      }
      this.$message({ message: data.message, type: data.success ? "success" : "error" });
      this.dialogVisible = false;
    }
  },
  methods: {
    chooseDateFun() {
      this.pageData.BeginDate = this.dateChoose == null ? "1" : this.dateChoose[0];
      this.pageData.EndDate = this.dateChoose == null ? "9999999999999" : this.dateChoose[1];
      this.pageData.PN = 1;
      this.searchItemData();
    },
    searchItemData() {
      let sendData = {
        BeginDate: this.pageData.BeginDate,
        EndDate: this.pageData.EndDate,
        SupplierId: this.pageData.SupplierId,
        PN: this.pageData.PN
      };
      this.$store.dispatch("getSupplierReportItem", sendData).then(() => {
        this.ItemLoading = true;
      });
    },
    handleView(idx, row) {
      this.pageData.SupplierId = row.ID;
      let sendData = {
        BeginDate: this.getMonthoneTime(),
        EndDate: this.getMonthlastTime(),
        SupplierId: row.ID,
        PN: 1
      };
      this.dateChoose = [this.getMonthoneTime(), this.getMonthlastTime()];

      this.$store.dispatch("getSupplierReportItem", sendData).then(() => {
        this.showDialog = true;
        this.ItemLoading = true;
      });
      this.itemObj = {};
    },
    referData(value) {
      this.$forceUpdate();
    },
    submitForm() {
      let sendData = Object.assign({}, this.ruleForm);
      sendData.BillDate = dayjs().valueOf();
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("payMoneySupplier", {
              data: sendData
            })
            .then(() => {
              this.showPayMoneyDialog = false;
            });
        }
      });
    },
    handlePayMoney(idx, row, type) {
      if (row.CURRMONEY <= 0) {
        this.$message("当前供应商无欠供应商款");
        return;
      }
      this.showPayMoneyDialog = true;
      this.isSelectSupplier = type;

      this.ruleForm = row;
      this.ruleForm.SupplierId = row.ID;
    },
    handleDialogClose() {
      this.showAddSupplier = false;
      this.$store
        .dispatch("getSupplierList", { Filter: this.Filter, IsCurr: 0, IsStop: -1 })
        .then(() => {
          this.loading = true;
        });
      this.$store.dispatch("clearSupplierItem");
    },
    pullSupplierList(arr) {
      this.pagelist = [...arr];
    },
    getNewData() {
      this.$store
        .dispatch("getSupplierList", { Filter: this.Filter, IsCurr: 0, IsStop: -1 })
        .then(() => {
          this.loading = true;
        });
    },
    getIntegralItem() {},
    handleAdd() {
      this.showAddSupplier = true;
      this.isAddSupplier = true;
      this.titleName = "新增供应商";
    },
    handleDeal(item) {
      this.showAddSupplier = true;
      this.titleName = "供应商详情";
      this.$store.dispatch("getSupplierItem", { id: item.ID }).then(() => {
        this.isAddSupplier = false;
      });
    },
    handleDel(index, item) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("cancelSupplier", { id: item.ID }).then(() => {
          this.loading = true;
          this.delIndex = index;
        });
      });
    }
  },
  mounted() {
    this.getNewData();
    this.$store.dispatch("getPaywayList", {});
  },

  beforeCreate() {},
  components: {
    headerPage: () => import("@/components/header"),
    addNewSupplier: () => import("@/components/goods/addNewSupplier.vue")
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
  border: solid 1px #d7d7d7;
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
.member-main-top {
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 150px;
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
</style>


