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
              <el-form label-width="110px" class="fastc_top">
                  <el-row class="fastc_top_cont">
                      <el-form-item label="调整储值积分">
                          <el-input
                              v-model="changeMoney"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              @input="inputMoneyFun()"
                              class="full-width"
                              placeholder="0.00"
                          >
                          </el-input>
                      </el-form-item>
                      <el-form-item label="调整后储值积分">
                          <el-input
                              v-model="changeAfterMoney"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              class="full-width"
                              placeholder="0.00"
                              :disabled="true"
                          >
                          </el-input>
                      </el-form-item>
                  </el-row>

                  <div style="width: 100%; height: 10px; float:left; background:#f4f5fa"></div>

                  <el-row class="fastc_top_cont" v-if="splitIntegral">
                      <el-form-item label="调整竞技积分">
                          <el-input
                              v-model="changeIntegral"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              @input="inputIntegralFun"
                              class="full-width"
                              placeholder="0.00"
                          >
                          </el-input>
                      </el-form-item>
                      <el-form-item label="调整后竞技积分">
                          <el-input
                              v-model="changeAfterIntegral"
                              style="width:85%"
                              size="medium"
                              autocomplete="off"
                              class="full-width"
                              placeholder="0.00"
                              :disabled="true"
                          >
                          </el-input>
                      </el-form-item>
                  </el-row>

                  <div style="width: 100%; height: 10px; float:left; background:#f4f5fa"></div>

              </el-form>
              <div class="integral-bottom timescountc_left_footer">
                <div>
                  <el-input
                      placeholder="请输入备注"
                      v-model="Remark"
                      type="textarea"
                      class="full-width"
                  ></el-input>
                </div>
                <div style="margin-top:10px; background:#fff; padding: 10px 0">
                  <el-row>
                    <el-col :span="24" style="text-align:right">
                      <el-button plain size="medium" @click="changeClean">清 空</el-button>
                      <el-button type="primary" style="width: 100px" size="medium" @click="onSubmit">确 认</el-button>
                    </el-col>
                    <!-- <el-col :span="12" style="text-align:center">
                      <el-button type="primary" style="width: 100px" size="medium" @click="onSubmit">确 认</el-button>
                    </el-col> -->
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="16">
            <div :style="`text-align:center; display: table; width: 100%; height: ${clientHeight}px`">
               <span style="display: table-cell; padding-top: 200px  ">
                  <img src="static/images/delf.png" style=" width: 180px; height:170px; display: inline-block;" alt="">
                  <div style="color:#868686; margin-top: 20px">
                  一步到位，矫正积分值
                  </div>
               </span>
            </div>
          </el-col>
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
import { getHomeData, getUserInfo } from "@/api/index";
export default {
  mixins: [MIXINS_MEMBER.MEMBER_MENU, MIXINS_CHECKOUT.CHOOSE_MEMBER],
  data() {
    return {
      VipId:"",
      changeMoney: '',
      changeAfterMoney: '',
      changeIntegral: '',
      changeAfterIntegral: '',
      Remark:"",
      height:window.innerHeight -50,
      memberItem : {},
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      ISSMS: getUserInfo().CompanyConfig.AUTOSENDCHANAGESMS,
      clientHeight: document.body.clientHeight -50,
    };
  },
  computed: {
    ...mapGetters({
      shopList: "shopList",
      dataInfo: "memberItemInfo",
      dataState: "newMemberIAdjustState"
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
  mounted(){
     console.log(getUserInfo())
  },
  methods: {
     inputMoneyFun(){
        if(this.memberItem.ID == undefined){
           this.$message({ message: "请先选择会员 !", type: "warning" });
           this.changeMoney = ''
           return
        }
        this.changeAfterMoney = this.memberItem.MONEY + Number(this.changeMoney)
     },
     inputIntegralFun(){
        if(this.memberItem.ID == undefined){
           this.$message({ message: "请先选择会员 !", type: "warning" });
           this.changeIntegral = ''
           return
        }
        this.changeAfterIntegral = this.memberItem.INTEGRAL + Number(this.changeIntegral)
     },
      //删除会员信息，子传父事件
      changeMemberIDnull(e){
         this.VipId=""
         this.Remark="",
         this.memberItem = {}
         this.changeMoney = ''
         this.changeAfterMoney = ''
         this.changeIntegral = ''
         this.changeAfterIntegral = ''
      },
      //选择会员信息
      getmemberID(id, data) {
          this.VipId = id;
          this.$store.dispatch("selectingMember", {
              isArr: false,
              data: data
          });
          this.memberItem = data
      },
      onSubmit() {
         if(this.VipId == ''){
            this.$message({ message: "请先选择会员 !", type: "warning" });
            return
         }
        let setDate = Object.assign({},{
          VipId:this.VipId,
          Money: this.changeMoney,
          Integral: this.splitIntegral == false ? 0 : this.changeIntegral,
          Remark:this.Remark,
          IsSms: this.ISSMS
        })
        this.$store.dispatch("newMemberIntegralAdjust", setDate).then(() => {
          this.loading = true;
        })
      },
      changeClean(){
        this.memberItem = {}
         this.changeMoney = ''
         this.changeAfterMoney = ''
         this.changeIntegral = ''
         this.changeAfterIntegral = ''
         this.VipId = ''
        this.Remark="",
        this.$store.dispatch("selectingMember", {
            isArr: false,
            data: new Object()
        }).then(() => {
            this.VipId = "";
        })
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
  }
  .el-main{
    padding: 5px !important;
  }
  .integrgl{
    position: relative;
    width: 100%;
    height: 800px;
    background: #f2f2f2;
    margin-top: 8px;
  }
.fastc_top {
    margin-top: 10px;
    /* background: #fff; */
}
.fastc_top_cont{
  padding-top: 15px;
  padding-left: 10px;
  background:#fff;
  margin-top: 10px;
}
.integral-bottom{
  position: absolute;
  width: 100%;
  height: 200px;
  bottom: 10px;
}

.timescountc_left_footer >>>.el-input__inner{
    border: 1px solid #fff!important;
    background: #fff;
    font-size: 12px;
    color: #444444;
}
.timescountc_left_footer >>>.el-textarea__inner{
    border: 1px solid #fff!important;
    background: #fff;
}
</style>

