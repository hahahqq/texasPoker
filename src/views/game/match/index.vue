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
          <div class="content-eighty" style="height: auto; padding: 16px 0; margin-bottom: 10px">
            <div class="content-center">
              <el-row :gutter="10" class="content-center-cont">
                <el-col :span="6" style="text-align: center">
                  <el-tooltip placement="right-start">
                    <div slot="content">
                      <ul class="matchChoseStyle">
                        <li @click="checkProjectTypeFun(0)">SNG比赛</li>
                        <li @click="checkProjectTypeFun(1)">MTT比赛</li>
                        <li @click="checkProjectTypeFun(3)" v-if="IsIntegralMatch">自由积分赛</li>
                      </ul>
                    </div>

                    <span style="text-align: center; font-size: 14px">
                      <img
                        src="static/images/icon_addMatch.png"
                        alt=""
                        style="width：50px; height: 50px"
                      />
                      <br />
                      添加赛事
                    </span>
                  </el-tooltip>
                </el-col>

                <el-col :span="6" style="text-align: center">
                  <span style="font-size: 14px" @click="showAddNew = true">
                    <img
                      src="static/images/icon_addVip.png"
                      alt=""
                      style="width：50px; height: 50px"
                    />
                    <br />
                    <a>添加会员</a>
                  </span>
                </el-col>

                <el-col :span="6" style="text-align: center">
                  <span style="font-size: 14px" @click="showRechargeDialog = true">
                    <img
                      src="static/images/icon_vipRecharge.png"
                      alt=""
                      style="width：50px; height: 50px"
                    />
                    <br />
                    <a>会员充值</a>
                  </span>
                </el-col>

                <el-col :span="6" style="text-align: center">
                  <span
                    style="font-size: 14px"
                    @click="$router.push({ path: '/game/match/verityBill' })"
                  >
                    <img
                      src="static/images/icon_scan.png"
                      alt=""
                      style="width：50px; height: 50px"
                    />
                    <br />
                    <a>扫码核销</a>
                  </span>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="content-table4" style="position: initial">
            <div class="content-table-center">
              <el-tabs type="card" v-model="activeName" @tab-click="selectEventsFun(activeName)">
                <el-tab-pane name="-1" label="全部赛事"></el-tab-pane>
                <el-tab-pane name="0" label="SNG比赛"></el-tab-pane>
                <el-tab-pane name="1" label="MTT比赛"></el-tab-pane>
                <el-tab-pane name="3" label="自由积分赛" v-if="IsIntegralMatch"></el-tab-pane>
              </el-tabs>

              <!-- 列表 -->
              <el-table
                size="small"
                :data="tableData"
                header-row-class-name="bg-F1F2F3"
                style="width: 100%"
                :height="tableHeight"
                v-loading="loading"
                element-loading-text="数据加载中"
                element-loading-spinner="el-icon-loading"
                @row-dblclick="signUpHandle"
              >
                <el-table-column prop="MATCHNAME" label="赛事名称">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="text"
                      @click="handleViewItem(scope.row, scope.$index)"
                    >
                      {{ scope.row.MATCHNAME }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="PLAYTIME" label="开赛时间" width="130">
                  <template slot-scope="scope">
                    {{ new Date(scope.row.PLAYTIME) | timehf }}
                  </template>
                </el-table-column>
                <el-table-column prop="TYPENAME" label="赛事类型" align="center"></el-table-column>
                <el-table-column prop="DESKNAME" label="桌号" align="center"></el-table-column>
                <el-table-column
                  prop="BUYINPRICE"
                  label="Buyin积分"
                  align="center"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="REBUYPRICE"
                  label="rebuy积分"
                  align="center"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="ADDONPRICE"
                  label="addon积分"
                  align="center"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="TOTALMONEY"
                  label="买入总积分"
                  align="center"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="VIPCOUNT"
                  label="参赛人数"
                  align="center"
                  width="90"
                ></el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="text"
                      @click="handleViewItem(scope.row, scope.$index)"
                    >
                      报名
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <!-- 分页 -->
              <div v-show="tableData.length > 0" class="m-top-sm clearfix elpagination">
                <el-pagination
                  @size-change="handlePageChange"
                  @current-change="handlePageChange"
                  :current-page.sync="pagination.PN"
                  :page-size="pagination.PageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="pagination.TotalNumber"
                  class="text-center"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </el-container>
    </el-container>

    <!-- 新增赛事 -->
    <el-dialog
      :title="`新增${title}`"
      :visible.sync="showAddDialog"
      width="60%"
      :before-close="handleClose"
    >
      <addSng
        v-if="projectType == 0"
        @closeModal="showAddDialog = false"
        @resetList="
          showAddDialog = false;
          getNewData(activeName, 1);
        "
      ></addSng>
      <addMtt
        v-if="projectType == 1"
        @closeModal="showAddDialog = false"
        @resetList="
          showAddDialog = false;
          getNewData(activeName, 1);
        "
      ></addMtt>
      <addIntegral
        v-if="projectType == 3"
        @closeModal="showAddDialog = false"
        @resetList="
          showAddDialog = false;
          getNewData(activeName, 1);
        "
      ></addIntegral>
    </el-dialog>

    <el-dialog title="扫码核销" :visible.sync="showVerifyBill" width="98%" append-to-body>
      <verifyBill></verifyBill>
    </el-dialog>

    <!-- 会员充值  -->
    <el-dialog title="会员充值" :visible.sync="showRechargeDialog" append-to-body width="600px">
      <vipRecharge
        @closeVipRecharge="showRechargeDialog = false"
        @referData="referData"
        :dataType="{ memberdetails: {} }"
      ></vipRecharge>
    </el-dialog>

    <!-- 新增会员 -->
    <el-dialog
      title="新增会员"
      :visible.sync="showAddNew"
      append-to-body
      width="800px"
      style="max-width: 100%"
    >
      <add-new-member
        @closeModal="showAddNew = false"
        @resetList="showAddNew = false"
      ></add-new-member>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_GAME from "@/mixins/game.js";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
  mixins: [MIXINS_GAME.GAME_MENU],
  data() {
    return {
      tableHeight: document.body.clientHeight - 300,
      projectType: -1,
      activeName: "-1",
      loading: false,
      tableData: [],
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      },
      PN: 1,
      title: "",
      showAddNew: false,
      showRechargeDialog: false,
      IsIntegralMatch: getUserInfo().CompanyConfig.ISINTEGRALMATCH,
      showAddDialog: false, // 新增赛事弹窗
      showDetailsDialog: false, // 报名弹窗
      showVerifyBill: false // 扫码核销弹窗
    };
  },
  computed: {
    ...mapGetters({
      getGameListState: "getGameListState",
      getEventsListAllState: "getEventsListAllState",
      getTableListState: "getTableListState",
      getGameDetailsState: "getGameDetailsState"
    })
  },
  watch: {
    getGameDetailsState(data) {
      console.log(data);
      if (data.success) {
        this.$router.push({
          name: "sngDetails"
        });
        //   this.showDetailsDialog = true
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    getGameListState(data) {
      console.log(data);
      this.loading = false;
      if (data.success) {
        let _data = data.data.PageData;
        this.tableData = _data.DataArr;
        this.pagination = {
          TotalNumber: _data.TotalNumber,
          PageNumber: _data.PageNumber,
          PageSize: _data.PageSize,
          PN: _data.PN
        };
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    }
  },
  methods: {
    referData() {},
    signUpHandle(row, event) {
      this.BILLID = row.BILLID;
      this.projectType = row.TYPE;
      this.$store.dispatch("getGameDetails", { BillId: row.BILLID }).then(() => {
        this.showDetailsDialog = true;
      });
    },
    checkProjectTypeFun(type) {
      this.projectType = type;
      if (type == 0) {
        this.title = "SNG 比赛";
      } else if (type == 1) {
        this.title = "MTT 比赛";
      } else if (type == 3) {
        this.title = "自由积分赛";
      }
      this.$store.dispatch("getEventsListAll", { Type: type }).then(() => {
        this.$store.dispatch("getTableList", { ShopId: getHomeData().shop.ID });
        this.showAddDialog = true;
      });
    },
    selectEventsFun(activeName) {
      this.getNewData(activeName, 1);
    },
    getNewData(Type, PN) {
      this.$store
        .dispatch("getGameList", { Type: Type, PN: PN, IsIntegralMatch: this.IsIntegralMatch })
        .then(() => {
          this.loading = true;
        });
    },
    handleClose() {
      this.showAddDialog = false;
    },
    handleClose1() {
      this.showDetailsDialog = false;
      this.$nextTick(() => {
        this.$refs.clearMemberData.cancelSignUp();
        if (this.projectType == 3) {
          this.$refs.clearMemberData.clearBuyVip();
        }
      });
    },
    handleDel(row, idx) {
      this.$confirm("确认删除【" + row.NAME + "】赛事?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("delEvents", { Id: row.ID });
        })
        .catch(() => {});
    },
    handleViewItem(row, idx) {
      console.log(row);
      this.BILLID = row.BILLID;
      this.projectType = row.TYPE;

      let routerName = "";
      if (row.TYPE == 0) {
        routerName = "sngDetails";
      } else if (row.TYPE == 1) {
        routerName = "mttDetails";
      } else if (row.TYPE == 3) {
        routerName = "integralDetails";
      }
      this.$router.push({
        name: routerName,
        query: { BILLID: row.BILLID, TYPE: row.TYPE }
      });
    },
    handlePageChange: function (currentPage) {
      if (this.PN == currentPage || this.loading) {
        return;
      }
      this.PN = parseInt(currentPage);
      this.getNewData(this.activeName, this.PN);
    }
  },
  components: {
    headerPage: () => import("@/components/header"),
    addSng: () => import("./SNG/add_SNG.vue"),
    addMtt: () => import("./MTT/add_MTT.vue"),
    addIntegral: () => import("./INTEGRAL/add_INTEGRAL.vue"),
    verifyBill: () => import("@/views/game/verityBill/index.vue"),
    vipRecharge: () => import("@/components/Recharge/vipRecharge"),
    addNewMember: () => import("@/components/member/add")
  },
  mounted() {
    this.getNewData(-1, 1);
    this.$store.dispatch("getstoragevaluerroyaltyState", {});
  }
};
</script>


<style scoped>
.addMatch {
  position: relative;
}

.el-header {
  padding: 0 !important;
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
}

.matchChoseStyle li {
  line-height: 30px;
  padding: 0 10px;
  border-radius: 4px;
}

.matchChoseStyle li:hover {
  background: #888;
  color: #fff;
  cursor: pointer;
}
</style>
