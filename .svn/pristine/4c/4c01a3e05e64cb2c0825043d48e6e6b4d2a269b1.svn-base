/**
 * setup
 * */
import {
    mapState,
    mapGetters
  } from "vuex";
  export default {
    MONEY_MENU: {
      data() {
        return {
          activePath: '',
          routesList: [],
        }
      },
      created() {
        let moneyObj = Object.assign({}, this.$router.options.routes[4]);
        console.log("moneyObj")
        console.log(moneyObj)
        this.routesList = [...moneyObj.children];
        this.activePath = this.$route.path;
      },
      
      components: {
        'sidebarMenu': () => import('@/components/other/sidebarMenu'),
      },
    },
  
  }
  
  