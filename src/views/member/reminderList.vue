<template>
  <el-container>
    <div class="content-new-fex">
      <div class="content-table5">
        <div class="content-table-center">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="生日提醒" name="first">
              <div class="content-eighty">
                <div>
                  <filtePage @getNewData="getNewData" :isAll="true"></filtePage>
                </div>
              </div>
              <el-table
                border
                :height="tableHeight"
                :data="pageList"
                header-row-class-name="bg-theme2 text-white"
                class="full-width"
              >
                <el-table-column prop="NAME" label="会员名" width="200"></el-table-column>
                <el-table-column prop="MOBILENO" label="手机号码"></el-table-column>
                <el-table-column prop="BIRTHDATE" label="生日时间">
                  <template slot-scope="scope">
                    <span>{{ new Date(scope.row.BIRTHDATE) | time }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="过期提醒" name="second">
              <div class="content-eighty">
                <div>
                  <filtePage @getNewData="getNewData1" :isAll="true"></filtePage>
                </div>
              </div>
              <el-table
                border
                :data="pageList"
                :height="tableHeight"
                header-row-class-name="bg-theme2 text-white"
                class="full-width"
              >
                <el-table-column prop="LASTSALEDATE" label="日期" width="200"></el-table-column>
                <el-table-column prop="VIPNAME" label="会员信息"></el-table-column>
                <el-table-column prop="USERNAME" label="操作员"></el-table-column>
                <el-table-column label="说明"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_REPORT from "@/mixins/report";
import { getHomeData, getUserInfo } from "@/api/index";
import MIXINS_CLEAR from "@/mixins/clearAllData";
export default {
  mixins: [MIXINS_REPORT.SIDERBAR_MENU, MIXINS_REPORT.COMMOM_PAGE, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      current: 0,
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      tableHeight: document.body.clientHeight,
      nameList: [],
      searchText: "",
      dateBE: [],
      sshopStr: "",
      sshopID: "",
      shopCheckText: "全部店铺",
      shopCheckidx: -1,
      isIndexSix: false,
      activeName: "first",
      input2: "",
      pageList: [],
      tableHeight: document.body.clientHeight - 280
    };
  },
  computed: {
    ...mapGetters({
      adjustTable: "adjustTable",
      adjustTableState: "adjustTableState",
      memberbrithday: "memberbrithday"
    })
  },
  watch: {
    memberbrithday(data) {
      console.log(data);
      this.pageList = data.DataArr;
      console.log("this.pageList");
      console.log(this.pageList);
    }
  },
  methods: {
    handleClick(e) {
      console.log(e.name);
      if (e.name == "first") {
        let homeInfo = getHomeData();
        let userInfo = getUserInfo();
        let sendData = {
          PN: 1,
          ShopId: homeInfo.shop.ID,
          BeginDate: 1,
          EndDate: 9999999999999,
          InterfaceCode: "2100211_02",
          CompanyId: homeInfo.shop.COMPANYID
        };
        this.$store.dispatch("getMemberBrithday", { sendData }).then(() => {});
      } else if (e.name == "second") {
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        let sendData = {
          PN: 1,
          ShopId: homeInfo.shop.ID,
          BeginDate: 1,
          EndDate: 9999999999999,
          InterfaceCode: "210021135",
          CompanyId: homeInfo.shop.COMPANYID
        };
        this.$store.dispatch("getMemberBrithday", { sendData }).then(() => {});
      }
    },
    getNewData(data) {
      console.log("// 当前数据", data);
      let homeInfo = getHomeData();
      this.dateBE[0] = data.BeginDate;
      this.dateBE[1] = data.EndDate;
      let sendData = {
        ShopId: data.ShopId,
        BeginDate: data.BeginDate,
        EndDate: data.EndDate,
        CompanyId: homeInfo.shop.COMPANYID,
        InterfaceCode: "2100211_02"
      };
      this.$store.dispatch("getMemberBrithday", { sendData }).then(() => {});
    },
    getNewData1(data) {
      console.log(data);
      // 当前数据
      let homeInfo = getHomeData();
      this.dateBE[0] = data.BeginDate;
      this.dateBE[1] = data.EndDate;
      let sendData = {
        ShopId: data.ShopId,
        BeginDate: data.BeginDate,
        EndDate: data.EndDate,
        InterfaceCode: "210021135",
        CompanyId: homeInfo.shop.COMPANYID
      };
      this.$store.dispatch("getMemberBrithday", { sendData }).then(() => {});
    }
  },
  created() {
    let homeInfo = getHomeData();
    let userInfo = getUserInfo();
    let sendData = {
      PN: 1,
      ShopId: homeInfo.shop.ID,
      BeginDate: 1,
      EndDate: 9999999999999,
      InterfaceCode: "2100211_02",
      CompanyId: homeInfo.shop.COMPANYID
    };
    this.$store.dispatch("getMemberBrithday", { sendData }).then(() => {});
  },
  components: {}
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
.el-main {
  padding: 0px !important;
}
.el-header {
  padding: 0 !important;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #d7d7d7;
  background: #fff;
}
</style>
