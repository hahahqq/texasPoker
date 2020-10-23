/**
 * setup
 * */
import {
    mapState,
    mapGetters
  } from "vuex";
  export default {
    GAME_MENU: {
      data() {
        return {
          activePath: '',
          routesList: [],
        }
      },
      created() {
        let moneyObj = Object.assign({}, this.$router.options.routes[3]);

        console.log(moneyObj)
        this.routesList = [...moneyObj.children];
        if(this.$route.path.indexOf('/game/match') != -1){
            this.activePath = "/game/match/index";
         }else{
            this.activePath = this.$route.path;
         }

        console.log(this.activePath)
      },

      components: {
        'memberMenu': () => import('@/components/other/gameMenu'),
      },
    },

  }

