<template>
  <div>
    <div v-for="(item,key,i) in pageList" :key="i" class="row-flex">
      <div class="paddingTB-sm block" style="width:100px">
        <span>{{item.info.MODULENAME}}</span>
      </div>
      <div class="full-width">
        <div
          class="inline-block m-left-sm m-bottom-sm"
          v-for="subItem in item.list"
          :key="subItem.FUNID"
          :class="{'text-theme':subItem.ISPURVIEW==1}"
        >
          <el-checkbox v-model="subItem.IsPurview" :label="subItem.MODULENAME" border></el-checkbox>
        </div>
      </div>
    </div>
    <div class="row-flex">
      <div class="paddingTB-sm block" style="width:100px">门店设置</div>
      <div class="full-width">
        <div
          class="inline-block m-left-sm m-bottom-sm"
          v-for="(item,i ) in pageList2"
          :key="'shop'+i"
          :class="{'text-theme':item.ISPURVIEW==1}"
        >
          <el-checkbox v-model="item.IsPurview" :label="item.SHOPNAME" border></el-checkbox>
        </div>
      </div>
    </div>

    <el-button
      @click="setPermission"
      :loading="loading"
      type="primary"
      style="margin-left:100px;"
    >保 存</el-button>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: ["uid"],
  data() {
    return {
      pageList: {},
      pageList2: [],
      loading: false,
      loadNum: 0
    };
  },
  computed: {
    ...mapGetters({
      dataList: "permissionList",
      dataStore: "permissionStore",
      dataState: "permissionState"
    })
  },
  watch: {
    dataState(data) {
      this.loading = false;
      this.loadNum--;
      if (this.loadNum == 0) {
        this.$message({
          message: data.message,
          type: data.success ? "success" : "error"
        });
        if (data.success) {
          this.closeModal("resetList");
          this.$store.dispatch("getPermissionInfo")
        }
      }else if(!data.success){
        this.$message({
          message: data.message,
          type: "error"
        });
      }
    }
  },
  methods: {
    closeModal(type) {
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    setPermission() {
      if (!this.uid) {
        this.$message({
          message: "请选择用户",
          type: "error"
        });
        this.closeModal();
        return;
      }
      let sendArr = [],
        sendArr2 = [];
      for (let key in this.pageList) {
        let list = this.pageList[key].list;
        for (let i = 0; i < list.length; i++) {
          if (list[i].IsPurview) {
            sendArr.push(list[i]);
          }
        }
      }
      for (let i = 0; i < this.pageList2.length; i++) {
        if (this.pageList2[i].IsPurview) {
          sendArr2.push({ ShopID: this.pageList2[i].SHOPID });
        }
      }
      this.$store
        .dispatch("setPermissionList", { uid: this.uid, parr: sendArr })
        .then(() => {
          this.$store.dispatch("setPermissionStore", {
            uid: this.uid,
            sarr: sendArr2
          });
          this.loading = true;
          this.loadNum = 2;
        });
    }
  },
  mounted() {
    if (Object.keys(this.dataList).length == 0) {
      this.$store.dispatch("getPermissionList");
    } else {
      let arr = [];
      for (let i = 0; i < this.dataStore.length; i++) {
        arr.push(
          Object.assign({}, this.dataStore[i], {
            IsPurview: this.dataStore[i].ISPURVIEW == 1 ? true : false
          })
        );
      }
      this.pageList2 = [...arr];
      this.pageList = Object.assign({}, this.dataList);
    }
  }
};
</script>

