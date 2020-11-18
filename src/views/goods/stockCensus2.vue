<template>
  <div class="content-new-fex">
    <div class="content-bigty">
      <div class="content-center">
        <div class="content-center-list">
          <el-row :gutter="10">
            <el-col :span="17">
              <el-radio-group
                size="small"
                v-model="chooseDateIdx"
                class="m-right-md"
                @change="chooseDate(chooseDateIdx)"
              >
                <el-radio-button
                  v-for="(item, index) in ['今天', '昨天', '本月', '上月', '其它']"
                  :key="index"
                  :label="index"
                >
                  {{ item }}
                </el-radio-button>
              </el-radio-group>

              <el-date-picker
                size="small"
                v-model="ruleForm.dateChoose"
                :disabled="chooseDateIdx != 4"
                @change="chooseDate2"
                type="datetimerange"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 400px;"
                class="inline-block"
              ></el-date-picker>
            </el-col>
            <el-col :span="7" class="pull-right">
              <el-input
                size="small"
                style="width: 100%"
                v-model="ruleForm.Filter"
                clearable
                prefix-icon="el-icon-search"
                placeholder="请输入商家名称或商品编码"
              >
                <el-button slot="append" type="default" @click="searchData">搜索</el-button>
              </el-input>
            </el-col>
            <el-col :span="5" class="pull-right text-right">
              <!-- <el-button type="primary" size="small" plain @click="ExportcaiGouData">
                                <i class="el-icon-upload el-icon--right"></i> 导出表格
                            </el-button> -->
            </el-col>
          </el-row>
        </div>
        <div class="content-center-list">

              店 铺
              <el-select
                size="small"
                v-model="ShopId"
                multiple
                collapse-tags
                clearable
                @change="searchData()"
                placeholder="请选择店铺"
                class="selectStyle1 m-right-md"
              >
                <el-option
                  v-for="item in shopList"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>

              供应商
              <el-select
                size="small"
                v-model="ruleForm.SupplierId"
                @change="searchData()"
                clearable
                placeholder="请选择供应商"
                class="m-right-md"
              >
                <el-option
                  v-for="(item, i) in datasupplierList"
                  :key="i"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>

              分 类
              <el-select
                v-model="TypeId"
                multiple
                collapse-tags
                clearable
                size="small"
                @change="searchData()"
                placeholder="请选择分类"
              >
                <el-option
                  v-for="(item, i) in categoryList"
                  :key="i"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>
        </div>
      </div>
    </div>
    <div class="content-table-caiGouReport" :style="{ height: tableHeiht + 'px;' }">
      <div class="content-table-center p-bottom-sm">
        <el-table
          size="small"
          :data="tableList"
          v-loading="loading"
          element-loading-text="数据加载中..."
          style="margin-top: 5px; width: 100%"
          header-row-class-name="bg-theme2 text-white"
          :height="tableHeight"
        >
          <el-table-column prop="GOODSNAME" label="商品"></el-table-column>
          <el-table-column prop="GOODSCODE" label="编码"></el-table-column>
          <el-table-column prop="TYPENAME" label="分类"></el-table-column>
          <el-table-column prop="UNITNAME" label="单位"></el-table-column>
          <el-table-column prop="QTY" label="数量"></el-table-column>
          <el-table-column prop="SALEPRICE" label="零售价"></el-table-column>
          <el-table-column prop="PRICE" label="采购价"></el-table-column>
          <el-table-column prop="MONEY" label="金额"></el-table-column>
        </el-table>
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
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import dayjs from "dayjs";
export default {
  mixins: [MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
  data() {
    return {
      chooseDateIdx: 0,
      loading: false,
      isShowDate: false,
      ShopId: [],
      TypeId: [],
      ruleForm: {
        Filter: "",
        dateChoose: [new Date(this.getCustomDay(-7)).getTime(), new Date().getTime()],
        PN: 1,
        SupplierId: ""
      },
      tableHeight: document.body.clientHeight - 275,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      },
      bussinessTime: getUserInfo().CompanyConfig.TIMEDIFFERENCE
    };
  },
  computed: {
    ...mapGetters({
      categoryList: "categoryList",
      datasupplierList: "goodssupplierList",
      shopList: "shopList",
      tableList: "CaiGouReportList",
      getCaiGouReportState: "getCaiGouReportState",
      exportWarehousingRbort: "exportWarehousingRbort",
      tableHeiht: document.body.clientHeight - 200
    })
  },
  watch: {
    exportWarehousingRbort(data) {
      this.exportExcel(data);
    },
    getCaiGouReportState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
        this.dataObj = data.data.Obj;
      } else {
        this.$message.error(data.message);
      }
    }
  },
  methods: {
    ExportcaiGouData() {
      this.$store.dispatch("getExportcaiGouData", this.ruleForm).then(() => {
        // this.exportLoading = true;
      });
    },
    exportExcel(arr) {
      // 导出到excel
      var list = [...arr];
      var head = ["商品名称", "商品编码", "商品分类", "单位", "数量", "零售价", "采购价", "金额"];
      var val = [
        "GOODSNAME",
        "GOODSCODE",
        "TYPENAME",
        "UNITNAME",
        "QTY",
        "SALEPRICE",
        "PRICE",
        "MONEY"
      ];
      var title = "采购统计导出" + this.getNowDateTime();
      this.export2Excel(head, val, list, title);
    },
    chooseDate2(v) {
      this.ruleForm.dateChoose = [v[0], v[1]];
      this.ruleForm.PN = 1;
      this.searchData();
    },
    chooseDate(i) {
      this.chooseDateIdx = i;

      let bussinessTimeToNumber = Number(this.bussinessTime.replace(":", ""));
      let curMonth = Number(dayjs().month()) + 1;
      let todayDate = dayjs(new Date().getTime());
      let nowHourMius = todayDate.format("HH:mm");
      let yesterdayDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      let nowHourMiusToNumber = Number(nowHourMius.replace(":", ""));

      let beginFormat = "",
        endFormat = "",
        beginTime = "",
        endTime = "";

      if (i == 0) {
        // 今天
        // 现在的时间 大于 营业时间, 为今天
        beginFormat =
          nowHourMiusToNumber >= bussinessTimeToNumber
            ? todayDate.format("YYYY-MM-DD")
            : yesterdayDate;
        endTime = todayDate.format("YYYY-MM-DD HH:mm:ss");
      } else if (i == 1) {
        // 昨日
        beginFormat =
          nowHourMiusToNumber >= bussinessTimeToNumber
            ? yesterdayDate
            : dayjs().subtract(2, "day").format("YYYY-MM-DD");
        endFormat =
          nowHourMiusToNumber >= bussinessTimeToNumber
            ? todayDate.format("YYYY-MM-DD")
            : yesterdayDate;
        endTime = endFormat + " " + this.bussinessTime + ":00";
      } else if (i == 2) {
        // 本月
        beginFormat = dayjs().year() + "-" + curMonth + "-" + 1;
        endTime = dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss");
      } else if (i == 3) {
        // 上月
        beginFormat = dayjs().year() + "-" + dayjs().month() + "-" + 1;
        endFormat = dayjs().year() + "-" + curMonth + "-" + 1;
        endTime = endFormat + " " + this.bussinessTime + ":00";
      } else {
        return;
      }

      beginTime = beginFormat + " " + this.bussinessTime + ":00";
      let firstDate = new Date(beginTime).getTime();
      let lastDate = new Date(endTime).getTime();

      console.log(firstDate, lastDate);

      this.ruleForm.dateChoose = [firstDate, lastDate];

      this.searchData();
    },
    searchData() {
      if (this.ShopId.length == 0) {
        this.ruleForm.ShopId = "";
      } else {
        let shopList = this.ShopId,
          str = "";
        for (var i in shopList) {
          str += shopList[i] + ",";
        }
        if (str.length > 0) {
          //去掉最后一个逗号
          str = str.substring(0, str.length - 1);
        }
        this.ruleForm.ShopId = str;
      }

      if (this.TypeId.length == 0) {
        this.ruleForm.TypeId = "";
      } else {
        let typeList = this.TypeId,
          str = "";
        for (var i in typeList) {
          str += typeList[i] + ",";
        }
        if (str.length > 0) {
          //去掉最后一个逗号
          str = str.substring(0, str.length - 1);
        }
        this.ruleForm.TypeId = str;
      }

      this.$store.dispatch("GetWarehousingReport", this.ruleForm).then(() => {
        this.loading = true;
      });
    },
    handlePageChange: function (currentPage) {
      if (this.ruleForm.PN == currentPage || this.loading) {
        return;
      }
      this.ruleForm.PN = parseInt(currentPage);
      this.searchData();
    },
    handleView(item, idx) {
      console.log(item);
      this.$message.warning(item.GOODSNAME);
    }
  },
  mounted() {
     let bussinessTimeToNumber = Number(this.bussinessTime.replace(":", ""));
    let curMonth = Number(dayjs().month()) + 1;
    let todayDate = dayjs(new Date().getTime());
    let nowHourMius = todayDate.format("HH:mm");
    let yesterdayDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    let nowHourMiusToNumber = Number(nowHourMius.replace(":", ""));

    let beginFormat =
      nowHourMiusToNumber >= bussinessTimeToNumber ? todayDate.format("YYYY-MM-DD") : yesterdayDate;

    let beginTime = beginFormat + " " + this.bussinessTime + ":00";
    let endTime = todayDate.format("YYYY-MM-DD HH:mm");

    let firstDate = new Date(beginTime).getTime();
    let lastDate = new Date(endTime).getTime();
    this.ruleForm.dateChoose = [firstDate, lastDate];

    this.ShopId = [getHomeData().shop.ID]

    this.searchData()

    if (this.categoryList.length == 0) {
      this.$store.dispatch("getCategoryList");
    }
    this.$store.dispatch("getGoodssupplierList", {});
  },
  beforeCreate() {
    this.$store.dispatch("getShopList", {});
  }
};
</script>
<style scoped>
.content-center-list {
  height: 60px;
  line-height: 60px;
}
.content-table-caiGouReport {
  margin-top: 10px;
  /* height: 550px; */
  width: 100%;
  background: #fff;
}
.selectStyle1 >>> .el-select__tags {
  max-width: none !important;
}
</style>
