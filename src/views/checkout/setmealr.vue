<template>
    <div class="s-botton-setmealr" style="height: 100%;">
        <!-- 套餐充值 -->
        <div class="s-botton-s" style="height: 100%;">
            <el-row :gutter="24" style="height: 100%;">
                <el-col
                    :span="8"
                    style="border-right: 10px solid rgba(234, 226, 213, 1);height: 100%;position: relative;"
                >
                    <dropdown
                        @getmemberID="getmemberID"
                        :details="Object.keys(selmember).length>0?selmember:new Object()"
                    ></dropdown>
                    <el-form label-width="80px" class="fastc_top">
                        <div class="selecttaocan">
                            <el-form-item label="选择套餐">
                                <el-input
                                    v-model="setmealrName"
                                    style="float: left;width: 75%;"
                                    autocomplete="off"
                                    class="full-width"
                                    disabled="disabled"
                                    placeholder="请选择套餐"
                                ></el-input>
                                <el-button
                                    type="danger"
                                    style="width: 25%;"
                                    @click="selectsetmealr()"
                                >选择</el-button>
                            </el-form-item>

                        </div>
                        <el-form-item label="套餐价格">
                            <el-input
                                v-model="setmealrPrice"
                                autocomplete="off"
                                :disabled="true"
                                class="full-width"
                                placeholder="0.00"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="充值次数">
                            <el-input
                                v-model="rechargecount"
                                autocomplete="off"
                                class="full-width"
                                type="number"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="有效期限">
                            <el-input
                                v-model="writetime"
                                autocomplete="off"
                                class="full-width"
                                placeholder="0.00"
                                :disabled="true"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="业绩员工">
                            <a @click="selroyaltyFun()" class="full-width bg-gw block pointer font-12 el-input__inner">
                                <span
                                    v-for="(item,i) in royaltyData.default"
                                    :key="i"
                                    v-text="(i>0?'，':'')+item.Name+'：'+item.Money+'元'"
                                ></span>
                                <span v-if="royaltyData.default.length==0">请选择业绩员工</span>
                            </a>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="Remark" autocomplete="off" class="full-width"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="timescountc_left_footer" ref="footer">
                        <div class="f_commodityc-left">
                            <div class="pull-right">
                                <el-button type="success" @click="resetData()">取消</el-button>
                                <el-button type="danger" @click="Rechargeok">充值</el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <el-row :gutter="20" class="timescountc_right" v-show="SGoodsListObj!='' ">
                        <el-col :span="24" style="margin-bottom:15px;">
                            <div class="tablelcenter totletaocan">
                                <div class="menu-img">
                                    <img src="static/images/shopmore.png" width="55" height="55" />
                                    <div class="titlename">
                                        <p data-icon="10">{{SGoodsListObj.NAME}}</p>
                                        <p class="list2">
                                            <span>{{SGoodsListObj.PRICE}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col
                            :span="12"
                            style="margin-bottom:15px;"
                            v-for="(item,i) in SGoodsList"
                            :key="i"
                        >
                            <div class="tablelcenter">
                                <div class="menu-img">
                                    <img src="static/images/shopmore.png" width="55" height="55" />
                                    <div class="titlename">
                                        <p data-icon="10">{{item.GOODSNAME}}</p>
                                        <p class="list2">
                                            <span>￥{{item.GOODSPRICE}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="menu-txt com_color">
                                    <strong>x{{item.QTY}}</strong>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
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
                            v-text="(pageItemData.TotalPrice * pageItemData.EmpAddRate).toFixed(2)"
                        ></span>
                        <span>元提成</span>
                    </div>
                </slot>
            </royalty-sel>
        </el-dialog>

        <!-- 套餐充值 充值界面 -->
        <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="700px">
            <recharge
                @closeModalrecharge="showRecharge=false"
                :totalprice="{ price:(setmealrPrice * rechargecount),discount:0 }"
                :isselectvip="VipId"
                @CashRecharge="CashRecharge"
                :rechargestatus="6"
                ref="SurveyForm"
            ></recharge>
        </el-dialog>
        <!-- 选择套餐 -->
        <el-dialog title="选择套餐" :visible.sync="itemPageData.isShow" width="700px">
            <setmealm-page v-bind:itemData="itemPageData" v-on:resultArr="resultArr_fun"></setmealm-page>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";

import { getHomeData, getUserInfo } from "@/api/index";

import royaltySel from "@/components/selected/selroyalty2.vue";
import recharge from "@/components/Recharge/Recharge";
import setmealmPage from "@/components/Recharge/setmealm.vue";
import MIXINS_CHECKOUT from "@/mixins/checkout";
export default {
    mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER],
    data() {
        return {
            timescountrstatus: false,
            loading: false,
            taotandatalist: [],
            setmealrName: "",
            setmealrPrice: "",
            rechargecount: "",
            writetime: "",
            SGoodsListObj: "",
            SGoodsList: [],
            rechargeGoodsList: [],
            IsInvalid: 1,
            GoodsPackId: "",
            searchText: "",
            VipId: "",
            Remark: "",
            datalistval: {},
            SaleEmpMoneyArray: [],

            dialogFormVisible: false,
            showRecharge: false,
            itemPageData: { isShow: false, dataArr: [] },
            pageItemData: { EmpAddRate: 0, TotalPrice: 0, isShow: false },
            royaltyData: {
                data: [],
                default: []
            }
        };
    },
    computed: {
        ...mapGetters({
            selmember: "selmember",
            employeeList: "employeeList",
            royaltyState: "storagevaluerroyaltyState",
            setmealrselectlistState: "setmealrselectlistState",
            setmealrselectdetailState: "setmealrselectdetailState",
            setmealrtimesrechargeState: "setmealrtimesrechargeState"
        })
    },
    watch: {
        setmealrselectlistState(data) {
            if (data.success) {
                let DataArr = data.data.PageData.DataArr;
                if (DataArr.length > 0) {
                    this.loading = false;
                    this.taotandatalist = DataArr;
                }
            }
        },
        setmealrselectdetailState(data) {
            if (data.success) {
                this.rechargeGoodsList = [];
                this.SGoodsListObj = data.data.obj;
                this.SGoodsList = [...data.data.GoodsList];
                let InvalidDate =
                    this.IsInvalid == 1
                        ? this.getTimeStampstatuesOutput(this.writetime)
                        : 9999999999999;
                for (let i = 0; i < this.SGoodsList.length; i++) {
                    this.rechargeGoodsList.push({
                        GoodsId: this.SGoodsList[i].GOODSID,
                        Qty: this.SGoodsList[i].QTY,
                        Price: this.SGoodsList[i].GOODSPRICE,
                        IsInvalid: this.IsInvalid,
                        InvalidDate: InvalidDate
                    });
                }
            }
        },

        royaltyState(data) {
            if (data.success && this.loading) {
                this.dialogFormVisible = true;
                setTimeout(() => {
                    this.pageItemData = {
                        EmpAddRate: data.data.EmpAddRate,
                        TotalPrice: this.setmealrPrice * this.rechargecount,
                        isShow: true
                    };
                }, 200);
            }
            this.loading = false;
        },
        setmealrtimesrechargeState(data) {
            if (this.timescountrstatus) {
                if (data.success) {
                    this.$message({
                        message: "套餐充值成功",
                        type: "success"
                    });
                    this.resetData();
                    this.timescountrstatus = false;
                    let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
                    if (this.$store.state.recharge.isPrintsatus) {
                        getDayindate("601020305", data.data.BillId, 5, qresurl);
                    }
                } else {
                    this.$message.error(data.message);
                    this.timescountrstatus = false;
                }
            }
        }
    },
    methods: {
        getmemberID(id, data) {
            this.VipId = id;
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: data
            });
        },
        selectsetmealr() {
            if (this.VipId == "") {
                this.$message("请选择会员");
                return;
            }
            this.itemPageData = { isShow: true };
        },
        resultArr_fun: function(data) {
            this.itemPageData.isShow = false;
            this.selectoneTotle(data);
        },
        selectoneTotle(item) {
            this.taotandatalist = [];
            this.setmealrName = item.NAME;
            this.setmealrPrice = item.PRICE;
            this.rechargecount = 1;
            if (item.ISVALIDDAY != true) {
                this.writetime = "不限期限";
                this.IsInvalid = 0;
            } else {
                this.writetime = this.gettotlemouthDay(item.VALIDDAY);
                this.IsInvalid = 1;
            }
            this.loading = true;
            this.GoodsPackId = item.ID;
            let dataid = {
                ID: this.GoodsPackId
            };

            this.$store
                .dispatch("getssetmealrselectdetailState", dataid)
                .then(() => {
                    this.loading = false;
                    this.timescountrstatus = true;
                });
        },

        resetData() {
            this.VipId = "";
            this.Remark = "";
            this.setmealrPrice = "";
            this.setmealrName = "";
            this.rechargecount = "";
            this.writetime = "";
            this.SGoodsListObj = "";
            this.SGoodsList = [];
            this.GoodsPackId = "";
            this.datalistval = {};
            this.SaleEmpMoneyArray = [];
            this.rechargeGoodsList = [];

            this.royaltyData = {
                data: [],
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
        Rechargeok() {
            if (this.VipId == "") {
                this.$message("请选择会员");
                return;
            }
            if (this.setmealrPrice == "") {
                this.$message("请选择套餐");
                return;
            }
             if (getparametersetup(2)) {
                    if (this.royaltyData.data.length == 0) {
                        this.$message.error("请选择业绩员工");
                        return;
                    }
                }
            nscreenexCodeFun(4, String(this.setmealrPrice * this.rechargecount));
            this.showRecharge = true;
        },
        CashRecharge(data) {
            this.showRecharge = false;
            let gList = [];

            for (let i = 0; i < this.rechargeGoodsList.length; i++) {
                let item = Object.assign({}, this.rechargeGoodsList[i], {
                    Qty:
                        parseInt(this.rechargecount) *
                        parseInt(this.rechargeGoodsList[i].Qty)
                });
                gList.push(item);
            }
            let sendData = Object.assign(
                {
                    GoodsList: JSON.stringify(gList),
                    SaleEmpMoney: JSON.stringify(this.royaltyData.data),
                    VipId: this.VipId,
                    Remark: this.Remark,
                    GoodsPackId: this.GoodsPackId,
                    GoodsPackQty: Number(this.rechargecount)
                },
                data
            );

            this.$store
                .dispatch("getsetmealrtimesrechargeState", sendData)
                .then(() => {
                    this.$store.dispatch("clearMember", 0);
                });
        },
        selroyaltyFun() {
            // 选择业绩员工
            if (!this.setmealrPrice) {
                this.$message.error("请选择套餐");
                return;
            }
            this.$store.dispatch("getstoragevaluerroyaltyState").then(() => {
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
        }
    },
    components: {
        recharge,
        royaltySel,
        setmealmPage
    },
    beforeCreate() {
        let list1 = this.$store.state.employee.employeeList;
        if (list1.length == 0) {
            this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
        }
    },
    mounted() {
        if (Object.keys(this.selmember).length > 0)
            this.VipId = this.selmember.ID;
    }
};
</script>
<style scoped>
.timescountc_left_footer {
    position: absolute;
    bottom: 12px;
    left: 22px;
    right: 22px;
    background: #fff;
}
.s-botton-setmealr .el-form-item {
    margin-bottom: 14px;
}

.employee_ms .el-form-item__content {
    width: 70%;
}

.employeetitle {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
    overflow: hidden;
    color: #130606;
    text-align: center;
}

.selecttaocan {
    position: relative;
}

.selecttaocan .showtaocanList {
    margin-left: 80px;
    max-height: 260px;
    overflow-y: auto;
    position: absolute;
    background: #fff;
    width: 78%;
    z-index: 999;
    border: solid #76b7ef 2px;
    border-top: 0;
    top: 38px;
    padding: 0 10px;
}

.selecttaocan .showtaocanList li {
    overflow: hidden;
    padding: 5px 0;
    cursor: pointer;
}

.selecttaocan .showtaocanList li:hover {
    cursor: pointer;
    color: #fff;
    background: #00a0e9;
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

.timescountc_right .totletaocan {
    border: none;
    border-bottom: 2px solid #cccccc;
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
    top: 12px;
    right: 20px;
}
</style>
