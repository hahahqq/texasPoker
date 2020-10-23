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
        <el-main>
          <page></page>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import MIXINS_SETUP from "@/mixins/setup";
export default {
  mixins: [MIXINS_SETUP.SIDERBAR_MENU],
  components:{
    page:()=>import("../selected/shop"),
    headerPage: () => import("@/components/header")
  }
}
</script>
<style scoped>
.el-header{
  padding: 0 !important;
}
.member-main-top{
  width: 100%;
  height: 100px;
  background: #fff;
}
.member-main-table{
  width: 100%;
  height: 600px;
  background: #fff;
}
</style>
