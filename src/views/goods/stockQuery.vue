<template>
  <el-container>
    <el-header style="height: 50px">
      <template>
        <div>
          <el-row>
            <el-col :span="16" class="member-header">
              <div class="center-title">{{ $route.meta.title }}</div>
              <div class="center-cont">
                <ul class="center-cont-ul">
                  <li
                    v-for="(item, index) in businessList"
                    :key="index"
                    @click="selctBusinessList(index, item)"
                    :class="{ selected: index == current }"
                  >
                    {{ item.name }}
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="8" class="shop">
              <span class="name">{{ shopInfo.SHOPNAME }}</span>
              <span class="">
                <el-popover
                  placement="bottom"
                  width="140"
                  trigger="hover"
                  popper-class="no-padding"
                >
                  <el-button
                    style="border: none !important"
                    @click="changeShop()"
                    class="full-width"
                    icon="icon-exchange"
                  >
                    &nbsp;&nbsp;切换店铺
                  </el-button>
                  <el-button
                    style="border: none !important"
                    class="full-width no-m-left border-top"
                    icon="icon-user"
                  >
                    &nbsp;&nbsp;账号信息
                  </el-button>
                  <el-button
                    style="border: none !important"
                    @click="logout()"
                    class="full-width no-m-left border-top"
                    icon="icon-signout"
                  >
                    &nbsp;&nbsp;退出账号
                  </el-button>

                  <a slot="reference" class="hitem">
                    <i class="icon-reorder"></i>
                  </a>
                </el-popover>
              </span>
            </el-col>
          </el-row>
          <el-dialog
            title="请选择门店"
            :visible.sync="isShowShop"
            width="300px"
            :before-close="handleClose"
          >
            <div class="shopListClass">
              <ul>
                <li v-for="(item, index) in theshopList" :key="index" @click="setShop(item)">
                  {{ item.SHOPNAME }}
                </li>
              </ul>
            </div>
          </el-dialog>
        </div>
      </template>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container :style="`height:${windowHeight}px; overflow:auto`">
        <stockCensus1 v-if="current == 0"></stockCensus1>
        <stockCensus2 v-if="current == 1"></stockCensus2>
        <stockCensus3 v-if="current == 2"></stockCensus3>
        <stockCensus4 v-if="current == 3"></stockCensus4>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// import MIXINS_REPORT from "@/mixins/report";
import MIXINS_MEMBER from "@/mixins/member";
import { getHomeData, getUserInfo } from "@/api/index";
import MIXINS_CLEAR from "@/mixins/clearAllData";
export default {
  mixins: [MIXINS_MEMBER.MEMBER_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      windowHeight: window.innerHeight - 80,
      current: 0,
      businessList: [
        { id: "001", name: "库存查询", number: "" },
        { id: "002", name: "采购统计", number: "" },
        { id: "003", name: "调拨统计", number: "" },
        { id: "004", name: "盘点统计", number: "" }
      ],
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: ""
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList"
    })
  },
  watch: {},
  methods: {
    selctBusinessList(e, item) {
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == item.number);
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("没有此功能权限，请联系管理员授权!");
      } else {
        this.current = e;
      }
    },
    handleClose(done) {
      this.isShowShop = false;
    },
    logout: function () {
      //退出登录
      var _this = this;
      this.$confirm("确认退出吗?", "提示")
        .then(() => {
          _this.$store.dispatch("toLogOut").then(() => {
            _this.clearAllData();
            _this.$router.push("/login");
          });
        })
        .catch(() => {
          console.log("logout");
        });
    },
    setShop(item) {
      //切换店铺
      this.$store.dispatch("choosingShop", item).then(() => {
        this.isShowShop = false;
        this.clearAllData();
        this.defaultData();
        this.$router.push({
          path: "/home"
        });
      });
    },
    defaultData() {
      let homeData = getHomeData();
      if (homeData.shop) {
        this.shopInfo = Object.assign({}, homeData.shop);
      }
      this.UserName = getUserInfo().UserName;
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList", {});
      }
    },
    changeShop() {
      let userInfo = getUserInfo();
      if (userInfo.CODE2 == "boss") {
        this.theshopList = [...this.shopList];
      } else {
        this.theshopList = [];
        for (let i = 0; i < userInfo.ShopList.length; i++) {
          if (userInfo.ShopList[i].ISPURVIEW == 1) {
            this.theshopList.push({
              ID: userInfo.ShopList[i].SHOPID,
              NAME: userInfo.ShopList[i].SHOPNAME
            });
          }
        }
      }
      this.isShowShop = true;
    }
  },
  created() {},
  mounted() {
    console.log(this.$route.query.current);
    if (this.$route.query.current != undefined) {
      this.current = this.$route.query.current;
    } else {
      this.current = 0;
    }
  },
  components: {
    stockCensus1: () => import("@/views/goods/stockCensus1.vue"),
    stockCensus2: () => import("@/views/goods/stockCensus2.vue"),
    stockCensus3: () => import("@/views/goods/stockCensus3.vue"),
    stockCensus4: () => import("@/views/goods/stockCensus4.vue")
  }
};
</script>
<style scoped>
.tableStock {
  height: 400px;
  border: 1px solid #ddd;
  border-right: 0;
  border-bottom: 0;
}
.tableStock thead {
  background: #e4e4e4;
  color: #333333;
  height: 36px;
  line-height: 36px;
}
.tableStock thead tr th {
  border-right: 1px solid #fff;
}
.tableStock tbody tr {
  height: 36px;
  line-height: 36px;
}

.tableStock tbody tr:hover {
  background: #ecf5ff;
}
.tableStock tfoot tr {
  height: 36px;
  line-height: 36px;
}
.el-header {
  padding: 0 !important;
}
.member-main-top {
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 100px;
  background: #fff;
}
.member-header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.center-title {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  border-right: solid 1px #ebedf0;
}
.center-cont {
  /* width: 100px; */
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin-left: 20px;
}
.center-cont-ul {
  display: flex;
}
.center-cont-ul li {
  /* width: 74px; */
  text-align: center;
  margin-right: 25px;
  cursor: pointer;
}
.center-cont-ul li.selected {
  color: #2589ff;
  border-bottom: 2px solid #2589ff;
}
.el-header {
  padding: 0 !important;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.el-aside,
.el-main {
  overflow: hidden !important;
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>
