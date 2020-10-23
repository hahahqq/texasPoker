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
        <template>
          <div>
          <div class="content-eighty">
            <div class="content-center">
                <el-row>
                  <el-col :span="10">
                    <el-button size="small" type="primary" @click="handleNew">添加预约</el-button>
                  </el-col>
                  <el-col :span="7">
                    <span>项目&nbsp;&nbsp;</span>
                    <el-select v-model="value1" placeholder="请选择" size="small" @change="selctGoods" clearable>
                      <el-option
                        v-for="item in subjectList"
                        :key="item.GOODSID"
                        :label="item.GOODSNAME"
                        :value="item.GOODSID">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <span>状态&nbsp;&nbsp;</span>
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
                <div class="content-table-center">
                <el-table
                  border size='small'
                  :data="dataList"
                  v-loading="loading"
                  :height="tableHeight"
                  header-row-class-name="bg-theme2 text-white"
                  class="m-top-sm"
                  style="width: 100%;"
                >
                  <el-table-column prop="GOODSNAME" label="预约项目" ></el-table-column>
                  <el-table-column prop="DATESTR" label="预约时间" width="320" align="center"></el-table-column>
                  <el-table-column prop="PRICE" label="价格" width="120" align="center"></el-table-column>
                  <el-table-column prop="STOCKQTY" label="预定数量" width="120" align="center"></el-table-column>
                  <el-table-column prop="LIMITQTY" label="限定数量" align="center"></el-table-column>
                  <el-table-column label="操作" width="170" fixed="right" align="right">
                    <template slot-scope="scope">
                      <el-button-group>
                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)" style="margin-left:20px;">删除</el-button>
                      </el-button-group>
                      <div class="hide">{{scope.row}}</div>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div v-show="pagination.TotalNumber > 20" class="m-top-smts clearfix elpagination">
                  <el-pagination
                    @size-change="handlePageChange"
                    @current-change="handlePageChange"
                    :pager-count="5"
                    :current-page.sync="pagination.PN"
                    :page-size="pagination.PageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.TotalNumber"
                    class="text-right"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- item -->
            <el-dialog
              :title="dealType=='add'?'新增'+title:'编辑'+title"
              :visible.sync="showItem"
              width="600px"
              style="max-width:100%"
            >
              <itemPage
                @closeModal="showItem=false"
                @resetList="getNewData(1);showItem=false"
                :dealType="{type:dealType,state:showItem}"
              ></itemPage>
            </el-dialog>
          </div>
        </template>
      </div>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_BESPEAK from "@/mixins/bespeak.js";
import { getHomeData } from '@/api/index'

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
      tableHeight:document.body.clientHeight-280,
      showItem: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      pageData: {
        ShopId: getHomeData().shop.ID,
        PN: 1,
        Status:'',
        GoodsId:'',
      },
      options: [{
        value: '0',
        label: '有效'
      }, {
        value: '1',
        label: '过期'
      }],
      value: '',
      value1:'',
    };
  },
  computed: {
    ...mapGetters({
      dataListState: "wechatListState",
      dataList: "wechatList",
      shopList: "shopList",
      dataState: "bespeakState",
      subjectList:'subjectList'
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
        }
      }
    },
    dataState(data) {
      this.loading = false;
      this.$message({ message: data.message, type: data.success ? "success" : "error" })
      if(data.success){
        this.getNewData(1)
      }
    }
  },
  methods: {
    selctGoods(i){
      let sendData = Object.assign({}, this.pageData);
      sendData.GoodsId = this.value1;
      sendData.Status = this.value;
      this.$store.dispatch("getWehatList", sendData).then(() => {
      })
    },
    formatStatus: function(row, column) {
      return row.ISSTOP ? "停用" : "启用";
    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData(0)
    },
    handleCommand(command) {
      this.pageData.ShopId = command;
      this.getNewData(1)
    },
    getNewData(type) {
      let sendData = Object.assign({}, this.pageData);
      if (type == 1) {
        sendData.PN = 1
      }
      this.$store.dispatch("getWehatList", sendData).then(() => {
        this.loading = true;
      });
    },
    handleNew() {
      this.dealType = "add";
      this.showItem = true;
    },
    handleEdit(index, row) {
      this.$store.dispatch("getWechatItem", row).then(() => {
        this.dealType = "edit";
        this.showItem = true;
      })
    },
    handleDel(index, row) {
      this.$confirm( "删除微信预约发布: " + row.GOODSNAME + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("dealWechatItem", {
          type: "del", data: { ID: row.BILLID }
        }).then(() => {
          this.loading = true
        })
      }).catch(() => { })
    }
  },
  mounted() {
    this.getNewData(1)
    this.$store.dispatch("getSubjectList")
  },
    components: {
      headerPage: () => import("@/components/header"),
      itemPage: () => import("./wechatItem.vue")
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
</style>


