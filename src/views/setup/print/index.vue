<template>
   <el-container>
        <el-header style="height:50px; padding: 0">
            <!-- <headerPage></headerPage> -->
            <!-- <el-row> -->
               <div class="member-header">
                  <div class="center-title">打印设置</div>
                  <div class="center-cont1">
                     <el-tabs v-model="activeName" @tab-click="selectTabsFun(activeName)">
                        <el-tab-pane name="0" label="充值小票"></el-tab-pane>
                        <el-tab-pane name="1" label="销售小票"></el-tab-pane>
                        <el-tab-pane name="2" label="快速消费小票"></el-tab-pane>
                        <el-tab-pane name="3" label="报名小票"></el-tab-pane>
                        <el-tab-pane name="4" label="领奖小票"></el-tab-pane>
                        <el-tab-pane name="5" label="奖励小票"></el-tab-pane>
                     </el-tabs>
                  </div>
               </div>
               <!-- <el-col :span="8" class="shop"></el-col> -->
            <!-- </el-row> -->
        </el-header>

        <el-container>
            <el-aside width="100px">
                <section style="min-width:100px;">
                    <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
                </section>
            </el-aside>

            <div style="width: 100%">
               <print1 v-if="activeName == 0" ></print1>
               <print2 v-if="activeName == 1" ></print2>
               <print3 v-if="activeName == 2" ></print3>
               <print4 v-if="activeName == 3" ></print4>
               <print5 v-if="activeName == 4" ></print5>
               <print6 v-if="activeName == 5" ></print6>
            </div>

        </el-container>
   </el-container>
</template>

<script>
var QRCode = require("qrcode");
import { mapState, mapGetters } from "vuex";
import qrcode from "@/assets/qrcode.png";
import MIXINS_SETUP from "@/mixins/setup";
import { SYSTEM_INFO } from "@/util/define.js";
export default {
    mixins: [MIXINS_SETUP.SIDERBAR_MENU],
    data() {
       return{
          height: window.innerHeight - 160,
          activeName: '0'
       }
    },
     computed: {
         ...mapGetters({
            memberQRcodeurlstate: "memberQRcodeurlstate"
         })
      },
    watch:{
       memberQRcodeurlstate(data) {
      QRCode.toDataURL(data.data.BarCode)
        .then((url) => {
          this.$store.state.commodityc.saveQRcodeIMG = url;
        })
        .catch((err) => {});
    }
    },
    methods:{
       selectTabsFun(activeName){

       }
    },
    mounted(){
       this.$store.dispatch("getmemberQRcodeurlstate");
    },
    components: {
      headerPage: () => import("@/components/header"),
      print1: () => import("@/views/setup/print/print1"),
      print2: () => import("@/views/setup/print/print2"),
      print3: () => import("@/views/setup/print/print3"),
      print4: () => import("@/views/setup/print/print4"),
      print5: () => import("@/views/setup/print/print5"),
      print6: () => import("@/views/setup/print/print6"),
    }
}
</script>

<style scoped>
.printEG .marginTB-xxs {
    margin: 5px 0px;
}

.printEG .line {
    padding: 5px 0;
    position: relative;
}

.printEG .line > i {
    display: block;
    height: 2px;
    border: 1px dashed rgb(0, 0, 0);
}

.printEG > .center > ul {
    padding: 3px 0;
    line-height: 1.5;
}

.print .line2 {
    border-bottom: 2px dashed #ccc;
}

.member-header {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.center-title {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  /* border: solid 1px #d7d7d7; */
}
.center-cont {
  width: 300px;
  text-align: left;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
}
.center-cont1 {
  text-align: left;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
}
.el-header {
  padding: 0 !important;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
  cursor: pointer;
}

</style>
