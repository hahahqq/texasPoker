<template>
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
      <div class="content-new-fex">
            <!-- 预约服务 -->
          <div class="content-eighty">
            <div class="content-center">
                <el-row>
                  <el-col :span="2">
                    <el-button size="small" type="primary" @click="handleNew">添加预约</el-button>
                  </el-col>
                  <el-col :span="8">
                    <span>日期:</span>
                    <el-date-picker size="small"
                        v-model="dateBE"
                        @change="chooseDate"
                        type="daterange"
                        style="width:300px;"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="m-left-sm"
                    ></el-date-picker>
                  </el-col>
                  <el-col :span="6">
                    <span>项目:</span>
                    <el-select v-model="value1" placeholder="请选择" size="small" @change="selctGoods" clearable>
                      <el-option
                        v-for="item in subjectList"
                        :key="item.GOODSID"
                        :label="item.GOODSNAME"
                        :value="item.GOODSID">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5">
                    <span>状态:</span>
                    <el-select v-model="value" placeholder="请选择" size="small" @change="selctGoods" clearable>
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 列表 -->
            <div class="content-table4">
                <div  class="content-table-center" >
                 <div :style="{height:tableHeight+'px'}" style="overflow-y: auto;">
                  <table class='tableStock' border='0' cellspacing='0' cellpadding='10' width='100%'>
                      <thead>
                      <tr>
                          <th align='center' style='width:140px' v-for="(items,index) in name" :key="index">{{items}}</th>
                      </tr>
                      </thead>
                      <tbody v-for='(items, index) in  moneyName' :key='index'>
                          <tr class="title-dan">
                              <td colspan="10">
                                <el-row>
                                  <el-col :span="12">
                                    <span><i class="el-icon-time"></i></span>
                                    <span style="margin-left:5px;font-size: 10px;">{{items.BILLTYPE}}</span>
                                    <span style="margin-left:10px;font-size: 10px;">{{items.WEEKNAME}}</span>
                                  </el-col>
                                  <el-col :span="12" style="text-align:right;">
                                    <span style="margin-right:30px;font-size: 10px;">合计 : {{items.FCOUNT}}笔</span>
                                  </el-col>
                                </el-row>
                              </td>
                          </tr>
                          <tr v-for='(item, index) in  items.List' :key='index'>
                              <td align='center' style='padding:0 4px;width:200px'>{{item.NAME}}</td>
                              <td align='center' style='padding:0 4px;width:200px'>x{{item.VIPCODE}}</td>
                              <td align='center' style='padding:0 4px;width:200px'>{{item.GOODSNAME}}</td>
                              <td align='center' style='padding:0 4px;width:200px'>{{item.DATESTR}}</td>
                              <td align='center' style='padding:0 4px;width:200px'>{{item.EMPNAME}}</td>
                              <td align='center' :class="item.STATUS==0? 'yz':'' ||item.STATUS==2? 'yqx':'' || item.STATUS==1? 'ydd':''" style='padding:0 4px;width:200px;'>{{item.STATUSNAME}}</td>
                              <td align='center' style='padding:0 4px; width:200px'>{{item.remark}}</td>
                              <td align='center' style='padding:0 4px; width:300px;color:#1B74FC' @click="detailedPage(items)">
                                <span v-if="item.STATUS==0" @click='editStatus("1", item.ID)'>到店确认</span>
                                <span v-if="item.STATUS==0" @click='editStatus("2", item.ID)'>取消预约</span>
                                <span v-if="item.STATUS==1 || item.STATUS==2" @click='editStatus("0", item.ID)'>恢复预约</span>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <div v-show="pagination.TotalNumber > 20" class="m-top-sm clearfix elpagination">
                  <el-pagination
                      @size-change="handlePageChange"
                      @current-change="handlePageChange"
                      :current-page.sync="pagination.PN"
                      :page-size="pagination.PageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="pagination.TotalNumber"
                      class="text-right"
                  ></el-pagination>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分页 -->
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
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from '@/api/index'
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_BESPEAK from "@/mixins/bespeak.js";

export default {
  mixins: [MIXINS_BESPEAK.BESPEAK_MENU],
  data() {
    return {
      obj: "",
      title: "预约",
      dealType: "add",
      loading: false,
      loadingShop: false,
      loadingItem: false,
      showItem: false,
      moneyName:[],
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
        EndDate: "",
        Goodsid:""
      },
      dateBE: [
              new Date().getTime(),
              new Date(this.getCustomDay(30)).getTime()
          ],
      options: [{
        value: '-1',
        label: '全部'
      },{
        value: '0',
        label: '预约中'
      },{
        value: '1',
        label: '已到店'
      },{
        value: '2',
        label: '已取消'
      }],
      value: '',
      value1:'',
      name:["预约人","手机号","预约项目","预约时间","预约员工","状态","备注","更多"],
      tableHeight: document.body.clientHeight - 250
    }
  },
  computed: {
    ...mapGetters({
      dataListState: "bespeakListState",
      dataList: "bespeakList",
      dataState: "bespeakState",
      dataItem: "bespeakItem",
      shopList: "shopList",
      editBespeakStatusState:'editBespeakStatusState',
      subjectList:'subjectList'
    })
  },
  watch: {
    dataList(data) {
      let newArr = []
      for(var i in data){
          newArr.push(data[i])
      }
       console.log(newArr)
      const masterArr = [...new Set(newArr.map((e) => e.DATESTR))].map(a => ({
          WEEKNAME:newArr.find(item => item.DATESTR === a).WEEKNAME,
          BILLTYPE: newArr.find(item => item.DATESTR === a).DATESTR,
          FCOUNT:newArr.find(item => item.DATESTR === a).FCOUNT,
          List: newArr.filter(item => item.BILLTYPE == undefined && item.DATESTR === a && item.BILLNO != undefined)
      }));
      console.log(masterArr)
      this.moneyName=masterArr;

    },
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
    chooseDate(e) {
      this.getNewData();
    },
    selctGoods(i){
      let sendData = Object.assign({}, this.pageData);
      sendData.BeginDate = this.dateBE[0];
      sendData.EndDate = this.dateBE[1];
      sendData.Goodsid = this.value1;
      sendData.Status = this.value;
      this.$store.dispatch("getBespeakList", sendData).then(() => {
        this.loading = true
      })
    },
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
      this.$store.dispatch("getShopList")
    }
    this.getNewData()
    this.$store.dispatch("getSubjectList")
  },
    components: {
      headerPage: () => import("@/components/header"),
      itemPage1: () => import("../bespeak/appointment/item1.vue")
    },
};
</script>
<style scoped>
.member-header{
  display: flex;
  align-items: center;
  height: 50px;
}
.center-title{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border: solid 1px #EDEEEE;
}
.center-cont{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.el-header{
  padding: 0 !important;
}
.shop{
  display: flex;
  align-items: center;
  height: 50px;
  position: relative;
}
.shop .name{
  position: absolute;
  right: 50px;
  height: 50px;
  line-height: 50px;
  width: 150px;
  text-align: center;
  top: 0;
  /* background: rebeccapurple; */
}
  .el-header, .el-footer {
    background-color: #fff;
    color: #333;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #F4F5FA;
    color: #333;
  }
  .index-top{
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    height: 80px;
    line-height: 80px;
    background: #fff;
    margin-top: 5px;
    margin-bottom: 15px;
  }
  .index-table{
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    height: 600px;
    background: #fff;
  }
  .member-main-top-buttom{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
  .member-main-top-type{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
   .tableStock thead{
    background:#EEEEEE; color:#4E4E4E; height:36px; line-height:36px;
  }
.tableStock thead tr th{
    border-right:1px solid #D8D8D8;
     }
.tableStock   tbody tr{
    
    height: 36px; line-height: 36px;
    
  }
  .tableStock tbody td{
      border-bottom: solid 0.5px #f2f2f2;
      border-right: solid 0.5px #f2f2f2;
  }
  .title-dan{
    background: #BFD8F0;
    width: 100%;
    height: 30px !important;
    line-height: 30px !important;
  }
  .el-icon-time{
    margin-left: 25px;
    font-size: 20px;
  }
  .index-table-cont{
    padding-top: 20px;
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
    overflow: auto;
    height: 600px;
  }
  .yz{
    color: #D9001B;
  }
  .yqx{
    color: #AAAAAA;
  }
  .ydd{
    color: #70B603;
  }
</style>




