/**
 * setup
 * */
import {
    mapState,
    mapGetters
  } from "vuex";
  export default {
    MEMBER_MENU: {
      data() {
        return {
          activePath: '',
          routesList: [],
        }
      },
      created() {
        let memberObj = Object.assign({}, this.$router.options.routes[5]);
        this.routesList = [...memberObj.children];
        this.activePath = this.$route.path;
      },
      components: {
        'memberMenu': () => import('@/components/other/memberMenu'),
      },
    },

  }

