/**
 * setup
 * */
import {
  mapState,
  mapGetters
} from "vuex";
export default {
  SIDERBAR_MENU: {
    data() {
      return {
        activePath: '',
        routesList: [],
      }
    },
    created() {
      // let reportObj = Object.assign({}, this.$router.options.routes[10]);
      let rr = this.$router.options.routes;
      let reportObj = rr.filter(item => item.name === 'setup');
      this.routesList = [...reportObj[0].children];
      this.activePath = this.$route.path;
    },
    components: {
      'memberMenu': () => import('@/components/other/memberMenu'),
    },
  },

}
