<template>
   <el-container>
      <el-header style="height:50px; padding: 0">
         <headerPage></headerPage>
      </el-header>
      <el-container>
         <el-aside width="100px">
               <section style="min-width:100px;">
                  <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
               </section>
         </el-aside>
         <el-container>
            <el-main :style="`height:${height}px`" v-loading='loading' element-loading-text="会员详情数据加载中..." element-loading-background="rgba(242,242,242, 0.8)">
               <div class='full-width pull-left' style="padding: 10px 10px 0; background:#fff; box-shadow: 10px 10px 10px -10px #aaa; ">
                  <div style="width: 100%; float:left; padding: 10px 20px; border-radius: 4px; background:#f2f2f2">
                        <span style="float:left; vertical-align: middle; ">
                           <img
                              :src="memberItem.IMAGEURL ? memberItem.IMAGEURL : 'static/images/header.png'"
                              style="width: 60px; height:60px; border-radius: 100%; margin-top:5px;"
                           >
                        </span>

                        <span style="float:left; padding-left: 10px;">
                           <div style="line-height: 34px;">
                              <i style="font-size:14px; font-weight:bold">{{memberItem.NAME}}</i>
                              <i style="color:#409eff; font-size: 14px; font-weight:bold; margin-left: 8px" :class="`${memberItem.SEX == 0 ? 'el-icon-male' : 'el-icon-female' }`"></i>
                              <i style="padding: 4px 8px; border-radius: 2px; color:#fff; background:#ff8800; margin-left: 10px;">{{memberItem.DISCOUNTNAME}}</i>
                           </div>
                           <div style="line-height: 34px">
                              <i>{{memberItem.MOBILENO}}</i>
                              <i v-if="memberItem.LASTTIME != undefined" style="margin-left: 20px">最近一次消费：
                                  {{ new Date(memberItem.LASTTIME) | timehf }}
                              </i>
                              <i style="margin-left: 20px">无消费记录</i>
                              <i v-if="memberItem.LASTTIME != undefined" style="margin-left: 20px;">【 距今 <a style="color:#f00; font-size: 14px;"> {{ new Date(memberItem.LASTTIME) | dateBetweenDay }} </a> 天 】</i>
                           </div>
                        </span>

                        <span style="float:right; line-height: 70px">
                           <!-- <el-button type='primary' plain size='small' @click="modifyPasswd()">修改密码</el-button>
                           <el-button type='danger' plain size='small' @click="delVip">删除</el-button> -->
                           <el-button type='primary' plain size='small' @click="handleReply()">回复</el-button>
                        </span>
                  </div>

                  <ul class="integralMoney">
                     <li>
                        <div>储值积分</div>
                        <div>{{memberItem.MONEY}}</div>
                     </li>

                     <li>
                        <div>竞技积分</div>
                        <div>{{memberItem.INTEGRAL}}</div>
                     </li>

                     <li>
                        <div>欠款金额</div>
                        <div>{{memberItem.OWEMONEY}}</div>
                     </li>

                     <li>
                        <div>优惠券</div>
                        <div>{{memberItem.COUPONNUM}}</div>
                     </li>

                     <li>
                        <div>大师分</div>
                        <div>100</div>
                     </li>

                     <li>
                        <div>参赛次数</div>
                        <div>100</div>
                     </li>

                     <li>
                        <div>累计参赛积分</div>
                        <div>100</div>
                     </li>
                  </ul>
               </div>

               <div class='full-width pull-left' :style="`padding: 10px 20px; height:${tableHeight}px; margin-top:10px; background:#fff`">
                  <el-tabs v-model="activeName" @tab-click="handleClick">
                     <el-tab-pane name='first' label='反馈内容'>
                        <div>
                           <div style="font-size:14px; font-weight:bold; margin-bottom: 10px">意见反馈</div>
                           <div>{{accepanceInfo.REMARK}}</div>
                           <div style="color:#9a9a9a">{{new Date(accepanceInfo.BILLDATE) | timehf }}</div>
                        </div>

                        <div style="margin-top:30px">
                           <div style="font-size:14px; font-weight:bold; margin-bottom: 10px">回复信息</div>
                           <div>{{accepanceInfo.CHECKREMARK}}</div>
                           <div style="color:#9a9a9a">{{new Date(accepanceInfo.CHECKTIME) | timehf }}</div>
                        </div>


                     </el-tab-pane>

                     <el-tab-pane name='second' label='会员信息'>
                        <div style="font-size:14px; font-weight:bold">基本信息</div>
                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span="4">
                              <i style='width:66px; float:left'>卡 &nbsp;&nbsp;号:</i> {{memberItem.CODE}}
                           </el-col>
                           <el-col :span="6">
                              <i style='width:66px; float:left'>等 &nbsp;&nbsp;级：</i> {{memberItem.DISCOUNTNAME}}
                           </el-col>
                        </el-row>

                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span="4">
                              <i style='width:66px; float:left'>顾 &nbsp;&nbsp;问：</i> {{memberItem.SALEEMPNAME ? memberItem.SALEEMPNAME : '--'}}
                           </el-col>
                           <el-col :span="6">
                              <i style='width:66px; float:left'>身份证：</i> {{memberItem.IDCARDNO ? memberItem.IDCARDNO : '--'}}
                           </el-col>
                        </el-row>

                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span="4">
                              <i style='width:66px; float:left'>性 &nbsp;&nbsp;别：</i> {{memberItem.SEX == 0 ? '男' : '女'}}
                           </el-col>
                           <el-col :span="6">
                              <i style='width:66px; float:left'>标 &nbsp;&nbsp;签</i>{{memberItem.VIPFLAG != undefined ? memberItem.VIPFLAG : '--'}}
                           </el-col>
                        </el-row>

                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span="4">
                              <i style='width:66px; float:left'>生 &nbsp;&nbsp;日：</i>
                              <span v-if="memberItem.BIRTHDATE != undefined">
                                 {{new Date(memberItem.BIRTHDATE) | time }}
                              </span>
                              <span v-else> -- </span>
                           </el-col>

                           <el-col :span="6">
                              <i style='width:66px; float:left'>注册日期：</i> {{new Date(memberItem.CREATEDATE) | time }}
                           </el-col>
                        </el-row>

                        <el-row style="line-height: 40px">
                           <el-col>
                              <i style='width:66px; float:left'>有效期：</i> {{new Date(memberItem.INVALIDDATE) | time }}
                           </el-col>
                        </el-row>

                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span='24'>
                              <i style='width:66px; float:left'> 地 &nbsp;&nbsp;址：</i> {{memberItem.ADDRESS != undefined ? memberItem.ADDRESS : '--' }}
                           </el-col>
                        </el-row>

                        <el-row :gutter="10" style=' line-height:40px '>
                           <el-col :span='24'><i style='width:66px; float:left'> 备 &nbsp;&nbsp;注：</i> {{memberItem.REMARK ? memberItem.REMARK : '--'}}</el-col>
                        </el-row>
                     </el-tab-pane>
                  </el-tabs>
               </div>

            </el-main>
         </el-container>
      </el-container>
   </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
import CRYPTO from "crypto-js";
export default {
   mixins: [MIXINS_MEMBER.MEMBER_MENU],
   data() {
      return {
         activeName: "first",
         height:window.innerHeight,
         tableHeight: document.body.clientHeight - 268,
         loading: false,
         toEdit: false,
         queryUrl: {},
         memberItem: {},
         vipPassword: '',
         IsUsePasswd: false,
         accepanceInfo: {}
      }
   },
   computed: {
      ...mapGetters({
         memberState:"memberState",
         sOpinionItem:'sOpinionItem',
         sOpinionState: 'sOpinionState'
      })
   },
   watch:{
      sOpinionState(data){
         console.log(data)
         if(data.success){
            this.$store.dispatch("getSOpinionItem", {BILLID: this.queryUrl.BILLID })
         }
      },
      sOpinionItem(data){
         console.log(data)
         this.accepanceInfo = data.BillObj
      },
      memberState(data){
         console.log(data)
         if(data.success){
            this.loading = false
            this.memberItem = data.data.obj
         }
      },
   },
   methods:{
      handleReply(idx, item) {
            this.$prompt("", "回复内容", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "textarea",
                inputPattern: /\S/,
                inputErrorMessage: "内容不能为空",
                inputPlaceholder: '请输入回复内容'
            }).then(({ value }) => {
                this.$store.dispatch("replySOpinionItem", {
                    BILLID: this.queryUrl.BILLID,
                    Remark: value
                })
            }).catch(() => {});
      },
      handleClick(){
         console.log(this.activeName)
      }
   },
   components: {
      headerPage: () => import("@/components/header"),
   },
   mounted(){
      let queryUrl = this.getSearchString()
      this.queryUrl = queryUrl
      this.$store.dispatch('getMemberItem', { ID: queryUrl.ID })

      this.$store.dispatch("getSOpinionItem", {BILLID: queryUrl.BILLID })
   }
}
</script>


<style scoped>
.integralMoney{
   padding: 16px 20px; width:100%; float:left;
}
.integralMoney li{
   text-align:center; float:left; width: 14%
}
.integralMoney li div:last-child{
   margin-top: 16px;
   color:#409eff;
   font-size: 18px;
   font-weight: bold;
}
</style>
