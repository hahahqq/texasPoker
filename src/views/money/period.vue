<template>
<el-container>
  <el-container>
    <el-aside width="100px">
        <section style="min-width:100px;">
        <sidebarMenu :activePath="activePath" :routesList="routesList" :width="100"></sidebarMenu>
        </section>
    </el-aside>
    <el-container>
        <div class="t-botton-timescountc" style="height: 100%;" ref="elememt">
            <div class="f-botton-fs" style="height: 100%;">
                <div style="position: absolute;top: 0px;bottom: 0px;right:0px;left:100px;">
                        <el-row :gutter="24" style="height: 100%;margin-right: 0px;margin-left: 0px">
                            <el-col
                                :span="8"
                                style="height: 100%;position: relative;background: rgb(248, 248, 249);padding-right: 0px;padding-left: 0px"
                            >
                                <div class="commodityc-top">
                                    <span class="title">时段充值</span>
                                    <span class="commodityc-top-text" @click="resetData">清空页面</span>
                                </div>
                                <div style="padding-top:10px;padding-left:10px;padding-right:10px;">
                                    <dropdown
                                        @getmemberID="getmemberID"
                                        :details="Object.keys(selmember).length>0?selmember:new Object()"
                                    ></dropdown>
                                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                                        <ul id="addshopList">
                                            <li
                                                class="danpintr"
                                                v-for="(item,i) in addobjCountList"
                                                :key="i"
                                                v-if="addobjCountList.length>0"
                                            >
                                                <el-row class="timescountc_left_cont">
                                                    <div class="timescountc_left_cont-top">
                                                        <el-col :span="11" class="timescountc_left_cont-top-name">{{item.goodsname}}</el-col>
                                                        <el-col :span="11" class="timescountc_left_cont-top-price">￥{{item.Price}}</el-col>
                                                    </div>
                                                    <div class="timescountc_left_cont-bottom">
                                                        <el-col :span="20">
                                                            <div class="cateringProductMoreinfo">
                                                                <div class="validityleft inline-block">
                                                                    <span>有效期</span>
                                                                    <el-date-picker
                                                                            v-model="dateBE"
                                                                            type="daterange"
                                                                            value-format="timestamp"
                                                                            range-separator="至"
                                                                            start-placeholder="开始日期"
                                                                            end-placeholder="结束日期"
                                                                            style="width:80%;"
                                                                            size="mini"
                                                                            class="inline-block"
                                                                    ></el-date-picker>
                                                                </div>
                                                            </div>
                                                        </el-col>
                                                    </div>
                                                    <i class="el-icon-delete" @click="deleteGood(i)"></i>
                                                </el-row>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="timescountc_left_footer" ref="footer">
                                        <div v-if="addobjCountList.length>0" style="margin-bottom:12px;">
                                            <el-select class="g-public-multi-select" v-model="value" placeholder="请选择销售员" multiple style="width:100%">
                                                <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div>
                                            <el-input
                                                :rows="2"
                                                placeholder="请输入备注信息">
                                            </el-input>
                                        </div>
                                        <div class="footer_top" style="margin: 6px 0;background-color: #fff;height:60px;line-height: 60px;">
                                            <el-row>
                                                <el-col :span="3">
                                                    <span>收款</span>
                                                </el-col>
                                                <el-col :span="15">
                                                    <input class="showEit-input1" placeholder="输入收款金额" v-model="AddMoney"/>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-button style="width:95%;" type="danger" @click="co_reckoning()" size="medium">收款</el-button>
                                                </el-col>
                                            </el-row>
                                        </div>
                                        <!-- <div>
                                            <el-row class="footer_top-cont">
                                                <el-col :span="4" style="text-align:center">
                                                    <span>收款</span>
                                                </el-col>
                                                <el-col :span="8" style="background: #fff;height:40px;">
                                                    <input class="showEit-input1" placeholder="输入收款金额" v-model="AddMoney"/>
                                                </el-col>
                                                <el-col :span="11" style="text-align:right">
                                                    <el-button type="danger" @click="co_reckoning()" style="width:120px;" size="medium">收款</el-button>
                                                </el-col>
                                            </el-row>
                                        </div> -->
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="16" style="padding-left:0px;padding-right: 0px;">
                                <div class="commodity-right">
                                    <div class="search_sock">
                                        <el-row>
                                            <el-col :span="16" class="member-header">
                                                <div class="search_sock-input">
                                                    <el-input
                                                        type="default"
                                                        v-model="searchText"
                                                        placeholder="输入商品名称/编码"
                                                        size="small"
                                                        style="width:100%;margin-left:5%;margin-right:5%;"
                                                    ></el-input>
                                                </div>
                                            </el-col>
                                            <el-col :span="8" class="shop">
                                                <span class="name">{{shopInfo.SHOPNAME}}</span>
                                                <span class="">
                                                    <el-popover placement="bottom" width="140" trigger="hover" popper-class="no-padding">
                                                        <el-button style="border: none!important;"  @click="changeShop()" class="full-width" icon='icon-exchange'>&nbsp;&nbsp;切换店铺</el-button>
                                                        <el-button style="border: none!important;"  class="full-width no-m-left border-top" icon='icon-user'>&nbsp;&nbsp; 账号信息</el-button>
                                                        <el-button style="border: none!important;"  @click="logout()" class="full-width no-m-left border-top" icon='icon-signout'>&nbsp;&nbsp;退出账号</el-button>
                                                        <a slot="reference" class="hitem">
                                                            <i class='icon-reorder'></i>
                                                        </a>
                                                    </el-popover>
                                                </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div class="commodity-right-good-list">
                                        <div class="classification_List">
                                            <div class="classification_List" ref="fenleiWidthsock">
                                                <div class="swiper-container">
                                                    <ul
                                                        class="swiper-wrapper"
                                                        id="activityList"
                                                        v-if="goodType.length>0"
                                                    >
                                                        <li
                                                            class="swiper-slide"
                                                            v-for="(item,index) in goodType"
                                                            :key="index"
                                                            @click="ck_commoditycflList(item.ID,index)"
                                                            :class="{'selected':index==current}"
                                                        >{{item.NAME}}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="commodityc_rightsock" :style="{height:tableHeight + 'px'}">
                                            <div class="tablelist scrollstyle font-12" v-loading="loading" element-loading-text="拼命加载中">
                                                <el-row :gutter="20" class="timescountc_right">
                                                    <el-col
                                                        :span="6"
                                                        style="margin-bottom:10px;"
                                                        v-for="(item,i) in pagelist"
                                                        :key="i"
                                                        v-if="item.GIFTINTEGRAL==0||item.GIFTINTEGRAL>0"
                                                    >
                                                        <div class="tablelcenter" @click="addcommodityc(item)">
                                                                <div class="img-box">
                                                                <div class="img">
                                                                <div>
                                                                    <img :src="item.showgoodsimg" onerror="this.src='static/images/shopzj.png'" style="width:60px;height:60px;">
                                                                </div>
                                                                <div style="margin-left:7px;">
                                                                    <div style="height:30px;width:110px;line-height:35px;text-overflow: ellipsis;overflow:hidden;white-space:nowrap;"> {{item.NAME}}</div>
                                                                    <div style="height:30px;width:110px;line-height:25px;">
                                                                        <el-row>
                                                                            <el-col :span="10">
                                                                                <span class="font-600 text-theme2" style="width:60%;">
                                                                                    <span>&yen;{{item.DISPRICE == undefined ? item.PRICE : item.DISPRICE}}</span>
                                                                                </span>
                                                                            </el-col>
                                                                            <el-col :span="14">
                                                                                <span style="color:#A3A3A3;">
                                                                                    <i
                                                                                        style="color: rgb(25, 23, 23);"
                                                                                    >库</i>
                                                                                        <!-- <el-tooltip  class="item" effect="dark" :content="item.STOCKQTY" placement="right"> -->
                                                                                                 <i>{{item.STOCKQTY}}</i>
                                                                                        <!-- </el-tooltip> -->
                                                                                </span>
                                                                            </el-col>
                                                                        </el-row>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </div>
                                        <div class="men_porioven pull-right" style="margin-top:-10px;">
                                            <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
                                                <el-pagination
                                                    background
                                                    @size-change="handlePageChange"
                                                    @current-change="handlePageChange"
                                                    :current-page.sync="pagination.PN"
                                                    :page-size="pagination.PageSize"
                                                    layout="total,prev, pager, next, jumper"
                                                    :total="pagination.TotalNumber"
                                                    class="text-center"
                                                ></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                </div>
            </div>
            <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="700px">
                <recharge
                    @closeModalrecharge="showRecharge=false"
                    :totalprice="{ price:AddMoney,discount:0 ,title:'充值日期'}"
                    :isselectvip="VipId"
                    @CashRecharge="CashRecharge"
                    :rechargestatus="5"
                    ref="SurveyForm"
                ></recharge>
            </el-dialog>
            <el-dialog title="请选择门店" :visible.sync="isShowShop" width="300px" :before-close="handleClose">
                <div class='shopListClass'>
                    <ul>
                        <li v-for='(item, index) in theshopList' :key="index" @click="setShop(item)">
                            {{item.SHOPNAME}}
                        </li>
                    </ul>
                </div>
            </el-dialog>
        </div>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

import royaltySel from "@/components/selected/selroyalty2.vue";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
let _ = require("lodash");
import MIXINS_CHECKOUT from "@/mixins/checkout";
import MIXINS_MONEY from "@/mixins/money";
import MIXINS_CLEAR from "@/mixins/clearAllData";
export default {
    mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER,MIXINS_MONEY.MONEY_MENU,MIXINS_CLEAR.LOGOUT],
    data() {
        return {
            AddMoney:'',
            goodType:"",
            options: [],
            value: '',
            timescountrstatus: false,
            getgoodsIMGURL: "",
            current: 0,
            index: "ok",
            searchText: "",
            objCount: [],
            addobjCountList: [],
            total: 0,
            TotalPrice: 0,
            dateBE: [
                new Date().getTime(),
                new Date(this.getCustomDay(30)).getTime(),
            ],
            checkedreceipt: false,
            checkedmessage: false,
            pagelist: [],
            loading: true,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 0
            },
            pageData: {
                PN: 1,
                Filter: "",
                Status: 1,
                Mode: 1,
                TypeID: "", //商品类别ID
                DescType: 0
            },
            showyjemployee: false,
            showRecharge: false,
            shopitemList: {},
            datalistval: {},
            showTishi: "",
            empList: [],
            SaleEmpMoneyArray: [],
            dialogFormVisible: false,
            showRecharge: false,
            otherDate: "",
            selectmouthTime_data: {},
            pageItemData: { EmpAddRate: 0, TotalPrice: 0, isShow: false },
            royaltyData: {
                data: {},
                default: []
            },
            shopInfo: getHomeData().shop,
            isShowShop:false,
            theshopList: [],
            activePath: "",
            shopName:getUserInfo().CompanyName,
            tableHeight: document.body.clientHeight - 175,
        };
    },
    computed: {
        ...mapGetters({
            memberState: "memberState",
            employeeList: "employeeList",
            commoditycflListState: "commoditycflListState",
            commoditycflList: "commoditycflList",
            dataList: "goodsListNew",
            dataListState: "goodsListNewState",
            periodDate: "periodDate",
            royaltyState: "storagevaluerroyaltyState",
            shopList: "shopList",
            shopListState:'shopListState'
        })
    },
    created(){  //生命周期里接收参数
        let getInfo = getUserInfo();
        this.isneedsaler=getInfo.CompanyConfig.ISNEEDSALER
    },
    watch: {
        commoditycflList(data) {
            let good=[]
            for(var i in data){
                good.push(data[i])
            }
            good.unshift({
                    ID: "0",
                    NAME: "全部",
                    })
            this.goodType=good;
            this.fenleiscrollwidth();
        },
        memberState(data) {
            if (data.success) {
                this.objCount = data.data.objCount;
            }
        },
        royaltyState(data) {
            if (data.success&&this.loading) {
                this.dialogFormVisible = true;
                setTimeout(() => {
                    this.pageItemData = {
                        EmpAddRate: data.data.EmpAddRate,
                        TotalPrice: this.TotalPrice,
                        isShow: true
                    };
                }, 200);
            }
            this.loading = false;
        },
        dataListState(data) {
            this.loading = false;
            this.isFilter = false;
            this.pagelist = [...this.dataList];
            this.getgoodsIMGURL = GOODS_IMGURL;
            for (let i = 0; i < this.pagelist.length; i++) {
                this.pagelist[i].showgoodsimg =
                    this.getgoodsIMGURL + this.pagelist[i].ID + ".png";
            }
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                };
            }
        },
        periodDate(data) {
            console.log("data时段充值成功")
            console.log(data)
            if (this.timescountrstatus) {
                if (data.success) {
                    this.$message({
                        message: "计次充值成功",
                        type: "success"
                    });
                    this.setmealrPrice = "";
                    this.setmealrName = "";
                    this.rechargecount = "";
                    this.writetime = "";
                    this.GoodsPackId = "";
                    this.rechargeGoodsList = [];
                    this.timescountrstatus = false;
                    this.resetData();
                    let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
                    if (this.$store.state.recharge.isPrintsatus) {
                        getDayindate("210020150", data.data.BillId, 3, qresurl);
                    }
                } else {
                    this.$message(data.message);
                    this.timescountrstatus = false;
                }
            }
        },
        employeeList(data) {
            this.options=[]
            let employeemen=data;
            for(var i in employeemen){
                let Obj={
                    value:employeemen[i].ID,
                    label:employeemen[i].NAME
                    }
                    this.options.push(Obj)
            }
        },
    },
    methods: {
        handleClose(done) {
            this.isShowShop = false;
        },
        logout: function() { //退出登录
            var _this = this;
            this.$confirm("确认退出吗?", "提示").then(() => {
                _this.$store.dispatch("toLogOut").then(() => {
                    _this.clearAllData();
                    _this.$router.push("/login");
                })
            }).catch(() => {
                console.log("logout");
            })
        },
        setShop(item) { //切换店铺
            this.$store.dispatch("choosingShop", item).then(() => {
                this.isShowShop = false;
                this.clearAllData();
                this.defaultData();
                console.log("11111111111111111111111")
                this.$router.push({
                    path: "/home"
                })
            })
        },
        defaultData() {
            let homeData = getHomeData();
            if (homeData.shop) {
                this.shopInfo = Object.assign({}, homeData.shop);
            }
            this.UserName = getUserInfo().UserName;
            if (this.shopList.length == 0) {
                this.$store.dispatch("getShopList")
            }
        },
        changeShop() {
            let userInfo = getUserInfo();
            if (userInfo.CODE2 == "boss") {
                this.theshopList = [...this.shopList];
            } else {
                this.theshopList = [];
                for (let i = 0; i < userInfo.ShopList.length; i++) {
                    if (userInfo.ShopList[i].ISPURVIEW == 1) {
                    this.theshopList.push({
                        ID : userInfo.ShopList[i].SHOPID,
                        NAME : userInfo.ShopList[i].SHOPNAME
                    });
                    }
                }
            }
            this.isShowShop = true;
        },
        //商品商品
        seletGoodsType(data){
            if(data=="reduce"){
                 if(this.current != 0){
                     this.current--;
                 }
            }else{
                if(this.current < this.goodType.length-1){
                    this.current++;
                }
            }
                for(var i in this.goodType){
                    if(this.current==i){
                        this.pageData.TypeID =this.current==0 ? "" : this.goodType[i].ID;
                        this.pageData.PN = 1;
                        this.getNewData();
                    }
                }
        },
        //触发分类
        ck_commoditycflList(flID, index) {
            this.current = index;
            if(this.current==0){
            this.pageData.PN = 1;
            this.pageData.TypeID ="";
            this.getNewData();
            }else{
            this.pageData.TypeID = flID;
            this.pageData.PN = 1;
            this.getNewData();
            }
        },
        deleteGood(event){
            this.addobjCountList.splice(event, 1);
        },
        clickme: function() {
            var that = this;
            that.$nextTick(function() {
                var mySwiper = new Swiper(".Tswiper-container", {
                    slidesPerView: 6,
                    paginationClickable: !0,
                    spaceBetween: 4,
                    freeMode: !0
                });
            });
            this.$store.dispatch("getGoodsList", {
                Status: 1,
                Mode: 1,
                Filter: "",
                PN: 1
            });
        },
        getmemberDetail(item) {
            this.$store.dispatch("getMemberItem", item).then(() => {});
        },
        getmemberID(id, data) {
            this.VipId = id;
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: data
            });
        },
        getNewData() {
            this.$store.dispatch("getGoodsListNew", this.pageData).then(() => {
                this.loading = true;
            });
        },
        handlePageChange: function(currentPage) {
            if (this.pageData.PN == currentPage || this.loading) {
                return;
            }
            this.pageData.PN = parseInt(currentPage);
            this.getNewData();
        },
        searchfun: _.debounce(function() {
            this.searchfun2(0);
        }, 1000),
        searchfun2(type) {
            if (type == 1 && !this.searchText) {
                return;
            }
            this.pageData.Filter = this.searchText;
            this.getNewData();
        },
        //选择商品
        addcommodityc(item) {
            this.addobjCountList=[];
            console.log(item)
            this.setcommonHeight();
            let count = 1;
            if (this.addobjCountList.length > 0) {
                for (let i = 0; i < this.addobjCountList.length; i++) {
                    if (this.addobjCountList[i].GoodsId == item.ID) {
                        this.addobjCountList[i].Qty =
                            this.addobjCountList[i].Qty + 1;
                        break;
                    } else {
                        if (i + 1 < this.addobjCountList.length) {
                            continue;
                        } else {
                            this.addobjCountList.push({
                                goodsname: item.NAME,
                                Qty: count,
                                GoodsId: item.ID,
                                retailprice: item.PRICE,
                                Discount: 1,
                                Price: item.PRICE,
                                itemObj: item,
                                statusactive: 3,
                                IsInvalid: 0,
                                InvalidDate: "",
                                showInvalidDate: "永久有效",
                                IsInvalid2: item.IsInvalid2,
                                dateBE: this.dateBE,
                            });
                            break;
                        }
                    }
                }
            } else {
                this.addobjCountList=[];
                console.log(this.addobjCountList)
                console.log("2")
                this.addobjCountList.push({
                    goodsname: item.NAME,
                    Qty: count,
                    GoodsId: item.ID,
                    retailprice: item.PRICE,
                    Discount: 1,
                    Price: item.PRICE,
                    itemObj: item,
                    statusactive: 3,
                    IsInvalid: 0,
                    InvalidDate: "",
                    showInvalidDate: "永久有效",
                    IsInvalid2: false,
                    dateBE:""
                });
            }
        },
        //清空页面数据
        resetData() {
            this.VipId = "";
            this.datalistval = {};
            this.addobjCountList = [];
            this.total = "";
            this.TotalPrice = "";
            this.value="";
            this.Remark="";
            this.AddMoney="";
            this.SaleEmpMoneyArray = [];
            this.royaltyData = {
                data: {},
                default: []
            };
            this.$store
                .dispatch("selectingMember", {
                    isArr: false,
                    data: new Object()
                })
                .then(() => {
                    this.VipId = "";
                });
        },
        // 充值
        co_reckoning() {
            if(this.isneedsaler==true){
                if(this.value.length>0){
                }else{
                    this.$message("请选择销售员");
                    return;
                }
            }
            if (this.addobjCountList.length == 0) {
                this.$message("请选择商品");
                return;
            }
            if (this.AddMoney == "") {
                this.$message("请输入收款金额");
                return;
            }
            nscreenexCodeFun(4, String(this.TotalPrice));
            this.showRecharge = true;
        },
        // 确认支付
        CashRecharge(data) {
            this.showRecharge = false;
            let dateBE  = this.addobjCountList[0].dateBE
            let GoodsID = this.addobjCountList[0].GoodsId;
            let str = ''
            for(let i in this.value){
                str += this.value[i] + ','
            }
            if(str.length>0){  //去掉最后一个逗号
                str=str.substring(0,str.length-1)
            }

            let otherdata = {
                GoodsID: GoodsID,
                SaleEmpList: str,
                VipId: this.VipId,
                Remark: this.Remark,
                GoodsPackId: "",
                dateBE:this.dateBE
            };
            let AllsendData = Object.assign({}, otherdata, data);

            AllsendData.PayTypeID = AllsendData.PaytypeId;
            delete AllsendData.PaytypeId;

            this.$store
                .dispatch("getPeriod", AllsendData)
                .then(() => {
                    this.timescountrstatus = true;
                });
        },
        setcommonHeight() {
            var elememtheight = this.$refs.elememt.offsetHeight;
            var footerheight = this.$refs.footer.offsetHeight;
            this.$refs.addsockheight.style.height =
                elememtheight - footerheight - 96 + "px";
        },
        setfenleiWidth() {
            let elefenleiWidthsock = this.$refs.fenleiWidthsock.offsetWidth;
            this.$refs.swipercontainersock.style.width =
                elefenleiWidthsock - 179 + "px";
        },
        fenleiscrollwidth() {
            this.$nextTick(function() {
                var mySwiper = new Swiper(".swiper-container", {
                    slidesPerView: 12,
                    paginationClickable: !0,
                    spaceBetween: 4,
                    freeMode: !0
                });
            });
        }
    },
    components: {
        recharge,
        royaltySel
    },
    beforeCreate() {
        let list = this.$store.state.commodityc.commoditycflList;
        if (list.length == 0) {
            this.$store.dispatch("getcommoditycflList", {}).then(() => {});
        }
        this.$store.dispatch("getGoodsListNew", {
            Status: 1,
            Mode: -1,
            Filter: "",
            PN: 1,
            TypeID: ''
        });
        let list1 = this.$store.state.employee.employeeList;
        if (list1.length == 0) {
            this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID }).then(() => {
                console.log(this.$store.state.employee.employeeList);
            });
        }
        let list2 = this.$store.state.commodityc.commoditycflDiscountList;
        if (list2.length == 0) {
            this.$store.dispatch("getcommoditycDiscountList", {}).then(() => {
            });
        }
    },
    mounted() {
        this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID }).then(() => {
            console.log(this.$store.state.employee.employeeList);
        });
        this.$store.dispatch("getcommoditycDiscountList", {}).then(() => {
        });
        this.$store.dispatch("getcommoditycflList", {}).then(() => {});
        // this.setfenleiWidth();
        this.fenleiscrollwidth();
    }
};
</script>
<style scoped>
.t-botton-timescountc .el-tag {
    line-height: 20px;
    height: inherit;
    padding: 0 5px;
    margin-left: 5px;
}

.t-botton-timescountc .el-tag.selected {
    background: #fb789a;
    color: #fff;
}

.classification_List {
    overflow: hidden;
    /* border-bottom: 2px solid #ccc; */
}

.classification_List ul li {
    float: left;
    width: 58px;
    text-align: center;
    cursor: pointer;
    line-height: 38px;
    margin-right: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #333333;
}

.classification_List ul li.selected {
    color: #2589FF;
    border-bottom: 2px solid #2589FF;
}

.commodityc_rightsock {
    width: 100%;
    height: 660px;
    /* background: #2589FF; */
    margin-top: 12px;
}

.employee_ms .el-form-item__content {
    width: 70%;
}

.f-botton-fs .el-form-item__label {
    text-align: left !important;
}

.f-botton-fs .fastc_top {
    margin-top: 50px;
}

.f-botton-fssock .el-dialog__body {
    padding: 5px 20px;
}

.employeetitle {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
    overflow: hidden;
    color: #130606;
    text-align: center;
}

.timescountc_left ul.productNav {
    /*padding: 0 12px;*/
    overflow: hidden;
    height: 26px;
    line-height: 26px;
    color: #795548;
    background-color: rgba(251, 120, 154, 0.3294117);
}

.timescountc_left ul.productNav li {
    float: left;
}

.timescountc_left ul#addshopList li {
    margin-top: 6px;
    width: 100%;
    overflow: hidden;
    /* padding: 4px 0; */
    background: #fff;
    height: 100px;

}
.timescountc_left_cont{
    /* display: flex;
    align-items: center; */
    position: relative;
    width: 100%;
    height: 100px;
}
.timescountc_left_cont-top{
    height: 45px;
    line-height: 40px;
    width: 100%;
    margin-left: 20px;
}
.timescountc_left_cont-bottom{
    height: 50px;
    line-height: 40px;
    width: 100%;
    margin-left: 20px;
}
.el-icon-delete{
    position: absolute;
    right: 15px;
    bottom: 20px;
    cursor: pointer;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo {
    overflow: hidden;
    width: 100%;
    float: left;
    color: #9e9e9e;
    font-size: 12px;
    margin-top: 5px;
    cursor: pointer;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo .validityleft {
    line-height: 25px;
}

.timescountc_left
    ul#addshopList
    li
    .cateringProductMoreinfo
    .validityleft
    span:last-child {
    border-bottom: 1px solid red;
    padding: 0 12px;
    padding-bottom: 2px;
}

.timescountc_left ul#addshopList .cateringProductNamebox {
    width: 16%;
    float: left;
}

.timescountc_left_footer {
    position: absolute;
    bottom: 0px;
    left: 10px;
    right: 10px;
    /* background: #fff; */
}

/*模板样式*/
.timescountc_right .tablelcenter {
    height: 60px;
    overflow: hidden;
    position: relative;
    border: 1px solid #E3E3E3;
    cursor: pointer;
}
.timescount-top{
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
}
.showEit-input1{
    border: none !important;
    margin-left: 5px;
}
.footer_top-cont{
    height: 40px;
    line-height: 40px;
    /* background: #fff; */
    margin-top: 20px;
}
.timescountc_left_cont-top-name{
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    color:rgba(51,51,51,1);
    margin-top: 5px;
}
.timescountc_left_cont-top-price{
    text-align: right;
    margin-left: 3px;
    font-size:14px;
    font-family:HelveticaCyr Upright;
    font-weight:bold;
    color:rgba(255,0,0,1);
     margin-top: 5px;
}
.swiper-container{
    display: flex;
    align-items: center;
    background: #fff;
}
.swiper-container-left{
    width: 20px;
    text-align: right;
    background: #fff;
    z-index: 99999;
}
.swiper-container-right{
    width: 20px;
    text-align: left;
    z-index: 99999;
}
.img-box{
    width: 100%;
    height: 60px;
    overflow: hidden;

}
.img{
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
}
.img:hover{
    transform: scale(1.03,1.03);
}
.timescountc_left_footer >>>.el-input__inner{
    border: 1px solid #fff!important;
    background: #fff;
    font-size: 12px;
    color: #D2D6D6;
}
input::-webkit-input-placeholder{
    color: #C0C4CC;
    font-size: 12px;
}
.commodity-right{
    position: relative;
    width: 100%;
    height: 100%;
}
.search_sock{
    height: 50px;
    line-height: 50px;
    background: #fff;
    width: 100%;
    border-left: solid 1px #EBEDF0;
    border-bottom: solid 1px #EBEDF0;
}
.search_sock-input{
    width: 100%;
}
.search_sock-shop{
    width: 50%;
    text-align: right;
}
.commodity-right-good-list{
    padding-top:10px;
    width: 100%;
    padding-right: 10px;
}
.shop{
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  /* background: #fff; */
}
.shop .name{
    margin-right: 8px;
}
.icon-reorder{
    color: #2589FF;
    cursor: pointer;
}
</style>
