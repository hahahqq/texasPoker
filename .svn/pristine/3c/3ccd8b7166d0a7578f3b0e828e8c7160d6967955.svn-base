<template>
  <div>
      <!-- {{dataProfile.obj}} -->
     <!-- <div style="width: 100%; float:left;">
        <div style="width: 70%; float:left">
           123456
        </div>
        <div style="width: 30%; float:left">
           <el-button type="primary" size="small">修改密码</el-button>
           <el-button type="primary" size="small">删除</el-button>
        </div>
     </div> -->

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="会员概况" name="first">
        <div style="width:760px;height:320px;">
          <el-row v-if="dataProfile.obj" :gutter="10">
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
              <div class="memberGeneral">
                <div>
                  <div class="hide">{{dataProfile}}</div>
                  <img
                    :src="dataProfile.obj.IMAGEURL?dataProfile.obj.IMAGEURL:'static/images/header.png'"
                    class="inline-block memberImg"
                    style="width: 60px; max-width: 70px;"
                  >
                </div>
                <div class="col-flex flex-between- full-width p-left-sm- memberGeneral-name">
                  <span class="membername">{{dataProfile.obj.NAME}}</span>
                  <span>电话：{{dataProfile.obj.MOBILENO}}</span>
                </div>
              </div>
              <ul class="text-right clearfix m-top-sm">
                <li class="paddingTB-sm">
                  <span class="pull-left">余额：<span class="text-theme">{{dataProfile.obj.MONEY}}</span></span>
                  <a
                    class="inline-block p-left-sm pointer"
                    @click="adjustFun('balanceAdjust',601050203)"
                  >调整</a>
                  <a class="inline-block p-left-sm pointer" @click="activeName='fourth';">详情</a>
                </li>
                <li class="paddingTB-sm">
                  <span class="pull-left">积分：<span class="text-theme">{{dataProfile.obj.INTEGRAL}}</span></span>
                  <a
                    class="inline-block p-left-sm pointer "
                    @click="adjustFun('integralAdjust',601050204)"
                  >调整</a>
                  <a class="inline-block p-left-sm pointer" @click="activeName='fifth';">详情</a>
                </li>
                <li class="paddingTB-sm">
                  <span class="pull-left">次卡：<span class="text-theme">{{dataInfo.CALCOUNT}}</span></span>
                  <a class="inline-block p-left-sm pointer" @click="activeName='sixth';">详情</a>
                </li>
                <li class="paddingTB-sm">
                  <span class="pull-left">欠款：<span class="text-theme">{{dataProfile.obj.OWEMONEY}}</span></span>
                  <a
                    class="inline-block p-left-sm pointer"
                    @click="adjustFun('repayArrears',601050205)"
                  >还款</a>
                  <a class="inline-block p-left-sm pointer" @click="activeName='seventh';">详情</a>
                </li>
                <li class="paddingTB-sm">
                  <span class="pull-left">密码：{{dataProfile.obj.ISUSEPASSWD?'启用':'未开启'}}</span>
                  <a
                    class="inline-block p-left-sm pointer"
                    @click="toEdit1=true;"
                  >设置</a>
                </li>
              </ul>
            </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">
              <div class="paddingLR-sm">
                <div class="row-flex text-center p-bottom-sm">
                  <div class="relative full-width">
                    <div class="font-3xs">{{dataProfile.obj.PAYCOUNT}}</div>
                    <div>消费次数</div>
                  </div>
                  <div class="relative full-width">
                    <div class="font-3xs">{{dataProfile.obj.PAYMONEY}}</div>
                    <div>消费金额</div>
                  </div>
                  <div class="relative full-width">
                    <div class="font-3xs">{{dataProfile.obj.COUPONNUM}}</div>
                    <div>优惠券</div>
                  </div>
                </div>
                <ul class="p-left-lg paddingTB-sm">
                  <li class="paddingTB-sm">
                    <span>最近一次消费：</span>
                    <span
                      v-if="totalData.LastPaymeny&&totalData.LastPaymeny.BILLDATE"
                    >{{new Date(totalData.LastPaymeny.BILLDATE) | time}}</span>
                    <span v-else>无</span>
                  </li>
                  <li class="paddingTB-sm">
                    <span>单次最高消费：</span>
                    <span
                      v-if="totalData.MaxPaymoney"
                    >{{totalData.MaxPaymoney}}</span>
                    <span v-else>0</span>
                  </li>
                  <li class="paddingTB-sm">
                    <span>单次平均消费：</span>
                    <span
                      v-if="totalData.AvgPaymoney"
                    >{{totalData.AvgPaymoney}}</span>
                    <span v-else>0</span>
                  </li>
                </ul>

                <div
                  v-if="dataProfile.objCount && dataProfile.objCount.length>0"
                  class="m-left-lg m-top-md m-bottom-sm"
                >
                  <div class="member-title">消费最多</div>
                  <div class="row-flex full-width m-top-sm">
                    <div
                      v-for="(item,i) in dataProfile.objCount"
                      :key="i"
                      v-if="i<3"
                      class="full-width"
                    >
                      <img
                        :src="'static/images/shopmore.png'"
                        class="pull-left m-right-sm"
                        style="width:36px;"
                      >
                      <div>{{item.GOODSNAME}}</div>
                      <div>{{item.CALCCOUNT}}次</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div v-if="toEdit1">
            <el-dialog
              width="38%"
              title="密码设置"
              :visible.sync="toEdit1"
              append-to-body>
              <div>
                <div>温馨提示</div>
                <div>
                  <div>1、会员<span>开启密码</span>后到店消费，需要向收银人员提供会员密码才能结账</div>
                  <div><span>2、员工可对会员密码进行开启、关闭、修改（请勿随意开关和修改会员密码）</span></div>
                </div>
              </div>
              <div style="margin-top:20px">
                <el-form status-icon label-width="100px" class="demo-ruleForm">
                  <el-form-item label="密码">
                    <el-input type="password" v-model="ruleForm.pass" size="small" autocomplete="off" style="width:70%;"></el-input>
                  </el-form-item>
                  <el-form-item label="密码使用">
                    <el-switch v-model="ruleForm.checkPass"></el-switch>
                  </el-form-item>
                  <el-form-item>
                    <div>
                      <el-button type="info" size="small">取消</el-button>
                      <el-button type="primary" size="small" @click="onPasswds">保存</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="详细信息" name="second">
        <div style="width:760px;height:320px;">
          <el-row :gutter="20" v-if="!toEdit" class="relative">
            <el-col :span="4">
              <div class="hide">{{dataInfo}}</div>
              <img
                :src="dataInfo.IMAGEURL?dataInfo.IMAGEURL:img"
                class="block"
                style="width:66px; max-width:100%;"
              >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="toEdit=true"
                style="position:absolute;bottom:0;left:10px;"
              ></el-button>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="infoText">
                    <span>姓名</span>
                    <span>{{dataInfo.NAME}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>手机</span>
                    <span>{{dataInfo.MOBILENO}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>卡号</span>
                    <span>{{dataInfo.CODE}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>折扣</span>
                    <span>{{dataInfo.DISCOUNTNAME}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>顾问</span>
                    <span></span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>押金</span>
                    <span>{{dataInfo.DEPOSITMONEY}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>性别</span>
                    <span>{{dataInfo.SEX==0?'男':'女'}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>生日</span>
                    <span v-if="dataInfo.BIRTHDATE">{{new Date(dataInfo.BIRTHDATE) | time }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>标签</span>
                    <span>{{dataInfo.VIPFLAG}}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="infoText">
                    <span>注册日期</span>
                    <span>{{new Date(dataInfo.CREATEDATE) | time }}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="infoText">
                    <span>地址</span>
                    <span>{{dataInfo.ADDRESS}}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="infoText bg-gw">
                    <span>备注</span>
                    <span>{{dataInfo.REMARK}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div v-if="toEdit">
            <el-dialog
              width="60%"
              title="编辑会员"
              :visible.sync="toEdit"
              append-to-body>
              <edit-member
                @closeModal="toEdit=false"
                @resetList="toEdit=false;getNewData();"
                :dealType="{type:'edit',state:toEdit}"
              ></edit-member>
            </el-dialog>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消费记录" name="third">
        <!-- 消费明细 -->
        <div style="width:760px;height:320px;">
           <spendingPage :pageState="activeName=='third'?true:false"></spendingPage>
        </div>
      </el-tab-pane>
      <el-tab-pane label="储值记录" name="fourth">
        <!-- 余额对帐明细 -->
        <div style="width:760px;height:320px;">
        <balancePage :pageState="activeName=='fourth'?true:false"></balancePage>
        </div>
      </el-tab-pane>
      <el-tab-pane label="积分记录" name="fifth">
        <!-- 积分对帐明细 -->
        <div style="width:760px;height:320px;">
        <integralPage :pageState="activeName=='fifth'?true:false"></integralPage>
        </div>
      </el-tab-pane>

      <el-tab-pane label="欠款记录" name="seventh">
        <!-- 会员还款记录 -->
        <div style="width:760px;height:320px;">
        <arrearsPage :pageState="activeName=='seventh'?true:false"></arrearsPage>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :width="width" :title="title" :visible.sync="isShowDeal" append-to-body>
      <components
        :is="componentName"
        @closeModal="isShowDeal=false"
        @resetData="getNewData();isShowDeal=false"
        :theState="isShowDeal"
        :theData="dataInfo"
      ></components>
    </el-dialog>
    <el-dialog :width="width" title="时段卡调整" :visible.sync="isShowDealtime" append-to-body>
      <div>
        <el-form ref="ruleForm" label-width="100px">
          <el-form-item label="会员">
            <div>{{dataInfo.NAME}}</div>
          </el-form-item>
          <el-form-item label="商品">
            <div>{{goodTimes.GOODSNAME}}</div>
          </el-form-item>
          <el-row class="times" :gutter="0">
              <el-col :xs="24" :sm="12" >
                <el-form-item label="开始时间">
                  <div style="width:80%;margin-left:15px;">{{goodTimes.BEGINDATE}}</div>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="ruleFormtime.EndDate"
                    type="date"
                    @change="changeTime"
                    style="width:80%;margin-left:15px;"
                    value-format="timestamp"
                    placeholder="选择有效时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row class="times" :gutter="0">
              <el-col :xs="24" :sm="12" >
                <el-form-item label="调整后开始时间">
                  <div style="width:80%;margin-left:15px;">{{goodTimes.BEGINDATE}}</div>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="调整后截止时间">
                  <div style="width:80%;margin-left:15px;">{{goodTimes.INVALIDDATE}}</div>
                </el-form-item>
              </el-col>
          </el-row>
          <el-form-item label="备注说明">
            <el-input v-model="goodTimes.Remark" placeholder="请输入备注说明"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" >保 存</el-button>
            <!-- <el-button @click="closeModal">取 消</el-button> -->
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/userdefault.png";
import CRYPTO from "crypto-js";
import dayjs from 'dayjs';
export default {
  props: {
    pageState: { type: Boolean, default: false },
    isReport: { type: Boolean, default: false }
  },
  data() {
    return {
      img: img,
      activeName: "first",
      activeName2: "",
      toEdit: false,
      toEdit1: false,
      componentName: "",
      isShowDeal: false,
      isShowDealtime:false,
      title: "",
      width: "50%",
      totalData:{},
      ruleForm: {
        pass: '',
        checkPass:false,
      },
      ruleFormtime:{
        StartDate:'',
        EndDate:'',
        Remark:'',
      },
      goodTimes:{},
    };
  },
  computed: {
    ...mapGetters({
      dataProfile: "memberItemProfile",
      dataInfo: "memberItemInfo",
      getmemberPasswd: "getmemberPasswd",
      memberCAdjustStateTime:"memberCAdjustStateTime"
    })
  },
  watch: {
    memberCAdjustStateTime(){
      if(data.success){
        this.$message({
            message: "操作成功",
            type: "success"
        });
      }else{
        this.$message({ message: data.message, type: "error" })
      }

    },
    getmemberPasswd(data){
      if(data.success){
        this.$message({
            message: "操作成功",
            type: "success"
        });

        if(this.ruleForm.checkPass==true){
         this.dataProfile.obj.ISUSEPASSWD=this.ruleForm.pass
        }else{
          console.log("密码没有启用")
          this.dataProfile.obj.ISUSEPASSWD=''
        }

        this.toEdit1=false;
        this.ruleForm.pass=''
      }else{
        this.$message({ message: data.message, type: "error" })
      }
    },
    pageState(value) {
      this.activeName = "first";
      this.activeName2 = "first";
      this.toEdit = false;
    },
    dataProfile(data){
      if(data.total){
        this.totalData = Object.assign({},data.total)
      }
    }
  },
  methods: {
    onSubmit(){
      this.isShowDealtime=false;
      this.goodTimes.INVALIDDATE=dayjs(this.ruleFormtime.EndDate).format('YYYY-MM-DD');
      let newData={
        VipId: this.goodTimes.VIPID,
        GoodsId: this.goodTimes.GOODSID,
        Remark: this.goodTimes.Remark,
        EndDate: this.ruleFormtime.EndDate,
      }
      this.$store.dispatch("memberCardsAdjustTime", newData).then(() => {
      });
    },
    changeTime(){
      this.goodTimes.INVALIDDATE=dayjs(this.ruleFormtime.EndDate).format('YYYY-MM-DD');

    },
    onPasswds(){
      console.log("88888")
      let id=this.dataProfile.obj.ID
      let pass=this.ruleForm.pass
      if(pass.length==6){
        let cpwd = pass != '' ? CRYPTO.MD5(pass).toString() : "";
        let newData={
          VipId:id,
          Md5Pass:cpwd,
          IsUsePasswd:this.ruleForm.checkPass
        }
        this.$store.dispatch("getMemberPasswd", newData).then(() => {
        });
      }else{
        this.$message("请重新输入以数字组成的六位数的密码");
        return;
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (this.activeName2 != this.activeName) {
        this.toEdit = false;
        this.activeName2 = tab.paneName;
      }
    },
    getNewData() {
      this.$store.dispatch("getMemberItem", this.dataInfo)
    },
    adjustFun(name,number) {
      if(number &&!this.isPurViewFun(number)){
         this.$notify({
          title: "警告",
          message: "没有权限",
          type: "warning"
        });
        return;
      }
      this.componentName = name;
      this.width = "680px";
      switch (name) {
        case "repayArrears":
          this.title = "会员还款";
          break;
        case "balanceAdjust":
          this.title = "余额调整";
          break;
        case "integralAdjust":
          this.title = "积分调整";
          break;
        case "cardsAdjust":
          this.title = "计次卡调整";
          break;
      }
      this.isShowDeal = true;
    }
  },
  components: {
    editMember: () => import("@/components/member/add"),
    spendingPage: () => import("@/components/member/spending"),
    balancePage: () => import("@/components/member/balance"),
    integralPage: () => import("@/components/member/integral"),
    arrearsPage: () => import("@/components/member/arrears"),
    repayArrears: () => import("@/components/member/repayArrears.vue"),
    balanceAdjust: () => import("@/components/member/balanceAdjust.vue"),
    integralAdjust: () => import("@/components/member/integralAdjust.vue"),
    cardsAdjust: () => import("@/components/member/cardsAdjust.vue")
  }
};
</script>
<style scoped>
.infoText {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
}
.infoText span:first-child {
  display: inline-block;
  width: 60px;
}
.right-line:after{
content: '';
position: absolute;
right:0;
top:20%;
width:1px;
height: 66%;
background: #ddd;
}
.memberGeneral{
  display: flex;
}
.memberGeneral .memberImg{
  border-radius: 10px;
}
.memberGeneral-name{
  margin-left: 20px;
}
.memberGeneral-name .membername{
  font-weight: bold;
  font-size: 18px;
}
.font-3xs{
  font-size: 1.5em;
  font-weight: bold;
  color: #2D2D2D;
  margin-bottom: 15px;
}
.member-title{
  font-size: 1.2em;
  font-weight: bold;
  color: #2D2D2D;
}
.times >>> .el-form-item__label{
  padding: 0 !important;
}

</style>

