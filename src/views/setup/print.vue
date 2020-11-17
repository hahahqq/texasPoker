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
                <el-main :style="{height:height+'px'}">
                    <div class="content-table1">
                        <div class="content-table-center">
                            <div class="print row-flex flex-start">
                                <section class="printEG">
                                    <div class="top">
                                        <div
                                            class="font-16 text-center m-top-sm overflow-hidden"
                                            v-if="ddList[0].isShow"
                                        >{{ddList[0].value}}</div>
                                        <div
                                            class="text-center paddingTB-xs"
                                        >{{titleText1}}&nbsp;{{titleText2}}</div>
                                        <template v-for="(item,i) in ddList1">
                                            <div class="marginTB-xxs" :key="i" v-if="item.isShow">
                                                <span>{{item.label}}</span>
                                                <span>{{item.value}}</span>
                                            </div>
                                        </template>
                                        <div class="line">
                                            <i></i>
                                        </div>
                                    </div>
                                    <div class="center">
                                        <ul>
                                            <li
                                                v-for="(item,i) in goodsList"
                                                :key="i"
                                                class="row-flex"
                                            >
                                                <span style="width:50%">{{item.name}}</span>
                                                <span style="width:25%">{{item.qty}}</span>
                                                <span style="width:25%">{{item.price}}</span>
                                            </li>
                                        </ul>
                                        <div class="line">
                                            <i></i>
                                        </div>
                                        <template v-for="(item,i) in ddList2">
                                            <div
                                                class="marginTB-xxs"
                                                :key="'2'+i"
                                                v-if="item.isShow"
                                            >
                                                <span>{{item.label}}</span>
                                                <span>{{item.value}}</span>
                                            </div>
                                        </template>
                                        <div class="line">
                                            <i></i>
                                        </div>
                                        <div class="marginTB-xxs">
                                            <span>现金支付：</span>
                                            <span>&yen;100</span>
                                        </div>
                                        <div class="line">
                                            <i></i>
                                        </div>
                                        <!-- 会员 -->
                                        <template v-for="(item,i) in ddList3">
                                            <div
                                                class="marginTB-xxs"
                                                :key="'3'+i"
                                                v-if="item.isShow"
                                            >
                                                <span>{{item.label}}</span>
                                                <span>{{item.value}}</span>
                                            </div>
                                        </template>
                                        <div class="line" v-if="ddList3Count>0">
                                            <i></i>
                                        </div>
                                        <template v-for="(item,i) in ddList4">
                                            <div
                                                class="marginTB-xxs"
                                                :key="'4'+i"
                                                v-if="item.isShow"
                                            >
                                                <span>{{item.label}}</span>
                                                <span>{{item.value}}</span>
                                            </div>
                                        </template>
                                        <div class="text-center">
                                            <div
                                                class="marginTB-xxs overflow-hidden"
                                                v-if="ddList[1].isShow"
                                            >{{ddList[1].value}}</div>
                                            <img
                                                :src="ddList[2].value"
                                                :alt="ddList[2].label"
                                                style="width:100px;"
                                                v-if="ddList[2].isShow"
                                            />
                                        </div>
                                    </div>
                                    <div class="bottom"></div>
                                </section>
                                <!-- set -->
                                <section class="m-top-lg" style="height:690px;">
                                    <div style="margin-bottom:12px;">
                                        <span>自动打印小票</span>
                                        <el-switch
                                            v-model="setupPrintstatus"
                                            active-color="#rgb(251, 120, 154)"
                                            inactive-color="##9E9E9E"
                                            class="pull-right"
                                            @change="setupPrint"
                                        ></el-switch>
                                    </div>
                                    <div class="m-bottom-sm">
                                        <span>如需打印小票，请下载打印插件并完成安装。</span>
                                        <el-button type="primary" size="mini">
                                            <a href="static/images/CLodop_Setup.exe" title>点击下载</a>
                                        </el-button>
                                    </div>
                                    <div class="padding-sm border">
                                        <div class="line2 m-top-xs p-bottom-xs">标题注脚设置</div>
                                        <div style="line-height:32px; margin-top: 10px">
                                            <span>打印小票规格</span>
                                            <el-select
                                                size="mini"
                                                v-model="setupPrintType"
                                                @change="setPrintTypeFun"
                                                placeholder="请选择"
                                                style="width:90px"
                                            >
                                                <el-option label="50mm" :value="0" size="mini"></el-option>
                                                <el-option label="80mm" :value="1" size="mini"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="row-flex">
                                            <el-checkbox
                                                v-model="ddList[0].isShow"
                                                @change="ssListFun1"
                                                class="marginTB-xs"
                                                style="width:100px;"
                                            >{{ddList[0].label}}</el-checkbox>
                                            <a
                                                class="m-top-xs inline-block border-bottom full-width pointer"
                                                @click="changeLabel(ddList[0])"
                                            >{{ddList[0].value}}</a>
                                        </div>
                                        <div class="row-flex">
                                            <el-checkbox
                                                v-model="ddList[1].isShow"
                                                @change="ssListFun2"
                                                class="marginTB-xs"
                                                style="width:100px;"
                                            >{{ddList[1].label}}</el-checkbox>
                                            <a
                                                class="m-top-xs inline-block border-bottom full-width pointer"
                                                @click="changeLabel(ddList[1])"
                                            >{{ddList[1].value}}</a>
                                        </div>

                                        <div v-for="(item,ii) in ssList" :key="ii" class>
                                            <div v-if="ii==0">
                                                <div class="line2 m-top-xs p-bottom-xs">店铺信息（可选打印选项）</div>
                                                <el-checkbox
                                                    v-model="ddList[2].isShow"
                                                    @change="ssListFun3"
                                                    class="marginTB-xs"
                                                >{{ddList[2].label}}</el-checkbox>
                                            </div>
                                            <div v-if="ii==3">
                                                <div class="line2 m-top-xs p-bottom-xs">会员信息（可选打印选项）</div>
                                            </div>
                                            <el-checkbox
                                                v-model="item.checked"
                                                @change="ssListFun(item)"
                                                class="marginTB-xs"
                                            >{{item.name}}</el-checkbox>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div style="width:100%;height:10px;background-color: #F4F5FA"></div>
                    <div style="width:100%;height:10px;background-color: #fff"></div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
import qrcode from "@/assets/qrcode.png";
import {
    getPrintData,
    setPrintData,
    getOthersData,
    setOthersData,
    getUserInfo
} from "@/api/index";
import MIXINS_SETUP from "@/mixins/setup";
import { SYSTEM_INFO } from "@/util/define.js";
export default {
    mixins: [MIXINS_SETUP.SIDERBAR_MENU],
    data() {
        return {
            setupPrintType: localStorage.getItem("printType")
                ? localStorage.getItem("printType")
                : 0, // //小票规格 0=50mm , 1=80mm
            height: window.innerHeight - 60,
            setupPrintstatus: false,
            titleText1: "店铺名称",
            titleText2: "小票打印",
            ddList: [
                {
                    label: "标题",
                    value: SYSTEM_INFO.NAME,
                    isShow: true
                },
                {
                    label: "注脚",
                    value: "谢谢惠顾，欢迎下次光临!",
                    isShow: true
                },
                {
                    label: "店铺二维码",
                    value: qrcode,
                    isShow: true
                }
            ],
            goodsList: [
                {
                    name: "商品",
                    qty: "数量",
                    price: "金额",
                    isShow: true
                },
                {
                    name: "红烧肉",
                    qty: "2",
                    price: "40",
                    isShow: true
                },
                {
                    name: "宫保鸡丁",
                    qty: "1",
                    price: "150",
                    isShow: true
                }
            ],
            ddList1: [
                {
                    label: "结账单号：",
                    value: "1000000",
                    isShow: true
                },
                {
                    label: "结账日期：",
                    value: "2020-10-19 11:34",
                    isShow: true
                },
                {
                    label: "收 银 员：",
                    value: getUserInfo().UserName,
                    isShow: true
                }
            ],
            ddList2: [
                {
                    label: "折扣优惠：",
                    value: "-10",
                    isShow: true
                },
                {
                    label: "优惠金额：",
                    value: "-10",
                    isShow: true
                },
                {
                    label: "优惠券：",
                    value: "-20",
                    isShow: true
                },
                {
                    label: "其它费用：",
                    value: "6",
                    isShow: true
                }
            ],
            ddList3: [
                {
                    label: "会员卡号：",
                    value: "000001",
                    isShow: true
                },
                {
                    label: "会员姓名：",
                    value: "陈生",
                    isShow: true
                },
                {
                    label: "会员余额：",
                    value: "678",
                    isShow: true
                },
                {
                    label: "积分(本次/剩余)：",
                    value: "256/32555",
                    isShow: true
                }
            ],
            ddList4: [
                {
                    label: "联系电话：",
                    value: "",
                    isShow: true
                },
                {
                    label: "联系地址：",
                    value: "",
                    isShow: true
                }
            ],
            ssList: [
                {
                    name: "收 银 员",
                    checked: true,
                    list: 1,
                    no: 2
                },
                {
                    name: "店铺电话",
                    checked: true,
                    list: 4,
                    no: 0
                },
                {
                    name: "店铺地址",
                    checked: true,
                    list: 4,
                    no: 1
                },
                {
                    name: "会员卡号",
                    checked: true,
                    list: 3,
                    no: 0
                },
                {
                    name: "会员姓名",
                    checked: true,
                    list: 3,
                    no: 1
                },
                {
                    name: "会员余额",
                    checked: true,
                    list: 3,
                    no: 2
                },
                {
                    name: "会员积分",
                    checked: true,
                    list: 3,
                    no: 3
                }
            ]
        };
    },
    computed: {
        ddList3Count() {
            return this.ddList3.filter(todo => todo.isShow).length;
        }
    },
    methods: {
        setPrintTypeFun() {
            localStorage.setItem("printType", this.setupPrintType);
        },
        setupPrint() {
            setOthersData({ isprint: this.setupPrintstatus });
        },
        ssListFun(item) {
            switch (item.list) {
                case 1:
                    this.ddList1[item.no].isShow = item.checked;
                    break;
                case 3:
                    this.ddList3[item.no].isShow = item.checked;
                    break;
                case 4:
                    this.ddList4[item.no].isShow = item.checked;
                    break;
            }
        },
        ssListFun1(v) {
            this.ddList[0].isShow = v;
        },
        ssListFun2(v) {
            this.ddList[1].isShow = v;
        },
        ssListFun3(v) {
            this.ddList[2].isShow = v;
        },
        changeLabel(item) {
            this.$prompt("请输入" + item.label + "内容", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValue: item.value
            })
                .then(({ value }) => {
                    item.value = value;
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消输入"
                    });
                });
        }
    },
    created() {
        let pringInfo = getPrintData();
        if (pringInfo) {
            let setInfo = Object.assign({}, pringInfo);
            this.ddList = [...setInfo.ddList];
            this.ddList1 = [...setInfo.ddList1];
            this.ddList3 = [...setInfo.ddList3];
            this.ddList4 = [...setInfo.ddList4];
            this.ssList = [...setInfo.ssList];
        }
        this.setupPrintstatus = getOthersData().isprint ? true : false;
        this.setupPrint.num = getOthersData().printnum
            ? parseInt(getOthersData().printnum)
            : 1;
        this.setupPrint.type = getOthersData().printtype
            ? parseInt(getOthersData().printtype)
            : 0;
    },
    beforeDestroy() {
        setPrintData({
            ddList: this.ddList,
            ddList1: this.ddList1,
            ddList3: this.ddList3,
            ddList4: this.ddList4,
            ssList: this.ssList
        });
    },
    components: {
        headerPage: () => import("@/components/header")
    }
};
</script>
<style scoped>
.printEG .marginTB-xxs {
    margin: 5px 0px;
}

.printEG .line {
    padding: 5px 0;
    position: relative;
}

.printEG .line > i {
    display: block;
    height: 2px;
    border: 1px dashed rgb(0, 0, 0);
}

.printEG > .center > ul {
    padding: 3px 0;
    line-height: 1.5;
}

.print .line2 {
    border-bottom: 2px dashed #ccc;
}
</style>
