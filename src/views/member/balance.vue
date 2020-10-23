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
        <el-row>
          <el-col :span="8">
            <div>
              <dropdown
                  @getmemberID="getmemberID"
                  @changeMemberIDnull="changeMemberIDnull"
                  :details="Object.keys(selmember).length>0?selmember:new Object()"
              ></dropdown>
            </div>
            <div class="integrgl" :style="{height:height+'px'}">
              <el-form label-width="80px" class="fastc_top">
                  <el-row class="fastc_top_cont">
                      <el-form-item label="现有余额">
                          <el-input
                              v-model="getMoney"
                              style="width:85%;"
                              size="medium"
                              autocomplete="off"
                              class="full-width"
                              :disabled="true"
                              placeholder="0.00"
                          >
                          <template slot="append">￥</template>
                          </el-input>
                      </el-form-item>
                      <el-form-item label="调整余额">
                          <el-input
                              v-model="changeMoney"
                              @input="addMoney"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              class="full-width"
                              placeholder="0.00"
                          >
                          <template slot="append">￥</template>
                          </el-input>
                      </el-form-item>
                      <el-form-item label="调后余额">
                          <el-input
                              v-model="nowMoney"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              class="full-width"
                              placeholder="0.00"
                              :disabled="true"
                          >
                          <template slot="append">￥</template>
                          </el-input>
                      </el-form-item>
                  </el-row>
              </el-form>
            <div class="integral-bottom">
              <div>
                <el-input
                    v-model="Remark"
                    placeholder="请输入备注"
                    type="textarea"
                    class="full-width"
                ></el-input>
              </div>
              <div style="margin-top:20px;">
                <el-row>
                  <el-col :span="12" style="text-align:center">
                    <el-button plain size="medium" @click="changeClean">清除</el-button>
                  </el-col>
                  <el-col :span="12" style="text-align:center">
                    <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            </div>
          </el-col>
          <el-col></el-col>
        </el-row>
      </div>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
import MIXINS_CHECKOUT from "@/mixins/checkout";
import listPage from "./list.vue";
import gradePage from "../selected/level.vue";
import recordPage from "./record.vue";
import promotionPage from "./promotion.vue";
export default {
  mixins: [MIXINS_MEMBER.MEMBER_MENU, MIXINS_CHECKOUT.CHOOSE_MEMBER],
  data() {
    return {
      activeName: "first",
      Remark:'',
      VipId:"",
      getMoney:"",
      changeMoney:"",
      nowMoney:"",
      height:window.innerHeight -50
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      dataInfo: "memberItemInfo",
      dataState: "memberBAdjustState"
    })
  },
  watch: {
    dataState(data){
      this.$message({
          message: data.message,
          type: data.success ? "success" : "error"
      });
      this.changeClean();
    }
  },
  components: {
    headerPage: () => import("@/components/header")
  },
  methods: {
      //删除会员信息，子传父事件
      changeMemberIDnull(e){
          this.VipId=""
      },
      //选择会员信息
      getmemberID(id, data) {
          this.getMoney=data.MONEY;
          this.VipId = id;
          this.$store.dispatch("selectingMember", {
              isArr: false,
              data: data
          });
      },
      //调整积分方法
      addMoney(){
          this.nowMoney=parseFloat(this.getMoney) + parseFloat(this.changeMoney)
      },
      onSubmit() {
        let setDate = Object.assign({},{
          VipId:this.VipId,
          Money:this.changeMoney,
          Remark:this.Remark
        })
        this.$store.dispatch("memberBalanceAdjust", setDate).then(() => {
          this.loading = true;
        });
      },
      changeClean(){
        this.changeMoney="",
        this.Remark="",
        this.nowMoney="",
        this.getMoney=""
        this.$store
            .dispatch("selectingMember", {
                isArr: false,
                data: new Object()
            })
            .then(() => {
                this.VipId = "";
            });
      }
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
  
  .el-main {
    background-color: #F4F5FA;
    padding: 5px !important;
  }
  .integrgl{
    position: relative;
    width: 100%;
    height: 800px;
    background: #fff;
    margin-top: 8px;
  }
.fastc_top {
    margin-top: 10px;
    background: #fff;
}
.fastc_top_cont{
  padding-top: 15px;
}
.integral-bottom{
  position: absolute;
  width: 100%;
  height: 200px;
  bottom: 20px;
}
</style>

