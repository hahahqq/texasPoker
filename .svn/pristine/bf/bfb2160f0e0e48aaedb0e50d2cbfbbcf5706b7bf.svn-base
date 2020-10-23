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
        <div class="content-eighty">
          <div class="content-center">
            <el-button type="primary" size="small" @click="addDiscount">添加会员等级</el-button>
          </div>
        </div>
        <div class="content-table4">
            <div class="content-table-center">
              <el-table
                :height="tableHeight"
                header-row-class-name="bg-F1F2F3"
                :data="dataList">
                <el-table-column label="等级名称" prop="NAME"></el-table-column>
                <el-table-column label="折扣率" prop="RATE"></el-table-column>
                <el-table-column label="操作" align=right>
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </div>
        <el-dialog
          title="添加等级"
          :visible.sync="dialogVisible"
          width="35%">
          <div class="adddiscount">
            <el-row class="adddiscount-type">
              <el-col :span="4">等级名称</el-col>
              <el-col :span="20"><el-input v-model="discountName" placeholder="请输入等级名称" style="width:90%;" size="medium"></el-input></el-col>
            </el-row>

            <el-row class="adddiscount-type">
              <el-col :span="4">商品折扣</el-col>
              <el-col :span="20">
                <el-input v-model="discountReat" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder="值范围1到100" style="width:90%;" size="medium">
                  <template slot="append">%</template>
                </el-input>
              </el-col>
            </el-row>

            <el-row class="adddiscount-type">
              <el-col :span="4">有效期</el-col>
              <el-col :span="20">
                  <el-radio v-model="InvalidDateType" @change="changeInvalidType" :label="-1">永久有效</el-radio>
                  <el-radio v-model="InvalidDateType" @change="changeInvalidType" :label="1">
                    <el-input placeholder="自定义" onkeyup="value=value.replace(/[^\d]/g,'')"  v-model="InvalidDate" style='width: 80px' size="small"></el-input>
                  </el-radio>
                  天
              </el-col>
            </el-row>

            <el-row class="adddiscount-type">
              <el-col :span="4">备 注</el-col>
              <el-col :span="20">
                <el-input v-model="Remark" placeholder="请输入会员卡备注" style="width:90%;" size="medium"></el-input>
              </el-col>
            </el-row>

            <el-row class="adddiscount-type">
              <el-col :span="4">是否启用</el-col>
              <el-col :span="20">
                <el-switch v-model="IsUse" active-color="#409eff" inactive-color="#ccc"></el-switch>
              </el-col>
            </el-row>

            <el-row style="margin-top:50px;">
              <el-col :span="24" style="text-align: center;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveType">保 存</el-button>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
      </div>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
import listPage from "./list.vue";
import gradePage from "../selected/level.vue";
import recordPage from "./record.vue";
import promotionPage from "./promotion.vue";
export default {
  mixins: [MIXINS_MEMBER.MEMBER_MENU],
  data() {
    return {
      activeName: "first",
      discountName:'',
      discountReat:'',
      InvalidDate:'',
      InvalidDateType: '',
      ID:'',
      Remark:'',
      IsUse: true,
      dialogVisible: false,
      tableData: [],
      tableHeight:document.body.clientHeight-400
    };
  },
  computed: {
      ...mapGetters({
          dataList: "memberPromotionList",
          dealLevelState:"dealLevelState"
      })
  },
  watch: {
    dataList(data){
      console.log(data)
    },
    dealLevelState(data){
      console.log(data)
      if (data.success) {
          this.$message("操作成功")
          this.$store.dispatch("getMemberPromotionList", {});
      } else {
          this.$message(data.message)
      }
    }
  },
  methods: {
    changeInvalidType(){
      if(this.InvalidDateType == -1){
        this.InvalidDate = 40000
      }else{
        this.InvalidDate = ''
      }
    },
    //保存折扣类型方法
    saveType(){
      let setDate = Object.assign({},{
          Name:this.discountName,
          Rate:this.discountReat,
          ID:this.ID
      })
      this.$store.dispatch("dealLevelItem", setDate);
      this.dialogVisible=false;
    },
    handleEdit(e,item){
      this.dialogVisible=true;
      this.discountName=item.NAME
      this.discountReat=item.RATE * 100
      this.ID=item.ID
    },
    addDiscount(){
      this.dialogVisible=true;
      this.discountName='';
      this.discountReat='';
      this.ID='';
    },
    handleDelete(e,item){
        this.$confirm('确认删除折扣 【'+ item.NAME +' 】?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
           this.$store.dispatch("delLevelItem", {ID:item.ID});
        }).catch(() => { })
    }
  },
  mounted() {
      this.pagination = {
          TotalNumber: this.dataListState.paying.TotalNumber,
          PageNumber: this.dataListState.paying.PageNumber,
          PageSize: this.dataListState.paying.PageSize,
          PN: this.dataListState.paying.PN
      };
      this.pagelist = [...this.dataList];
      if (this.shopList.length == 0) {
          this.$store.dispatch("getShopList", {});
      }
  },
  components: {
      addNewMember: () => import("@/components/member/add"),
      itemPage: () => import("./item"),
      headerPage: () => import("@/components/header")
  },
  beforeCreate() {
          this.$store.dispatch("getMemberPromotionList", {});
      // if (list2.length == 0) {
      //     this.$store.dispatch("getMemberLevel");
      // }
      // if (list3.length == 0) {
      //     this.$store.dispatch("getMemberFlag");
      // }
  },
};
</script>
<style scoped>
.el-main{
  height: 660px!important;
}
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
  border: solid 1px #d7d7d7;
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
  .discount-container{
    margin-top: 10px;
    width: 99%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    height: 600px;
    background: #fff;
  }
  .adddiscount{
    width: 92%;
    margin-left: 4%;
    margin-right: 4%;
  }
  .adddiscount-type{
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .discount-top-cot{
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
  }
</style>

