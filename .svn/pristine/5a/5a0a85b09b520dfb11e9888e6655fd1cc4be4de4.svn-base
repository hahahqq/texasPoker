<template>
  <!-- <div class="setup row-flex flex-start">
    <section style="min-width:130px;margin-left:-10px;">
      <sidebarMenu :activePath="activePath" :routesList="routesList" :width="130"></sidebarMenu>
    </section>
    <section class="bg-white marginLR-sm paddingTB-sm paddingLR-md full-width">
      <page></page>
    </section>
  </div> -->
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
  components: {
    page: () => import("../selected/employee"),
    headerPage: () => import("@/components/header")
  }
};
</script>
<style scoped>
.el-header{
  padding: 0 !important;
}
.member-main-top{
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 100px;
  background: #fff;
}
.member-main-table{
  margin-top: 8px;
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 600px;
  background: #fff;
}
</style>
