<template>
   <div class="chongzhi">
      <el-form :inline="false" :model="vipnews" ref="vipnews" label-width="110px" class="vipRechargeForm">
         <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
               <el-form-item label="会员">
                  <el-select
                     v-model='searchText'
                     filterable
                     remote
                     reserve-keyword
                     :remote-method="remoteMethod"
                     clearable
                     style='width:100%'
                     :loading="loading"
                     @change="handleSelect(searchText)"
                     @focus='defaultMemberData()'
                     size="small"
                     placeholder="请输入会员名或手机号">
                     <el-option v-for='(item,i) in dataMemberList' :key='i' :value='item'>
                        <span style='float:left'>{{item.NAME}}</span>
                        <span style="float:right; color: #8492a6; font-size: 13px">{{item.MOBILENO}}</span>
                     </el-option>
                  </el-select>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
               <el-form-item label="姓名">
                  <el-input v-model="vipnews.NAME" disabled placeholder="会员姓名" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
               <el-form-item label="手机号">
                  <el-input v-model="vipnews.MOBILENO" disabled placeholder="会员手机号" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
               <el-form-item label="卡号">
                  <el-input v-model="vipnews.CODE" disabled placeholder="会员卡号" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
               <el-form-item label="当前储值余额">
                  <el-input v-model="vipnews.MONEY" disabled placeholder="当前储值余额" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
               <el-form-item label="充值金额">
                  <el-input v-model.trim="addMoney" @keyup.native="inputpayMoney" oninput="value=value.replace(/\D/g,'')" placeholder="请输入充值金额" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
               <el-form-item label="赠送金额">
                  <el-input v-model.trim="giftMoney" oninput="value=value.replace(/\D/g,'')" placeholder="请输入赠送金额" size="small" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm='24'>
               <el-form-item>
                  <ul v-if="storagevaluerroyaltyState.data.GiftList.length != 0">
                     <li class="rechargeWayItem" v-for="(item, index) in storagevaluerroyaltyState.data.GiftList" :key="index" @click="choseCurWay(item, index)">
                        <div class="addMoney" style="">充{{ item.ADDMONEY }} 元</div>
                        <div class='giftMoney' style="">送 {{ item.MONEY }} 元</div>

                        <div v-if="curPayWayIdx==index" :class="{'selected':curPayWayIdx==index}" style="">
                           <i class="el-icon-check"></i>
                        </div>
                     </li>
                  </ul>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
               <el-form-item label="支付方式">
                  <div class="rightList1">
                     <div class="showpayList overflowscroll">
                        <ul>
                           <li class="list-group-item" v-for="(item,index) in rechargeListList" :key='index' @click="toggletab(index,item)">
                              <div class="paylistsock" style="padding-top: 10px">
                                 <img :src="item.payerIMG" alt="" style="width:28px;height:30px; display:table; margin: 0 auto">
                                 <div style="line-height: 26px"> {{item.NAME}}</div>
                                 <i v-if="curtab==index" :class="{isselectPay:curtab==index}" class="el-icon-circle-check"></i>
                              </div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="24">
               <el-form-item label="备注信息">
                  <el-input type="textarea" v-model='Remark' :show-word-limit='true' placeholder="请输入备注，不超过50字" maxlength="50" style="width: 100%"></el-input>
               </el-form-item>
            </el-col>
         </el-row>

         <el-row :gutter="10">
            <el-col :xs="24" :sm="24" style="text-align:center; margin-top: 30px">
               <el-button @click="closeModal()">取 消 </el-button>
               <el-button type='primary' :loading="loadingBtn" @click="submitBtn">确 认</el-button>
            </el-col>
         </el-row>
      </el-form>

      <!-- 扫描支付 -->
      <el-dialog title="扫码支付" :visible.sync="showbarCodePay" width="550px" append-to-body>
         <barCodePay :paytypeid="PaytypeId" :billmoney="addMoney" @barcodePayclick="barcodePaycomback"></barCodePay>
      </el-dialog>

   </div>
</template>


<script>
let _ = require("lodash");
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import { VIPIMAGESIMG } from "@/util/define";
import barCodePay from "@/components/Recharge/barCodePay";
import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

export default {
   props: ["dataType"],
   data(){
      return {
         curtab: -1,
         addMoney: '',
         giftMoney: '',
         Remark: '',
         PaytypeId:'',
         payName:'',

         searchText: '',
         loading: false,
         pageData: {
            PN: 1,
            Filter: "",
         },
         vipnews: {
            NAME: '姓名',
            MOBILENO: '手机号',
            CODE: '',
            INTEGRAL: '0',
            MONEY: '0'
         },
         splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
         curPayWayIdx: -1,
         VipId: '',
         submitVipID:'',
         IsSms: false,
         dataMemberList:[],
         rechargeListList: [],
         loadingBtn: false,
         showbarCodePay: false,
         barCodePayMoney:'',
      }
   },
   computed: {
      ...mapGetters({
         rechargeListList1: "rechargeListList",
         saveVipRechargeState: 'saveVipRechargeState',
         getssmemberdListState: 'ssmemberdListState1',
         marketingRechargedetailed:"marketingRechargeStatus",
         barcodepayopenState: "barcodepayopenState",
         storagevaluerroyaltyState: "storagevaluerroyaltyState"
      })
   },
   watch: {
      dataType(data){
         if(data.memberdetails.ID != undefined){
            this.defaultItem()
         }
      },
      getssmemberdListState(data) {
        this.loading = false;
        if (data.success) {
            this.dataMemberList = [...data.data.PageData.DataArr];
         }
      },
      storagevaluerroyaltyState(data) {
         if (data.success) {
            // console.log("充值赠送列表",data.data)
         }
      },
      marketingRechargedetailed(data){
         console.log(data)
         this.getAddMoneyList = data.data.GiftList
      },
      memberListAllState(data){
         this.loading = false
         if(data.success){
         this.dataMemberList = [...data.data.List]
         }else{
         this.$message.error(data.message)
         }
      },
      saveVipRechargeState(data){
         this.loadingBtn = false
         if(data.success){
            let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print1");
            let jsonPrintData = JSON.parse(printRules);
            if(jsonPrintData.autoPrint){
               this.testPrint(data.data.BillId, jsonPrintData)
            }else{
               this.clearData()
            }
            this.$emit("referData", this.submitVipID)
         }
         this.$message({ type: data.success ? 'success' : 'error', message: data.message })
      },
      barcodepayopenState(data) {
         if (data.success) {
            let IsCheck = data.data.IsCheck;
            if (IsCheck) {
               this.showbarCodePay = true;
            } else {
               this.$message('请联系客服开通扫码支付');
               return;
            }
         }
      },
      rechargeListList1(data) {
         let newParam = []
         for(var i in data){
            if(data[i].NAME != '余额支付' && data[i].NAME != '欠款'){
               newParam.push(data[i])
            }
         }
         this.rechargeListList = newParam
      },
   },
   methods:{
      testPrint(billid, jsonPrintData){
         let billInfo = [
            {
               label: "充值单号：",
               value: billid
            },
            {
               label: "充值日期：",
               value: dayjs().format("YYYY-MM-DD hh:mm")
            }
         ];

         let saleInfo = [
         {
            label: "充值金额：",
            value: this.addMoney
         },
         {
            label: "赠送金额：",
            value: this.giftMoney
         },
         {
            label: "充值合计：",
            value: Number(this.addMoney) + Number(this.giftMoney)
         },
         {
            label: "支付方式：",
            value: this.payName
         }
         ];

         let vipInfo = jsonPrintData.vipInfo;
         vipInfo[0].value = this.vipnews.CODE;
         console.log(this.vipnews)
         vipInfo[1].value = this.vipnews.NAME;
         vipInfo[2].value = this.vipnews.MONEY + Number(this.addMoney) + Number(this.giftMoney);
         if (this.splitIntegral) {
            vipInfo.push({
               label: "竞技积分",
               value: this.vipnews.INTEGRAL,
               isShow: vipInfo[2].isShow
            });
         }

         jsonPrintData.remark.value = this.Remark;

         let printData = Object.assign(
         {},
         jsonPrintData,
         { billInfo: billInfo },
         { saleInfo: saleInfo }
         );
         let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
         getDayindata(printData, "print1", qresurl);

         this.clearData()
      },
      barcodePaycomback(data) {
         this.barcodepaystatus = 1;
         this.submitBtn()
      },
      referMemeberMoney(){
         this.clearData()
         this.$emit("referData", this.submitVipID)
      },
      clearData(){
         this.addMoney = ''
         this.giftMoney = ''
         this.vipnews = {
            NAME: '姓名',
            MOBILENO: '手机号',
            INTEGRAL: '0',
            MONEY: '0',
         }
         this.curPayWayIdx = -1
         this.curtab = -1
         this.PayTypeId = ''
         this.VipId = ''
         this.Remark = ''
      },
      closeModal(){
         this.clearData()
         this.$emit('closeVipRecharge')
      },
      submitBtn(){
         if(this.VipId == ''){
            this.$message.warning('请选择要充值的会员')
            return
         }

         if(this.PaytypeId == ''){
            this.$message.warning('请选择支付方式')
            return
         }

         if(this.addMoney == '' || this.addMoney == 0){
            this.$message.warning('请输入充值金额')
            return
         }

         if(this.payName == '扫码支付' && this.barcodepaystatus != 1){
            this.$store.dispatch("getbarcodepayopenState", {}).then(() => {});
            return;
         }

         this.loadingBtn = true

         this.$store.dispatch('saveVipRecharge', {
            VipId: this.VipId,
            AddMoney: this.addMoney,
            GiftMoney: this.giftMoney,
            IsSmd: this.IsSms == true ? 1 : 0,
            PayTypeId: this.PaytypeId
         }).then(() =>{
            this.submitVipID = this.VipId
         })
      },
      defaultItem(){
         let vipInfo = this.dataType.memberdetails
         console.log(vipInfo)
         if(vipInfo.ID != undefined){
            this.vipnews = {
               NAME: vipInfo.NAME,
               MOBILENO: vipInfo.MOBILENO,
               CODE: vipInfo.CODE,
               INTEGRAL: vipInfo.INTEGRAL,
               MONEY: vipInfo.MONEY
            }
            this.VipId = vipInfo.ID
         }
      },
      inputpayMoney(){
         if(this.addMoney == ''){
            this.giftMoney = ''
            return
         }
         console.log([...this.storagevaluerroyaltyState])
         if(this.storagevaluerroyaltyState.data.GiftList.length != 0){
            let gList = [...this.storagevaluerroyaltyState.data.GiftList];

            let ruleId, maxArr = []
            for (let i = 0; i < gList.length; i++) {
               if (this.addMoney >= gList[i].ADDMONEY) {
                  maxArr.push(gList[i])
               }
            }

            maxArr.sort(function(a, b){
               return a.ADDMONEY - b.ADDMONEY
            })

            if(maxArr[maxArr.length - 1] != undefined){
               this.giftMoney = maxArr[maxArr.length - 1].MONEY
            }
         }
      },
      choseCurWay(item, index){
         this.addMoney = item.ADDMONEY
         this.giftMoney = item.MONEY
         this.curPayWayIdx = index
      },
      toggletab(index, item) {
         this.curtab = index;
         this.PaytypeId = item.ID;
         this.payName = item.NAME;
      },
      remoteMethod(query){
         this.pageData.Filter = query
         this.$store.dispatch('getSsmemberdList1', this.pageData)
      },
      handleSelect(item) {
         this.searchText = '';
         this.VipId = item.ID

         if (Object.keys(item).length > 0) {
            for (let key in this.vipnews) {
               let UCkey = key.toUpperCase();
               this.vipnews[key] = item[UCkey];
            }
            this.vipnews.CODE = item.CODE
            this.defaultMemberData()
         }
      },
      defaultMemberData(){
         let sendData = { PN: 1, Filter: "" }
         this.$store.dispatch("getSsmemberdList1", sendData).then(() => {
            this.loading = true
         });
      },
      getviprechargeData() {
         this.$store.dispatch("getrechargeList", { codestatus: '' })
      },
   },
   mounted() {
      this.getviprechargeData();

      this.defaultItem()
   },
   components: {
      barCodePay
   }
}
</script>


<style lang="scss" scoped>
.vipRechargeForm>>>.el-form-item{
  margin-bottom: 10px
}

.giftMoney{
   font-size: 12px; color:#aaa;
}
.addMoney{
   font-size: 14px; color:#333; font-weight:bold
}
.rechargeWayItem{
  width: 100px;
  text-align:center;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 4px;
  float:left;
  border: 1px solid #fbc4c4;
  background:#f2f2f2;
  position: relative;
}
.rechargeWayItem div{
   line-height: 30px;
}
.rechargeWayItem:hover {
  background: #fef0f0;
  cursor: pointer;
}
.rechargeWayItem .selected{
   position: absolute;
   bottom: 0px;
   right: 0px;
   border-bottom: 26px solid #333;
   border-left: 26px solid transparent;
   width: 0;
   height: 0;
}
.rechargeWayItem .selected i{
   position: absolute;
   left: -14px;
   top: 10px;
   color: #fff;
   font-size: 14px;
}

.rightList1 {
  margin-top: 12px;
}

.chongzhi .showpayList ul li {
  display: inline-block;
  color: #666;
  font-size: 14px;
  text-decoration: none;
  width: 15%;
  text-align: center;
  float: left;
  cursor: pointer;
  margin: 0 5px 5px 0;
  font-size: 12px;
  position: relative;
}

.chongzhi .showpayList ul li .paylistsock {
  padding: 4px;
  border: 1px solid #f1a027;
  overflow: hidden;
  background: #fffff1;
  border-radius: 5px;
}

.rightList1 .isselectPay {
  position: absolute;
  color: #FF5722;
  top: 0px;
  right: 0px;
  font-size: 18px;
}
</style>
