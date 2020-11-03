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
      <el-container class="addgoods">
        <div class="content-new-fex">
          <div class="member-main-top">
            <div class="content-center">
              <div class="member-main-top-buttom">
                <div class="btn">
                  <div class="btm-list">
                    <el-button type="primary" size="small" @click="showAddNewChange()">
                      新增商品
                    </el-button>
                  </div>
                  <div class="btm-list">
                    <el-button
                      type="default"
                      icon
                      for="input"
                      plain
                      size="small"
                      :loading="importLoading"
                      @click="$refs.upload.click()"
                    >
                      商品导入
                    </el-button>
                    <input
                      type="file"
                      ref="upload"
                      @change="readExcel"
                      accept=".xls, .xlsx"
                      class="outputlist_upload hide"
                    />
                  </div>
                  <div class="btm-list">
                    <el-button plain size="small" @click="ExportGoodsData">商品导出</el-button>
                  </div>
                  <div class="btm-list">
                    <el-button plain size="small">
                      <a href="static/images/商品导入模板.xls" class="producttemplate">下载模板</a>
                    </el-button>
                  </div>
                </div>
                <!-- <div class="ipt">
                  <el-input
                    v-model="searchText"
                    placeholder="请输入商品"
                    style="width: 52%"
                    size="small"
                  >
                    <template slot="append" @click="searchfun2(1)">
                      <span style="font-size: 12px">搜索</span>
                    </template>
                  </el-input>
                </div> -->
              </div>
              <div class="content-center-button">
                <el-row class="member-main-top-type">
                  <el-col :span="7">
                    商品分类&nbsp;&nbsp;&nbsp;
                    <el-select
                      v-model="value2"
                      placeholder="请选择商品分类"
                      size="small"
                      @change="selectMode"
                      clearable
                    >
                      <el-option
                        v-for="item in commoditycflList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    状态&nbsp;&nbsp;&nbsp;
                    <el-select
                      v-model="value3"
                      placeholder="请选择状态"
                      size="small"
                      @change="selectMode"
                      clearable
                    >
                      <el-option
                        v-for="item in status"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-col>

                  <el-col :span="10" style="text-align: right">
                    <el-input
                      v-model="searchText"
                      placeholder="请输入商品名称或货号"
                      style="width: 70%"
                      size="small"
                    >
                      <template slot="append">
                        <span style="font-size: 12px; cursor: default" @click="searchfun2(1)">
                          搜索
                        </span>
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="content-table3">
            <div class="content-table-center">
              <el-table
                size="small"
                highlight-current-row
                :data="pagelist"
                :height="tableHeight"
                v-loading="loading"
                ref="Table"
                @selection-change="handleSelectionChange"
                style="width: 100%"
                header-row-class-name="bg-F1F2F3"
              >
                <el-table-column type="selection" width="42" fixed="left"></el-table-column>
                <el-table-column prop="NAME" label="商品" width="160" sortable>
                  <template slot-scope="scope">
                    <el-tooltip placement="right-start">
                      <div slot="content">
                        <img
                          :src="scope.row.goodsImg != undefined ? scope.row.goodsImg : defaultImg"
                          onerror="this.src='static/images/shopmore.png'"
                          alt=""
                          style="width: 150px; height: 150px"
                        />
                      </div>
                      <img
                        :src="scope.row.goodsImg != undefined ? scope.row.goodsImg : defaultImg"
                        onerror="this.src='static/images/shopmore.png'"
                        style="
                          float: left;
                          border-radius: 3px;
                          width: 40px;
                          height: 40px;
                          margin-right: 8px;
                        "
                      />
                    </el-tooltip>

                    <span style="height: 40px; width: 102px">
                      <i
                        class="pull-left inline-block"
                        style="
                        color:#2589FF;
                          width: 92px;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                      >
                      <span style="cursor:pointer" @click="handleEdit(scope.$index, scope.row)">{{scope.row.NAME ? scope.row.NAME : ' '}}</span>
                      </i>
                      <i class="" style="width: 92px">{{ scope.row.MOBILENO }}</i>
                      {{ scope.row.CODE }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="TYPENAME" label="分类" align="center"></el-table-column>
                <!-- <el-table-column prop="SPECS" label="规格" align="center"></el-table-column> -->
                <el-table-column prop="PRICE" label="价格" align="center"></el-table-column>
                <el-table-column prop="PURPRICE" label="成本" width="90" align="center">
                  <template slot-scope="scope">
                    {{ isPurViewFun(210040601) ? scope.row.PURPRICE : "****" }}
                  </template>
                </el-table-column>
                <el-table-column prop="STOCKQTY" label="库存" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="scope">
                    <span style="height: 40px; width: 102px">
                      {{ scope.row.STATUS == 1 ? "上架" : "下架" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" align="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="retrievalChange(scope.$index, scope.row)"
                    >
                      出库
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="UnRetrievalChange(scope.$index, scope.row)"
                    >
                      入库
                    </el-button>

                    <el-button
                      type="text"
                      size="small"
                      @click="notesChange(scope.$index, scope.row)"
                    >
                      记录
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="handleEdit(scope.$index, scope.row)"
                    >
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <div v-show="dataList.length > 0" class="m-top-smts clearfix elpagination">
                <div>
                  <el-row>
                    <el-col :span="12">
                      <el-button size="small" @click="delGoods">删除商品</el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-pagination
                        @size-change="handlePageChange"
                        @current-change="handlePageChange"
                        :current-page.sync="pagination.PN"
                        :pager-count="5"
                        :page-size="pagination.PageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pagination.TotalNumber"
                        class="text-right"
                      ></el-pagination>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>

          <!-- add -->
          <el-dialog
            v-if="showAddNew && dealType == 'add'"
            title="添加商品"
            :visible.sync="showAddNew"
            width="55%"
          >
            <add-new-goods
              @closeModal="showAddNew = false"
              @resetList="
                showAddNew = false;
                getNewData();
              "
              :dataType="{ value: 2, dealState: 'add' }"
            ></add-new-goods>
          </el-dialog>

          <!-- 商品详情 -->
          <el-dialog
            title="商品详情"
            :visible.sync="showItem"
            width="700px"
            top="2%"
            style="max-width: 100%"
          >
            <add-new-goods
              v-if="showItem"
              @closeModal="showItem = false"
              @resetList="
                showItem = false;
                getNewData();
              "
              :dataType="{ value: parseInt(goodsMode) + 1, dealState: 'edit' }"
            ></add-new-goods>
          </el-dialog>

          <!-- 出库弹窗 -->
          <el-dialog title="商品出库" :visible.sync="retrievalShow" width="35%">
            <div class="retrieval">
              <div>
                <el-form ref="form" :rules="rules1" :model="form" label-width="80px">
                  <el-form-item label="商品名称">
                    <el-button type="text" style="margin-left: 18px">{{ form.name }}</el-button>
                  </el-form-item>
                  <el-form-item label="现有库存">
                    <el-button type="text" style="margin-left: 18px">{{ form.qty }}</el-button>
                  </el-form-item>
                  <el-form-item label="出库数量" prop="retQty">
                    <el-input v-model="form.retQty" placeholder="请输入出库数量"></el-input>
                  </el-form-item>
                  <el-form-item label="出库类型" prop="region">
                    <el-select
                      v-model="form.region"
                      placeholder="请选择出库类型"
                      style="width: 100%"
                    >
                      <el-option label="采购进货" value="1"></el-option>
                      <el-option label="采购退货" value="2"></el-option>
                      <el-option label="采购丢损" value="3"></el-option>
                      <el-option label="采购调整" value="4"></el-option>
                      <el-option label="采购调拨" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注说明">
                    <el-input v-model="form.Remark" placeholder="请输入备注说明"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div style="text-align: center">
                <span slot="footer" class="dialog-footer">
                  <el-button @click="retrievalShow = false">取 消</el-button>
                  <el-button type="primary" @click="setRetrival">保存</el-button>
                </span>
              </div>
            </div>
          </el-dialog>

          <!-- 入库弹窗 -->
          <el-dialog title="商品入库" :visible.sync="unretrievalShow" width="35%">
            <div class="retrieval">
              <div>
                <el-form ref="unform" :rules="rules" :model="unform" label-width="80px">
                  <el-form-item label="商品名称">
                    <el-button type="text" style="margin-left: 18px">{{ unform.name }}</el-button>
                  </el-form-item>
                  <el-form-item label="现有库存">
                    <el-button type="text" style="margin-left: 18px">{{ unform.qty }}</el-button>
                  </el-form-item>
                  <el-form-item label="入库数量" prop="retQty">
                    <el-input placeholder="请输入入库数量" v-model.trim="unform.retQty"></el-input>
                  </el-form-item>
                  <el-form-item label="入库类型" prop="region">
                    <el-select
                      v-model="unform.region"
                      placeholder="请选择入库类型"
                      style="width: 100%"
                    >
                      <el-option label="采购进货" value="1"></el-option>
                      <el-option label="采购退货" value="2"></el-option>
                      <el-option label="采购丢损" value="3"></el-option>
                      <el-option label="采购调整" value="4"></el-option>
                      <el-option label="采购调拨" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注说明">
                    <el-input v-model="unform.Remark" placeholder="请输入备注说明"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div style="text-align: center">
                <span slot="footer" class="dialog-footer">
                  <el-button @click="unretrievalShow = false">取 消</el-button>
                  <el-button type="primary" @click="unSetRetrival">保存</el-button>
                </span>
              </div>
            </div>
          </el-dialog>

          <el-dialog title="记录" :visible.sync="notesShow" width="60%" :before-close="handleClose">
            <recordPage :dataType="dataTypes"></recordPage>
          </el-dialog>

          <!-- 数据导出 -->
          <el-dialog
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            title="数据导出"
            :visible.sync="exportData.show"
            width="400px"
          >
            <exportPage
              :dataType="exportData"
              :isPage="true"
              @closeModal="exportData.show = false"
            ></exportPage>
          </el-dialog>

        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import table2excel from "js-table2excel";
import MIXINS_GOOD from "@/mixins/good.js";
import { GOODS_IMGURL } from "@/util/define";
import { getUserInfo } from "@/api/index";
let _ = require("lodash");

export default {
  mixins: [MIXINS_GOOD.GOOD_MENU, MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
  data() {
    return {
      dataTypes: {},
      activeName: "first",
      retrievalShow: false,
      unretrievalShow: false,
      notesShow: false,
      dialogVisible: false,
      pagelist: [],
      mode: [
        { id: 1, name: "服务" },
        { id: 0, name: "商品" }
      ],
      status: [
        { id: 1, name: "上架" },
        { id: 0, name: "下架" }
      ],
      value1: "",
      value2: "",
      value3: "",
      options1: "",
      getgoodsIMGURL: "",
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      },
      searchText: "",
      isFilter: false,
      pageData: {
        PN: 1,
        Filter: "",
        Status: -1,
        LevelName: "",
        VipFlag: "",
        ShopId: "",
        FilterStr: "",
        Mode: -1
      },
      multipleSelection: [],
      reportLoss: { loading: false, num: 0 },
      showAddNew: false,
      showItem: false,
      exportLoading: false,
      form: {
        name: "",
        qty: "",
        retQty: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        Remark: "",
        ID: ""
      },
      unform: {
        name: "",
        qty: "",
        retQty: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        Remark: "",
        ID: ""
      },
      deskmode: "",
      goodsMode: "",
      tableHeight: document.body.clientHeight - 300,
      Goodscode: "",
      rules: {
        region: [
          {
            required: true,
            message: "请选择入库类型",
            trigger: "change"
          }
        ],
        retQty: [
          {
            required: true,
            message: "请选择入库数量",
            trigger: "blur"
          }
        ]
      },
      rules1: {
        region: [
          {
            required: true,
            message: "请选择出库类型",
            trigger: "change"
          }
        ],
        retQty: [
          {
            required: true,
            message: "请选择出库数量",
            trigger: "blur"
          }
        ]
      },
      exportData: { show: false }
    };
  },
  computed: {
    ...mapGetters({
      dataList: "goodsList",
      goodsListState: "goodsListState",
      commoditycflList: "commoditycflList",
      goodsMovingState: "goodsMovingState",
      dgoodsdeleteState: "goodsdeleteState",
      exportGoodsState: "exportGoodsState",
      importState: "importGoodsState",
      gparameterstate: "gparameterstate"
    })
  },
  watch: {
    gparameterstate(data) {
      if (data.success && Object.keys(data.data.CompanyConfig).length > 0) {
        let code = data.data.CompanyConfig.AUTOGENGOODSCODE;
        this.Goodscode = code;
      }
    },
    outputsState(data) {
      // 导入 mixins
      if (data.state) {
        this.importExcel(this.outputs);
      } else {
        this.$message({
          showClose: true,
          message: "数据为空",
          type: "error"
        });
      }
    },
    importState(data) {
      if (data.success) {
        this.$message("导入成功");
        this.$store.dispatch("getGoodsList", {
          Status: -1,
          Mode: -1,
          Filter: "",
          PN: 1
        });
      } else {
        this.$message(data.message);
      }
    },
    exportGoodsState(data) {
      this.exportLoading = false;
      if (data.success) {
        this.exportExcel(data.data.PageData);
      }
    },
    dgoodsdeleteState(data) {
      this.loading = false;
      if (data.success) {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getNewData();
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },

    dataList(data) {
      this.getgoodsIMGURL = GOODS_IMGURL;
      let setDate = data;
      let agentPermission = getUserInfo().List;

      let arr = agentPermission.filter((element) => element.MODULENAME == "成本价");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        for (var i in setDate) {
          setDate[i].goodsImg = this.getgoodsIMGURL + setDate[i].ID + ".png?" + Math.random();
          setDate[i].PURPRICE = "***";
        }
      } else {
        for (var i in setDate) {
          setDate[i].goodsImg = this.getgoodsIMGURL + setDate[i].ID + ".png?" + Math.random();
        }
      }
      this.pagelist = setDate;
      this.loading = false;
    },
    goodsListState(data) {
      this.pagination = {
        TotalNumber: data.data.PageData.TotalNumber,
        PageNumber: data.data.PageData.PageNumber,
        PageSize: data.data.PageData.PageSize,
        PN: data.data.PageData.PN
      };
    },
    searchText() {
      this.searchfun();
    },
    goodsMovingState(data) {
      if (data.success) {
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.retrievalShow = false;
        this.unretrievalShow = false;
        this.getNewData();
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    dataState(data) {
      console.log(data.data);
      if (data.success && this.loading && this.dealType == "edit") {
        this.showItem = true;
      }
      this.loading = false;
    }
  },
  methods: {
    handleClose() {
      this.notesShow = false;
    },
    ExportGoodsData() {
      this.exportData = {
        show: true,
        data: {
          Filter: this.searchText,
          Mode: this.pageData.Mode,
          TypeID: this.pageData.TypeID,
          status: this.pageData.Status,
          ShopId: this.pageData.ShopId
        },
        index: 22
      };
    },
    exportExcel(arr) {
      // 导出到excel
      this.getgoodsIMGURL = GOODS_IMGURL;
      var list = [...arr];
      for (var i in list) {
        list[i].GOODIMG = this.getgoodsIMGURL + list[i].ID + ".png";
        if (list[i].STATUS == 1) {
          list[i].STATUS = "上架";
        } else {
          list[i].STATUS = "下架";
        }

        if (list[i].GOODSMODE == 1) {
          list[i].GOODSMODE = "服务";
        } else {
          list[i].GOODSMODE = "商品";
        }
      }
      var head = [
        "商品名称",
        "商品编码",
        "商品分类",
        "商品价格",
        "会员价",
        "商品进价",
        "库存",
        "单位",
        "商品规格",
        "状态",
        "类型",
        "商品预警",
        "备注",
        "图片链接"
      ];
      var val = [
        "NAME",
        "CODE",
        "TYPENAME",
        "PRICE",
        "VIPPRICE",
        "PURPRICE",
        "STOCKQTY",
        "UNITNAME",
        "SPECS",
        "STATUS",
        "GOODSMODE",
        "MINSTOCKNUMBER",
        "REMARK",
        "GOODIMG"
      ];
      var title = "商品导出" + this.getNowDateTime();
      this.export2Excel(head, val, list, title);
    },
    importExcel(arr) {
      // 导入数据
      let newData = [];
      for (let i = 1; i < arr.length; i++) {
        let strCode;
        for (var index in arr[i]) {
          let strlen = index.replace(/\s*/g, "").length;
          if (strlen > 40) {
            strCode = arr[i][index];
          }
        }

        //   if (
        //     arr[i].__EMPTY_1 == "商品" ||
        //     arr[i].__EMPTY_1 == "服务" ||
        //     arr[i].__EMPTY_1 == 1 ||
        //     arr[i].__EMPTY_1 == 0
        //   ) {
        let item = {
          Code: strCode,
          Name: arr[i].__EMPTY == undefined ? "" : arr[i].__EMPTY,
          GoodsMode: 0,
          TypeName: arr[i].__EMPTY_1 == undefined ? "" : arr[i].__EMPTY_1,
          Specs: arr[i].__EMPTY_2 == undefined ? "" : arr[i].__EMPTY_2,
          Remark: arr[i].__EMPTY_3 == undefined ? "" : arr[i].__EMPTY_3,
          UnitName: arr[i].__EMPTY_4 == undefined ? "" : arr[i].__EMPTY_4,
          Price: arr[i].__EMPTY_5 == undefined ? "" : arr[i].__EMPTY_5,
          PurPrice: arr[i].__EMPTY_6 == undefined ? "" : arr[i].__EMPTY_6,
          StockQty: arr[i].__EMPTY_7 == undefined ? "" : arr[i].__EMPTY_7,
          VipPrice: arr[i].__EMPTY_8 == undefined ? "" : arr[i].__EMPTY_8
        };
        newData.push(item);
        //   } else {
        //     this.$message.error("导入的商品编码填写错误,请重新填写再导入");
        //     this.importLoading = false;
        //     return;
        //   }
      }
      // console.log(newData); return;
      this.$store.dispatch("getImportGoodsData", newData).then(() => {
        // this.importLoading = true;
      });
    },
    retrievalChange(e, event) {
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == "210040102");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("您还没有获得相关权限!");
      } else {
        this.form.name = event.NAME;
        this.form.qty = event.STOCKQTY;
        this.form.ID = event.ID;
        this.retrievalShow = true;
      }
    },
    UnRetrievalChange(e, event) {
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == "210040102");
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("您还没有获得相关权限!");
      } else {
        this.unform.name = event.NAME;
        this.unform.qty = event.STOCKQTY;
        this.unform.ID = event.ID;
        this.unretrievalShow = true;
      }
    },
    setRetrival() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let setDate = Object.assign(
            {},
            {
              id: this.form.ID,
              QTY: this.form.retQty,
              BillType: this.form.region,
              Remark: this.form.Remark,
              movemode: -1
            }
          );
          this.$store.dispatch("setGoodsMoving", setDate);
          this.form = {
            name: "",
            qty: "",
            retQty: "",
            region: "",
            date1: "",
            date2: "",
            delivery: false,
            Remark: "",
            ID: ""
          };
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    unSetRetrival() {
      this.$refs.unform.validate((valid) => {
        if (valid) {
          let setDate = Object.assign(
            {},
            {
              id: this.unform.ID,
              QTY: this.unform.retQty,
              BillType: this.unform.region,
              Remark: this.unform.Remark,
              movemode: 1
            }
          );
          this.$store.dispatch("setGoodsMoving", setDate);
          this.unform = {
            name: "",
            qty: "",
            retQty: "",
            region: "",
            date1: "",
            date2: "",
            delivery: false,
            Remark: "",
            ID: ""
          };
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.retrievalShow=false
    },
    notesChange(e, event) {
      this.notesShow = true;
      this.dataTypes = Object.assign({}, event);
      this.$store.dispatch("getGoodsInventory", {
        ID: this.dataTypes.ID,
        PN: 1
      });
    },
    searchfun: _.debounce(function () {
      this.searchfun2(0);
    }, 1000),
    searchfun2(type) {
      this.pageData.FilterStr = this.searchText;
      this.pageData.PN = 1;
      this.getNewData();
    },
    handlePageChange: function (currentPage) {
      console.log("页面跳转", currentPage);
      this.pagination.PN = parseInt(currentPage);
      this.pageData.PN = parseInt(currentPage);
      this.pageData.Mode = this.value1;
      this.getNewData();
    },
    getNewData() {
      this.$store.dispatch("getGoodsList", this.pageData).then(() => {
        this.loading = true;
      });
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.Table.clearSelection();
        this.$refs.Table.toggleRowSelection(val.pop());
      } else {
        this.multipleSelection = val;
      }
    },
    delGoods() {
      console.log("删除商品");
      if (this.multipleSelection.length == 0) {
        this.$message("请选择商品");
        return;
      }
      let ID;
      if (this.multipleSelection.length > 0) {
        ID = this.multipleSelection[0].ID;
        console.log(this.multipleSelection);
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("getGoodsdelete", { ID }).then(() => {
            this.loading = true;
            this.dealType = "del";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    selectMode(e) {
      this.loading = true;
      this.$store.dispatch("getGoodsList", {
        Status: this.value3,
        Mode: String(this.value1),
        TypeID: this.value2,
        FilterStr: "",
        PN: 1
      });
    },
    handleEdit(idx, item) {
      this.$store.dispatch("getGoodsItem", item).then(() => {
        this.goodsMode = parseInt(item.GOODSMODE);
        console.log(this.goodsMode);
        this.dealType = "edit";
        // this.loading = true;
      });
      this.showItem = true;
    },
    showAddNewChange() {
      this.showAddNew = true;
      this.dealType = "add";
      if (this.Goodscode == true) {
        this.$store.dispatch("getGoodsCode").then(() => {});
      }
    }
  },
  mounted() {
    this.$store.dispatch("getparameterstate");
    this.$store.dispatch("getGoodsList", {
      Status: 1,
      Mode: -1,
      FilterStr: "",
      PN: 1
    });
  },
  created() {
    this.activePath = this.$route.path;
    let getUser = getUserInfo();
    console.log("getUser");
    console.log(getUser.TradeType);
    console.log("getUser");
    this.deskmode = getUser.TradeType;
  },
  beforeCreate() {
    let list = this.$store.state.commodityc.commoditycflList;
    if (list.length == 0) {
      this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    }
  },
  components: {
    headerPage: () => import("@/components/header"),
    addNewGoods: () => import("@/components/goods/add"),
    recordPage: () => import("@/components/goods/record"),
    exportPage: () => import("@/components/export/common.vue")
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
  /* margin-top: 5px; */
  display: flex;
  height: 60px;
  width: 100%;
  align-items: center;
  /* margin-left: 28px; */
}
.member-main-top-buttom .btn {
  width: 50%;
  display: flex;
  align-items: center;
  padding-top: 7px;
}
.member-main-top-buttom .ipt {
  width: 50%;
  text-align: right;
  padding-top: 7px;
}
.btm-list {
  margin-right: 25px;
}
.member-main-top-type {
  height: 60px;
  width: 100%;
  /* line-height: 60px; */
  padding-bottom: 7px;
  padding-top: 14px;
}
.addGoods {
  width: 60px;
  height: 160px;
  text-align: center;
}
.addgoods >>> .el-dialog__header {
  padding: 20px 20px 10px !important;
}
.addGoods img {
  padding-top: 25px;
}
.addGoods-cont >>> .el-tabs__item.is-left {
  height: 160px !important;
}
.addGoods-cont >>> .is-scrollable {
  padding: 0 !important;
}
.addGoods-cont >>> .el-tabs__nav {
  height: 780px !important;
}
.retrieval {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
}
.content-table3 {
  position: absolute;
  bottom: 0px;
  top: 140px;
  left: 10px;
  right: 10px;
  background: #fff;
}
</style>
