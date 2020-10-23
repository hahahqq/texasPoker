<template>
  <div id="consume" class="row-flex flex-start full-width">
    <div class="leftArea col-flex" :style="{'height':(height-28) +'px'}">
      <div>
        <selMemberPage @activeItem="activeItem_fun"></selMemberPage>
        <div class="row-flex paddingTB-sm text-left font-12">
          <span class="flex-grow-6">
            姓名:
            <span class="text-theme2">{{activeItem.NAME}}</span>
          </span>
          <span class="flex-grow-6">
            等级:
            <span class="text-theme2">{{activeItem.LEVELNAME}}</span>
          </span>
          <span class="flex-grow-6">
            余额:
            <span class="text-theme2">{{activeItem.MONEY}}</span>
          </span>
          <span class="flex-grow-6">
            积分:
            <span class="text-theme2">{{activeItem.INTEGRAL}}</span>
          </span>
        </div>
      </div>

      <div class="border-top relative overflowY-scroll full-height">
        <div
          v-for="(item,i) in selroom"
          :key="i"
          class="inline-block marginTB-sm text-center"
          style="width:33%"
        >
          <div>
            <img :src="img" alt>
          </div>
          {{item.ROOMNAME}}
        </div>
         <div class="text-center m-top-sm" v-if="selroom.length>0">
        <el-button size="default" type="primary" @click="handleSubmit">开台</el-button>
      </div>
      </div>
     
    </div>
    <!-- 选择房台 -->
    <div class="rightArea">
      <theRoomPage :height="height" @returnData="getRoomData_fun"></theRoomPage>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/room.png";
export default {
  data() {
    return {
      img: img,
      activeItem: {},
      height: 0
    };
  },
  computed: {
    ...mapGetters({
      selroom: "selroom",
      selmember: "selmember"
    })
  },
  methods: {
    activeItem_fun(v) {
      this.activeItem = Object.assign({}, v);
    },
    handleSubmit() {
      if (this.selroom.length > 0) {
        this.$store.dispatch("selectingRoom", this.selroom).then(() => {
          this.$emit("changePage", 1);
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择会员和房台",
          type: "error"
        });
      }
    },
    getRoomData_fun(data){
      this.$emit("changePage", 2);
    },
    defaultData() {
      this.height = window.innerHeight - 125;
    }
  },
  mounted() {
    this.defaultData();
  },
  components: {
    selMemberPage: () => import("@/components/selected/selmember2.vue"),
    theRoomPage: () => import("./room.vue")
  }
};
</script>
<style scoped>
.leftArea {
  width: 380px;
  min-width: 380px;
  padding-right: 10px;
   overflow-x: hidden;
  overflow-y: auto;
}
.rightArea {
  position: relative;
  width: 100%;
  border-left: 10px solid rgb(234, 226, 213);
  padding-left: 10px;
  overflow: hidden;
}
</style>








