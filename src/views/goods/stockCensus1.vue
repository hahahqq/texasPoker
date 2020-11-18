<template>
  <el-container>
    <el-container>
      <div class="content-new-fex">
        <div class="shopquery">
          <div class="content-eighty">
            <div class="content-center">
              <el-row class="member-main-top-type">
                <el-col :span="7">
                  店铺&nbsp;&nbsp;&nbsp;
                  <el-select
                    class="selectStyle"
                    size="small"
                    v-model="radio"
                    @change="submitSearch"
                    multiple
                    collapse-tags
                    placeholder="请选择店铺"
                  >
                    <el-option value="所有店铺">所有店铺</el-option>
                    <el-option
                      :disabled="radio == '所有店铺'"
                      v-for="item in shopList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item.ID"
                    ></el-option>
                  </el-select>
                </el-col>

                <el-col :span="7">
                  商品分类&nbsp;&nbsp;&nbsp;
                  <el-select
                    v-model="TypeId"
                    placeholder="请选择商品分类"
                    size="small"
                    multiple
                    collapse-tags
                    @change="submitSearch"
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
          <div class="content-table4">
            <div class="content-table-center">
              <el-tabs
                v-model="activeName"
                type="card"
                class="tabsStyle"
                @tab-click="handleTabClick(activeName)"
              >
                <el-tab-pane
                  :key="item.name"
                  v-for="item in tableTabs"
                  :label="item.label"
                  :name="item.name"
                ></el-tab-pane>
              </el-tabs>

              <el-table
                size="small"
                :data="tableData"
                :height="tableHeight"
                header-row-class-name="bg-theme2 text-white"
                class="full-width"
                v-loading="loading"
              >
                <el-table-column align="center" prop="RN" label="序号" width="70"></el-table-column>
                <el-table-column
                  prop="SHOPNAME"
                  label="店铺"
                  v-if="activeName == 'first'"
                ></el-table-column>
                <el-table-column align="center" prop="GOODSNAME" label="商品名称"></el-table-column>
                <el-table-column align="center" prop="GOODSCODE" label="商品编码"></el-table-column>
                <el-table-column align="center" prop="TYPENAME" label="分类"></el-table-column>
                <el-table-column align="center" prop="UNITNAME" label="单位"></el-table-column>
                <el-table-column align="center" prop="PRICE" label="商品价格"></el-table-column>
                <el-table-column align="center" label="商品成本">
                  <template slot-scope="scope">
                    {{ isPurViewFun(92100310) ? scope.row.PURPRICE : "****" }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="QTY"
                  sortable
                  label="库存数"
                ></el-table-column>
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
          </div>
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import MIXINS_GOOD from "@/mixins/good.js";
export default {
  props: {
    dataType: {
      type: Object,
      default: function () {
        return { dealState: "reset" };
      }
    }
  },
  mixins: [MIXINS_GOOD.GOOD_MENU],
  data() {
    return {
      loading: false,
      searchText: "",
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      },
      tableData: [],
      pageData: {
        ShopId: getHomeData().shop.SHOPID,
        CategoryId: "",
        Filter: "",
        PN: 1,
        Type: ""
      },
      tableHeight: document.body.clientHeight - 286,
      activeName: "first",
      tableTabs: [
        { name: "first", label: "库存明细" },
        { name: "second", label: "库存汇总" }
      ],
      TypeId: [],
      radio: [getHomeData().shop.ID]
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      stockqueryList: "stockqueryList",
      stockDetailsState: "stockDetailsState",
      stockTotalState: "stockTotalState",
      commoditycflList: "commoditycflList"
    })
  },
  watch: {
    stockTotalState(data) {
      this.loading = false;
      if (data.success && this.activeName == "second") {
        this.tableData = data.data.PageData.DataArr;
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
      }
    },
    stockDetailsState(data) {
      this.loading = false;
      if (data.success && this.activeName == "first") {
        this.tableData = data.data.PageData.DataArr;
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
      }
    }
  },

  methods: {
    handleTabClick(activeName) {
      this.pageData.PN = 1;
      this.pageData.Filter = "";
      this.getStockData();
    },
    submitSearch() {
      if (this.TypeId.length == 0) {
        this.pageData.TypeId = "";
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
        this.pageData.TypeId = str;
      }

      let haveAllShop = this.radio.filter((item) => item == "所有店铺"),
        shopIdList = [];
      if (haveAllShop.length == 1) {
        this.radio = ["所有店铺"];
        shopIdList = this.shopList.map((item) => item.ID);
      } else if (this.radio.length == 0) {
        shopIdList = [getHomeData().shop.ID];
        this.radio = [getHomeData().shop.ID];
      } else {
        shopIdList = this.radio;
      }

      let str = "",
        id = "";
      for (let i in shopIdList) {
        str += shopIdList[i] + ",";
      }
      if (str.length > 0) {
        //去掉最后一个逗号
        str = str.substring(0, str.length - 1);
      }
      this.pageData.ShopId = str;

      this.pageData.Filter = this.searchText;
      this.pageData.PN = 1;
      this.getStockData();
    },

    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getStockData();
    },
    getStockData() {
      this.$store
        .dispatch(this.activeName == "first" ? "GetStockDetails" : "GetStockTotal", this.pageData)
        .then(() => {
          this.loading = true;
        });
    }
  },
  mounted() {
    this.getStockData();
  },
  components: {
    headerPage: () => import("@/components/header")
  },
  beforeCreate() {
    let list = this.$store.state.commodityc.commoditycflList;
    if (list.length == 0) {
      this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    }
    this.$store.dispatch("getShopList", {});
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
  padding: 5px !important;
}
.selectStyle >>> .el-select__tags {
  max-width: none !important;
}
.tabsStyle >>> .el-tabs__header .el-tabs__item {
  color: #aaa !important;
  background: #f2f2f2 !important;
  border-left: 1px solid #dddddd !important;
}

.tabsStyle >>> .el-tabs__header .el-tabs__item:first-child {
  border-left: none !important;
}

.tabsStyle >>> .el-tabs__header .el-tabs__item.is-active {
  background: #fff !important;
  color: #409eff !important;
}
</style>
