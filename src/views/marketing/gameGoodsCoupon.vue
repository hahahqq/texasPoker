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
                <el-col :span="18">
                  <el-button type="primary" size="small" @click="addNewCouponFun">
                    新增优惠券
                  </el-button>
                </el-col>

                <el-col :span="6" style="text-align:right">
                  状态 ：
                  <el-select
                    size="small"
                    v-model="IsValid"
                    placeholder="请选择状态"
                    clearable
                    @change="
                      PN = 1;
                      getNewData();
                    "
                  >
                    <el-option label="发行中" value="0"></el-option>
                    <el-option label="已停用" value="1"></el-option>
                  </el-select>
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

                <el-table-column label="优惠券面值">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="routerDetailsFun(scope.row)">{{ scope.row.MONEY }} 元</el-button>
                  </template>
                </el-table-column>

                <el-table-column prop="NAME" label="规则"></el-table-column>

                <el-table-column label="优惠券类型" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.TYPE == 0 ? "商品券" : "赛事券" }}
                  </template>
                </el-table-column>

                <el-table-column label="发放方式" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.ISLITMITVIP ? "定向发放" : "会员领取" }}
                  </template>
                </el-table-column>
                <el-table-column label="剩余 / 总量" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.QTY - scope.row.GETQTY }} / {{ scope.row.QTY }}
                  </template>
                </el-table-column>
                <el-table-column label="已使用 / 已领取" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.SALEQTY }} / {{ scope.row.GETQTY }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="微信平台显示"
                  :formatter="formatWechatHide"
                  align="center"
                ></el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.ISSTOP"
                      style="color: #7f7f7f; padding: 4px 10px; background: #f2f2f2"
                    >
                      已停用
                    </span>
                    <span v-else style="color: #70b603; padding: 4px 10px; background: #e7f3d5">
                      发行中
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="text"
                      v-if="scope.row.ISLITMITVIP == false"
                      @click="handleStop(scope.$index, scope.row)"
                    >
                      {{ scope.row.ISSTOP ? "恢复发行" : "停止发行" }}
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>

              <div v-show="tableList.length > 0" class="m-top-sm clearfix elpagination">
                <el-pagination
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
      </el-container>
    </el-container>

    <!-- 新增优惠券 -->
    <el-dialog title="新增优惠券" :visible.sync="showAddCouponDialog" width="750px">
      <el-row :gutter="10">
        <el-col :span="17">
          <el-row :gutter="10">
            <el-col :span="24" class="colLineHeight">
              <span>
                优惠券类型
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="赛事券用于选手参加赛事报名时使用；商品券用于购买商品时使用"
                  placement="right"
                >
                  <i class="el-icon-question font-14" style="color: #409eff"></i>
                </el-tooltip>
              </span>
              <el-radio-group v-model="ruleForm.Type">
                <el-radio size="small" :label="0">商品券</el-radio>
                <el-radio size="small" :label="2">赛事券</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="24" class="colLineHeight">
              <span>优惠券面值</span>
              <el-input
                type="number"
                size="small"
                style="width: 300px"
                v-model.trim="ruleForm.Money"
                placeholder="请输入优惠券面值"
              >
                <template slot="append">元</template>
              </el-input>
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>使用规则</span>
              满 &nbsp;
              <el-input
                type="number"
                size="small"
                style="width: 220px"
                v-model="ruleForm.LimitMoney"
                placeholder="使用规则： 例： 100"
              ></el-input>
              &nbsp; 元可用
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>发行数量</span>
              <el-input
                type="number"
                size="small"
                style="width: 300px"
                v-model.trim="ruleForm.Qty"
                placeholder="请输入数量"
              ></el-input>
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>开始日期</span>
              <el-date-picker
                v-model="ruleForm.BeginDate"
                type="date"
                size="small"
                value-format="timestamp"
                style="width: 300px"
                placeholder="选择日期"
              ></el-date-picker>
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>结束日期</span>
              <el-date-picker
                v-model="ruleForm.EndDate"
                type="date"
                size="small"
                value-format="timestamp"
                style="width: 300px"
                placeholder="选择日期"
              ></el-date-picker>
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>使用说明</span>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="ruleForm.Remark"
                style="width: 300px"
                placeholder="请输入优惠券使用说明"
              ></el-input>
            </el-col>

            <el-col :span="24" class="colLineHeight">
              <span>
                微信平台显示
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="不显示后，将不在微信公众平台的优惠券中显示；您可以在批量发券中选择主动指定相应会员发放优惠券"
                  placement="right"
                >
                  <i class="el-icon-question font-14" style="color: #409eff"></i>
                </el-tooltip>
              </span>
              <el-radio-group v-model="ruleForm.IsWechatHide">
                <el-radio size="small" :label="0">显示</el-radio>
                <el-radio size="small" :label="1">不显示</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="7">
          <div style="width: 100%; height: 100px; background: #409eff; border-radius: 6px">
            <div class="couponTop">
              <span class="moneyClass">
                <i>￥</i>
                {{ ruleForm.Money ? ruleForm.Money : "0" }}
              </span>
              <span class="whiteCircle1"></span>
              <span class="whiteCircle2"></span>
              <span class="whiteLine"></span>
            </div>

            <div class="couponBottom">
              满 {{ ruleForm.LimitMoney ? ruleForm.LimitMoney : "0" }} 元可用
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" style="text-align: center; margin-top: 30px">
          <el-button plain @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="submitBtn" :loading="loadingBtn">保 存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
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
      ruleForm: {
        Type: 0,
        Money: "",
        LimitMoney: "",
        Qty: "",
        BeginDate: "",
        EndDate: "",
        Remark: "",
        IsWechatHide: 0
      },
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      tableList: [],
      buttonGroup: [
        { label: "拓客工具", value: "/marketing/bespeakList" },
        { label: "优惠券", value: "" }
      ],
      showAddCouponDialog: false,
      loadingBtn: false
    };
  },
  computed: {
    ...mapGetters({
      tableListState: "getGameGoodsCouponListState",
      addCouponState: "addGameGoodsCouponState",
      openCloseCoupouState: "openCloseCoupouState"
    })
  },
  watch: {
    openCloseCoupouState(data) {
      console.log(data);
      if (data.success) {
        this.PN = 1;
        this.getNewData();
      }
      this.$message({
        type: data.success ? "success" : "error",
        message: data.message
      });
    },
    addCouponState(data) {
      this.loadingBtn = false;
      if(data.success){
         this.showAddCouponDialog = false
         this.PN = 1
         this.getNewData()
      }
      console.log(data);
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
      console.log(data);
    }
  },
  components: {
    headerPage: () => import("@/components/header/headBC")
  },
  methods: {
     routerDetailsFun(row){
        this.$router.push({ path: '/getCouponDetails', query: {BillId: row.BILLID}})
     },
    handleStop(index, row) {
       console.log(row)
      let type = row.ISSTOP ? 1 : 0;
      let title = row.ISSTOP ? '恢复发行' : '停止发行'
      this.$confirm("确认"+ title +"该优惠券?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            this.$store.dispatch("openCloseCoupon", { BillId: row.BILLID, type: type });
        }).catch(() => { })
    },
    handlePageChange: function (currentPage) {
      if (this.PN == currentPage || this.loading) {
        return;
      }
      this.PN = parseInt(currentPage);
      this.getNewData();
    },
    closeDialog() {
      this.showAddCouponDialog = false;
      this.ruleForm = {
        Type: 0,
        Money: "",
        LimitMoney: "",
        Qty: "",
        BeginDate: "",
        EndDate: "",
        Remark: "",
        IsWechatHide: 0
      };
    },
    addNewCouponFun() {
      this.showAddCouponDialog = true;
    },
    formatWechatHide: function (row, column) {
      return row.ISWECHATHIDE ? "不显示" : "显示";
    },
    getNewData() {
      this.$store
        .dispatch("getGameGoodsCouponList", {
          PN: this.PN,
          IsValid: this.IsValid,
          Type: -1
        })
        .then(() => {
          this.loading = true;
        });
    },
    submitBtn() {
      this.$store.dispatch("addGameGoodsCoupon", this.ruleForm).then(() => {
        this.loadingBtn = true;
      });
    }
  },
  mounted() {
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
</style>

