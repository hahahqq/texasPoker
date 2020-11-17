<template>
    <div class='recommendSet'>
        <el-form label-width="130px" v-loading='loading' :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="推荐会员注册返利">
                <div style='border:1px solid #e4e7ed; border-radius: 8px; min-height:80px; float:left; padding: 6px 10px; background:#f4f4f4; width:60%'>
                    <span style='width:100%; float:left'>
                        推荐人获得
                        <el-select v-model="ruleForm.RShareGetType" @change="curSelectState(ruleForm.RShareGetType)" size="small" style="width:110px; margin-left:12px">
                            <el-option v-for='(item,index) in selectList' :key='index' :label="item.name" :value="item.type"></el-option>
                        </el-select>
                        <el-input type="number" v-model.trim="ruleForm.RShareGetQty" min="0" size='small' style="width:110px" :placeholder="`请输入${title}`"></el-input> {{unitName}}
                    </span>
                    <span style='width:100%; float:left'>
                        被推荐人奖励
                        <el-select v-model="ruleForm.RVipGetType" @change="curSelect2State(ruleForm.RVipGetType)" size="small" style="width:110px">
                            <el-option v-for='(item, index) in selectList1' :key='index' :label="item.name" :value="item.type"></el-option>
                        </el-select>
                        <el-input size="small" v-if='ruleForm.RVipGetType != "coupon"' v-model="ruleForm.RVipGetQty" style="width:110px" :placeholder="`请输入${title1}`"></el-input>
                        <el-button size='small' v-else type="primary" icon="el-icon-plus" @click="showCouponDialog = true" plain style="width:110px">选择券</el-button>
                    </span>

                    <div v-if='ruleForm.RVipGetType == "coupon"' class="coupont full-width pull-left select-list-cont" style='padding-left:15%; margin-bottom:30px'>
                        <ul>
                            <li v-for="(item, i) in choseCouponList" :key="i">
                                <div class="coupont-list">
                                    <div class="coupont-list-top">
                                        <div style="height:20px;width:100%;line-height: 20px;">
                                            <span class='font-20'>￥{{item.MONEY}}</span>
                                            <span style='padding-left:4px; font-size:12px'>满{{item.LIMITMONEY}}元可用</span>
                                            <i @click="selectDelete(item, i)" class="el-icon-delete pull-right" style="margin-right:8px; color:#333;font-size:18px; cursor:pointer"></i>
                                        </div>
                                        <div style="height:20px;width:100%;line-height: 20px;font-size:12px;">
                                            <span>{{item.DATENAME.substr(0,3)}}{{item.DATENAME.substr(14, 24)}}</span>
                                        </div>
                                    </div>
                                    <div class="coupont-list-bottom">
                                        {{item.REMARK == undefined ? '[全品类]可用' : item.REMARK}}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="会员消费返利">
                <div style='border:1px solid #e4e7ed; border-radius: 8px; float:left; padding: 6px 10px; min-height:80px; background:#f4f4f4; width:60%'>
                    <el-row>
                        会员每消费
                        <el-input size="small" type="number" v-model="ruleForm.PVipPayMoney" style="width:110px; margin-left:12px" placeholder="请输入金额"></el-input> 元
                    </el-row>
                    <el-row>
                        推荐人获得
                        <el-input size="small" type='number' min="0" v-model="ruleForm.ShareGetQty" style='width:110px; margin-left:12px' placeholder="请输入金额"></el-input>
                        <el-select v-model="ruleForm.ShareGetType" size="small" style="width:110px">
                            <el-option v-for='(item,index) in selectList' :key='index' :label="item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item label="会员提现设置">
                <div style='border:1px solid #e4e7ed; border-radius: 8px; float:left;  padding: 6px 10px; min-height:80px; background:#f4f4f4; width:60%'>
                    <el-row>
                        最低提现金额
                        <el-input size="small" min="0" type="number" v-model="ruleForm.BrokerageMoney" style="width:110px" placeholder="请输入金额"></el-input> 元
                    </el-row>

                    <el-row>
                        提现规则说明
                        <el-input type="textarea" v-model="ruleForm.BrokerageRemark" placeholder="请输入提现规则说明( 不超过 40 字)" maxlength="40" :show-word-limit='showWordLimit' style='width:80%'></el-input>
                    </el-row>
                </div>
            </el-form-item>

            <el-form-item label="功能开关">
                <el-switch
                    v-model="ruleForm.IsStart"
                    active-color="#409eff"
                    inactive-color="#ff4949"
                ></el-switch>
            </el-form-item>

            <el-form-item class='m-top-md'>
                <el-button type="primary" @click='submitSave()'>确 认</el-button>
                <el-button @click='getNewData()'>取 消</el-button>
            </el-form-item>
        </el-form>

        <el-dialog title='选择优惠券' :visible.sync="showCouponDialog" append-to-body width='60%'>
            <el-tabs v-model="activeName" @tab-click='selectCoupont(activeName)'>
                <el-tab-pane :label="`可使用( ${ISINVALID} )`" name='first'></el-tab-pane>
                <el-tab-pane :label="`不可用( ${ISNOTINVALID} )`" name='second'></el-tab-pane>
            </el-tabs>

            <div v-if='CouponList.length == 0'> 无可用优惠券 </div>
            <div class="select-list" v-else>
                <div class="select-list-cont">
                    <ul>
                        <li v-for="(item,index) in CouponList" :key="index">
                            <div class="coupont-list" @click="selectListCont(index,item)" :class="item.isSelect==true && activeName =='first' ?'select-border':''">
                                <div class="coupont-list-top">
                                    <div style="height:20px;width:100%;line-height: 20px;">
                                        <span style='font-size:20px'>￥{{item.MONEY}}</span>
                                        <span style='padding-left:4px; font-size:12px'>满{{item.LIMITMONEY}}元可用</span>
                                    </div>
                                    <div style="height:20px;width:100%;line-height: 20px;font-size:12px;">
                                        <span>{{item.DATENAME.substr(0,3)}} {{item.DATENAME.substr(14, 24)}}</span>
                                    </div>
                                </div>
                                <div class="coupont-list-bottom">
                                    {{item.REMARK == undefined ? '[全品类]可用' : item.REMARK}}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

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
            <div class='full-width' style='margin-top:30px; display:table;'>
                <el-button type="primary" @click="choseCouponList = selectlist; showCouponDialog = false">确认</el-button>
                <el-button @click='showCouponDialog = false'>取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    name:'recommendSet',
    data(){
        return{
            loading: false,
            ISINVALID: 0,
            ISNOTINVALID: 0,
            activeName:'first',
            showCouponDialog: false,
            showWordLimit: true,
            ruleForm:{
                IsStart: true,
                RShareGetType: 'money',
                RVipGetType: 'money',
                ShareGetType:'money',
                RShareGetQty:'',
                RVipGetQty:'',
                ShareGetQty:'',
                PVipPayMoney:'',
                BrokerageMoney:'',
                BrokerageRemark:''
            },
            rules:{ },
            choseCouponList:[],
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 1
            },
            CouponList:[],
            title:'余额',
            title1:'余额',
            unitName:'元',
            selectList  : [{ name: '余额', type: 'money'},{ name: '积分', type: 'integral'},{ name: '佣金', type: 'brokerage'} ],
            selectList1 : [{ name: '余额', type: 'money'},{ name: '积分', type: 'integral'},{ name: '优惠券', type: 'coupon'} ],
            selectlist:[]
        }
    },
    computed: {
        ...mapGetters({
            dataState: "marketingShopListState2",
            dataItem :'RecommendGiftsItemState',
            saveState:'saveRecommendGiftsState'
        })
    },
    watch:{
        saveState(data){
            if(data.success){
                this.getNewData()
            }
            this.$message({ type: data.success ? 'success' : 'error', message: data.message })
        },
        dataState(data){
            this.CouponList = []
            data.DataArr.forEach(item => {
                this.$set(item, "isSelect" , false)
                this.CouponList.push(item)
            })
            this.pagination = {
                PN: data.PN,
                PageNumber: data.PageNumber,
                PageSize: data.PageSize,
                TotalNumber: data.TotalNumber
            }
            this.ISINVALID = data.ISINVALID
            this.ISNOTINVALID = data.ISNOTINVALID
        },
        dataItem(data){
            this.loading = false
            if(data.success){
                let info = data.data.Obj
                this.choseCouponList = data.data.CouponList
                let arr = data.data.CouponList, CouponList = []

                this.ruleForm = {
                    IsStart: info.ISSTART,
                    RShareGetType: info.RSHAREGETTYPE,
                    RVipGetType: info.RGETTYPE,
                    ShareGetType: info.SHAREGETTYPE,
                    RShareGetQty: info.RSHAREGETQTY,
                    RVipGetQty: info.RGETTYPE == 'coupon' ? '' : info.RGETQTY,
                    ShareGetQty: info.SHAREGETQTY,
                    PVipPayMoney: info.PAYMONEY,
                    BrokerageMoney: info.BROKERAGEMONEY,
                    BrokerageRemark: info.BROKERAGEREMARK
                }
            }else{
                this.$message.error(data.message)
            }
        }
    },
    methods:{
        submitSave(){
            let data = this.ruleForm
            let arr = this.choseCouponList, CouponList = []
            for(var i in arr){
                CouponList.push({'Billid' : arr[i].BILLID })
            }
            let sendData = {
                IsStart: data.IsStart ? 1 : 0,
                RShareGetType: data.RShareGetType,
                RVipGetType: data.RVipGetType,
                PVipPayMoney: data.PVipPayMoney,
                ShareGetType: data.ShareGetType,
                BrokerageMoney: data.BrokerageMoney,
                BrokerageRemark: data.BrokerageRemark,
                RShareGetQty: data.RShareGetQty,
                RVipGetQty: data.RVipGetType == 'coupon' ? JSON.stringify(CouponList) : data.RVipGetQty,
                ShareGetQty: data.ShareGetQty
            }
            this.$store.dispatch('saveRGiftsSet', sendData)
        },
        selectListCont(idx,items) {
            this.CouponList[idx].isSelect = !this.CouponList[idx].isSelect;
            this.selectlist = this.CouponList.filter((item) => {
                return item.isSelect != false
            })
        },
        handlePageChange: function(currentPage) {
            this.$store.dispatch('getMarketingShopList2',  { IsValid : this.activeName == 'first' ? 0 : 1 , PN:  parseInt(currentPage) })
        },
        selectCoupont(activeName){
            this.$store.dispatch("getMarketingShopList2", { IsValid : activeName == 'first' ? 0 : 1 , PN: 1})
        },
        selectDelete(item1, idx){
            this.choseCouponList.forEach(item => {
                if(item.BILLID==item1.BILLID){
                    this.choseCouponList.splice(idx,1);
                }
            })

            this.selectList = this.choseCouponList
        },
        curSelectState(state){
            if(state == 'money'){
                this.title = '余额'
                this.unitName = '元'
            }else if(state == 'integral'){
                this.title = '积分'
                this.unitName = '积分'
            }else{
                this.title = '佣金'
                this.unitName = '元'
            }
        },
        curSelect2State(state){
            if(state == 'money'){
                this.title1 = '余额'
            }else if(state == 'integral'){
                this.title1 = '积分'
            }
        },
        getNewData(){
            this.$store.dispatch('getRGiftsItem').then(()=>{
                this.loading = true
            })
        }
    },
    mounted(){
        this.getNewData()
        this.$store.dispatch("getMarketingShopList2", { IsValid : 0 , PN: 1})
    }
}
</script>

<style lang="scss" scoped >
.coupont ul li{
    float: left;
    margin-right: 20px;
    margin-top: 8px;
}
.coupont-list{
    width: 200px;
    height: 100px;
    border: solid 1px #3EA9FF;
    color: #fff;
}

.coupont-list-top{
    width: 100%;
    padding:10px 2px;
    height: 64px;
    background: #3EA9FF;
}
.coupont-list-bottom{
    height: 34px;
    width: 94%;
    padding: 0 3%;
    line-height: 35px;
    font-size: 11px;
    color: #666666;
}

.selectList{
  height: 50px;
  width: 100%;
  line-height: 50px;
  border-bottom: solid 1px #F4F6F8;
  border-top: solid 1px #F4F6F8;
}
.selectList ul li{
  float: left;
  width: 50%;
  text-align: center;
}
.select-list{
  width: 100%;
  height:360px;
  overflow: auto;
}
.select-list ul li{
    float: left;
    margin-right: 20px;
    margin-top: 10px;
}
.select-border{
  border: solid 2px #F8493B;
}
.select-list-cont{
  position: relative;
}
.select-list-bottom{
  height: 100px;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.foot-bottom{
  margin-top: 20px;
  width: 100%;
  height: 80px;
  text-align: center;
}
.foot-con{
  margin-top: 20px;
  width: 100%;
  height: 80px;
  text-align: center;
}
.titleStyle{
    border:1px solid #ccc; background:#f2f2f2; margin-left:16px; padding: 4px 10px; width:80%; float:left;border-radius: 5px
}
</style>
