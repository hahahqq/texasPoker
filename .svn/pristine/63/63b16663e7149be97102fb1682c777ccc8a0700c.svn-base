/**
 * 报表页
 * */
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
export default {
   SIDERBAR_MENU: {
      data() {
         return {
            activePath: "",
            routesList: [],
            theShopId: getHomeData().shop.ID,
            theShopName: getHomeData().shop.NAME
         };
      },
      created() {
         // let reportObj = Object.assign({}, this.$router.options.routes[9]);
         let rr = this.$router.options.routes;
         let reportObj = rr.filter(item => item.name === "reports");
         this.routesList = [...reportObj[0].children];
         this.activePath = this.$route.path;
      },
      components: {
         memberMenu: () => import("@/components/other/memberMenu")
      }
   },
   COMMOM_PAGE: {
      data() {
         return {
            ruleFrom: {}, // list
            ruleFrom2: {}, // item
            isShowList: false,
            loading: false,
            title: ""
         };
      },
      watch: {
         dataListState(data) {
            this.loading = false;
            if (data.success) {
               if (this.dataListArr[this.ruleFrom2.obj.index].List.length == 0) {
                  this.$message(this.title + "，暂时没有数据");
               } else {
                  this.isShowList = true;
               }
            } else {
               this.$message.error(data.message);
            }
         }
      },
      components: {
         filtePage: () => import("@/views/reports/filtePage.vue")
      }
   }
};
