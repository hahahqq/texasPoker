<template>
  <div class="warehousing">
    <div class="content-eighty">
      <div class="content-center">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="6">
            <span>店铺</span>
            <el-select size="small" v-model="shopId" placeholder="请选择店铺">
              <el-option
                v-for="item in shopList"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <span>供应商</span>
            <el-select size="small" v-model="pageData.SUPPLIERID" placeholder="请选择供应商">
              <el-option
                v-for="item in supplierList"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-input
              type="default"
              v-model="searchText"
              size="small"
              @keyup.enter.native="scanSearch()"
              placeholder="请扫描商品或单品条形码"
            >
              <div slot="prepend">
                <i class="icon-barcode"></i>
                <span class="m-left-xs">扫码</span>
              </div>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" style="text-align: right">
            <el-date-picker
              size="small"
              v-model="BILLDATE"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-table4">
      <div class="content-table-center">
        <div class="tableStyle">
          <el-table
            border
            size="small"
            :data="theGoodsList"
            :height="tableHeight"
            @row-click="handleCurRow"
            :highlight-current-row="true"
            header-row-class-name="bg-theme2 text-white"
            empty-text='暂无数据,请点击 "增加行" 或 扫码添加商品'
            class="full-width"
          >
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
              fixed="left"
            ></el-table-column>
            <el-table-column label="商品" fixed="left">
              <template slot-scope="scope">
                <span v-if="scope.row.isEdit && scope.row.GOODSID != ''">
                  {{ scope.row.GOODSNAME }}
                </span>
                <span v-if="!scope.row.isEdit && scope.row.GOODSID != ''">
                  {{ scope.row.GOODSNAME }}
                </span>
                <el-select
                  size="small"
                  v-if="scope.row.isEdit == true && scope.row.GOODSID == ''"
                  v-model="scope.row.GOODSID"
                  :remote-method="handleGoodsFilter"
                  reserve-keyword
                  remote
                  clearable
                  @change="curSelect(scope.$index, scope.row)"
                  @focus="defaultGoodsList"
                  filterable
                  placeholder="请输入货号或品名"
                >
                  <el-option
                    v-for="(item, index) in goodsListData"
                    :key="index"
                    :label="item.NAME"
                    :value="item.ID"
                  >
                    <span style="float: left">{{ item.NAME }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">
                      {{ item.CODE }}
                    </span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="GOODSCODE" label="条码" align="center"></el-table-column>
            <el-table-column prop="PURPRICE" label="参考进价" width="100" align="center">
              <template slot-scope="scope">
                {{ isPurViewFun(92100310) ? scope.row.PURPRICE : "****" }}
              </template>
            </el-table-column>
            <el-table-column label="折扣" align="center" width="150">
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">{{ scope.row.DISCOUNT }}</span>
                <el-input-number
                  v-if="scope.row.isEdit"
                  size="small"
                  style="width: 120px"
                  :min="0"
                  controls-position="right"
                  v-model.trim="scope.row.DISCOUNT"
                  placeholder="请输入"
                  @change="changePr(scope.row)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center" width="160">
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">
                  {{ isPurViewFun(92100310) ? scope.row.PRICE : "****" }}
                </span>
                <el-input-number
                  v-if="scope.row.isEdit"
                  size="small"
                  style="width: 130px"
                  controls-position="right"
                  v-model.trim="scope.row.PRICE"
                  placeholder="请输入"
                  @change="changeDP(scope.row)"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center" width="150">
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">{{ scope.row.QTY }}</span>
                <el-input-number
                  v-if="scope.row.isEdit"
                  size="small"
                  style="width: 120px"
                  controls-position="right"
                  :min="1"
                  v-model.trim="scope.row.QTY"
                  placeholder="请输入"
                  @input="totalfun"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center" width="120">
              <template slot-scope="scope">
                {{
                  isPurViewFun(92100310) ? (scope.row.PRICE * scope.row.QTY).toFixed(2) : "****"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.GOODSID != ''"
                  type="text"
                  size="small"
                  @click="handleDel(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-row :gutter="10" class="marginTB-sm">
          <el-col :xs="24" :sm="12" :md="6" class="row-flex flex-items-center">
            <span class="leftLabel">优惠金额</span>
            <el-input
              size="small"
              type="number"
              class="inputWidth"
              v-model.number="pageData.BREAKSMONEY"
              @input="totalfun"
              @keyup.enter.native="totalfun"
              placeholder="￥ 0.00"
            ></el-input>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6" class="row-flex flex-items-center" style="margin-left: -6px">
            <span class="leftLabel">其它费用</span>
            <el-input
              size="small"
              type="number"
              class="inputWidth"
              v-model.number="pageData.OTHERMONEY"
              @input="totalfun"
              @keyup.enter.native="totalfun"
              placeholder="￥ 0.00"
            ></el-input>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" class="row-flex flex-items-center">
            <span class="inline-block text-center">
              <i style="color: #868686">总合计</i>
              <i class="font-600 text-danger m-left-md font-18">
                {{ isPurViewFun(92100310) ? "&yen; " + totalPrice : "****" }}
              </i>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" class="row-flex flex-items-center" style="margin-left: -5px">
            <span class="leftLabel">结算账户</span>
            <el-select
              size="small"
              class="inputWidth"
              v-model="pageData.PAYTYPEID"
              placeholder="选择账户"
            >
              <el-option
                v-for="pitem in this.paywayList"
                :key="pitem.ID"
                :label="pitem.NAME"
                :value="pitem.ID"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6" class="row-flex flex-items-center">
            <span class="leftLabel">实付金额</span>
            <el-input
              size="small"
              type="number"
              class="inputWidth"
              v-model.number="pageData.PAYMONEY"
              placeholder="￥0.00"
            ></el-input>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" class="row-flex flex-items-center">
            <span class="leftLabel">备 注</span>
            <el-input size="small" v-model="pageData.REMARK" placeholder="输入单据备注"></el-input>
          </el-col>
        </el-row>

        <div class="marginTB-sm">
          <span class="text-999 m-top-sm" style="float: left">
            <span>制单人 :</span>
            {{ USERNAME }}
            <span style="margin-left: 30px">制单时间 : &nbsp;</span>
            {{ zhiDanData }}
          </span>
          <span class="text-right" style="float: right">
            <el-button
              style="margin-right: 40px"
              plain
              icon="el-icon-upload"
              @click="showUploadDialog = true"
            >
              导 入
            </el-button>

            <el-button type="success" plain icon="el-icon-plus" @click="addNewBill">
              新增单据
            </el-button>
            <el-button
              type="info"
              @click="handleSubmit(0)"
              :disabled="theGoodsList[0].GOODSNAME == ''"
              :loading="CGloading"
            >
              草稿
            </el-button>
            <el-button
              type="primary"
              @click="handleSubmit(1)"
              :disabled="theGoodsList[0].GOODSNAME == ''"
              :loading="loading"
            >
              保存
            </el-button>
          </span>
        </div>
      </div>
    </div>

    <el-dialog
      title="导入采购入库单"
      :visible.sync="showUploadDialog"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
    >
      <uploadBillTable
        @closeModal="showUploadDialog = false"
        @GetUploadExportData="getUploadData"
        :dealUploadData="{ dealState: 'Discount' }"
      ></uploadBillTable>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import dayjs from "dayjs";
export default {
  data() {
    return {
      loading: false,
      CGloading: false,
      searchText: "",
      shopId: getHomeData().shop.SHOPID,
      BILLDATE: dayjs(),
      USERNAME: getUserInfo().UserName,
      pageData: {
        SUPPLIERID: "",
        BILLDATE: "",
        ManualNo: "", //手工单号
        PAYTYPEID: "", // 付款方式ID
        PAYMONEY: "",
        REMARK: "",
        GoodsList: [], // 货号Id,数量,单价,备注
        IsCheck: 1,
        FromBillId: "", // 引用采购单号
        BREAKSMONEY: "",
        OTHERMONEY: "",
        BILLID: ""
      },
      zhiDanData: dayjs(new Date()).format("YYYY-MM-DD"),
      theGoodsList: [],
      goodsListData: [],
      constGOODSLIST: [],
      totalPrice: 0,
      goodsObj: {},
      pageDataBill: {
        PN: 1,
        Filter: "",
        Status: 1,
        TypeID: "", //商品类别ID
        DescType: 0,
        IsGift: -1,
        Mode: 0
      },
      showUploadDialog: false,
      vCheckGoodsTimeOut: undefined,
      tableHeight: document.body.clientHeight - 330
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      supplierList: "supplierList",
      goodsList: "goodsList",
      goodsItem: "goodsItem",
      goodsListState: "goodsListState",
      paywayList: "paywayList",
      dataList: "warehousingItem",
      dataObj: "warehousingObj",
      warehousingAddState: "warehousingAddState",
      goodsListNew: "goodsListNew",
      getWarehousingBillid: "getWarehousingBillid"
    })
  },
  components: {
    uploadBillTable: () => import("../uploadExportBill.vue")
  },

  watch: {
    getWarehousingBillid(data) {
      console.log("新增单据", data.Obj);
      this.pageData.SUPPLIERID = data.Obj.ID;
    },
    goodsListNew(data) {
      console.log("有数据吗", data);

      if (data.length == 0) {
        this.$message.error(this.searchText + ", 查无此商品 ！");
        this.searchText = "";
        return;
      }
      let param = this.theGoodsList,
        info = data[0];
      let info1 = [
        {
          GOODSNAME: info.NAME,
          GOODSID: info.ID,
          GOODSCODE: info.CODE,
          PRICE: info.PURPRICE,
          PURPRICE: info.PURPRICE,
          QTY: 1,
          DISCOUNT: 1,
          isEdit: false
        }
      ];

      if (this.theGoodsList.length == 0) {
        this.theGoodsList = info1;
      } else {
        let arr2 = this.theGoodsList.concat(info1);
        let noEmptyArr = arr2.filter((item) => item.GOODSID != "" && item.GOODSNAME != "");
        let newArr = [];
        noEmptyArr.forEach((el) => {
          const res = newArr.findIndex((ol) => {
            return el.GOODSNAME == ol.GOODSNAME && el.GOODSID == ol.GOODSID;
          });
          if (res !== -1) {
            newArr[res].QTY = Number(newArr[res].QTY) + Number(el.QTY);
          } else {
            newArr.push(el);
          }
        });
        this.theGoodsList = newArr.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      }

      this.searchText = "";
    },
    goodsListState(data) {
      if (data.success) {
        this.goodsListData = this.goodsList;
        this.constGOODSLIST = [...data.data.PageData.DataArr];
      }
    },
    warehousingAddState(data) {
      this.loading = false;
      this.CGloading = false;
      if (data.success) {
        this.$message.success("保存成功！");
        this.theGoodsList = [
          {
            GOODSNAME: "",
            GOODSID: "",
            GOODSCODE: "",
            PRICE: 0,
            PURPRICE: 0,
            QTY: 1,
            DISCOUNT: 0,
            isEdit: true
          }
        ];
        this.pageData.BILLID = "";
        this.pageData.OTHERMONEY = "";
        this.pageData.BREAKSMONEY = "";
        this.pageData.SUPPLIERID = "";
        this.pageData.PAYTYPEID = "";
        this.pageData.PAYMONEY = "";
        this.pageData.REMARK = "";
        this.totalPrice = 0;
        this.$store.dispatch("getWarehousingItem", { BillId: data.data.OutBillId });
        this.$store.dispatch("getWarehousingBillid", {});
      } else {
        this.$message.error(data.message);
      }
    }
  },
  methods: {
    getUploadData(data) {
      let arr = [],
        newArr = [];
      for (var i in data) {
        arr.push({
          GOODSNAME: data[i].GOODSNAME,
          GOODSID: data[i].GOODSID,
          GOODSCODE: data[i].GOODSCODE,
          PRICE: data[i].PRICE,
          PURPRICE: data[i].GOODSPURPRICE,
          QTY: data[i].QTY,
          DISCOUNT: data[i].Discount,
          isEdit: false
        });
      }

      arr.forEach((el) => {
        const res = newArr.findIndex((ol) => {
          return el.GOODSNAME == ol.GOODSNAME && el.GOODSID == ol.GOODSID && el.PRICE == ol.PRICE;
        });
        if (res !== -1) {
          newArr[res].QTY = Number(newArr[res].QTY) + Number(el.QTY);
        } else {
          newArr.push(el);
        }
      });

      this.theGoodsList = newArr.concat({
        GOODSNAME: "",
        GOODSID: "",
        GOODSCODE: "",
        PRICE: 0,
        PURPRICE: 1,
        QTY: 1,
        DISCOUNT: 0,
        isEdit: true
      });

      this.totalfun();
      this.showUploadDialog = false;
    },
    changePr(row) {
      row.PRICE = parseFloat(row.PURPRICE * row.DISCOUNT).toFixed(2);
      this.totalfun();
    },
    changeDP(row) {
      row.PURPRICE = row.PURPRICE == 0 ? 1 : row.PURPRICE;
      row.DISCOUNT = parseFloat(row.PRICE / row.PURPRICE).toFixed(2);
      this.totalfun();
    },
    handleCurRow(row) {
      let param = this.theGoodsList,
        newParam = [];
      for (var i in param) {
        if (param[i].GOODSID == row.GOODSID || param[i].GOODSID == "") {
          param[i].isEdit = true;
        } else {
          param[i].isEdit = false;
        }
        newParam.push(param[i]);
      }
      this.theGoodsList = newParam;
    },
    twoDisConfirm() {
      this.theGoodsList.splice(this.theGoodsList.length - 1, 1);
      let insertModels = [];
      if (this.theGoodsList.length == 0) {
        this.theGoodsList = insertModels.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      } else {
        let arr2 = this.theGoodsList.concat(insertModels),
          newArr = [];
        arr2.forEach((el) => {
          const res = newArr.findIndex((ol) => {
            return el.GOODSNAME == ol.GOODSNAME && el.GOODSID == ol.GOODSID;
          });
          if (res !== -1) {
            newArr[res].QTY = Number(newArr[res].QTY) + Number(el.QTY);
          } else {
            newArr.push(el);
          }
        });

        this.theGoodsList = newArr.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      }
      this.pageData.OTHERMONEY = "";
      this.pageData.BREAKSMONEY = "";
      this.pageData.PAYTYPEID = "";
      this.pageData.PAYMONEY = "";
      this.totalfun();
    },
    addNewBill() {
      // 新增单据
      let haveData = this.theGoodsList.filter((item) => item.GOODSNAME != "");
      if (haveData.length != 0) {
        this.$confirm("单据还未保存，确定要新增单据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.theGoodsList = [
              {
                GOODSNAME: "",
                GOODSID: "",
                GOODSCODE: "",
                PRICE: 0,
                PURPRICE: 0,
                QTY: 1,
                DISCOUNT: 0,
                isEdit: true
              }
            ];
            this.pageData = {};
            this.searchText = "";
            this.totalPrice = 0;
          })
          .catch(() => {});
      }
    },

    scanSearch() {
      // 根据单据号查询
      console.log("searchText输入内容", this.searchText);
      this.pageDataBill.Filter = this.searchText;
      if (this.searchText.length > 0) {
        this.$store.dispatch("getGoodsListNew", this.pageDataBill);
      } else {
        this.$message.error("请输入商品条码或扫描商品条码 ！");
      }
    },
    curSelect(idx, row) {
      let param = this.goodsListData,
        obj = {};
      for (let i in param) {
        if (param[i].ID == row.GOODSID) {
          obj = param[i];
        }
      }

      this.theGoodsList.splice(this.theGoodsList.length - 1, 1);

      let insertModels = [
        {
          GOODSID: obj.ID,
          GOODSNAME: obj.NAME,
          GOODSCODE: obj.CODE,
          PRICE: obj.PURPRICE,
          PURPRICE: obj.PURPRICE,
          DISCOUNT: 1,
          QTY: 1,
          isEdit: false
        }
      ];

      if (this.theGoodsList.length == 0) {
        this.theGoodsList = insertModels.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      } else {
        let arr2 = this.theGoodsList.concat(insertModels),
          newArr = [];
        arr2.forEach((el) => {
          const res = newArr.findIndex((ol) => {
            return el.GOODSNAME == ol.GOODSNAME && el.GOODSID == ol.GOODSID;
          });
          if (res !== -1) {
            newArr[res].QTY = Number(newArr[res].QTY) + Number(el.QTY);
          } else {
            newArr.push(el);
          }
        });

        this.theGoodsList = newArr.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      }
      this.pageData.OTHERMONEY = "";
      this.pageData.BREAKSMONEY = "";
      this.pageData.PAYTYPEID = "";
      this.pageData.PAYMONEY = "";
      this.totalfun();
    },
    handleGoodsFilter(val) {
      if (val == "") {
        this.goodsListData = this.constGOODSLIST;
        return;
      }

      if (this.vCheckGoodsTimeOut) {
        window.clearTimeout(this.vCheckGoodsTimeOut);
      }
      let that = this;
      // 1秒内如果有改动查询关键字，就取消查询，否则触发查询
      this.vCheckGoodsTimeOut = setTimeout(function () {
        console.log(val, "vallllll");
        that.$store.dispatch("getGoodsList", { Status: 1, FilterStr: val, Mode: 0, PN: 1 });
      }, 800);
    },
    addRow() {
      let newParam = this.theGoodsList.filter(
        (item) => item.GOODSNAME == "" && item.GOODSCODE == ""
      );
      if (newParam.length != 0) {
        this.$message.warning("请先完成之前的操作 !");
        return;
      }
      this.theGoodsList.push({
        GOODSNAME: "",
        GOODSID: "",
        GOODSCODE: "",
        PRICE: 0,
        PURPRICE: 0,
        QTY: 1,
        DISCOUNT: 1,
        isEdit: true
      });
    },
    handleSubmit(value) {
      let haveEmptyGoods = this.theGoodsList.filter(
        (item) => item.GOODSNAME == "" && item.GOODSCODE == ""
      );
      if (haveEmptyGoods.length > 1) {
        this.$message.warning("表格中有未保存的商品");
        return;
      }

      if (this.pageData.SUPPLIERID == "") {
        this.$message.warning("请选择供应商");
        return;
      }
      this.theGoodsList.splice(this.theGoodsList.length - 1, 1);
      let param = this.theGoodsList,
        newArr = [];
      for (let i = 0; i < param.length; i++) {
        newArr.push({
          GoodsId: param[i].GOODSID,
          Qty: param[i].QTY,
          Price: param[i].PRICE,
          Remark: ""
        });
      }

      let sendData = {
        ShopId: this.shopId,
        BillId: this.pageData.BILLID,
        SupplierId: this.pageData.SUPPLIERID,
        BillDate: dayjs(this.BILLDATE).valueOf(),
        ManualNo: "", //手工单号  中国标准时间转时间
        PayTypeId: this.pageData.PAYTYPEID, // 付款方式ID
        PayMoney: this.pageData.PAYMONEY,
        Remark: this.pageData.REMARK,
        GoodsList: JSON.stringify(newArr),
        IsCheck: value, // 0: 草稿  1：确认单
        FromBillId: "", // 引用采购单号
        BreaksMoney: this.pageData.BREAKSMONEY,
        OtherMoney: this.pageData.OTHERMONEY
      };

      this.$store.dispatch("addWarehousing", sendData).then(() => {
        if (value == 0) {
          this.loading = true;
        } else {
          this.CGloading = true;
        }
      });
    },
    handleDel(idx, row) {
      this.theGoodsList.splice(idx, 1);
      this.pageData.OTHERMONEY = "";
      this.pageData.BREAKSMONEY = "";
      this.pageData.PAYTYPEID = "";
      this.pageData.PAYMONEY = "";
      this.totalfun();
    },
    totalfun() {
      let tprice = 0,
        param = this.theGoodsList;
      for (let i = 0; i < param.length; i++) {
        tprice += param[i].PRICE * param[i].QTY;
      }
      let BreaksMoney = this.pageData.BREAKSMONEY == undefined ? 0 : this.pageData.BREAKSMONEY; //优惠金额
      let OtherMoney = this.pageData.OTHERMONEY == undefined ? 0 : this.pageData.OTHERMONEY; // 其他金额
      this.totalPrice = tprice - BreaksMoney + OtherMoney;
    },
    defaultGoodsList() {
      this.$store.dispatch("getGoodsList", { Status: 1, Filter: "", Mode: 0, PN: 1 });
    }
  },
  mounted() {
    this.$store.dispatch("getWarehousingBillid", {});
    if (this.shopList.length == 0) {
      this.$store.dispatch("getShopList",{});
    }
    this.$store.dispatch("getSupplierList", { IsStop: 0, IsCurr: 0 });
    if (this.paywayList.length == 0) {
      this.$store.dispatch("getPaywayList", {});
    }
    this.defaultGoodsList();

    let getItemData = sessionStorage.getItem("theGoodsList_W") || "[]";
    let theGoodsList = JSON.parse(getItemData);

    if (theGoodsList.length != 0) {
      let theGoodsList = JSON.parse(getItemData);
      this.theGoodsList = theGoodsList.concat({
        GOODSNAME: "",
        GOODSID: "",
        GOODSCODE: "",
        PRICE: 0,
        PURPRICE: 0,
        QTY: 1,
        DISCOUNT: 0,
        isEdit: true
      });
      let getItemObj = sessionStorage.getItem("theGoodsObj_W");
      let obj = JSON.parse(getItemObj);
      let haveCurSupplier = this.supplierList.filter((item) => item.ID == obj.SUPPLIERID);
      if (haveCurSupplier.length != 0) {
        this.pageData = JSON.parse(getItemObj);
      } else {
        this.pageData = obj;
        this.pageData.SUPPLIERID = "";
      }
      this.totalfun();
    } else {
      this.theGoodsList = [
        {
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          DISCOUNT: 1,
          isEdit: true
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.warehousing .el-input-group__prepend {
  padding: 0 10px !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.el-table td,
.el-table th {
  text-align: center;
}
.leftLabel {
  width: 70px;
  min-width: 70px;
  text-align: right;
  margin-right: 10px;
}
.inputWidth >>> .el-input__inner{
   width: 208px !important;
}
</style>

