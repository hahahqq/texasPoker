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
          <div class="content-eightys">
            <div class="content-center">
              <div>
                <div>
                  <el-button size="small" @click="handleDeal({}, 0)" type="primary">
                    新增分类
                  </el-button>
                  <div class="hide">{{ dataList }}</div>
                </div>
              </div>
            </div>
            <!--列表-->
            <div class="content-table4">
              <div class="content-table-center">
                <el-table
                  size="small"
                  :data="dataList"
                  v-loading="loading"
                  :height="tableHeight"
                  header-row-class-name="bg-F1F2F3"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80"
                  ></el-table-column>
                  <el-table-column
                    prop="NAME"
                    label="分类名称"
                    align="center"
                    width="150"
                  ></el-table-column>
                  <!-- <el-table-column prop="REMARK" label="备注"></el-table-column> -->
                  <el-table-column label="操作" align="right">
                    <template slot-scope="scope">
                      <el-button-group>
                        <el-button
                          style="margin-right: 8px"
                          size="small"
                          type="text"
                          @click="handleDeal(scope.row, 1)"
                          icon="el-icon-edit"
                        >
                          编辑
                        </el-button>
                        <el-button
                          size="small"
                          type="text"
                          @click="handleDel(scope.$index, scope.row)"
                          icon="el-icon-delete"
                        >
                          删除
                        </el-button>
                      </el-button-group>
                      <div class="hide">{{ scope.row }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <!-- <div v-if="dataList.length>0" class="m-top-sm clearfix elpagination">
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
                </div> -->
          <!-- add -->
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_GOOD from "@/mixins/good.js";

export default {
  mixins: [MIXINS_GOOD.GOOD_MENU],
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      setTimeout(() => {
        if (value > 100 || value < 1) {
          callback(new Error("请输入1~100内数值"));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      activeName: "first",
      pagelist: [],
      value1: "",
      options1: "",
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      searchText: "",
      isFilter: false,
      pageData: {
        PN: 1,
        Filter: "",
        Status: -1,
        LevelName: "",
        VipFlag: "",
        ShopId: ""
      },
      multipleSelection: [],
      reportLoss: { loading: false, num: 0 },
      showAddNew: false,
      showItem: false,
      exportLoading: false,
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      pageData: { PN: 1 },
      tableHeight: document.body.clientHeight - 220
    };
  },
  computed: {
    ...mapGetters({
      dataList: "categoryList",
      dataListState: "categoryListState",
      dataState: "categoryState",
      dealState: "dealCategoryState"
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
        this.SumBillCount = data.SumBillCount ? parseInt(data.SumBillCount) : 0;
        this.SumMoney = data.SumMoney ? parseInt(data.SumMoney) : 0;
      }
    },
    dealState(data) {
      if (data.success) {
        this.getNewData();
      } else {
        this.loading = false;
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
    }
  },
  methods: {
    getNewData() {
      this.$store.dispatch("getCategoryList").then(() => {
        this.loading = true;
      });
    },
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    getCategoryItem() {},
    handleDeal(item, type) {
      let title = type == 0 ? "新增" : "编辑";
      this.$prompt("", title + "商品分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: type == 0 ? "" : item.NAME,
        inputPattern: /\S/,
        inputErrorMessage: "分类名称不能为空 ！"
      })
        .then(({ value }) => {
          let sendData = {
            ID: type == 0 ? "" : item.ID,
            Name: value,
            Remark: ""
          };
          this.$store.dispatch("dealCategoryItem", sendData).then(() => {
            this.loading = true;
          });
        })
        .catch(() => {});
    },
    handleDel(index, item) {
      console.log(item);
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("delCategoryItem", {
              index: index,
              data: item
            })
            .then(() => {
              this.loading = true;
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getNewData();
  },
  components: {
    headerPage: () => import("@/components/header")
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

.el-main {
  background-color: #f4f5fa;
  color: #333;
  /* text-align: center; */
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
.item-category {
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 15px;
  background: #fff;
}
.content-eightys {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #fff;
}
</style>


