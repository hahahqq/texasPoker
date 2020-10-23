<template>
  <div class="selroom">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane
        name="tab"
        :style="{'height':'50vh','overflow-y':'auto','overflow-x':'hidden'}"
      >
        <a slot="label" @click="handleClick">全部</a>
        <div v-if="noData && dataList.length==0" class="padding-sm text-a9">暂无房台</div>
        <div
          v-for="(item,i) in alltableTabs"
          :key="i"
          v-if="!item.ISSTOP && !item.DISTRICISSTOP"
          class="m-right-sm m-bottom-sm relative"
          :class="item.ROOMID?'inline-block':'block'"
        >
          <div
            v-if="item.ROOMID"
            @click="chooseRoom(-1,-1,item)"
            class="border text-center pointer"
            :class="{'text-theme3':item.ISSTOP}"
            style="width:120px;"
          >
            <div v-if="item.active" class="checkActive">
              <i class="el-icon-check"></i>
            </div>
            <div class="relative" style="height:60px;">
              <div class="translateY-center block full-width">{{item.ROOMNAME}}</div>
            </div>
            <div class="text-white padding-xs block" :class="item.ISSTOP?'bg-theme3':'bg-theme2'">
              <span v-text="item.ISSTOP?'停用':'启用'"></span>
            </div>
          </div>
          <div v-else>{{item.DISTRICTNAME}}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="(tabItem,tabIndex) in editableTabs"
        :key="tabIndex"
        :label="tabItem.title"
        :name="tabItem.name"
        :style="{'height':'50vh','overflow-y':'auto','overflow-x':'hidden'}"
        v-if="!tabItem.DISTRICISSTOP"
      >
        <div
          v-for="(item,i) in tabItem.sub"
          :key="i"
          @click="chooseRoom(tabIndex,i,item)"
          class="m-right-sm m-bottom-sm border text-center inline-block pointer relative"
          :class="{'text-theme3':item.ISSTOP}"
          style="width:120px;"
        >
          <div v-if="item.active" class="checkActive">
            <i class="el-icon-check"></i>
          </div>
          <div class="relative" style="height:60px;">
            <div class="translateY-center block full-width">{{item.ROOMNAME}}</div>
          </div>
          <div class="text-white padding-xs block" :class="item.ISSTOP?'bg-theme3':'bg-theme2'">
            <span v-text="item.ISSTOP?'停用':'启用'"></span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="m-top-sm">
      <el-button @click="closeModal">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/room.png";
export default {
  data() {
    return {
      height:window.innerHeight * 0.5,
      img: img,
      searchText: "",
      activeItem: {},
      activeName: "tab",
      alltableTabs: [],
      editableTabs: [],
      activeRoom: [],
      noData: false
    };
  },
  computed: {
    ...mapGetters({
      dataList: "roomList",
      dataListState: "roomListState",
      selroom: "selroom"
    })
  },
  watch: {
    dataListState(data) {
      if (data.success) {
        if (this.dataList.length > 0) this.tabsData();
        this.noData = this.dataList.length > 0 ? false : true;
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    getNewData() {
      // Status: 0=全部，1=空闲房台
      this.$store.dispatch("getRoomList", { Status: 1 });
    },
    chooseRoom(tabIndex, i, item) {
      let index = -1;
      if (this.activeRoom.length > 0) {
        index = this.activeRoom.findIndex(obj =>
          Object.is(parseFloat(item.ROOMID), parseFloat(obj.ROOMID))
        );
      }
      if (index > -1) {
        this.activeRoom.splice(index, 1);
      } else {
        this.activeRoom.push(Object.assign({}, item));
      }
      this.toActiveItem();
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (this.dataList.length == 0) {
        this.getNewData();
      }
    },
    handleSubmit() {
      if (this.activeRoom.length == 0) {
        this.$message.error("请选择房台");
      } else {
        this.$emit("dealDatafun", this.activeRoom);
      }
    },
    toActiveItem() {
      let arr = [...this.alltableTabs],
        arr2 = [...this.editableTabs],
        tabIdx = 0,
        tsIdx = 0,
        subIdx = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].ROOMID) {
          subIdx = i - tsIdx - 1;
          arr[i].active = false;
          arr2[tabIdx - 1].sub[subIdx].active = false;
          this.activeRoom.forEach(aItem => {
            if (arr[i].ROOMID == aItem.ROOMID) {
              arr[i].active = true;
              arr2[tabIdx - 1].sub[subIdx].active = true;
            }
          });
        } else {
          tabIdx++;
          tsIdx = i;
        }
      }

      this.alltableTabs = [...arr];
      this.editableTabs = [...arr2];
    },
    tabsData() {
      let arr = [...this.dataList],
        newArr = [],
        index = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].ROOMID) {
          let dd = Object.assign({}, arr[i], { active: false });
          newArr[index].sub.push(dd);
        } else {
          index++;
          let item = Object.assign({}, arr[i], {
            sub: [],
            title: arr[i].DISTRICTNAME,
            name: "tab" + index
          });
          newArr.push(item);
        }
      }
      this.editableTabs = [...newArr];
      this.alltableTabs = [...arr];
      this.toActiveItem();
    },
    defaultData() {
      if (this.selroom.length > 0) {
        this.activeRoom = [...this.selroom];
      } else {
        this.activeRoom = [];
      }
      if (this.dataList.length == 0) {
        this.getNewData();
      } else {
        this.tabsData();
      }
    }
  },
  mounted() {
    this.defaultData();
  }
};
</script>
<style scoped>
.checkActive {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 20px;
}
</style>
