<template>
  <div>
    <div v-for="(item, key, i) in pageList" :key="i" class="row-flex">
      <div class="paddingTB-sm block" style="width: 100px">
        <span>{{ item.info.MODULENAME }}</span>
      </div>
      <div class="full-width">
        <div
          class="inline-block m-left-sm m-bottom-sm"
          v-for="subItem in item.list"
          :key="subItem.FUNID"
          :class="{ 'text-theme': subItem.ISPURVIEW == 1 }"
        >
          <el-checkbox v-model="subItem.IsPurview" :label="subItem.MODULENAME" border></el-checkbox>
        </div>
      </div>
    </div>

    <!-- <div class="row-flex">
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
    </div> -->

    <!-- <div class="row-flex">
      <div class="paddingTB-sm block" style="width:100px">品牌设置</div>
      <div class="full-width">
        <div
          class="inline-block m-left-sm m-bottom-sm"
          v-for="(item,i ) in pageList3"
          :key="'brand'+i"
          :class="{'text-theme':item.ISPURVIEW==1}"
        >
          <el-checkbox v-model="item.IsPurview" :label="item.NAME" border></el-checkbox>
        </div>
      </div>
    </div> -->

    <el-button @click="setPermission" :loading="loading" type="primary" style="margin-left: 100px">
      保 存
    </el-button>
    <el-button @click="closeModal('closeModal')" type="primary" plain>取消</el-button>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: ["uid"],
  data() {
    return {
      pageList: {},
      // pageList2: [],
      // pageList3:[],
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      dataList: "permissionList",
      // dataStore: "permissionStore",
      dataState: "permissionState",
      dataBrand: "permissionBrand"
    })
  },
  watch: {
    dataState(data) {
      this.loading = false;
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      if (data.success) {
        this.closeModal("resetList");
        this.$store.dispatch("getPermissionInfo");
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
      let sendArr = [];
      for (let key in this.pageList) {
        let list = this.pageList[key].list;
        for (let i = 0; i < list.length; i++) {
          if (list[i].IsPurview) {
            sendArr.push(list[i]);
          }
        }
      }

      if (this.uid != "") {
        this.$store
          .dispatch("setPermissionList", {
            uid: this.uid,
            parr: sendArr
          })
          .then(() => {
            this.loading = true;
          });
      }
    }
  },
  mounted() {
    if (Object.keys(this.dataList).length == 0) {
      this.$store.dispatch("getPermissionList");
    } else {
      this.pageList = Object.assign({}, this.dataList);
    }
  }
};
</script>

