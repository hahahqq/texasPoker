<template>
  <div class="room full-width">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="房台消费" name="first">
        <components :is="componentName" @changePage="changePage_fun" :ptype="ptype"></components>
      </el-tab-pane>
      <el-tab-pane label="待结账单" name="second">
        <orderPage @changePage="changePage_fun"></orderPage>
      </el-tab-pane>
      <el-tab-pane label="房台管理" name="third">
        <managePage v-if="activeName == 'third'"></managePage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_QURCODEIMG from "@/mixins/qurcodeImg";
export default {
  mixins: [MIXINS_QURCODEIMG.QURCODE_IMG_ITEM],
  data() {
    return {
      activeName: "first",
      componentName: "consumePage",
      ptype: 0,
      time: null
    };
  },
  computed: {
    ...mapGetters({
      roomList: "roomList2",
      dataListState: "roomListState",
      roomOrderList: "roomOrderList"
    })
  },
  watch: {
    dataListState(data) {
      if (
        data.success &&
        this.activeName == "first" &&
        !this.time &&
        this.ptype == 0
      ) {
        this.settheTime();
      }
      if (this.activeName != "first" && this.time && this.ptype > 0) {
        clearInterval(this.time);
      }
    }
  },
  methods: {
    getNewData() {
      this.$store.dispatch("getRoomList2").then(() => {
        console.log("index reset room list");
      });
    },
    handleClick(tab, event) {
      // console.log(tab.name);
      if (tab.name == "first") {
        this.ptype = 0;
        this.componentName = "consumePage";
        this.$store.dispatch("selectingRoom", []);
        this.$store.dispatch('selectingMember',{isArr:false,data:new Object()}).then(()=>{
          console.log('clear selectingMember');
        });
        if (this.roomList.length == 0 || (!this.time && this.ptype == 0)) {
          this.getNewData();
        }
      } else {
        if (this.time && this.ptype > 0) {
          clearInterval(this.time);
        }
      }

      if (tab.name == "second" && this.roomOrderList.length == 0) {
        this.$store.dispatch("getRoomOrderList", {
          PN: 1,
          IsCheck: 0,
          BeginDate: 1,
          EndDate: 9999999999999
        });
      }
    },
    changePage_fun(type) {
      this.activeName = "first";
      this.ptype = type;
      this.componentName = type == 0 ? "consumePage" : "choosePage";
    },
    settheTime() {
      let isSetTime = 0;
      for (let i = 0; i < this.roomList.length; i++) {
        if (this.roomList[i].BILLID && this.roomList[i].ISSTART == 1)
          isSetTime++;
      }
      if (isSetTime > 0) {
        console.log("set time to reset room list");
        this.time = setInterval(this.getNewData, 60000);
      } else {
        clearInterval(this.time);
      }
    }
  },
  components: {
    consumePage: () => import("./consume.vue"),
    choosePage: () => import("./choose.vue"),
    orderPage: () => import("./order.vue"),
    managePage: () => import("./manage.vue")
  },
  created(){
    this.$store.dispatch('selectingMember',{isArr:false,data:new Object()}).then(()=>{
          console.log('clear selectingMember');
        });
  },
  destroyed() {
    this.$store.dispatch("clearRoomAll", 0);
    clearInterval(this.time);
  }
};
</script>
<style>
