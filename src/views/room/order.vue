<template>
    <div class="roomOrder" v-loading="loading">
        <!-- table -->
        <el-table
            :data="dataList"
            :max-height="height"
            header-row-class-name="bg-theme text-white"
            style="width: 100%"
        >
            <el-table-column label="序号" prop="RN" width="50" class="text-center"></el-table-column>
            <el-table-column label="订单单号" prop="BILLNO"></el-table-column>
            <el-table-column label="下单时间" prop="DATESTR"></el-table-column>
            <el-table-column label="订单内容" prop="LONGGOODSNAME"></el-table-column>
            <el-table-column label="房台" prop="LONGROOMNAME"></el-table-column>
            <el-table-column label="金额" prop="GOODSMONEY"></el-table-column>
            <el-table-column fixed="right" label="操作" width="280">
                <template slot-scope="props">
                    <el-button-group>
                        <el-button
                            size="small"
                            @click.native.prevent="handleClick('checkout',props.row)"
                        >结账</el-button>
                        <el-button
                            size="small"
                            @click.native.prevent="handleClick('edit',props.row)"
                        >详情</el-button>
                        <el-button
                            size="small"
                            @click.native.prevent="handleClick('print',props.row)"
                        >打印</el-button>
                        <el-button
                            size="small"
                            @click.native.prevent="handleClick('cancel',props.row)"
                        >作废</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- page -->
        <div class="text-right m-top-sm relative">
            <el-button
                type="primary"
                size="small"
                icon="el-icon-refresh"
                @click="formData.PN=1;getNewData()"
                class="pull-left"
            >刷新</el-button>
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="dataListState.paying.PN"
                :page-size="dataListState.paying.PageSize"
                layout="prev, pager, next, jumper"
                background
                :total="dataListState.paying.TotalNumber"
            ></el-pagination>
        </div>
        <!-- 订单详情 -->
        <el-dialog
            v-if="showItem"
            :title="'订单详情（'+theOrderItem2.BILLNO+'）'"
            :visible.sync="showItem"
            width="500"
        >
            <editPage @closeModal="resetData" :theData="theOrderItem2"></editPage>
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
import MIXINS_ROOM from "@/mixins/room";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
export default {
    mixins: [MIXINS_ROOM.DEAL_ORDER],
    data() {
        return {
            formData: { PN: 1 },
            loading: false,
            height: window.innerHeight - 168,
            showItem: false,
            theOrderItem: {},
            theOrderItem2: {},
            theOrderList: [],
            showCheckout: false,
            thetype: "",
            VipId: ""
        };
    },
    computed: {
        ...mapGetters({
            dataList: "roomOrderList",
            dataListState: "roomOrderListState",
            dataItem: "roomOrderItem",
            printState: "printRoomOrderState",
            cancelState: "cancelRoomOrderState",
            paywayList: "paywayList"
        })
    },
    watch: {
        dataListState(data) {
            this.loading = false;
            if (data.success) {
                this.formData.PN = data.paying.PN;
            }
        },
        dataItem(data) {
            if (data.success && this.loading) {
                // this.showItem = true;
                this.dealselRoomData(data.data, this.theOrderItem2); // 单据详情数据处理
                if (this.thetype == "edit") {
                    this.$emit("changePage", 2);
                } else if (this.thetype == "checkout") {
                    if (data.data.VipObj && data.data.VipObj.ID) {
                        this.VipId = data.data.VipObj.ID;
                    }
                    nscreenexCodeFun(4, String(this.theOrderItem2.GOODSMONEY));
                    this.theOrderList = [...this.selroom];
                    this.showCheckout = true;
                }
            }
            if (!data.success) {
                this.$message({
                    showClose: true,
                    message: data.message,
                    type: "error"
                });
            }
            this.loading = false;
        },
        printState(data) {
            this.loading = false;
            console.log(data);
        },
        cancelState(data) {
            if (data.success) {
                this.showItem = false;
                this.resetData(true);
            }
            if (this.loading) {
                this.$message({
                    showClose: true,
                    message: data.message,
                    type: data.success ? "success" : "error"
                });
            }
            this.loading = false;
        }
    },
    methods: {
        getNewData() {
            let sendData = Object.assign({}, this.formData, {
                IsCheck: 0,
                BeginDate: 1,
                EndDate: 9999999999999
            });
            this.$store.dispatch("getRoomOrderList", sendData).then(() => {
                this.loading = true;
            });
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            if (this.formData.PN != val) {
                this.formData.PN = val;
                this.getNewData();
            }
        },
        handleClick(type, item) {
            console.log(type, item);
            this.thetype = type;
            this.theOrderItem2 = Object.assign({}, item);
            if (type == "edit" || type == "checkout") {
                this.VipId = "";
                this.$store
                    .dispatch("getRoomOrderItem", {
                        RoomId: "",
                        BillId: item.BILLID
                    })
                    .then(() => {
                        this.loading = true;
                        this.$store.dispatch("getRoomList2");
                    });
            }
            if (type == "cancel") {
                if (!this.isPurViewFun(601050207)) {
                    this.$notify({
                        title: "警告",
                        message: "没有权限",
                        type: "warning"
                    });
                    return;
                }

                this.$confirm("是否作废单号：" + item.BILLNO, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$store
                            .dispatch("cancelRoomOrder", {
                                BillId: item.BILLID
                            })
                            .then(() => {
                                this.loading = true;
                            });
                    })
                    .catch(() => {});
            }
            if (type == "print") {
                let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
                getDayindate("601020444", item.BILLID, 1, qresurl);
                // this.$store
                //   .dispatch("printRoomOrder", {
                //     BillId: item.BILLID
                //   })
                //   .then(() => {
                //     this.loading = true;
                //   });
            }
        },
        resetData: function(status) {
            if (status) {
                this.formData.PN = 1;
                this.$store.dispatch("clearRoomAll", 1).then(() => {
                    this.getNewData();
                });
            }
            this.showItem = false;
            this.showCheckout = false;
        }
    },
    mounted() {
        this.height = window.innerHeight - 168;
        if (this.dataList.length == 0) {
            this.getNewData();
        }
    },
    components: {
        editPage: () => import("@/components/room/order/edit.vue"),
        rechargePage: () => import("@/components/Recharge/Recharge"),
        detailsPage: () => import("@/components/room/order/details.vue")
    }
};
</script>
