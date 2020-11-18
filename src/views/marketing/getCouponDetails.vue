<template>
  <el-container>
    <el-header style="height: 50px; padding: 0">
      <headerPage :pageList="buttonGroup"></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="content-new-fex">
          <div class="content-eighty">
            <div class="content-center">
              <el-row :gutter="10" class="content-center-cont">
                <el-col :span="12">
                  状态 ：
                  <el-select
                    size="small"
                    v-model="Status"
                    placeholder="请选择状态"
                    clearable
                    @change="
                      PN = 1;
                      Filter = '';
                      getNewData();
                    "
                  >
                    <el-option label="未使用" value="0"></el-option>
                    <el-option label="已使用" value="1"></el-option>
                    <el-option label="已过期" value="2"></el-option>
                  </el-select>
                </el-col>

                <el-col :span="12" style="text-align: right">
                  <el-input
                    v-model="Filter"
                    placeholder="请输入会员姓名或手机号"
                    style="width: 300px"
                    size="small"
                  >
                    <template slot="append">
                      <span
                        style="font-size: 12px; cursor: default"
                        @click="
                          PN = 1;
                          getNewData();
                        "
                      >
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
              <el-table
                size="small"
                :data="tableList"
                v-loading="loading"
                :height="tableHeight"
                header-row-class-name="bg-theme2 text-white"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="80"
                ></el-table-column>

                <el-table-column prop="NAME" label="会员信息" width="160">
                  <template slot-scope="scope">
                    <img
                      :src="scope.row.IMAGEURL"
                      onerror="this.src='static/images/shopmore.png'"
                      alt=""
                      style="
                        float: left;
                        border-radius: 8px;
                        width: 40px;
                        height: 40px;
                        margin-right: 8px;
                      "
                    />
                    <span>
                      <i
                        class="pull-left inline-block text-overflow"
                        style="color: #2589ff; width: 92px; line-height: 20px"
                      >
                        <span>
                          {{ scope.row.VIPNAME ? scope.row.VIPNAME : " " }}
                        </span>
                        &nbsp;&nbsp;
                        <img
                          :src="
                            scope.row.SEX == 0
                              ? 'static/images/icon_man.png'
                              : 'static/images/icon_woman.png'
                          "
                          style="width: 13px; height: 13px; vertical-align: middle"
                        />
                      </i>
                      <i
                        class="pull-left inline-block text-overflow"
                        style="width: 92px; line-height: 20px"
                      >
                        {{ scope.row.MOBILENO }}
                      </i>
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="领取时间">
                  <template slot-scope="scope">
                    {{ new Date(scope.row.WRITETIME) | timehf }}
                  </template>
                </el-table-column>

                <el-table-column label="使用时间">
                  <template slot-scope="scope">
                    <span v-if="scope.row.SALETIME != undefined">
                      {{ new Date(scope.row.SALETIME) | timehf }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>

                <el-table-column prop="STATUS" label="状态" align="center"></el-table-column>

                <el-table-column label="操作" align="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      v-if="scope.row.STATUS == '未使用'"
                      @click="delCoupon(scope.row)"
                    >
                      作废
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>

              <div class="m-top-sm clearfix elpagination">
                <el-button size="small" @click="cancelAllCouponFun">作废全部优惠券</el-button>
                <i style="color: #868686; margin-left: 15px">
                  作废后会员未使用的券将变为已作废状态
                </i>
                <el-pagination
                  v-show="tableList.length > 0"
                  @size-change="handlePageChange"
                  @current-change="handlePageChange"
                  :current-page.sync="pagination.PN"
                  :page-size="pagination.PageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="pagination.TotalNumber"
                  class="text-right"
                  style="width: 50%; float: right"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MARKETING from "@/mixins/marketing.js";
import MIXINS from "@/mixins/index";
export default {
  mixins: [MIXINS.IS_SHOW_POPUP, MIXINS_MARKETING.MARKETING_MENU],
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 230,
      IsValid: "",
      PN: 1,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      tableList: [],
      buttonGroup: [
        { label: "拓客工具", value: "/marketing/bespeakList" },
        { label: "优惠券", value: "/gameGoodsCoupon" },
        { label: "领取情况", value: "" }
      ],
      Filter: "",
      BillId: "",
      Status: "",
      loadingBtn: false
    };
  },
  computed: {
    ...mapGetters({
      tableListState: "coupouGetDetailsState",
      delGetCouponState: "delGetCouponState",
      cancelAllCouponState: "cancelAllCouponState"
    })
  },
  watch: {
    cancelAllCouponState(data) {
      this.$message({
        type: data.success ? "success" : "error",
        message: data.message
      });
      if (data.success) {
        this.$router.push({ path: "/gameGoodsCoupon" });
      }
    },
    delGetCouponState(data) {
      this.$message({
        type: data.success ? "success" : "error",
        message: data.message
      });
      this.PN = 1;
      this.Filter = "";
      this.getNewData();
    },
    tableListState(data) {
      this.loading = false;
      if (data.success) {
        this.tableList = data.data.PageData.DataArr;
        this.pagination = {
          TotalNumber: data.data.PageData.TotalNumber,
          PageNumber: data.data.PageData.PageNumber,
          PageSize: data.data.PageData.PageSize,
          PN: data.data.PageData.PN
        };
      } else {
        this.$message.warning(data.message);
      }
    }
  },
  components: {
    headerPage: () => import("@/components/header/headBC")
  },
  methods: {
    handleStop(index, row) {
      let type = row.ISSTOP ? 1 : 0;
      let title = row.ISSTOP ? "恢复发行" : "停止发行";
      this.$confirm("确认" + title + "该优惠券?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("openCloseCoupon", { BillId: row.BILLID, type: type });
        })
        .catch(() => {});
    },
    handlePageChange: function (currentPage) {
      if (this.PN == currentPage || this.loading) {
        return;
      }
      this.PN = parseInt(currentPage);
      this.getNewData();
    },
    closeDialog() {},

    getNewData() {
      this.$store
        .dispatch("couponGetDetails", {
          PN: this.PN,
          BillId: this.BillId,
          Filter: this.Filter,
          Status: this.Status
        })
        .then(() => {
          this.loading = true;
        });
    },
    delCoupon(row) {
      this.$confirm("确认作废【" + row.VIPNAME + "】领取的优惠券?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("delGetCoupon", {
            BillId: row.BILLID,
            Id: row.ID,
            VipId: row.VIPID
          });
        })
        .catch(() => {});
    },
    cancelAllCouponFun() {
      this.$confirm("确认作废全部优惠券?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("cancelAllCoupon", {
            BillId: this.BillId
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.BillId = this.$route.query.BillId;
    this.getNewData();
  }
};
</script>

<style scoped>
.colLineHeight {
  line-height: 32px;
  margin-bottom: 15px;
}

.colLineHeight span {
  width: 110px;
  float: left;
  text-align: right;
  margin-right: 30px;
}
.whiteCircle1,
.whiteCircle2 {
  width: 14px;
  height: 14px;
  margin-top: 60px;
  position: absolute;
  border-radius: 50%;
  background: #fff;
}
.whiteCircle1 {
  border-right: 1px solid #fff;
  left: -10px;
}
.whiteCircle2 {
  border-left: 1px solid #fff;
  right: -10px;
}
.whiteLine {
  height: 1px;
  width: 100%;
  border-bottom: 1px dashed #fff;
  position: absolute;
  margin-top: 67px;
}
.moneyClass {
  position: absolute;
  line-height: 60px;
  text-align: center;
  width: 100%;
  color: #fff;
  font-size: 24px;
}
.moneyClass i {
  font-size: 16px;
}
.couponTop {
  width: 100%;
  float: left;
  height: 70px;
  position: relative;
}
.couponBottom {
  width: 100%;
  float: left;
  line-height: 30px;
  text-align: center;
  color: #fff;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

