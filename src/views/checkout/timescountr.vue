<template>
    <div class="t-botton-timescountc" style="height: 100%;" ref="elememt">
        <!-- 计次充值 -->
        <div class="f-botton-fs" style="height: 100%;">
            <el-row :gutter="24" style="height: 100%;">
                <el-col
                    :span="8"
                    style="border-right: 10px solid rgba(234, 226, 213, 1);height: 100%;position: relative;"
                >
                    <dropdown
                        @getmemberID="getmemberID"
                        :details="Object.keys(selmember).length>0?selmember:new Object()"
                    ></dropdown>
                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                        <ul class="productNav">
                            <li style="width: 30%;">
                                <span>品名</span>
                            </li>
                            <li style="width: 15%;">
                                <span>单价</span>
                            </li>
                            <li style="width: 20%;" class="text-center">
                                <span>数量</span>
                            </li>
                            <li style="width: 15%;">
                                <span>实销价</span>
                            </li>
                            <li style="width: 20%;">
                                <span>小计</span>
                            </li>
                        </ul>
                        <ul id="addshopList">
                            <li
                                class="danpintr"
                                v-for="(item,i) in addobjCountList"
                                :key="i"
                                v-if="addobjCountList.length>0"
                            >
                                <div class="cateringProductNamebox" style="width: 30%;">
                                    <span>{{item.goodsname}}</span>
                                </div>
                                <div class="cateringProductNamebox" style="width: 15%;">
                                    <span>{{item.retailprice}}</span>
                                </div>
                                <div class="cateringProductNamebox text-center" style="width: 20%;">
                                    <div v-if="item.IsInvalid2" style="min-height:20px;">不限</div>
                                    <div class="sumchange" v-else>
                                        <i
                                            class="el-icon-remove jiajianbtn"
                                            @click="addjiajianhao(1,item.calccount,item.maxcalccount,item.GoodsId)"
                                        ></i>
                                        <span class="getqty" v-on:click="changeQty(i)">{{item.Qty}}</span>
                                        <i
                                            class="el-icon-circle-plus jiajianbtn"
                                            @click="addjiajianhao(2,item.calccount,item.maxcalccount,item.GoodsId)"
                                        ></i>
                                    </div>
                                </div>
                                <div
                                    class="cateringProductNamebox"
                                    style="width: 15%;cursor: pointer;"
                                    @click="changeDP({GoodsId:item.GoodsId,label:'实销价',value:item.Price,dpstatus:2})"
                                >
                                    <span>{{item.Price}}</span>
                                </div>
                                <div class="cateringProductNamebox" style="width: 20%;">
                                    <span>{{(item.Price*item.Qty).toFixed(2)}}</span>
                                </div>
                                <div class="cateringProductMoreinfo">
                                    <div class="validityleft inline-block">
                                        <span>有效期</span>
                                        <span style="padding:0px;">{{item.showInvalidDate}}</span>
                                    </div>
                                    <div
                                        class="validityright inline-block pull-right"
                                        style="width:240px;"
                                    >
                                        <span
                                            class="el-tag"
                                            v-for="(itemd,index) in selectTimedata"
                                            :key="index"
                                            :class="{'selected':index==item.statusactive}"
                                            @click="selectmouthTime(i,index,itemd.mouthday)"
                                        >{{itemd.name}}</span>
                                        <el-date-picker
                                            v-model="otherDate"
                                            type="date"
                                            placeholder="选择日期"
                                            style="wdith:1px;height:0px;"
                                            class="inline-block overflow-hidden pull-right"
                                            ref="otherDate"
                                            @change="selectmouthTime2"
                                        ></el-date-picker>
                                    </div>
                                    <div class="text-left clearfix">
                                        <el-checkbox
                                            v-model="item.IsInvalid2"
                                            size="mini"
                                            class="inline-block"
                                        >
                                            <span v-text="item.IsInvalid2?'不限次数':'限制次数'"></span>
                                        </el-checkbox>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                        <div class="footer_top" style="margin: 12px 0;">
                            <span style="width:36%;    display: inline-block;">合计</span>
                            <span style="display: inline-block;">{{total}}</span>
                            <span
                                class="text-center pull-right"
                                style="display: inline-block;"
                            >{{TotalPrice}}</span>
                        </div>
                        <div class="row-flex flex-items-center marginTB-xs">
                            <span style="min-width:70px;">业绩员工</span>
                            <a @click="selroyaltyFun()" class="full-width bg-gw block pointer font-12 el-input__inner">
                                <span
                                    v-for="(item,i) in royaltyData.default"
                                    :key="i"
                                    v-text="(i>0?'，':'')+item.Name+'：'+item.Money+'元'"
                                ></span>
                                <span v-if="royaltyData.default.length==0">请选择业绩员工</span>
                            </a>
                        </div>
                        <div class="f_commodityc-left">
                            <el-button type="info" @click="resetData()">清空</el-button>
                            <div class="pull-right">
                                <el-button type="danger" @click="co_reckoning()">充值</el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="classification_List">
                        <div class="Tswiper-container">
                            <ul class="swiper-wrapper" id="activityList">
                                <li
                                    class="swiper-slide"
                                    @click="ck_commoditycflList('','ok')"
                                    :class="{'selected':index==current}"
                                >全部</li>
                                <li
                                    class="swiper-slide"
                                    v-for="(item,index) in commoditycflList"
                                    :key="index"
                                    @click="ck_commoditycflList(item.ID,index)"
                                    :class="{'selected':index==current}"
                                >{{item.NAME}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="commodityc_rightsock">
                        <div class="tablelist scrollstyle" v-loading="loading">
                            <el-row :gutter="20" class="timescountc_right">
                                <el-col
                                    :span="6"
                                    style="margin-bottom:10px;"
                                    v-for="(item,i) in pagelist"
                                    :key="i"
                                >
                                    <div class="tablelcenter" @click="addcommodityc(item)">
                                        <div class="menu-img">
                                            <img
                                                :src="item.showgoodsimg"
                                                width="55"
                                                height="55"
                                                onerror="this.src='static/images/shopmore.png'"
                                            />
                                            <div class="titlename">
                                                <p
                                                    data-icon="10"
                                                    style="font-size: 12px;"
                                                >{{item.NAME}}</p>
                                                <strong
                                                    class="com_color"
                                                    style="position: absolute;bottom: 8px;"
                                                >￥{{item.PRICE}}</strong>
                                            </div>
                                        </div>
                                        <div class="menu-txt com_color" v-if="item.GOODSMODE==0">
                                            <strong style="font-size: 12px;">
                                                <i
                                                    style="background: #ff5722;color: #fff;padding: 0 3px;border-radius: 6px;font-size: 12px;"
                                                >库</i>
                                                {{item.STOCKQTY}}
                                            </strong>
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
                                layout="prev, pager, next, jumper"
                                :total="pagination.TotalNumber"
                                class="text-center"
                            ></el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 选择业绩员工 -->
        <el-dialog title="选择业绩员工" :visible.sync="dialogFormVisible">
            <royalty-sel
                @closeModal="dialogFormVisible=false"
                @resultArr="selRoyalty_Fun"
                :pageData="pageItemData"
            >
                <slot>
                    <div class="employeetitle">
                        <span>充值金额：</span>
                        <span class="com_color">{{pageItemData.TotalPrice}}</span>
                        <span>元，按金额的</span>
                        <span class="com_color" v-text="(pageItemData.EmpAddRate * 100) + '%'"></span>
                        <span>提成，员工可的</span>
                        <span
                            class="com_color"
                            v-text="pageItemData.TotalPrice * pageItemData.EmpAddRate"
                        ></span>
                        <span>元提成</span>
                    </div>
                </slot>
            </royalty-sel>
        </el-dialog>

        <!-- 计次充值 充值界面 -->
        <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="700px">
            <recharge
                @closeModalrecharge="showRecharge=false"
                :totalprice="{ price:TotalPrice,discount:0 }"
                :isselectvip="VipId"
                @CashRecharge="CashRecharge"
                :rechargestatus="5"
                ref="SurveyForm"
            ></recharge>
        </el-dialog>
    </div>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";
import { mapState, mapGetters } from "vuex";

import royaltySel from "@/components/selected/selroyalty2.vue";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
let _ = require("lodash");
import MIXINS_CHECKOUT from "@/mixins/checkout";
export default {
    mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER],
    data() {
        return {
            timescountrstatus: false,
            getgoodsIMGURL: "",
            current: "ok",
            index: "ok",
            searchText: "",
            objCount: [],
            addobjCountList: [],
            total: 0,
            TotalPrice: 0,
            checkedreceipt: false,
            checkedmessage: false,
            pagelist: [],
            selectTimedata: [
                {
                    name: "1个月",
                    mouthday: 1
                },
                {
                    name: "6个月",
                    mouthday: 6
                },
                {
                    name: "1年",
                    mouthday: 12
                },
                {
                    name: "永久有效",
                    mouthday: "ok"
                },
                {
                    name: "其它",
                    mouthday: 24
                }
            ],
            loading: false,
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
        };
    },
    computed: {
        ...mapGetters({
            memberState: "memberState",
            employeeList: "employeeList",
            commoditycflListState: "commoditycflListState",
            commoditycflList: "commoditycflList",
            dataList: "goodsList",
            dataListStateTitle: "goodsListState",
            setmealrtimesrechargeState: "setmealrtimesrechargeState",
            royaltyState: "storagevaluerroyaltyState"
        })
    },
    watch: {
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
        dataListStateTitle(data) {
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
        setmealrtimesrechargeState(data) {
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
                        getDayindate("601020305", data.data.BillId, 5, qresurl);
                    }
                } else {
                    this.$message(data.message);
                    this.timescountrstatus = false;
                }
            }
        }
    },
    methods: {
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
        ck_commoditycflList(flID, index) {
            //触发分类
            this.current = index;
            this.pageData.TypeID = flID;
            this.pageData.PN = 1;
            this.getNewData();
        },
        selectmouthTime(i, index, mouthday) {
            let item = this.addobjCountList[i];

            if (index == 4) {
                console.log(this.$refs.otherDate[i]);
                this.$refs.otherDate[i].showPicker();
                this.selectmouthTime_data = { i, index };
                return;
            }
            if (mouthday == "ok") {
                item.IsInvalid = 0;
                item.InvalidDate = "9999999999999";
                item.showInvalidDate = "永久有效";
            } else {
                let InvalidDate = this.getMouthorYearDay(mouthday);
                item.IsInvalid = 1;
                item.InvalidDate = this.getTimeStampstatuesOutput(InvalidDate);
                item.showInvalidDate = this.filterTimeOut(
                    new Date(InvalidDate)
                );
            }

            item.statusactive = index;
            console.log(item);
            this.addobjCountList = [...this.addobjCountList];
        },
        selectmouthTime2(v) {
            let item = this.addobjCountList[this.selectmouthTime_data.i];
            item.IsInvalid = 1;
            item.InvalidDate = v.getTime();
            item.showInvalidDate = this.filterTimeOut(v);

            item.statusactive = this.selectmouthTime_data.index;
            this.addobjCountList = [...this.addobjCountList];
            this.selectmouthTime_data = {};
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
            this.$store.dispatch("getGoodsList", this.pageData).then(() => {
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

        addcommodityc(item) {
            console.log(item);
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
                                IsInvalid2: item.IsInvalid2
                            });
                            break;
                        }
                    }
                }
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
                    IsInvalid2: false
                });
            }
            this.dealTotalData();
        },
        dealTotalData() {
            this.total = 0;
            this.TotalPrice = 0;
            for (let i in this.addobjCountList) {
                this.total += this.addobjCountList[i].Qty;
                this.TotalPrice +=
                    this.addobjCountList[i].Price * this.addobjCountList[i].Qty;
            }
        },
        changeQty(i) {
            this.$prompt("请输入数值", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "Number",
                inputPattern: /^[0-9]*[1-9][0-9]*$/,
                inputErrorMessage: "数值格式不正确"
            })
                .then(({ value }) => {
                    this.addobjCountList[i].Qty = value;
                    this.dealTotalData();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入"
                    });
                });
        },
        addjiajianhao(status, calccount, maxcalccount, GoodsId) {
            for (let i = 0; i < this.addobjCountList.length; i++) {
                if (this.addobjCountList[i].GoodsId == GoodsId) {
                    if (status == 1) {
                        this.addobjCountList[i].Qty =
                            this.addobjCountList[i].Qty - 1;
                        if (this.addobjCountList[i].Qty == 0) {
                            this.addobjCountList.splice(i, 1);
                        }
                    } else {
                        this.addobjCountList[i].Qty =
                            this.addobjCountList[i].Qty + 1;
                    }
                    this.dealTotalData();
                    break;
                } else {
                    if (i + 1 < this.addobjCountList.length) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        },
        resetData() {
            this.VipId = "";
            this.datalistval = {};
            this.addobjCountList = [];
            this.total = "";
            this.TotalPrice = "";
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
        Receiveyjemployee(item1, item2, GoodsId) {
            this.showyjemployee = false;
            for (let i = 0; i < this.addobjCountList.length; i++) {
                if (this.addobjCountList[i].GoodsId == GoodsId) {
                    this.addobjCountList[i].showempremark = item2.join(",");
                    let newObj = {};
                    if (item1.length > 1) {
                        for (var k = 0; k < item1.length; k++) {
                            Object.assign(newObj, item1[k]);
                        }
                    } else {
                        Object.assign(newObj, item1[0]);
                    }
                    Object.assign(this.addobjCountList[i], newObj);
                    break;
                } else {
                    if (i + 1 < this.addobjCountList.length) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        },
        co_reckoning() {
            // 充值
            if (this.VipId == "") {
                this.$message("请选择会员");
                return;
            } 
            
                if (getparametersetup(2)) {
                    if (this.royaltyData.data.length == 0) {
                        this.$message.error("请选择业绩员工");
                        return;
                    }
                }
            
            nscreenexCodeFun(4, String(this.TotalPrice));
            this.showRecharge = true;
        },
        CashRecharge(data) {
            // 确认支付
            this.showRecharge = false;
            let gList = [];
            for (let i = 0; i < this.addobjCountList.length; i++) {
                let item = this.addobjCountList[i];
                gList.push({
                    GoodsId: item.GoodsId,
                    Qty: item.IsInvalid2 ? 0 : item.Qty,
                    Price: item.Price,
                    IsInvalid: item.IsInvalid2 ? 2 : 0,
                    InvalidDate:
                        item.IsInvalid == 1 ? item.InvalidDate : "9999999999999"
                });
                //不限次数 IsInvalid=2, QTY=0 ; 限制次数 IsInvalid=0
            }

            let otherdata = {
                GoodsList: JSON.stringify(gList),
                SaleEmpMoney: JSON.stringify(this.royaltyData.data),
                VipId: this.VipId,
                Remark: "",
                GoodsPackId: ""
            };
            let AllsendData = Object.assign({}, otherdata, data);

            AllsendData.PayTypeID = AllsendData.PaytypeId;
            delete AllsendData.PaytypeId;

            this.$store
                .dispatch("getsetmealrtimesrechargeState", AllsendData)
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
        selroyaltyFun() {
            // 选择业绩员工
            if (this.addobjCountList.length == 0) {
                this.$message.error("请选择商品");
                return;
            }
            this.$store.dispatch("getstoragevaluerroyaltyState").then(()=>{
                this.loading = true;
            });
        },
        selRoyalty_Fun: function(arr) {
            let d = [];
            for (let i = 0; i < arr.length; i++) {
                d.push({ EmpId: arr[i].EmpId, Money: arr[i].Money });
            }
            this.royaltyData = {
                data: d,
                default: [...arr]
            };

            this.pageItemData.TotalPrice = 0;
            this.pageItemData.isShow = false;
            this.dialogFormVisible = false;
        },

        changeDP(item) {
            this.$prompt("请输入" + item.label + "内容", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: item.value
            })
                .then(({ value }) => {
                    let inputvalue = this.onlyInputnumber(value);
                    this.changeaddobjCountListDate(
                        item.GoodsId,
                        Number(inputvalue),
                        item.dpstatus
                    );
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入"
                    });
                });
        },
        changeaddobjCountListDate(GoodsId, value, dpstatus) {
            for (let i = 0; i < this.addobjCountList.length; i++) {
                if (this.addobjCountList[i].GoodsId == GoodsId) {
                    this.addobjCountList[i].Price = value;
                    this.addobjCountList[i].Discount = (
                        this.addobjCountList[i].Price /
                        this.addobjCountList[i].retailprice
                    ).toFixed(2);
                    this.dealTotalData();
                    break;
                } else {
                    if (i + 1 < this.addobjCountList.length) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
        }
    },
    components: {
        recharge,
        royaltySel
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
    border-bottom: 2px solid #ccc;
}

.classification_List ul li {
    float: left;
    width: 55px;
    text-align: center;
    cursor: pointer;
    line-height: 38px;
    width: 73px !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.classification_List ul li.selected {
    color: #ec5566;
    border-bottom: 2px solid #ec5566;
}

.commodityc_rightsock {
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
    padding: 4px 0;
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
    bottom: 12px;
    left: 0;
    right: 0;
    border-top: 3px solid #eae2d5;
    background: #fff;
    padding: 0 12px;
}

/*模板样式*/
.timescountc_right .tablelcenter {
    height: 70px;
    overflow: hidden;
    position: relative;
    border: 1px solid #9e9e9e;
    padding: 8px;
    cursor: pointer;
}

.timescountc_right .tablelcenter .menu-img img {
    height: 50px;
    width: 50px;
    vertical-align: middle;
    border: 0;
    float: left;
    margin-right: 5px;
}

.timescountc_right .tablelcenter .menu-txt {
    position: absolute;
    bottom: 9px;
    right: 8px;
    padding-top: 25px;
}
</style>
