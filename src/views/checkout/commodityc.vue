<template>
    <div class="t-botton-timescountc" style="height: 100%;" ref="elememt">
        <div class="f-botton-fs" style="height: 100%;">
            <el-row :gutter="24" style="height: 100%;">
                <el-col
                    :span="8"
                    style="border-right: 10px solid rgba(234, 226, 213, 1);height: 100%;position: relative;"
                >
                    <dropdown @getmemberID="getmemberID" :details="Object.keys(selmember).length>0?selmember:new Object()"></dropdown>
                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                        <ul class="productNav">
                            <li style="width: 20%;">
                                <span>品名</span>
                            </li>
                            <li style="width: 15%;">
                                <span>零售价</span>
                            </li>
                            <li style="width: 20%;">
                                <span>数量</span>
                            </li>
                            <li style="width: 15%;">
                                <span>折扣</span>
                            </li>
                            <li style="width: 15%;">
                                <span>实销价</span>
                            </li>
                            <li style="width: 15%;">
                                <span>小计</span>
                            </li>
                        </ul>
                        <ul id="addshopList" class="p-bottom-sm">
                            <li
                                v-for="(item,i) in addobjCountList"
                                :key="i"
                                class="block m-top-xs paddingTB-xs clearfix"
                            >
                                <div
                                    class="cateringProductNamebox overflowehide"
                                    style="width: 20%;"
                                >
                                    <span>{{item.goodsname}}</span>
                                </div>
                                <div class="cateringProductNamebox">
                                    <span>{{item.retailprice}}</span>
                                </div>
                                <div class="cateringProductNamebox text-center" style="width: 20%;">
                                    <div class="sumchange">
                                        <i
                                            class="el-icon-remove jiajianbtn"
                                            @click="addjiajianhao(1,item.calccount,item.maxcalccount,item.GoodsId,i)"
                                        ></i>
                                        <span class="getqty" v-on:click="changeQty(i)">{{item.Qty}}</span>
                                        <i
                                            class="el-icon-circle-plus jiajianbtn"
                                            @click="addjiajianhao(2,item.calccount,item.maxcalccount,item.GoodsId,i)"
                                        ></i>
                                    </div>
                                </div>
                                <div
                                    class="cateringProductNamebox pointer"
                                    @click="changeDP(i,1,item.Discount)"
                                >
                                    <div class="full-width"><span v-text="(Object.keys(selmember).length>0&&item.VIPPRICE>0)?parseFloat(item.Discount).toFixed(4):parseFloat(item.Discount).toFixed(2)"></span></div>
                                </div>
                                <div
                                    class="cateringProductNamebox pointer"
                                    @click="changeDP(i,2,item.Price)"
                                >
                                    <span>{{item.Price|money}}</span>
                                </div>
                                <div class="cateringProductNamebox">
                                    <span>{{parseFloat(item.Price*item.Qty).toFixed(2)}}</span>
                                </div>
                                <div class="text-left font-12 m-top-xs clearfix">
                                    <a @click="selectYJemployee(item,i)" class="pointer text-a9">
                                        <i
                                            class="el-icon-warning"
                                            v-if="item.showempremark ==undefined || item.showempremark =='' "
                                        ></i>
                                        <i
                                            style="color: #67c23a;"
                                            class="el-icon-circle-check"
                                            v-else
                                        ></i>
                                        {{(item.showempremark ==undefined || item.showempremark =='') ? '选择业绩员':item.showempremark}}
                                    </a>
                                    <a
                                        @click="delgoods(i)"
                                        class="pull-right pointer text-a9 paddingLR-sm"
                                    >
                                        <span>删除</span>
                                    </a>
                                    <span class="pull-right text-a9">{{item.priceremark}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                        <div class="footer_top" style="margin: 12px 0;">
                            <span style="width:36%;    display: inline-block;">合计</span>
                            <span style="display: inline-block;">{{totalTotal.num}}</span>
                            <span
                                class="text-center pull-right"
                                style="display: inline-block;"
                            >{{(totalTotal.price - totalTotal.discount)|money}}</span>
                        </div>
                        <div class="f_commodityc-left">
                            <el-button type="info" @click="clearData()">清空</el-button>
                            <div class="pull-right">
                                <el-button type="success" @click="putUpok">挂单</el-button>
                                <el-button type="danger" @click="co_reckoning">结账</el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <!-- 右边 选择商品 -->
                    <div class="classification_List" ref="fenleiWidthsock">
                        <div
                            class="swiper-container"
                            style="margin: inherit;float: left;"
                            ref="swipercontainersock"
                        >
                            <ul
                                class="swiper-wrapper"
                                id="activityList"
                                v-if="commoditycflList.length>0"
                            >
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
                        <div class="search_sock" style="width:178px;float: right;">
                            <el-input
                                type="default"
                                v-model="searchText"
                                placeholder="输入商品名称/编码"
                                style="width:178px;float: right;"
                            ></el-input>
                        </div>
                    </div>
                    <div class="commodityc_rightsock">
                        <div class="tablelist scrollstyle font-12" v-loading="loading">
                            <!-- goods -->
                            <el-row :gutter="20" class="timescountc_right">
                                <el-col
                                    :span="6"
                                    style="margin-bottom:10px;"
                                    v-for="(item,i) in pagelist"
                                    :key="i"
                                    v-show="item.PRICE==0||item.PRICE>0"
                                >
                                    <div class="tablelcenter" @click="addcommodityc(item)">
                                        <div class="menu-img">
                                            <img
                                                :src="item.showgoodsimg"
                                                width="55"
                                                height="55"
                                                onerror="this.src='static/images/shopmore.png'"
                                            >
                                            <div class="goodsName">{{item.NAME}}</div>
                                            <div>
                                                <span
                                                    class="font-600 text-theme2"
                                                >&yen;{{item.DISPRICE == undefined ? item.PRICE : item.DISPRICE}}</span>
                                            </div>
                                        </div>
                                        <div class="menu-txt com_color" v-if="item.GOODSMODE==0">
                                            <strong style="font-size: 12px;">
                                                <i
                                                    style="color: rgb(25, 23, 23);padding: 0px 3px;"
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

        <!-- 业绩员工 -->
        <el-dialog v-if="showyjemployee" title="业绩员工" :visible.sync="showyjemployee" width="700px">
            <yjemployee
                @showyjemployee="showyjemployee=false"
                :shopitemList="shopitemList"
                @Receiveyjemployee="Receiveyjemployee"
            ></yjemployee>
        </el-dialog>
        <!-- 收银-商品消费 -->
        <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="700px">
            <recharge
                @closeModalrecharge="showRecharge=false"
                :totalprice="totalTotal"
                :isselectvip="VipId"
                @CashRecharge="CashRecharge"
                ref="SurveyForm"
            ></recharge>
        </el-dialog>
    </div>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";
import { getDayindate } from "@/util/Printing";
import { mapState, mapGetters } from "vuex";

import yjemployee from "@/components/employee/YJemployee";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
const settheVipPrice_Fun = function(goodsItem, selmember, type, value) {
    // 设置会员折扣 type：0=商品选择，1=挂单商品， 2=all, 3=更改折扣
    let gPrice = 0;
    let price = parseFloat(goodsItem.PRICE),
        discount = 1,
        remark = "";
        console.log(type)
    switch (type) {
        case 1:
            gPrice = parseFloat(goodsItem.GOODSPRICE);
            break;
        case 2:
            gPrice = parseFloat(goodsItem.retailprice);
            break;
        case 3:
            gPrice = parseFloat(goodsItem.retailprice);
            break;
        case 4:
            gPrice = parseFloat(goodsItem.retailprice);
            break;
        default:
            if(goodsItem.DISPRICE != undefined && goodsItem.ISVIPDISCOUNT != undefined){
                gPrice = parseFloat(goodsItem.DISPRICE);
                price = gPrice
            }else{
                gPrice = parseFloat(goodsItem.PRICE);
            }
    }
    if (type < 3 && selmember.ID != undefined) {
        if(goodsItem.ISVIPDISCOUNT == undefined || goodsItem.ISVIPDISCOUNT == false && goodsItem.DISPRICE == undefined){
            gPrice = parseFloat(goodsItem.PRICE);
        }else{
            if(goodsItem.ISVIPDISCOUNT == true){
                gPrice = selmember.ID == undefined ? parseFloat(goodsItem.PRICE) : parseFloat(goodsItem.DISPRICE)
            }
        }
        if(goodsItem.DISPRICE != undefined && goodsItem.ISVIPDISCOUNT != undefined){
            gPrice = parseFloat(goodsItem.DISPRICE);
            price = gPrice
        }else{
            gPrice = parseFloat(goodsItem.PRICE);
        }
        if (goodsItem.VIPPRICE && parseFloat(goodsItem.VIPPRICE) > 0) {
            if(selmember.ID == undefined){
                discount = gPrice == 0 ? 0 : parseFloat(price / gPrice)
            }else{
                discount = goodsItem.GOODSMODE == 1 ? selmember.SERVICEDISCOUNT : selmember.DISCOUNT;
            }
            price = gPrice * discount;
            remark = "(会员价" + goodsItem.VIPPRICE + "元)";
        } else {
            discount = goodsItem.GOODSMODE == 1 ? selmember.SERVICEDISCOUNT : selmember.DISCOUNT;
            price = gPrice * discount;
            if (discount < 1) {
                remark = "(会员折扣" + discount + "折)";
            }
        }
    }
    if (type == 3) {
        discount = parseFloat(value);
        price = gPrice * discount;
        remark = "(会员折扣1 " + discount + "折)";
    }
    if (type == 4) {
        price = parseFloat(value);
        discount = gPrice == 0 ? 0 : parseFloat(price / gPrice);
        remark = "(会员折扣2 " + discount.toFixed(2) + "折)";
    }
    console.log(gPrice)
    return {
        Price: price,
        Discount: discount,
        priceremark: remark,
        retailprice: gPrice
    };
};
let _ = require("lodash");
import MIXINS_CHECKOUT from "@/mixins/checkout";
export default {
    mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER],
    data() {
        return {
            getgoodsIMGURL: "",
            current: "ok",
            index: "ok",
            searchText: "",
            VipId: "",
            VipIdrows: "",
            BillId: "",
            objCount: [],
            addobjCountList: [],
            totalTotal: {
                num: 0,
                price: 0,
                discount: 0
            },
            checkedreceipt: false,
            checkedmessage: false,
            pagelist: [],
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
                Mode: -1,
                TypeID: "", //商品类别ID
                DescType: 0
            },
            showyjemployee: false,
            showRecharge: false,
            shopitemList: {},
            showTishi: "",
            putUpokstatus: ""
        };
    },
    computed: {
        ...mapGetters({
            memberState: "memberState",
            employeeList: "employeeList",
            commoditycflListState: "commoditycflListState",
            commoditycflList: "commoditycflList",
            // dataList: "goodsList",
            // dataListState: "goodsListState",
            dataList: "goodsListNew",
            dataListState: "goodsListNewState",

            commoditycconsumption: "commoditycconsumption",
            goodsState: "goodsState",
            goodsItem: "goodsItem"
        })
    },
    watch: {
        searchText() {
            this.searchfun();
        },
        commoditycflList(data) {
            this.fenleiscrollwidth();
        },
        memberState(data) {
            if (data.success) {
                this.objCount = data.data.objCount;
            }
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
        commoditycconsumption(data) {
            if (data.success) {
                this.clearData();
                this.loading = false;
                let qresurl = this.$store.state.commodityc.saveQRcodeIMG; // 注意获取图片
                this.$message({
                    message: this.showTishi,
                    type: "success"
                });
                if (this.putUpokstatus != 1) {
                    if (this.$store.state.recharge.isPrintsatus) {
                        getDayindate("601020406",data.data.OutBillId,1,qresurl);
                    }
                }
            } else {
                this.$message.error(data.message);
            }
        },
        goodsState(data) {
            if (data.success && !this.showyjemployee) {
                this.shopitemList.itemObj = Object.assign({},this.goodsItem,this.shopitemList.itemObj);
                this.showyjemployee = true;
            }
        }
    },
    methods: {
        firstclick() {
            // 获取挂单商品
            let Obj = Object.assign(
                {},
                this.$store.state.guadanc.guadancdlistobj
            );
            let GoodsObj = [...this.$store.state.guadanc.guadancdlistGoodsObj];

            this.BillId = Obj.BILLID;
            this.addobjCountList = [];
            if (Obj.VIPID == undefined || Obj.VIPID == "") {
                this.VipId = "";
                this.VipIdrows = {};
            } else {
                this.VipId = Obj.VIPID;
                this.VipIdrows = {
                    NAME: Obj.VIPNAME,
                    LEVELNAME: Obj.LEVELNAME,
                    MONEY: Obj.VIPMONEY,
                    INTEGRAL: Obj.VIPINTEGRAL,
                    DISCOUNT: Obj.DISCOUNT,
                    SERVICEDISCOUNT: Obj.SERVICEDISCOUNT?Obj.SERVICEDISCOUNT:1
                };
            }
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: this.VipIdrows
            });

            for (let i = 0; i < GoodsObj.length; i++) {
                let item = GoodsObj[i];
                let dd = this.settheVipPrice(item, 1);
                let newItem = Object.assign(
                    {
                        goodsname: item.GOODSNAME,
                        Qty: item.QTY,
                        GoodsId: item.GOODSID,
                        itemObj: Object.assign({}, item, Obj),
                        EmpId1: item.EMPID1,
                        EmpMoney1: item.EMPMONEY1,
                        EmpId2: item.EMPID2,
                        EmpMoney2: item.EMPMONEY2,
                        EmpId3: item.EMPID3,
                        EmpMoney3: item.EMPMONEY3,
                        showempremark: item.EMPMONEYNAME
                    },
                    item,
                    dd
                );
                this.addobjCountList.push(newItem);
            }
            this.dealTotalData();
        },
        getmemberDetail(item) {
            this.$store.dispatch("getMemberItem", item).then(() => {});
        },
        getmemberID(id, data) {
            // 会员选择
            this.VipId = id;
            this.VipIdrows = Object.assign({}, data);
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: data
            });
            if (this.addobjCountList.length > 0) {
                for (var i = 0; i < this.addobjCountList.length; i++) {
                    let item = this.addobjCountList[i];
                    let dd = this.settheVipPrice(item, 2);
                    this.addobjCountList[i] = Object.assign({}, item, dd);
                }
                this.dealTotalData();
            }
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
        settheVipPrice(goodsItem, type, value) {
            return settheVipPrice_Fun(goodsItem, this.VipIdrows, type, value);
        },

        addcommodityc(item) {
            // 选择商品
            // console.log(22222, item);
            let dd = this.settheVipPrice(item, 0);
            let newItem = Object.assign(
                {
                    goodsname: item.NAME,
                    Qty: 1,
                    GoodsId: item.ID,
                    itemObj: item
                },
                item,
                dd
            );
            this.addobjCountList.push(newItem);
            this.dealTotalData();
        },
        clearData() {
              this.addobjCountList = [];
            this.VipId = "";
            this.BillId = "";
            this.totalTotal = {
                    num: 0,
                    price: 0,
                    discount: 0
                };
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: new Object()
            }).then(()=>{
                this.VipId = '';
                this.VipIdrows = {}
            });
        },
        delgoods(i) {
            //  移除商品
            this.addobjCountList.splice(i, 1);
            this.dealTotalData();
        },
        dealTotalData() {
            let tnum = 0, tprice = 0, tdiscount = 0;
            for (let i = 0; i < this.addobjCountList.length; i++) {
                let tt = parseFloat(this.addobjCountList[i].retailprice) * parseInt(this.addobjCountList[i].Qty);
                tnum += parseInt(this.addobjCountList[i].Qty);
                tprice += tt;

                if ( this.addobjCountList[i].Discount && parseFloat(this.addobjCountList[i].Discount) > 0 ) {
                    tdiscount += tt * (1 - parseFloat(this.addobjCountList[i].Discount));
                }
            }
            this.totalTotal = {
                num: tnum,
                price: tprice,
                discount: tdiscount
            };
        },
        changeQty(i) {
            this.$prompt("请输入数值", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType:'Number',
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
        addjiajianhao(status, calccount, maxcalccount, GoodsId, i) {
            if (status == 1) {
                this.addobjCountList[i].Qty -= 1;
                if (this.addobjCountList[i].Qty == 0) {
                    this.addobjCountList.splice(i, 1);
                }
            } else {
                this.addobjCountList[i].Qty += 1;
            }

            this.dealTotalData();
        },
        ck_commoditycflList(flID, index) {
            //触发分类
            this.current = index;
            this.pageData.TypeID = flID;
            this.pageData.PN = 1;
            this.getNewData();
        },
        selectYJemployee(item, i) {
            // 收银选择业绩员
            this.shopitemList = Object.assign(
                {
                    position: {
                        i: i
                    }
                },
                item
            );
            if (item.itemObj.BILLID) {
                let fArr = this.pagelist.filter(
                    element => item.GoodsId == element.ID
                );
                if (fArr.length > 0) {
                    this.shopitemList.itemObj = Object.assign(
                        {},
                        fArr[0],
                        this.shopitemList.itemObj
                    );
                    this.showyjemployee = true;
                    console.log(this.shopitemList);
                } else {
                    this.$store.dispatch("getGoodsItem", { ID: item.GoodsId });
                }
            } else {
                this.showyjemployee = true;
            }
        },
        Receiveyjemployee(item1, item2, GoodsId) {
            // 业绩员工
            let i = this.shopitemList.position.i;
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

            this.addobjCountList = [...this.addobjCountList];
            this.showyjemployee = false;
        },
        co_reckoning() {
            if (this.addobjCountList.length == 0) {
                this.$message("请选择商品");
                return;
            } else {
                if (getparametersetup(2)) {
                    for (let i = 0; i < this.addobjCountList.length; i++) {
                        if (
                            this.addobjCountList[i].EmpId1 == undefined ||
                            this.addobjCountList[i].EmpId1 == ""
                        ) {
                            this.$message.error("请选择业绩员工");
                            return;
                        }
                    }
                }
            }
            nscreenexCodeFun(4, String(this.totalTotal.price));
            this.showRecharge = true;
        },
        putUpok() {
            if (this.addobjCountList.length == 0) {
                this.$message("请选择商品");
                return;
            }
            this.putUpokstatus = 1;
            let GoodsDetaila = {};
            for (let i = 0; i < this.addobjCountList.length; i++) {
                Vue.delete(this.addobjCountList[i], "itemObj");
                GoodsDetaila[i] = this.addobjCountList[i];
            }
            this.showTishi = "挂单成功";
            let AllsendData = {
                DeskId: "",
                GoodsDetail: JSON.stringify(GoodsDetaila),
                VipId: this.VipId,
                Remark: "",
                FavorMoney: 0,
                CouponNo: "",
                PaytypeId: "",
                GetIntegral: 0,
                IsSms: 0,
                PayMoney: 0,
                PayIntegral: 0,
                IntegralMoney: 0,
                IsCheck: 0,
                BillId: this.BillId
            };
            this.$store
                .dispatch("getcommoditycconsumption", AllsendData)
                .then(() => {});
        },
        CashRecharge(data) { // 结账
            this.putUpokstatus = "";
            let GoodsDetaila = {};
            for (let i = 0; i < this.addobjCountList.length; i++) {
                Vue.delete(this.addobjCountList[i], "itemObj");
                Vue.delete(this.addobjCountList[i], "PRICE");
                Vue.delete(this.addobjCountList[i], "PURPRICE");
                Vue.delete(this.addobjCountList[i], "WRITER");
                Vue.delete(this.addobjCountList[i], "WRITETIME");
                Vue.delete(this.addobjCountList[i], "EMPMONEYREMARK");
                Vue.delete(this.addobjCountList[i], "showgoodsimg");
                Vue.delete(this.addobjCountList[i], "ISGIFT");
                Vue.delete(this.addobjCountList[i], "GIFTINTEGRAL");
                Vue.delete(this.addobjCountList[i], "ISRETURNVISIT");
                Vue.delete(this.addobjCountList[i], "SERVICEMINUTE");
                Vue.delete(this.addobjCountList[i], "ISCYCLE");
                Vue.delete(this.addobjCountList[i], "ISEMPMONEY");
                Vue.delete(this.addobjCountList[i], "GOODSMODE");
                Vue.delete(this.addobjCountList[i], "TYPENAME");
                Vue.delete(this.addobjCountList[i], "MINSTOCKNUMBER");
                Vue.delete(this.addobjCountList[i], "RETURNVISITDAY");
                Vue.delete(this.addobjCountList[i], "CYCLEDAY");
                Vue.delete(this.addobjCountList[i], "priceremark");
                Vue.delete(this.addobjCountList[i], "VERSION");
                Vue.delete(this.addobjCountList[i], "TYPEID");
                Vue.delete(this.addobjCountList[i], "STATUS");
                Vue.delete(this.addobjCountList[i], "VIPPRICE");
                Vue.delete(this.addobjCountList[i], "SALEQTY");
                Vue.delete(this.addobjCountList[i], "RN");
                GoodsDetaila[i] = this.addobjCountList[i];
            }
            this.showRecharge = false;
            this.showTishi = "结账成功";
            let otherdata = {
                DeskId: "",
                GoodsDetail: JSON.stringify(GoodsDetaila),
                VipId: this.VipId,
                Remark: "",
                BillId: this.BillId
            };
            let AllsendData = Object.assign({}, otherdata, data);
            if(AllsendData.PayMoney){
                AllsendData.PayMoney = parseFloat(AllsendData.PayMoney).toFixed(2)
            }
            console.log(AllsendData)
            this.$store
                .dispatch("getcommoditycconsumption", AllsendData)
                .then(() => {});
        },
        setcommonHeight() {
            let elememtheight = this.$refs.elememt.offsetHeight;
            let footerheight = this.$refs.footer.offsetHeight;
            this.$refs.addsockheight.style.height =
                elememtheight - footerheight - 96 + "px";
        },
        setfenleiWidth() {
            let elefenleiWidthsock = this.$refs.fenleiWidthsock.offsetWidth;
            this.$refs.swipercontainersock.style.width =
                elefenleiWidthsock - 179 + "px";
        },
        changeDP(i, type, vv) {
            //更改折扣,实销价
            let itemData = this.addobjCountList[i];
            if (
                itemData.VIPPRICE &&
                itemData.VIPPRICE > 0 &&
                Object.keys(this.VipIdrows).length > 0
            ) {
                return;
            }

            let msg =
                type == 1 ? "请输入1~100的百分比折扣数值" : "请输入实销价内容";
            let patrn = type == 1 ? /^[0-9]*$/ : /^\d+(\.\d+)?$/;
            let ivalue = null;
            if (vv > 0) {
                ivalue = type == 1 ? vv * 100 : vv;
            }

            this.$prompt(msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "number",
                inputValue: ivalue,
                inputPattern: patrn,
                inputErrorMessage: "数值格式不正确"
            })
                .then(({ value }) => {
                    let val = 0,
                        dd = new Object();
                    if (type == 1) {
                        val =
                            parseFloat(value) > 100
                                ? 0
                                : parseFloat(value) / 100;
                        dd = this.settheVipPrice(itemData, 3, val);
                    } else { // 实销价
                        val = parseFloat(value).toFixed(2);
                        dd = this.settheVipPrice(itemData, 4, val);
                    }

                    this.addobjCountList[i] = Object.assign({}, itemData, dd);
                    this.addobjCountList = [...this.addobjCountList];
                    this.dealTotalData();
                })
                .catch(() => {});
        },

        fenleiscrollwidth() {
            this.$nextTick(function() {
                var mySwiper = new Swiper(".swiper-container", {
                    slidesPerView: 6,
                    paginationClickable: !0,
                    spaceBetween: 4,
                    freeMode: !0
                });
            });
        }
    },
    components: {
        yjemployee,
        recharge
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
    },
    mounted() {
        this.setcommonHeight();
        this.setfenleiWidth();
        this.fenleiscrollwidth();
        this.pagination = {
            TotalNumber: this.dataListState.paying.TotalNumber,
            PageNumber: this.dataListState.paying.PageNumber,
            PageSize: this.dataListState.paying.PageSize,
            PN: this.dataListState.paying.PN
        };
        this.pagelist = [...this.dataList];
    }
};
</script>
<style scoped>
.goodsName {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 36px;
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
    text-align: center;
}

.timescountc_left ul#addshopList {
    /*padding: 0 12px;*/
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

.timescountc_left ul#addshopList .cateringProductNamebox {
    width: 15%;
    float: left;
    text-align: center;
}

.timescountc_left_footer {
    position: absolute;
    bottom: 12px;
    left: 22px;
    right: 22px;
    border-top: 3px solid #eae2d5;
    background: #fff;
}

/*模板样式*/
.timescountc_right .tablelcenter {
    height: 70px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ded9d9;
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
