<template>
  <div class="room" v-loading="loading">
    <el-button
      type="primary"
      size="small"
      icon="icon-bookmark m-right-xs"
      @click="handleClickArea('add',null)"
    >新增区域</el-button>
    <el-button type="primary" size="small" icon="el-icon-refresh" @click="getNewData" >刷新</el-button>
    <ul class="m-top-sm p-top-xs">
      <li v-for="(item,i) in pageList" :key="i" class="p-bottom-sm m-bottom-sm">
        <div>
          <i class="icon-bookmark" :class="{'text-theme':!item.DISTRICISSTOP}"></i>
          <span
            class="font-16 m-right-sm m-left-xs inline-block"
            style="min-width:120px"
          >{{item.DISTRICTNAME}}</span>
          <el-button-group class="m-right-sm">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleClickArea('edit',item)"
            >编辑</el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-delete"
              v-if="item.sub.length>0"
              disabled
            >删除</el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-delete"
              v-else
              @click="handleClickArea('del',item)"
            >删除</el-button>
          </el-button-group>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="handleClickRoom('add',item)"
          >新增房台</el-button>
        </div>
        <ul class="m-top-sm p-top-xs p-left-sm">
          <li
            v-for="(subitem,j) in item.sub"
            :key="j"
            class="m-left-sm m-bottom-sm border text-center inline-block relative"
            style="width:120px;"
          >
            <a
              v-if="!subitem.BILLID"
              class="subDel pointer text-theme2 h3"
              @click="handleClickRoom('del',subitem)"
            >
              <i class="el-icon-delete"></i>
            </a>
            <el-tag v-else class="subDel" size="mini" type="success">使用中</el-tag>
            <div class="relative" style="height:60px;">
              <span class="translateY-center block full-width">{{subitem.ROOMNAME}}</span>
            </div>
            <a
              @click="handleClickRoom('edit',subitem)"
              class="text-white padding-xs block pointer"
              :class="subitem.ISSTOP?'bg-theme3':'bg-theme2'"
            >
              <span v-text="subitem.ISSTOP?'已停用':'启用中'"></span>
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="dataList.length==0" class="padding-sm text-a9">暂无房台</div>
    <el-dialog v-if="showPage" :title="title" :visible.sync="showPage" :width="dwidth">
      <components :is="componentName" @closeModal="resetPageList" :defaultData="dealData"></components>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      formData: { Status: 0 },
      loading: false,
      height: window.innerHeight - 168,
      pageList: [],
      dwidth: "500px",
      componentName: "",
      title: "",
      showPage: false,
      dealData: {}
    };
  },
  computed: {
    ...mapGetters({
      dataList: "roomList",
      dataListState: "roomListState",
      roomState: "roomState",
      roomAreaState: "roomAreaState"
    })
  },
  watch: {
    dataListState(data) {
      if (data.success && this.loading) {
        this.defaultData();
      }
      this.loading = false;
    },
    dataItem(data) {
      this.loading = false;
      console.log(data);
    },
    roomAreaState(data) {
      if (data.success && this.loading) {
        this.resetPageList(true);
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      this.loading = false;
    },
    roomState(data) {
      if (data.success && this.loading) {
        this.resetPageList(true);
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      this.loading = false;
    }
  },
  methods: {
    getNewData() {
      let sendData = Object.assign({}, this.formData);
      this.$store.dispatch("getRoomList", sendData).then(() => {
        this.loading = true;
        console.log('manage')
      });
    },
    handleClickArea(type, item) {
      this.dealData = {};
      this.dwidth = "400px";
      this.componentName = "roomAreaPage";
      if (item) {
        this.dealData = {
          Name: item.DISTRICTNAME,
          Status: !item.DISTRICISSTOP, // false = 启用，true=停用
          DescNo: "",
          Id: item.DISTRICTID
        };
      }
      if (type == "del") {
        this.$confirm(
          "删除房台区域:" + this.dealData.Name + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$store
              .dispatch("delRoomArea", { Id: item.DISTRICTID })
              .then(() => {
                this.loading = true;
              });
          })
          .catch(() => {});
      } else {
        this.title = type == "add" ? "新增房台区域" : "编辑房台区域";
        this.showPage = true;
      }
    },
    handleClickRoom(type, item) {
      console.log(type, item);
      if (item.BILLID) {
        this.$message.error("启用中不能修改");
        return;
      }
      this.dealData = {};
      this.dwidth = "400px";
      this.componentName = "roomPage";
      if (item) {
        this.dealData = {
          DistrictId: item.DISTRICTID,
          Name: item.ROOMNAME,
          Status: item.ISSTOP ? false : true,
          DescNo: item.ROOMDESCNO,
          Id: item.ROOMID
        };
      }
      if (type == "del") {
        this.$confirm(
          "删除房台:" + this.dealData.Name + ", 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$store
              .dispatch("delRoomItem", { Id: item.ROOMID,DistrictId:item.DISTRICTID })
              .then(() => {
                this.loading = true;
              });
          })
          .catch(() => {});
      } else {
        this.title = type == "add" ? "新增房台" : "编辑房台";
        this.showPage = true;
      }
    },
    resetPageList(v) {
      // reset
      if (v) {
        this.$store.dispatch("clearRoomAll", 1).then(() => {
          this.getNewData();
        });
      }
      this.showPage = false;
    },
    defaultData() {
      let arr = [...this.dataList],
        newArr = [],
        index = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].ROOMID) {
          let dd = Object.assign({}, arr[i], {
            active: arr[i].ISSTOP ? false : true
          });
          newArr[index].sub.push(dd);
          if (!arr[i].ISSTOP) {
            newArr[index].active = true;
          }
        } else {
          index++;
          let item = Object.assign({}, arr[i], {
            sub: [],
            name: arr[i].DISTRICTNAME
          });
          newArr.push(item);
        }
      }
      this.pageList = [...newArr];
    }
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.getNewData();
    } else {
      this.defaultData();
    }
  },
  components: {
    roomAreaPage: () => import("@/components/room/dealarea.vue"),
    roomPage: () => import("@/components/room/dealroom.vue")
  }
};
</script>
<style scoped>
.subDel {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 1;
}
</style>

