<template>
  <div>
    <!-- 预约服务 -->
    <div class="text-right">
      <el-button icon="el-icon-plus" size="small" type="primary" @click="handleNew" plain class="pull-left">新增</el-button>
      <el-dropdown
        @command="handleCommand"
        type="primary" plain
        class="pull-left" style='margin-left:10px'
      >
        <el-button type="primary" size="small" plain>状态
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size='small' slot="dropdown">
          <el-dropdown-item size='small' command="-1">全 部</el-dropdown-item>
          <el-dropdown-item size='small' command="0">预约中</el-dropdown-item>
          <el-dropdown-item size='small' command="1">已到店</el-dropdown-item>
          <el-dropdown-item size='small' command="2">已取消</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-select size="small" v-model="pageData.ShopId" placeholder="请选择店铺" class>
        <el-option v-for="item in shopList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
      </el-select>

      <el-date-picker size="small"
        v-model="dateBE"
        type="daterange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="m-left-sm"
      ></el-date-picker>

      <el-input
        type="default" size="small"
        v-model="pageData.Filter"
        placeholder="手机号/卡号/姓名"
        class="m-left-sm"
        style="width: 250px;"
      >
        <template slot="append">
          <a @click="getNewData(1)" class="block pointer">查 询</a>
        </template>
      </el-input>
    </div>

    <!-- 列表 -->
    <el-table
      border size='small'
      :data="dataList"
      v-loading="loading"
      height="470"
      header-row-class-name="bg-theme text-white"
      style="width: 100%; margin-top:10px"
    >
      <el-table-column prop="NAME" label="预约人" width="120" align="left"></el-table-column>
      <el-table-column prop='PHONENO' label='手机号' align="center"></el-table-column>
      <el-table-column prop="GOODSNAME" label="预约项目" align="center"></el-table-column>
      <el-table-column prop="DATESTR" label="到店时间" align="center"></el-table-column>
      <!-- <el-table-column label="预约时间">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.BEGINTIME) | timeDHF}} ~ {{new Date(scope.row.ENDTIME) | timeDHF}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="EMPNAME" label="预约员工" align="center"></el-table-column>
      <el-table-column prop="SHOPNAME" label="预约店铺" align="center"></el-table-column>
      <el-table-column prop="STATUS" label="状态" :formatter="formatStatus" width="100" align="center"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
            <!-- <el-button-group>
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </el-button-group> -->

            <el-button-group v-if='scope.row.STATUS == 0'>
              <el-button size='small' @click='editStatus("1", scope.row.ID)'>到店确认</el-button>
              <el-button size='small' @click='editStatus("2", scope.row.ID)'>取消预约</el-button>
            </el-button-group>

            <el-button-group v-if='scope.row.STATUS == 1 || scope.row.STATUS == 2'>
              <el-button size='small' @click='editStatus("0", scope.row.ID)'>恢复预约</el-button>
            </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-show="pagination.TotalNumber > 20" class="m-top-sm clearfix elpagination">
      <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page.sync="pagination.PN"
        :page-size="pagination.PageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.TotalNumber"
        class="text-center"
      ></el-pagination>
    </div>
    <!-- item -->
    <el-dialog
      :title="dealType=='add'?'新增'+title:'编辑'+title"
      :visible.sync="showItem"
      width="700px"
      style="max-width:100%"
    >
      <itemPage1
        @closeModal="showItem=false"
        @resetList="getNewData(1);showItem=false"
        :dealType="{type:dealType,state:showItem}"
      ></itemPage1>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from '@/api/index'
export default {
  data() {
    return {
      obj: "",
      title: "预约",
      dealType: "add",
      loading: false,
      loadingShop: false,
      loadingItem: false,
      showItem: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 1
      },
      pageData: {
        ShopId: getHomeData().shop.ID,
        PN: 1,
        Status: "-1", // -1=全部  0=预约中  1=已到店  2=已取消
        Filter: "",
        BeginDate: "",
        EndDate: ""
      },
      dateBE: [
        new Date().getTime(),
        new Date(this.getCustomDay(7)).getTime()
      ]
    }
  },
  computed: {
    ...mapGetters({
      dataListState: "bespeakListState",
      dataList: "bespeakList",
      dataState: "bespeakState",
      dataItem: "bespeakItem",
      shopList: "shopList",
      editBespeakStatusState:'editBespeakStatusState'
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
        this.pageData.PN = data.paying.PN;
      }
    },
    editBespeakStatusState(data){
      if(data.success){
        this.getNewData(1)
      }
    }
  },
  methods: {
    formatStatus: function(row, column) {
      // // -1=全部  0=预约中  1=已到店  2=已取消
      let text = "";
      switch (row.STATUS) {
        case -1:
          text = "";
          break;
        case 0:
          text = "预约中";
          break;
        case 1:
          text = "已到店";
          break;
        case 2:
          text = "已取消";
          break;
      }
      return text
    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData(0)
    },
    handleCommand(command) {
      this.pageData.Status = command;
      this.getNewData(1)
    },
    getNewData(type) {
      let sendData = Object.assign({}, this.pageData);
      sendData.BeginDate = this.dateBE[0];
      sendData.EndDate = this.dateBE[1];
      if (type == 1) {
        sendData.PN = 1
      }
      this.$store.dispatch("getBespeakList", sendData).then(() => {
        this.loading = true
      })
    },
    handleNew() {
       if (!this.isPurViewFun(601050406)) {
        this.$message.warning('您还没有获得相关权限!')
        return
      }
      this.dealType = "add"
      this.showItem = true
      // this.$store.dispatch("selectingGoods",{})
      // this.$store.dispatch('clearMember', 8)
    },
    editStatus(status, id){
      this.$confirm('确认修改当前预约状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('editBespeakStatus', { ID: id, Status: status})
      }).catch(() => { })
    }
  },
  mounted() {
    if (this.shopList.length == 0) {
      this.$store.dispatch("getShopList",{})
    }
    this.getNewData()
  },
  components: {
    // itemPage1: () => import("./item.vue")
    itemPage1: () => import("./item1.vue")
  }
};
</script>
