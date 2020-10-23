<template>
    <div id="roomChoose" v-loading="loading" class="row-flex flex-start full-width font-12">
        <!-- choose goods -->
        <div class="leftArea col-flex flex-start overflowY-scroll-">
            <div style="height:65px;">
                <selMemberPage></selMemberPage>
                <div class="row-flex marginTB-sm font-12">
                    <span class="inline-block align-self-center flex-grow-6">
                        姓名:
                        <span class="text-theme2">{{selmember.NAME}}</span>
                    </span>
                    <span class="inline-block align-self-center flex-grow-6">
                        等级:
                        <span class="text-theme2">{{selmember.LEVELNAME}}</span>
                    </span>
                    <span class="inline-block align-self-center flex-grow-6">
                        余额:
                        <span class="text-theme2">{{selmember.MONEY}}</span>
                    </span>
                    <span class="inline-block align-self-center flex-grow-6">
                        积分:
                        <span class="text-theme2">{{selmember.INTEGRAL}}</span>
                    </span>
                </div>
            </div>

            <div class="relative">
                <el-tabs
                    v-model="leftTabsValue"
                    type="card"
                    editable
                    @edit="handleTabsEdit"
                    @tab-click="changeTab"
                    class="tabsmini"
                >
                    <el-tab-pane
                        v-for="(sub,tabIndex) in theOrderList"
                        :key="sub.ROOMID"
                        :label="sub.ROOMNAME"
                        :name="sub.ROOMID"
                    >
                        <div class="text-center">
                            <!-- goods head -->
                            <div
                                class="row-flex flex-items-center orderList paddingTB-sm p-right-sm"
                                style="background-color:#FED3DE;"
                            >
                                <div>品名</div>
                                <div>零售价</div>
                                <div>数量</div>
                                <div>折扣</div>
                                <div>实销价</div>
                                <div>小计</div>
                            </div>
                            <!-- goods content -->
                            <div
                                class="tabList overflowX-hidden overflowY-scroll"
                                :style="{'height':(ptype>1?height-52:height) +'px'}"
                            >
                                <div v-for="(item,i) in sub.List" :key="i" class="paddingTB-sm">
                                    <div class="row-flex flex-items-center orderList">
                                        <div class="text-left text-overflow-fag">{{item.NAME}}</div>
                                        <div>{{item.retailprice}}</div>
                                        <!-- <div>{{item.num}}</div> -->
                                        <div>
                                            <el-input-number
                                                v-model="item.num"
                                                @change="changeNumber"
                                                :min="1"
                                                :max="100000"
                                                size="mini"
                                                class="qtyNumber full-width"
                                            ></el-input-number>
                                        </div>
                                        <div>
                                            <a
                                                @click="changeDP(tabIndex,i,1,item.discount)"
                                                class="pointer"
                                            >
                                                <!-- <span>{{item.discount|money}}</span> -->
                                                <div class="full-width"><span v-text="(Object.keys(selmember).length>0&&item.VIPPRICE>0)?parseFloat(item.discount).toFixed(4):parseFloat(item.discount).toFixed(2)"></span></div>
                                            </a>
                                        </div> 
                                        <div>
                                            <a
                                                @click="changeDP(tabIndex,i,2,item.price)"
                                                class="pointer"
                                            >{{item.price|money}}</a>
                                        </div>
                                        <div>{{parseFloat(item.price * item.num).toFixed(2)}}</div>
                                    </div>
                                    <div class="text-left font-12 m-top-xs">
                                        <a
                                            @click="changeEmployee(tabIndex,i,item)"
                                            class="pointer text-a9"
                                        >
                                            <i
                                                class="m-right-xs"
                                                :class="item.empList.length>0?'el-icon-circle-check text-success':'el-icon-warning'"
                                            ></i>
                                            <span v-if="item.empList.length==0">选择业绩员工</span>
                                            <span
                                                v-else
                                                v-for="(label ,i ) in item.empListLabel"
                                                :key="i"
                                                v-text="label"
                                                class="m-right-xs"
                                            ></span>
                                        </a>
                                        <a
                                            @click="delgoods(tabIndex,i,item)"
                                            class="pull-right pointer text-a9 paddingLR-sm"
                                        >
                                            <span>删除</span>
                                        </a>
                                        <span class="pull-right text-a9">{{item.remark}}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- goods foot -->
                            <div class="text-right border-top">
                                <div class="paddingTB-sm row-flex">
                                    <span
                                        class="inline-block align-self-center"
                                        style="width:76px;min-width:76px;"
                                    >合计：</span>
                                    <div class="inline-block align-self-center full-width">
                                        <span
                                            v-if="sub.total"
                                            class="m-right-sm"
                                        >数量 {{sub.total.num}},</span>
                                        <span v-if="sub.total" class>总价{{sub.total.price|money}}</span>
                                    </div>
                                </div>

                                <div v-if="ptype>1" class="text-left m-bottom-xs">
                                    <el-row :gutter="0">
                                        <el-col :span="12">
                                            <div
                                                class="row-flex flex-items-center m-bottom-xs m-right-xs"
                                            >
                                                <span
                                                    class="inline-block text-999"
                                                    style="min-width:58px;"
                                                >下单时间</span>
                                                <div
                                                    class="inline-block rounded-xs border padding-xs bg-default full-width"
                                                >
                                                    <span>{{dataItem.data.Obj.DATESTR}}</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="row-flex flex-items-center m-bottom-xs">
                                                <span
                                                    class="inline-block text-999"
                                                    style="min-width:58px;"
                                                >预计时长</span>
                                                <div
                                                    class="inline-block rounded-xs border padding-xs bg-default full-width"
                                                >
                                                    <span>{{dataItem.data.Obj.SERIVCETIME?parseFloat(dataItem.data.Obj.SERIVCETIME):0}}分钟</span>
                                                    <!-- <span >预计时长</span> -->
                                                </div>
                                            </div>
                                        </el-col>

                                        <el-col :span="12">
                                            <div
                                                class="row-flex flex-items-center m-bottom-xs m-right-xs"
                                            >
                                                <span
                                                    class="inline-block text-999"
                                                    style="min-width:58px;"
                                                >开始时间</span>
                                                <div
                                                    class="inline-block rounded-xs border padding-xs bg-default full-width"
                                                >
                                                    <span
                                                        v-if="sub.BEGINTIME"
                                                    >{{new Date(sub.BEGINTIME) | time}}</span>
                                                    <span v-else>开始时间</span>
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="row-flex flex-items-center m-bottom-xs">
                                                <span
                                                    class="inline-block text-999"
                                                    style="min-width:58px;"
                                                >剩余时长</span>
                                                <div
                                                    class="inline-block rounded-xs border padding-xs bg-default full-width"
                                                >
                                                    <span>{{(dataItem.data.Obj.SERIVCETIME?parseFloat(dataItem.data.Obj.SERIVCETIME):0) - sub.NEWSERIVICETIME}}分钟</span>
                                                    <!-- <span>剩余时长</span> -->
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>

                                <div>
                                    <div class="row-flex m-top-sm">
                                        <span
                                            class="inline-block align-self-center"
                                            style="width:76px;min-width:76px;"
                                        >备注：</span>
                                        <el-input
                                            placeholder
                                            v-model="remark"
                                            clearable
                                            size="small"
                                        ></el-input>
                                    </div>
                                </div>
                                <div v-if="ptype>1" class="text-left p-top-sm">
                                    <el-dropdown
                                        trigger="click"
                                        @command="changeRoom"
                                        class="m-right-sm"
                                    >
                                        <el-button type="primary" size="small" class="bg-primary">
                                            <span>换台</span>
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item
                                                v-for="(item ,i) in roomList2"
                                                v-if="item.ROOMID && item.ROOMID != sub.ROOMID && !item.BILLID"
                                                :key="i"
                                                :command="item"
                                            >{{item.ROOMNAME}}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <el-button-group v-if="sub.BILLID">
                                        <el-button
                                            type="default"
                                            size="small"
                                            v-if="sub.ISSTART==1"
                                            @click="handleClickTime('stopTime',sub)"
                                            class="bg-primary"
                                        >暂停计时</el-button>
                                        <el-button
                                            type="primary"
                                            size="small"
                                            v-else
                                            @click="handleClickTime('startTime',sub)"
                                            class="bg-primary"
                                        >开始计时</el-button>
                                    </el-button-group>
                                    <el-button-group class="pull-right">
                                        <el-button size="small" @click="back">返回</el-button>
                                        <el-button
                                            type="primary"
                                            size="small"
                                            @click="handleSubmit('save')"
                                            class="bg-primary"
                                        >保存</el-button>
                                        <el-button
                                            type="primary"
                                            size="small"
                                            @click="handleSubmit('checkout')"
                                        >结账</el-button>
                                    </el-button-group>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="ptype==1" class="text-right p-top-sm" style="height:42px;">
                <el-button size="small" @click="back">返回</el-button>
                <el-button size="small" @click="handleSubmit('order')" type="primary">下单</el-button>
            </div>
        </div>
        <!-- 右边 选择商品 -->
        <div class="rightArea">
            <selGoodsPage :activeRoomId="leftTabsValue" @resultFun="theOrderList_fun"></selGoodsPage>
        </div>
        <!-- 业绩员工 -->
        <el-dialog v-if="showyjemployee" title="业绩员工" :visible.sync="showyjemployee" width="700px">
            <royalty-sel
                @showyjemployee="showyjemployee=false"
                :shopitemList="theGoodsItem"
                @Receiveyjemployee="selRoyalty_Fun"
            ></royalty-sel>
        </el-dialog>
        <!-- 选择房台 -->
        <el-dialog v-if="showRoom" title="选择房台" :visible.sync="showRoom" width="80%">
            <selRoomPage @closeModal="showRoom=false" @dealDatafun="dealRoom_fun"></selRoomPage>
        </el-dialog>
        <!-- 订单详情 -->
        <el-dialog v-if="showOrder" title="订单详情" :visible.sync="showOrder" width="500">
            <detailsPage
                @closeModal="closeModal_order"
                :theOrderList="theOrderList"
                :totalTotal="totalTotal"
                :dtype="1"
                class="font-14"
            ></detailsPage>
        </el-dialog>
        <!-- 结账 -->
        <el-dialog
            width="90%"
            title="结账"
            v-if="showCheckout"
            :visible.sync="showCheckout"
            append-to-body
        >
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24" :md="8">
                    <detailsPage
                        :theOrderList="theOrderList"
                        :totalTotal="totalTotal"
                        :dtype="2"
                        class="full-width font-12"
                    ></detailsPage>
                </el-col>
                <el-col :xs="24" :sm="24" :md="16">
                    <rechargePage
                        @closeModalrecharge="showCheckout=false"
                        :totalprice="totalTotal"
                        :isselectvip="VipId"
                        @CashRecharge="CashRecharge"
                        ref="SurveyForm"
                    ></rechargePage>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { GOODS_IMGURL } from "@/util/define";
import MIXINS_ROOM from "@/mixins/room";
export default {
    props: {
        ptype: {
            type: [Number, String],
            default: 1 // 1=下单，2=编辑
        }
    },
    mixins: [MIXINS_ROOM.DEAL_GOODS, MIXINS_ROOM.DEAL_ORDER],
    data() {
        return {
            imgUrl: GOODS_IMGURL,
            height: window.innerHeight - 395,
            loading: false,
            isBack: false,
            oldOrderList: [],
            theOrderList: [],
            theGoodsItem: {},
            leftTabsValue: 0,
            showyjemployee: false,
            showRoom: false,
            showOrder: false,
            showCheckout: false,
            remark: ""
        };
    },
    computed: {
        ...mapGetters({
            dataState: "dealRoomOrder",
            dataItem: "roomOrderItem",
            cgList: "goodsList2",
            goodsState: "goodsState",
            goodsItem: "goodsItem",
            roomList2: "roomList2"
        })
    },
    watch: {
        dataState(data) {
            this.loading = false;
            if (data.success) {
                this.$message({
                    showClose: true,
                    message: data.message,
                    type: "success"
                });
                this.$store.dispatch("clearRoomAll", 2).then(() => {
                    this.back();
                });
            } else {
                this.$message.error(data.message);
            }
        },
        goodsState(data) {
            if (data.success && !this.showyjemployee) {
                this.theGoodsItem.itemObj = Object.assign(
                    {},
                    this.goodsItem,
                    this.theGoodsItem.itemObj
                );
                this.showyjemployee = true;
            }
        },
        dataItem(data) {
            console.log(888);
            this.defaultData();
        }
    },
    methods: {
        theOrderList_fun(arr) {
            // add goods
            this.theOrderList = [...arr];
            this.seltabForTotal();
        },
        closeModal_checkout(status) {
            if (status) {
                this.back();
            } else {
                this.showCheckout = false;
            }
        },
        closeModal_order(status) {
            if (status) {
                this.handleSubmit2();
            } else {
                this.showOrder = false;
            }
        },
        dealRoom_fun(arr) {
            // 选择房台
            this.leftTabsValue = arr[0].ROOMID;
            let newArr = [];
            for (let i = 0; i < arr.length; i++) {
                newArr.push(Object.assign({}, arr[i], { List: [] }));
                this.theOrderList.forEach(item => {
                    if (item.ROOMID == arr[i].ROOMID) {
                        newArr[newArr.length - 1] = Object.assign(
                            {},
                            newArr[newArr.length - 1],
                            item
                        );
                    }
                });
            }
            // console.log(newArr);
            this.showRoom = false;
            this.$store.dispatch("selectingRoom", newArr).then(() => {
                this.theOrderList = [...newArr];
                this.dealTotalData(0);
            });
        },
        handleTabsEdit(targetName, action) {
            // 增减标签页，房台增减
            if (action === "add") {
                // this.back();
                this.$store
                    .dispatch("selectingRoom", this.theOrderList)
                    .then(() => {
                        this.showRoom = true;
                    });
            }
            if (action === "remove") {
                if (this.theOrderList.length == 1) {
                    this.$message.error("房台不能为空");
                    return;
                }
                let tabs = this.theOrderList;
                let activeName = this.leftTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.ROOMID === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.ROOMID;
                            }
                        }
                    });
                }

                this.leftTabsValue = activeName;
                this.theOrderList = tabs.filter(
                    tab => tab.ROOMID !== targetName
                );
                this.$store.dispatch("selectingRoom", this.theOrderList);
            }
        },

        changeEmployee(index, i, item) {
            this.theGoodsItem = {
                Discount: item.discount,
                goodsname: item.NAME,
                GoodsId: item.ID,
                itemObj: Object.assign({}, item),
                Price: item.price,
                retailprice: item.PRICE,
                Qty: item.num,
                position: {
                    index: index,
                    i: i
                }
            };

            if (this.ptype > 1) {
                let fArr = this.cgList.filter(element => item.ID == element.ID);
                if (fArr.length > 0) {
                    this.theGoodsItem.itemObj = Object.assign(
                        {},
                        fArr[0],
                        this.theGoodsItem.itemObj
                    );
                    this.showyjemployee = true;
                } else {
                    this.$store.dispatch("getGoodsItem", item);
                }
            } else {
                this.showyjemployee = true;
            }
        },
        selRoyalty_Fun: function(item1, item2, GoodsId) {
            // 业绩员工
            let index = this.theGoodsItem.position.index;
            let i = this.theGoodsItem.position.i;
            let oItem = this.theOrderList[index];
            oItem.List[i].empList = [...item1];
            oItem.List[i].empListLabel = [...item2];

            this.theOrderList = [...this.theOrderList];
            this.showyjemployee = false;
        },

        handleSubmit(type) {
            let sendData = {
                GoodsDetail: "",
                VipId: this.selmember.ID ? this.selmember.ID : "",
                IsCancel: 0,
                Remark: this.remark
            };
            let ddata = this.sortGoodsDetail(this.theOrderList);
            let goodsList = [...ddata.gList];
            if (goodsList.length == 0) {
                this.$message.error("请选择商品");
                return;
            }
            if (this.ptype > 1) {
                goodsList = this.changeGoodsDetail(
                    goodsList,
                    this.oldOrderList
                );
            }
            sendData.GoodsDetail = JSON.stringify(goodsList);
            this.totalTotal = {
                num: ddata.tnum,
                price: ddata.tprice,
                discount: ddata.tdiscount,
                type: goodsList.length,
                data: sendData
            };

            if (this.ptype > 1) {
                sendData.BillId = this.selroom[0].BILLID;
                if (type == "checkout") {
                    // 编辑结账
                    console.log('checkout')
                    this.VipId = Object.keys(this.selmember).length > 0 ? this.selmember.ID : '';
                    this.showCheckout = true;
                }
                if (type == "save") {
                    // 编辑保存
                    console.log("编辑保存，", sendData);
                    this.$store.dispatch("saveRoomOrder", sendData).then(() => {
                        this.loading = true;
                    });
                }
            } else {
                // 下单 order
                if (goodsList.length > 1) {
                    this.showOrder = true;
                } else {
                    console.log("下单：一个商品，", sendData);
                    this.$store.dispatch("saveRoomOrder", sendData).then(() => {
                        this.loading = true;
                    });
                }
            }
        },
        handleSubmit2() {
            // 下单：多个商品
            this.$store
                .dispatch("saveRoomOrder", this.totalTotal.data)
                .then(() => {
                    this.loading = true;
                    this.showOrder = false;
                    this.totalTotal = {
                        type: 0,
                        data: {},
                        num: 0,
                        price: 0,
                        discount: 0
                    };
                });
        }
    },
    components: {
        selMemberPage: () => import("@/components/selected/selmember2.vue"),
        selGoodsPage: () => import("@/components/selected/selgoods2.vue"),
        royaltySel: () => import("@/components/employee/YJemployee"),
        selRoomPage: () => import("@/components/selected/selroom.vue"),
        rechargePage: () => import("@/components/Recharge/Recharge"),
        detailsPage: () => import("@/components/room/order/details.vue")
    }
};
</script>
<style scoped>
.leftArea {
    width: 380px;
    min-width: 380px;
    padding-right: 10px;
}
.rightArea {
    position: relative;
    width: 100%;
    border-left: 10px solid rgb(234, 226, 213);
    padding-left: 10px;
    overflow: hidden;
}
.tabList::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.tabList::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    background: #c1c1c1;
}
.tabList::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #f1f1f1;
}

.orderList > div:nth-child(1) {
    width: 80px;
}
.orderList > div:nth-child(2) {
    width: 60px;
}
.orderList > div:nth-child(3) {
    width: 92px;
    min-width: 80px;
}
.orderList > div:nth-child(4) {
    width: 50px;
}
.orderList > div:nth-child(5) {
    width: 60px;
}
.orderList > div:nth-child(6) {
    width: 50px;
}

.bg-primary.el-button--primary,
.bg-primary.el-button--default {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
</style>
<style>
#roomChoose .leftArea .el-tabs__nav-prev,
#roomChoose .leftArea .el-tabs__nav-next {
    background-color: #fb789a;
    color: #fff;
}

#roomChoose .el-tabs__new-tab {
    border-color: #999;
    color: #333;
}
#roomChoose .leftArea .el-tabs__nav-wrap.is-scrollable {
    padding: 0 12px;
}

#roomChoose .rightArea .el-input-group__append {
    background-color: #fb789a;
    padding: 0;
}
</style>

