<template>
  <div class="selmember2 relative">
    <el-input placeholder="输入会员手机号/卡号" size="small" v-model.trim="searchText" class="theinput">
      <template slot="append">
        <a @click="handleSearch" class="paddingLR-sm text-white pointer block paddingTB-xs">选择</a>
      </template>
    </el-input>
    <div class="thepopover">
      <el-popover placement="bottom-end" width="370" trigger="click" v-model="showList">
        <div class="overflowY-scroll overflowX-hidden p-right-sm" v-loading="loading" style="max-height:300px">
          <div
            v-for="(item,i) in dataList"
            :key="i"
            @click="activeItem(item)"
            class="block clearfix paddingTB-sm pointer border-bottom"
          >
            <img :src="item.IMAGEURL?item.IMAGEURL:img" class="pull-left p-right-xs" style="width:44px;">
            <div class="relative">
              <span>{{item.NAME}}({{item.CODE}})</span>
              <span class="pull-right">&yen;{{item.MONEY}}</span>
            </div>
            <div class="relative">
              <span>{{item.MOBILENO}}</span>
              <span class="pull-right">{{item.INTEGRAL}}</span>
            </div>
          </div>
          <div v-if="dataList.length==0&&!loading">没有数据</div>
        </div>
        <el-button slot="reference" ref="bb" style="height:0px;padding:0;width:100%;"></el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/userdefault.png";
let _ = require("lodash");
export default {
  data() {
    return {
      searchText: "",
      showList: false,
      loading:false,
      img: img
    };
  },
  computed: {
    ...mapGetters({
      dataList: "memberList2",
      dataListState: "memberListState2"
    })
  },
  watch: {
    searchText(v) {
      this.getNewData();
    },
    dataListState(data) {
      this.loading = false;
    }
  },
  methods: {
    handleSearch() { 
      let sendData = {
        Filter: this.searchText,
        Status: 0,
        PN:1
      };
      this.loading = true;
      this.$store.dispatch("getMemberList2", sendData).then(() => {
        this.$refs.bb.handleClick();
        this.showList = true;
      });
    },
    getNewData: _.debounce(function() { 
      if (!this.loading) {
        this.handleSearch();
      }
    }, 500),
    activeItem(item) {
      this.$refs.bb.handleClick();
      this.showList = false;
      this.$store.dispatch('selectingMember',{isArr:false,data:Object.assign({type:'room'},item)})
      this.$emit("activeItem", item);
    }
  }
};
</script>
<style>
.selmember2 .el-input-group__append {
  background-color: #fb789a;
  padding: 0;
}
.selmember2 .theinput {
  position: relative;
  z-index: 1;
}
.selmember2 .thepopover {
  margin-top: -20px;
  position: relative;
  z-index: -1;
}
</style>