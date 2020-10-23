/**
 * setup
 * */
import {
    mapState,
    mapGetters
  } from "vuex";
  export default {
    MARKETING_MENU: {
      data() {
        return {
          activePath: '',
          routesList: [],
        }
      },
      created() {
        let memberObj = Object.assign({}, this.$router.options.routes[8]);
        this.routesList = [...memberObj.children];
        this.activePath = this.$route.path;
      },
      components: {
        'memberMenu': () => import('@/components/other/memberMenu'),
      },
    },

  }

