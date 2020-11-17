<template>
  <div class="history">
    <div class="content-eighty">
      <div class="content-center">
        <div class="history_top">
          <el-row>
            <el-col :span="8">
              <el-button size="small" @click="addNewBill(0)" icon="el-icon-plus">
                新增单据
              </el-button>
              <el-button size="small" icon="el-icon-download" @click="exportTable">导出</el-button>
            </el-col>
            <el-col :span="8" style="text-align: right">
              <el-radio-group size="small" v-model="radioStatus" @change="curRadioStatus">
                <el-radio-button
                  v-for="(item, index) in billStatusList"
                  :key="index"
                  :label="item.id"
                >
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
              &nbsp;
            </el-col>
            <el-col :span="5" style="text-align: right">
              <el-input
                size="small"
                v-model="searchText"
                placeholder="输入单号、店铺"
                @input="searchList(searchText)"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="3" style="text-align: right">
              <el-button-group class="pull-right m-right-sm">
                <el-popover placement="bottom" v-model="isFilter">
                  <div>
                    <el-form label-width="100px">
                      <el-form-item label="日 期 ：">
                        <el-date-picker
                          size="small"
                          v-model="dateList"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item label="店 铺 ：">
                        <el-select size="small" v-model="searchShopId" placeholder="请选择店铺">
                          <el-option
                            v-for="item in shopList"
                            :key="item.SHOPID"
                            :label="item.SHOPNAME"
                            :value="item.SHOPID"
                            @change="outShop(item.SHOPID)"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelSearch">取消</el-button>
                    <el-button type="primary" size="mini" @click="submitChoose">确定</el-button>
                  </div>
                  <el-button size="small" type="default" icon="icon-filter" slot="reference">
                    &nbsp;&nbsp;高级搜索
                  </el-button>
                </el-popover>
              </el-button-group>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="content-table4">
      <div class="content-table-center">
        <div class="history_content">
          <el-table
            size="small"
            :data="pagelist"
            v-loading="loading"
            element-loading-text="数据加载中..."
            header-row-class-name="bg-theme2 text-white"
            :height="tableHeight"
            show-summary
            :summary-method="getSummaries1"
            :row-class-name="tableRowClassName"
            ref="table1"
            style="width: 100%"
          >
            <el-table-column
              prop="RN"
              label="序号"
              fixed="left"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column label="状态" fixed="left" width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.ISCHECK == true && scope.row.ISCANCEL == false">已盘点</span>
                <span v-else-if="scope.row.ISCHECK == true && scope.row.ISCANCEL == true">
                  已作废
                </span>
                <span v-else-if="scope.row.ISCHECK == false && scope.row.ISCANCEL == false">
                  草稿单
                </span>
              </template>
            </el-table-column>
            <el-table-column label="业务日期" width="90">
              <template slot-scope="scope">
                <span>{{ new Date(scope.row.BILLDATE) | time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单据编号" prop="BILLNO" width="130"></el-table-column>
            <el-table-column label="盘点店铺" prop="SHOPNAME" align="center"></el-table-column>
            <el-table-column label="盘点数量" prop="STOCKQTY" align="center"></el-table-column>
            <el-table-column label="库存数量" align="center">
              <template slot-scope="scope">
                <span>{{ Number(scope.row.STOCKQTY) - Number(scope.row.GOODSQTY) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="差异" prop="GOODSQTY" align="center"></el-table-column>
            <el-table-column label="备注" prop="REMARK" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="viewCurInfo(scope.row, scope.$index)">
                  详情
                </el-button>
                <el-button
                  size="small"
                  v-if="scope.row.ISCHECK == false && scope.row.ISCANCEL == false"
                  type="text"
                  @click="cancelBill(scope.row.BILLID, 'sc')"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="m-top-sm clearfix elpagination">
            <el-pagination
              background
              @size-change="handlePageChange"
              @current-change="handlePageChange"
              :current-page.sync="pagination.PN"
              :page-size="pagination.PageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.TotalNumber"
              class="text-right"
            ></el-pagination>
          </div>
        </div>

        <el-dialog
          :title="`详情 (${title})`"
          :visible.sync="isShowDialog"
          width="80%"
          append-to-body
        >
          <div>
            <span>店铺 : {{ infoList.SHOPNAME }}</span>
            <span style="float: right">业务日期 : {{ new Date(infoList.BILLDATE) | timehf }}</span>
          </div>
          <el-table
            size="small"
            :data="theGoodsListInfo"
            height="300"
            header-row-class-name="bg-theme2 text-white"
            class="full-width m-top-sm"
            show-summary
            :summary-method="getSummaries"
            ref='table'
            v-loading="loadingInfo"
          >
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
              fixed="left"
            ></el-table-column>
            <el-table-column prop="GOODSNAME" label="商品" fixed="left"></el-table-column>
            <el-table-column prop="GOODSCODE" label="条码" align="center"></el-table-column>
            <el-table-column
              prop="UNITNAME"
              label="单位"
              align="center"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="TYPENAME"
              label="分类"
              align="center"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="STOCKQTY"
              label="盘点数量"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="CURSTOCKQTY"
              label="盘点前数量"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column
              prop="QTY"
              label="盈亏数量"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column prop="MONEY" label="盈亏金额" align="center" fixed="right">
              <template slot-scope="scope">
                {{ isPurViewFun(92100310) ? scope.row.MONEY : "****" }}
              </template>
            </el-table-column>
          </el-table>

          <el-row :gutter="24" class="marginTB-sm p-top-sm">
            <el-col :span="24">
              <span>备 注：</span>
              <span>{{ pageData.REMARK != undefined ? pageData.REMARK : "" }}</span>
            </el-col>
          </el-row>

          <div class="marginTB-sm" style="padding-bottom: 30px">
            <span class="text-999 m-top-sm" style="float: left">
              <span>制单人 : &nbsp;</span>
              {{ infoList.USERNAME }}
              <span style="margin-left: 30px">制单时间 : &nbsp;</span>
              {{ new Date(infoList.BILLDATE) | timehf }}
            </span>
            <span class="text-right" style="float: right">
              <el-button type="success" plain icon="el-icon-plus" @click="addNewBill(1)">
                新增单据
              </el-button>
              <el-button
                type="info"
                v-if="editStatu != ''"
                @click="handleDraft(editStatu, infoList.BILLID)"
              >
                {{ editStatu }}
              </el-button>
              <el-button
                type="primary"
                v-if="isPrintStatu != '' && isPrintStatu != '打印'"
                @click="handlePrint(isPrintStatu, infoList.BILLID, infoList)"
              >
                {{ isPrintStatu }}
              </el-button>
            </span>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import { getHomeData, getUserInfo } from "@/api/index";
import dayjs from "dayjs";
export default {
  mixins: [MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
  data() {
    return {
      loading: false,
      loadingInfo: false,
      pagelist: [],
      dateList: null,
      searchText: "",
      radioStatus: 0,
      infoList: {},
      isFilter: false,
      searchShopId: "",
      sendDataInfo: {
        BeginDate: 1,
        EndDate: 9999999999999,
        ShopId: "",
        BillNo: "",
        IsCheck: -1, // 是否确认, -1=all,0=草稿,1=确认单
        IsCancel: -1, // 是否作废,-1=all,0=正常,1=已作废
        PN: 1
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      billStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "已盘点" },
        { id: 2, name: "草稿单" }
      ],
      isShowDialog: false,
      theGoodsListInfo: [],
      totalNum: 0,
      pageData: {
        ShopId: "",
        SUPPLIERID: "",
        BILLDATE: "",
        ManualNo: "", //手工单号
        PAYTYPEID: "", // 付款方式ID
        PAYMONEY: 0,
        REMARK: "",
        GoodsList: [], // 货号Id,数量,单价,备注
        IsCheck: 1,
        FromBillId: "" // 引用采购单号
      },
      title: "",
      editStatu: "",
      isPrintStatu: "",
      showEditStatu: true,
      tableHeight: document.body.clientHeight - 230
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      inventoryListState: "inventoryListState",
      supplierList: "supplierList",
      dataState: "inventoryState",
      dataList: "inventoryItem",
      dataObj: "inventoryObj",
      inventoryCancel: "inventoryCancel",
      dataExportState: "inventoryExportState",
      inventoryAddState: "inventoryAddState",
      cgdInventoryDataList: "cgdInventoryDataList"
    })
  },
  watch: {
    cgdInventoryDataList(data) {},
    dataExportState(data) {
      if (data.success) {
        let list = [...data.data.List];
        for (let i in list) {
          list[i].TOTALNUMBER = list[i].GOODSQTY * list[i].GOODSMONEY;
          let status = "";
          if (list[i].ISCHECK == true && list[i].ISCANCEL == false) {
            status = "已盘点";
          } else if (list[i].ISCHECK == false && list[i].ISCANCEL == false) {
            status = "草稿单";
          }
          list[i].STATUS = status;
          list[i].panDianQty = list[i].STOCKQTY - list[i].GOODSQTY;
          list[i].BILLDATE = dayjs(list[i].BILLDATE).format("YYYY-MM-DD");
        }
        var head = [
          "状态",
          "业务日期",
          "单据编号",
          "盘点店铺",
          "盘点数量",
          "库存数量",
          "盈亏数量",
          "备注"
        ];
        var val = [
          "STATUS",
          "BILLDATE",
          "BILLNO",
          "SHOPNAME",
          "panDianQty",
          "STOCKQTY",
          "GOODSQTY",
          "REMARK"
        ];
        var title = "店铺盘点历史" + this.getNowDateTime();
        this.export2Excel(head, val, list, title);
      }
    },
    inventoryListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
        this.pagelist = [...data.data.PageData.DataArr];
      } else {
        this.$message(data.message);
      }
    },
    dataState(data) {
      this.loadingInfo = false;
      if (data.success) {
        this.theGoodsListInfo = this.dataList;
        this.pageData = this.dataObj;
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    inventoryCancel(data) {
      this.$message({ type: data.success ? "success" : "error", message: data.message });
      if (data.success) {
        this.isShowDialog = false;
        this.getHistoryList();
      }
    },
    inventoryAddState(data) {
      this.$message({ type: data.success ? "success" : "error", message: data.message });
      if (data.success) {
        this.isShowDialog = false;
        this.getHistoryList();
      }
    }
  },
  mounted() {
    this.getHistoryList();
    if (this.supplierList.length == 0) {
      this.$store.dispatch("getSupplierList", { IsStop: 0, IsCurr: 0 });
    }
    if (this.shopList.length == 0) {
      this.$store.dispatch("getShopList",{});
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index > 0 && index <= 4) {
          sums[index] = "";
          return;
        }

        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      this.$nextTick(() => {
   　　　　this.$refs['table'].doLayout();
   　　})

      return sums;
    },
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index > 0 && index <= 4 && index > 7) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });

      this.$nextTick(() => {
   　　　　this.$refs['table1'].doLayout();
   　　})

      return sums;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.ISCHECK == false && row.ISCANCEL == false && this.radioStatus == 0) {
        return "orangeColor";
      } else if (row.ISCHECK == true && row.ISCANCEL == true && this.radioStatus == 0) {
        return "grayColor";
      }
      return "";
    },
    exportTable() {
      this.$store.dispatch("getinventoryList_Export", this.sendDataInfo);
    },
    dateChoose() {
      this.sendDataInfo.BeginDate =
        this.dateList == null ? 1 : new Date(this.dateList[0]).getTime();
      this.sendDataInfo.EndDate =
        this.dateList == null ? 9999999999999 : new Date(this.dateList[1]).getTime();
      this.sendDataInfo.ShopId = this.searchShopId;
      this.sendDataInfo.PN = 1;
      this.getHistoryList();
    },
    searchList(value) {
      this.sendDataInfo.Filter = value;
      this.sendDataInfo.PN = 1;
      this.sendDataInfo.ShopId = this.searchShopId;
      this.getHistoryList();
    },
    cancelBill(value, status) {
      let title = status == "zf" ? "作废" : "删除";
      this.$confirm("确认" + title + "该单据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("cancelInventory", { BillId: value });
        })
        .catch(() => {});
    },
    handlePrint(isPrintStatu, BillId, item) {
      //弹窗列表是否打印状态
      let param = this.theGoodsListInfo,
        newArr = [];
      for (let i = 0; i < param.length; i++) {
        newArr.push({
          GoodsId: param[i].GOODSID,
          Qty: param[i].QTY,
          Price: param[i].PRICE,
          ColorId: param[i].COLORID,
          SizeId: param[i].SIZEID,
          Remark: ""
        });
      }
      let sendData = {
        BillId: item.BILLID,
        BillDate: new Date().getTime(),
        ManualNo: "", //手工单号
        Remark: this.pageData.REMARK,
        GoodsList: JSON.stringify(newArr),
        IsCheck: 1,
        IsAll: 0,
        ShopId: item.SHOPID
      };
      this.$store.dispatch("addInventory", sendData);
      // }
    },
    handleDraft(editStatu, BillId) {
      //弹窗列表是否作废状态
      if (editStatu == "作废") {
        if (!this.isPurViewFun(91040114)) {
          this.$message.warning("您还没有获得相关权限!");
        } else {
          this.$confirm("确认作废该单据", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$store.dispatch("cancelInventory", { BillId: BillId });
            })
            .catch(() => {});
        }
      } else {
        let sendData = {
          arr: this.theGoodsListInfo,
          obj: this.pageData
        };
        this.$store.dispatch("cgdInventoryDataList", sendData).then(() => {
          this.isShowDialog = false;
          this.$emit("isAddNewBill_I", true);
        });
      }
    },
    addNewBill(val) {
      // 新增单据
      if (val == 1) {
        this.isShowDialog = false;
      }
      this.$emit("isAddNewBill_I", true);
    },
    viewCurInfo(item, idx) {
      this.isShowDialog = true;
      this.infoList = item;
      let sendData = { BillId: item.BILLID };
      if (item.ISCHECK == true && item.ISCANCEL == false) {
        this.title = " 已盘点 ";
        // this.editStatu = '作废'
        this.editStatu = "";
        this.isPrintStatu = "打印";
        this.showEditStatu = true;
      } else if (item.ISCHECK == false && item.ISCANCEL == false) {
        this.title = " 草稿单 ";
        this.editStatu = "草稿";
        this.isPrintStatu = "盘点";
        this.showEditStatu = true;
      }
      this.$store.dispatch("getInventoryItem", sendData).then(() => {
        this.loadingInfo = true;
      });
    },
    cancelSearch() {
      // 取消高级搜索
      this.isFilter = false;
      this.searchShopId = "";
      this.dateList = null;
      this.submitChoose();
    },
    submitChoose() {
      //库存盘点高级搜索
      this.sendDataInfo.BeginDate =
        this.dateList == null ? 1 : new Date(this.dateList[0]).getTime();
      this.sendDataInfo.EndDate =
        this.dateList == null ? 9999999999999 : new Date(this.dateList[1]).getTime();
      this.sendDataInfo.ShopId = this.searchShopId;
      this.sendDataInfo.PN = 1;
      this.getHistoryList();
      this.isFilter = false;
    },
    curRadioStatus() {
      //采购盘点状态切换
      var IsCheck = -1,
        IsCancel = -1;
      if (this.radioStatus == 0) {
        (IsCheck = -1), (IsCancel = -1);
      } //全部
      else if (this.radioStatus == 1) {
        (IsCheck = 1), (IsCancel = 0);
      } // 已盘点
      else if (this.radioStatus == 2) {
        (IsCheck = 0), (IsCancel = 0);
      } // 草稿单
      this.sendDataInfo.IsCheck = IsCheck;
      this.sendDataInfo.IsCancel = IsCancel;
      this.sendDataInfo.PN = 1;
      this.sendDataInfo.ShopId = this.searchShopId;
      this.getHistoryList();
    },
    handlePageChange: function (currentPage) {
      if (this.sendDataInfo.PN == currentPage || this.loading) {
        return;
      }
      this.sendDataInfo.PN = parseInt(currentPage);
      this.getHistoryList();
    },
    getHistoryList() {
      this.$store.dispatch("getInventoryList", this.sendDataInfo).then(() => {
        this.loading = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped >
.el-table .orangeColor {
  color: #ff6633;
}
.el-table .grayColor {
  color: #999;
}
</style>
