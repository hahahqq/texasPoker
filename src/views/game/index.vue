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
                    <div>赛事报名</div>
                </div>
            </el-container>
        </el-container>
    </el-container>
</template>


<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_GAME from "@/mixins/game.js";
import { getHomeData } from "@/api/index";


export default {
  mixins: [ MIXINS_GAME.GAME_MENU ],
  data() {
    return {

    }
  },
  components: {
    headerPage: () => import("@/components/header")
  },

}
</script>


<style scoped>
.member-header{
    display: flex;
    align-items: center;
    height: 50px;
}

.el-header{
    padding: 0 !important;
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
}
</style>