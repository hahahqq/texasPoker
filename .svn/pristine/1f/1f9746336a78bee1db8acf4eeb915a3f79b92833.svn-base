<template>
<el-container>
  <el-header style="height:50px;">
    <headerPage></headerPage>
  </el-header>
  <el-container>
    <el-aside width="100px">
        <section style="min-width:100px;">
        <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
    </el-aside>
    <el-container>
      <div class="content-new-fex">
          <div class="content-eighty">
            <div class="content-center">
              <filtePage @getNewData="getNewData" :isAll="true"></filtePage>
            </div>
          </div>
         <!--列表-->
        <div class="content-table4">
          <div class="content-table-center">
              <el-table
                size='small'
                :data="tebleList"
                v-loading="loading"
                :height="tableHeight"
                header-row-class-name="bg-theme2 text-white"
              >
                <el-table-column prop="ITEMNAME" label="排名" width="120"  ></el-table-column>
                <el-table-column prop="BILLCOUNT" label="费用项目"></el-table-column>
                <el-table-column prop="FRATE" label="笔数"></el-table-column>
                <el-table-column prop="MONEY" label="金额"></el-table-column>
                <el-table-column prop="MONEY" label="占比"></el-table-column>
              </el-table>
              </div>

            <!-- 分页 -->
            <div v-show="tebleList.length>0" class="m-top-sm clearfix elpagination">
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
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_DEFRAY from "@/mixins/defray.js";
import { getHomeData, getUserInfo } from "@/api/index";
import dayjs from 'dayjs'

export default {
  mixins: [MIXINS_DEFRAY.DEFRAY_MENU],
  data() {
    return {
      activeName: "first",
      tebleList: [],
      loading: false,
      pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 0
      },
      loading: false,
      pageData: {
         ShopId: "",
         PN: 1,
         BeginDate: "",
         EndDate: ""
      },
      dateBE: [new Date(this.getCustomDay(-7)).getTime(), new Date().getTime()],
      tableHeight: document.body.clientHeight - 250,
      bussinessTime: getUserInfo().CompanyConfig.TIMEDIFFERENCE
    };
  },
    computed: {
        ...mapGetters({
            dataData: "defrayReportData",
            dataExportState: "defrayReportExportState",// 支出分析导出
            dataState: "defrayReportState",
            dataList: "defrayReportList",
            dataListState: "defrayReportListState",
            dataListArr: "defrayReportListARR"
        })
    },
    watch: {
        dataState(data) {
           this.loading = false;
          this.defaultData();
        },
      dataListState(data) {
         console.log(data)
        this.loading = false;
        if (data.success) {
          this.pagination = {
            TotalNumber: data.paying.TotalNumber,
            PageNumber: data.paying.PageNumber,
            PageSize: data.paying.PageSize,
            PN: data.paying.PN
          };
        } else {
          this.$message.error(data.message);
        }
      }
    },
    methods: {
        defaultData() {
            this.tebleList = [...this.dataData.List];
            console.log(this.tebleList)
            console.log("this.tebleList")

            this.pagination = {
               TotalNumber: this.dataData.paying.TotalNumber,
               PageNumber: this.dataData.paying.PageNumber,
               PageSize: this.dataData.paying.PageSize,
               PN: this.dataData.paying.PN
            };
        },
        getNewData(data) {
            let sendData = Object.assign({}, data);
            this.$store.dispatch("cleardefrayReportList2").then(() => {
                this.$store.dispatch("getdefrayReportData", sendData);
                this.loading = true;
                this.ruleFrom = Object.assign({}, sendData);
                this.pageData.PN = 1;
            });
        },
      handlePageChange: function(currentPage) {
        if (this.pageData.PN == currentPage || this.loading) {
          return;
        }
        this.pageData.PN = parseInt(currentPage);
        this.getNewData(this.pageData);
      },
    },
    mounted() {
      //   this.$store
      //     .dispatch("getdefrayReportData", {
      //         ShopId: this.theShopId,
      //         BeginDate: this.getTimeStamp(),
      //         EndDate: new Date().getTime()
      //       })
      //     .then(() => {
      //     });

      let bussinessTimeToNumber = Number(this.bussinessTime.replace(":",""));
         let curMonth = Number(dayjs().month())+1;
         let todayDate = dayjs(new Date().getTime());
         let nowHourMius = todayDate.format('HH:mm');
         let yesterdayDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
         let nowHourMiusToNumber = Number(nowHourMius.replace(":", ""));

         let beginFormat = nowHourMiusToNumber >= bussinessTimeToNumber ? todayDate.format('YYYY-MM-DD') : yesterdayDate;

         let beginTime = beginFormat + " " + this.bussinessTime+':00' ;
         let endTime = todayDate.format('YYYY-MM-DD HH:mm');

         let firstDate = new Date(beginTime).getTime();
         let lastDate = new Date(endTime).getTime();
         this.ruleFrom = {
            ShopId: getHomeData().shop.ID,
            BeginDate: firstDate,
            EndDate: lastDate
         };

         this.$store.dispatch("getdefrayReportData", {
            ShopId: this.theShopId,
            BeginDate: firstDate,
            EndDate: lastDate
         })
    },
    components: {
      headerPage: () => import("@/components/header"),
      // filtePage: () => import("@/views/reports/filte")
      filtePage: () => import("@/views/member/vipFilterPage"),
    },
};
</script>
<style scoped>
.member-header{
  display: flex;
  align-items: center;
  height: 50px;
}
.center-title{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border: solid 1px #EDEEEE;
}
.center-cont{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.el-header{
  padding: 0 !important;
}
.shop{
  display: flex;
  align-items: center;
  height: 50px;
  position: relative;
}
.shop .name{
  position: absolute;
  right: 50px;
  height: 50px;
  line-height: 50px;
  width: 150px;
  text-align: center;
  top: 0;
  /* background: rebeccapurple; */
}
  .el-header, .el-footer {
    background-color: #fff;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #F4F5FA;
    color: #333;
    /* text-align: center; */
  }
  .defrayReport-top{
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    height: 80px;
    line-height: 80px;
    background: #fff;
    margin-bottom: 20px;
  }
  .member-main-table{
    margin-top: 8px;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    background: #fff;
  }
  .member-main-top-buttom{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
  .member-main-top-type{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
</style>


