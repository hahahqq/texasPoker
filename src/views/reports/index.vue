<template>
   <div id="report">
      <el-container>
         <el-header style="height: 50px; padding: 0">
            <headerPage :pageList="buttonGroup" @showPageIdx="showPageIdx_fun"></headerPage>
         </el-header>

         <el-container>
            <el-aside width="100px">
               <section style="min-width: 100px">
                  <subMenu :activePath="activePath" :routesList="routesList"></subMenu>
               </section>
            </el-aside>
            <el-main
               style="margin: 0"
               :style="{ height: height + 'px', 'max-width': width + 'px' }"
            >
               <router-view :activePage="activePage"></router-view>
            </el-main>
         </el-container>
      </el-container>
   </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
   data() {
      return {
         height: window.innerHeight - 50,
         width: window.innerWidth - 190,
         activePath: "",
         routesList: [],
         buttonGroup: [],
         activePage: {
            show: false,
            index: 1
         }
      };
   },
   computed: {
      ...mapGetters({
         payWayList: "rechargeListList",
         payWayState: "rechargeListState"
      })
   },
   watch: {
      $route(to, from) {
         this.height = window.innerHeight - 50;
         this.defaultData();
      },
      payWayState(data) {
         console.log(data, this.payWayList);
      }
   },
   methods: {
      showPageIdx_fun(v) {
         this.activePage = {
            show: true,
            index: parseInt(v) + 1
         };
      },
      defaultData() {
         let rr = this.$router.options.routes;
         let reportObj = rr.filter(item => item.name === "reports");
         this.routesList = [...reportObj[0].children[1].children];

         let Rmeta = this.$route.meta,
            arr = [];
         let idx = this.$route.query.idx ? parseInt(this.$route.query.idx) + 1 : 1;
         if (Rmeta.buttonGroup && Rmeta.buttonGroup.length > 0) arr = [...Rmeta.buttonGroup];
         this.$nextTick(() => {
            this.activePath = Rmeta.name;
            this.buttonGroup = arr;
            this.activePage = {
               show: true,
               index: idx
            };
         });
      }
   },
   beforeCreate() {
      this.$store.dispatch("getrechargeList", {});
   },
   created() {
      this.height = window.innerHeight - 50;
      this.defaultData();
   },
   components: {
      headerPage: () => import("@/components/header/headDiv"),
      subMenu: () => import("@/components/other/subMenu")
   }
};
</script>
<style>
/* 表格列宽（px）：
 * 赛事名称、店铺=175，备注=210px ，日期=140px，单号=130px
 * 会员 VIPCODE=100px，VIPNAME=90px, VIPMOBILENO=110px
 */

/* 表格某一列内容过多，超出省略号显示 */
#report .el-tooltip__popper {
   max-width: 20%;
}
#report .el-tooltip__popper,
#report .el-tooltip__popper.is-dark {
   background: rgb(48, 65, 86) !important;
   color: #fff !important;
   line-height: 1.5;
}

#report .el-table thead th > .cell {
   text-align: center !important;
}

#report .el-dialog__body {
   padding: 12px 20px 30px !important;
}
</style>
