<template>
  <div class="allocation">
    <div class="content-eighty">
      <div class="content-center">
        <el-row :gutter="10">
          <el-col :xs="24" :md="6">
            <span>调出店铺</span>
            <el-select size="small" clearable v-model="curOutShopId" placeholder="请选择调出店铺">
              <el-option
                v-for="item in shopList"
                :key="item.SHOPID"
                :disabled="item.SHOPID == curInShopId"
                :label="item.SHOPNAME"
                :value="item.SHOPID"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :md="6">
            <span>调入店铺</span>
            <el-select size="small" clearable v-model="curInShopId" placeholder="请选择调入店铺">
              <el-option
                v-for="item in shopList"
                :key="item.SHOPID"
                :disabled="item.SHOPID == curOutShopId"
                :label="item.SHOPNAME"
                :value="item.SHOPID"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :md="6">
            <el-input
              type="default"
              v-model="searchText"
              size="small"
              @keydown.enter.native="scanSearch(searchText)"
              autofocus="true"
              placeholder="请扫描商品或单品条形码"
            >
              <div slot="prepend">
                <i class="icon-barcode"></i>
                <span class="m-left-xs">扫码</span>
              </div>
            </el-input>
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
              width="60"
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
                  placeholder="请输入货号、品名或条码"
                >
                  <el-option
                    v-for="(item, index) in goodsListData"
                    :key="index"
                    :label="item.NAME"
                    :value="item.ID"
                  >
                    <span style="float: left">{{ item.CODE }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">
                      {{ item.NAME }}
                    </span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="GOODSCODE" label="条码" align="center"></el-table-column>
            <el-table-column
              prop="PRICE"
              label="零售价"
              align="center"
              width="180"
            ></el-table-column>
            <el-table-column label="数量" align="center" width="180">
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">{{ scope.row.QTY }}</span>
                <el-input-number
                  v-if="scope.row.isEdit"
                  size="small"
                  style="width: 160px"
                  controls-position="right"
                  :min="1"
                  v-model.trim="scope.row.QTY"
                  placeholder="请输入"
                ></el-input-number>
              </template>
            </el-table-column>

            <el-table-column label="金额" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.PRICE * scope.row.QTY }}</span>
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
          <el-col :xs="24" :sm="8" :md="12" class="row-flex flex-items-center">
            <span class="leftLabel">备注</span>
            <el-input size="small" v-model="pageData.REMARK" placeholder="输入单据备注"></el-input>
          </el-col>
        </el-row>

        <div class="marginTB-sm">
          <span class="text-999 m-top-sm" style="float: left">
            <span>制单人 : &nbsp;</span>
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
              :loading="loading"
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
      title="导入库存调拨单"
      :visible.sync="showUploadDialog"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
    >
      <uploadBillTable
        @closeModal="showUploadDialog = false"
        @GetUploadExportData="getUploadData"
        :dealUploadData="{ dealState: 'noDiscount' }"
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
      curOutShopId: getHomeData().shop.SHOPID,
      USERNAME: getUserInfo().UserName,
      curInShopId: "",
      titleName: "",
      searchText: "",
      pageData: {
        BILLDATE: "",
        ManualNo: "", //手工单号
        PAYTYPEID: "", // 付款方式ID
        PAYMONEY: 0,
        REMARK: "",
        GoodsList: [], // 货号Id,颜色Id,尺码Id,数量,单价,备注
        IsCheck: 1,
        FromBillId: "", // 引用采购单号
        BREAKSMONEY: 0,
        OTHERMONEY: 0,
        BILLID: ""
      },
      pageDataBill: {
        PN: 1,
        Filter: "",
        Status: 1,
        TypeID: "", //商品类别ID
        DescType: 0,
        IsGift: -1,
        Mode: 0
      },
      zhiDanData: dayjs(new Date()).format("YYYY-MM-DD"),
      theGoodsList: [],
      goodsListData: [],
      constGOODSLIST: [],
      vCheckGoodsTimeOut: undefined,
      tableHeight: document.body.clientHeight - 300,
      showUploadDialog: false
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      goodsList: "goodsList",
      goodsItem: "goodsItem",
      goodsListState: "goodsListState",
      paywayList: "paywayList",
      dataList: "allocationItem",
      dataObj: "allocationObj",
      dataState: "allocationState",
      allocationAddState: "allocationAddState",
      OnlyOneGoodsState: "goodsListNew"
    })
  },
  components: {
    uploadBillTable: () => import("../uploadExportBill.vue")
  },
  watch: {
    OnlyOneGoodsState(data) {
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
          PURPRICE: 1,
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
    allocationAddState(data) {
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
            isEdit: true
          }
        ];
        this.pageData.BILLID = "";
        this.pageData.REMARK = "";
      } else {
        this.$message({ message: data.message, type: "error" });
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
          isEdit: false
        });
      }

      arr.forEach((el) => {
        const res = newArr.findIndex((ol) => {
          return (
            el.GOODSNAME == ol.GOODSNAME &&
            el.GOODSID == ol.GOODSID &&
            el.PRICE == ol.PRICE
          );
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
        isEdit: true
      });

      this.showUploadDialog = false;
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
      if (this.storedCount == undefined) {
        this.storedCount = [];
      }
      for (let i = 0; i < this.currentColors.length; i++) {
        let color = this.currentColors[i];
        for (let j = 0; j < this.currentSizes.length; j++) {
          let size = this.currentSizes[j];
          if (color[size.SIZEID] != undefined) {
            if (this.storedCount[this.currentColors[i].COLORID] == undefined) {
              this.storedCount[this.currentColors[i].COLORID] = [];
            }
            let item = this.goodsObj;
            let newModel = {
              GOODSID: item.ID,
              GOODSNAME: item.NAME,
              GOODSCODE: item.CODE,
              QTY: color[size.SIZEID],
              PRICE: item.PURPRICE,
              PURPRICE: item.PURPRICE,
              DISCOUNT: 1,
              isEdit: false
            };
            insertModels.push(newModel);
          }
        }
      }

      if (this.theGoodsList.length == 0) {
        this.theGoodsList = insertModels.concat({
          GOODSNAME: "",
          GOODSID: "",
          GOODSCODE: "",
          PRICE: 0,
          PURPRICE: 0,
          QTY: 1,
          isEdit: true
        });
      } else {
        let arr2 = this.theGoodsList.concat(insertModels),
          newJson = [];
        for (let item1 of arr2) {
          let flag = true;
          for (let item2 of newJson) {
            if (
              item1.COLORID == item2.COLORID &&
              item1.SIZEID == item2.SIZEID &&
              item1.GOODSNAME == item2.GOODSNAME &&
              item1.GOODSID == item2.GOODSID
            ) {
              flag = false;
            }
          }
          if (flag == true) {
            //判断是否重复
            newJson.push(item1); //不重复的放入新数组, 新数组的内容会继续进行上边的循环。
          }
        }

        let newArr = [];
        newJson.forEach((el) => {
          const res = newArr.findIndex((ol) => {
            return (
              el.COLORID == ol.COLORID &&
              el.SIZEID == ol.SIZEID &&
              el.GOODSNAME == ol.GOODSNAME &&
              el.GOODSID == ol.GOODSID
            );
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
          isEdit: true
        });
      }
      this.isAddGoodsGroup = false;
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
                isEdit: true
              }
            ];
            this.pageData = {};
            this.searchText = "";
          })
          .catch(() => {});
      }
    },
    scanSearch(searchText) {
      // 根据单据号查询
      this.pageDataBill.Filter = searchText;
      if (searchText.length > 0) {
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
          PURPRICE: 1,
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
          PURPRICE: 1,
          QTY: 1,
          DISCOUNT: 0,
          isEdit: true
        });
      }
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
      // 1秒内如果有改动查询关键字，就取消查询，否则触发查询。
      this.vCheckGoodsTimeOut = setTimeout(function () {
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
        isEdit: true
      });
    },
    handleSubmit(value) {
      if (this.curOutShopId == "") {
        this.$message.warning("请选择调出店铺");
        return;
      }
      if (this.curInShopId == "") {
        this.$message.warning("请选择调入店铺");
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
        BillId:
          this.pageData.BILLID == undefined || this.pageData.BILLID == ""
            ? ""
            : this.pageData.BILLID,
        BillDate: new Date().getTime(),
        ManualNo: "", //手工单号
        Remark: this.pageData.REMARK,
        GoodsList: JSON.stringify(newArr),
        IsCheck: value, // 0: 草稿  1：确认单
        ShopId: this.curOutShopId,
        InShopId: this.curInShopId
      };

      this.$store.dispatch("addAllocation", sendData).then(() => {
        if (value == 0) {
          this.CGloading = true;
        } else {
          this.loading = true;
        }
      });
    },
    handleDel(idx, row) {
      this.theGoodsList.splice(idx, 1);
    },
    defaultGoodsList() {
      this.$store.dispatch("getGoodsList", { Status: 1, Filter: "", Mode: 0, PN: 1 });
    }
  },
  mounted() {
    if (this.shopList.length == 0) {
      this.$store.dispatch("getShopList");
    }
    if (this.paywayList.length == 0) {
      this.$store.dispatch("getPaywayList", {});
    }
    this.defaultGoodsList();

    let getItemData = sessionStorage.getItem("theGoodsList_A") || "[]";
    let theGoodsList = JSON.parse(getItemData);

    if (theGoodsList.length != 0) {
      this.theGoodsList = theGoodsList.concat({
        GOODSNAME: "",
        GOODSID: "",
        GOODSCODE: "",
        PRICE: 0,
        PURPRICE: 0,
        QTY: 1,
        isEdit: true
      });
      let getItemObj = sessionStorage.getItem("theGoodsObj_A");
      let obj = JSON.parse(getItemObj);
      this.pageData = obj;
      this.curInShopId = obj.INSHOPID;
      this.curOutShopId = obj.SHOPID;
    } else {
      this.theGoodsList.push({
        GOODSNAME: "",
        GOODSID: "",
        GOODSCODE: "",
        PRICE: 0,
        PURPRICE: 0,
        QTY: 1,
        isEdit: true
      });
    }
  }
};
</script>

<style lang="scss" scoped >
.allocation .el-input-group__prepend {
  padding: 0 10px !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.el-table td,
.el-table th {
  text-align: center;
}

.leftLabel {
  width: 77px;
  min-width: 77px;
}
</style>

