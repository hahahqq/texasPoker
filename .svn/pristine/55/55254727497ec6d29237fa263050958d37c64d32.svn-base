<template>
    <el-container>
        <el-header style="height:50px;">
            <headerPage></headerPage>
        </el-header>
        <el-container>
            <el-aside width="100px">
                <section style="min-width:100px;">
                    <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
                </section>
            </el-aside>
            <el-container>
                <div class="content-new-fex">
                    <div class="content-eighty">
                        <div class="content-center">
                            <el-button size="small" type="primary" @click="showForm=true">账户互转</el-button>
                            <div class="hide">{{dataList}}</div>
                        </div>
                    </div>
                    <div class="content-table4">
                        <div class="content-table-center">
                            <el-table
                                border
                                size="small"
                                :data="dataList"
                                v-loading="loading"
                                :height="tableHeight"
                                header-row-class-name="bg-theme2 text-white"
                            >
                                <el-table-column prop="PAYTYPENAME" label="名称" width="120"></el-table-column>
                                <el-table-column prop="FIRSTMONEY" label="期初金额"></el-table-column>
                                <el-table-column prop="CURMONEY" label="余额"></el-table-column>
                                <el-table-column label="操作" align="right">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="small"
                                            type="text"
                                            @click="handleDeal(scope.row)"
                                        >编辑</el-button>
                                        <el-button
                                            size="small"
                                            type="text"
                                            @click="handleItem(scope.row)"
                                        >详情</el-button>
                                        <div class="hide">{{scope.row}}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <!-- form1 -->
                    <el-dialog
                        width="500px"
                        title="帐户互转"
                        :visible.sync="showForm"
                        append-to-body
                        style="max-width:100%;"
                    >
                        <el-form
                            ref="ruleForm1"
                            :model="ruleForm1"
                            :rules="rules1"
                            label-width="80px"
                        >
                            <el-form-item label="转出帐户" prop="OutPaytypeId">
                                <el-select
                                    v-model="ruleForm1.OutPaytypeId"
                                    placeholder="请选择转出帐户"
                                    class="full-width"
                                >
                                    <el-option
                                        v-for="(item,i) in dataList"
                                        :key="i"
                                        :label="item.PAYTYPENAME"
                                        :value="item.PAYTYPEID"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="转入帐户" prop="InPaytypeId">
                                <el-select
                                    v-model="ruleForm1.InPaytypeId"
                                    placeholder="请选择转入帐户"
                                    class="full-width"
                                >
                                    <el-option
                                        v-for="(item,i) in dataList"
                                        :key="i"
                                        :label="item.PAYTYPENAME"
                                        :value="item.PAYTYPEID"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="转出金额">
                                <el-input v-model.number="ruleForm1.Money" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="ruleForm1.Remark"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="transferfun()"
                                    :loading="formLoading"
                                >保 存</el-button>
                                <el-button @click="showForm=false">取 消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-dialog
                        width="70%"
                        title="账户流水"
                        :visible.sync="showForm2"
                        append-to-body
                        style="max-width:100%;"
                    >
                        <el-row>
                            <el-col :span="24">
                                <el-date-picker
                                    v-model="dateBE"
                                    size="small"
                                    type="daterange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    style="width:290px"
                                ></el-date-picker>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div>
                                    <span class="inline-block paddingTB-sm m-right-sm">
                                        合计单数:
                                        <span class="text-red">{{count.BillCount}}</span>
                                    </span>
                                    <span class="inline-block paddingTB-sm m-right-sm">
                                        收入金额合计:
                                        <span class="text-red">{{count.CMoney}}</span>
                                    </span>
                                    <span class="inline-block paddingTB-sm m-right-sm">
                                        支出金额合计:
                                        <span class="text-red">{{count.DMoney}}</span>
                                    </span>
                                    <span class="inline-block paddingTB-sm m-right-sm">
                                        账户余额:
                                        <span class="text-red">{{count.PayTypeAmount}}</span>
                                    </span>
                                </div>
                            </el-col>
                        </el-row>
                        <el-table
                            border
                            size="small"
                            :data="dataList1"
                            v-loading="loading1"
                            height="300"
                            header-row-class-name="bg-theme text-white"
                        >
                            <el-table-column prop="BILLTYPENAME" label="名称" width="100"></el-table-column>
                            <el-table-column prop="DMONEY" label="期初金额" width="80" align="center"></el-table-column>
                            <el-table-column prop="MONEY" label="金额" width="80" align="center"></el-table-column>
                            <el-table-column
                                prop="CMONEY"
                                label="收入金额合计"
                                width="110"
                                align="center"
                            ></el-table-column>
                            <el-table-column prop="DATESTR" label="时间" width="110"></el-table-column>
                            <el-table-column prop="SM" label="说明"></el-table-column>
                            <el-table-column prop="REMARK" label="备注" show-overflow-tooltip></el-table-column>
                        </el-table>

                        <div
                            v-if="pagination.TotalNumber > 20"
                            class="m-top-smts clearfix elpagination"
                        >
                            <el-pagination
                                @size-change="handlePageChange"
                                @current-change="handlePageChange"
                                :current-page.sync="pagination.PN"
                                :page-size="pagination.PageSize"
                                layout="total, prev, pager, next, jumper"
                                :total="pagination.TotalNumber"
                                class="text-right"
                            ></el-pagination>
                        </div>
                    </el-dialog>

                    <!-- 新增弹窗 -->
                    <el-dialog
                        width="500px"
                        title="新增账户"
                        :visible.sync="showForm3"
                        append-to-body
                        style="max-width:100%;"
                    >
                        <el-form
                            ref="ruleForm3"
                            :model="ruleForm3"
                            :rules="rules2"
                            label-width="80px"
                        >
                            <el-form-item label="帐户名称" prop="Account">
                                <el-input v-model="ruleForm3.Account"></el-input>
                            </el-form-item>
                            <el-form-item label="期初金额" v-show="shouEit">
                                <el-input v-model="ruleForm3.Money" type="number"></el-input>
                            </el-form-item>
                            <el-form-item label="是否启用">
                                <el-switch v-model="ruleForm3.ISHIDE"></el-switch>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    @click="addAccount"
                                    :loading="formLoading"
                                >保 存</el-button>
                                <el-button @click="showForm3=false">取 消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_DEFRAY from "@/mixins/defray.js";
import { getHomeData, getUserInfo } from "@/api/index";
import dayjs from "dayjs";
export default {
    mixins: [MIXINS_DEFRAY.DEFRAY_MENU],
    data() {
        var checkTitme = (rule, value, callback) => {
            if (
                (this.ruleForm1.OutPaytypeId || this.ruleForm1.InPaytypeId) &&
                this.ruleForm1.OutPaytypeId == this.ruleForm1.InPaytypeId
            ) {
                return callback(new Error("转出转入帐户不能相同"));
            } else {
                return callback();
            }
        };
        return {
            shouEit: false,
            loading: false,
            loading1: false,
            ruleForm1: {
                OutPaytypeId: "",
                InPaytypeId: "",
                Money: 0,
                Remark: ""
            },
            ruleForm3: {
                ISHIDE: false,
                Account: "",
                Money: ""
            },
            rules1: {
                OutPaytypeId: [
                    {
                        required: true,
                        message: "请选择转出帐户",
                        validator: checkTitme,
                        trigger: "change"
                    }
                ],
                InPaytypeId: [
                    {
                        required: true,
                        message: "请选择转入帐户",
                        validator: checkTitme,
                        trigger: "change"
                    }
                ]
            },
            rules2: {
                Account: [
                    {
                        required: true,
                        message: "请输入账户名称",
                        trigger: "blur"
                    }
                ],
                InPaytypeId: [
                    {
                        required: true,
                        message: "请选择转入帐户",
                        validator: checkTitme,
                        trigger: "change"
                    }
                ]
            },
            dealType: "add",
            showForm: false,
            formLoading: false,
            showForm2: false,
            showForm3: false,
            dateBE: [
                new Date(this.getCustomDay(-7)).getTime(),
                new Date().getTime()
            ],
            pageData: {
                ShopId: getHomeData().shop.SHOPID,
                PayTypeId: "",
                PN: 1,
                BeginDate: "",
                EndDate: ""
            },
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 1
            },
            count: {
                BillCount: 0,
                CMoney: 0,
                DMoney: 0,
                PayTypeAmount: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            dataList: "accountList",
            dataListState: "accountListState",
            dataList1: "accountFlowList",
            dataListState1: "accountFlowListState",
            dataState: "accountState",
            dealState: "dealAccountState",
            addaccount: "addaccount",
            dealAccountState: "dealAccountState"
        })
    },
    watch: {
        dataListState1(data) {
            if (this.loading1) {
                if (data.success) {
                    this.pagination = {
                        TotalNumber: data.paying.TotalNumber,
                        PageNumber: data.paying.PageNumber,
                        PageSize: data.paying.PageSize,
                        PN: data.paying.PN
                    };
                    this.count = {
                        BillCount: data.data.BillCount
                            ? parseInt(data.data.BillCount)
                            : 0,
                        CMoney: data.data.CMoney,
                        DMoney: data.data.DMoney,
                        PayTypeAmount: data.data.PayTypeAmount
                    };
                } else {
                    this.$message.error(data.message);
                }
            }
            this.loading1 = false;
        },
        dataListState(data) {
            this.loading = false;
        },
        dealAccountState(data) {
            this.formLoading = false;
            if (data.success) {
                this.getNewData();
            }
            this.$message({
                message: data.message,
                type: data.success ? "success" : "error"
            });
            this.showForm3 = false;
        },
        dealState(data) {
            if (data.success) {
                this.getNewData();
            }
            this.$message({
                message: data.message,
                type: data.success ? "success" : "error"
            });
        },
        addaccount(data) {
            this.formLoading = false;
            if (data.success) {
                this.getNewData();
            }
            this.$message({
                message: data.message,
                type: data.success ? "success" : "error"
            });
            this.showForm3 = false;
        }
    },
    methods: {
        handleItem(item) {
            this.showForm2 = true;
            this.pageData.PayTypeId = item.PAYTYPEID;
            this.getNewData1(0);
        },
        formatStatus: function(row, column) {
            return row.ISSTOP ? "启用" : "停用";
        },
        getNewData1() {
            let sendData = Object.assign({}, this.pageData);
            sendData.BeginDate = dayjs(this.dateBE[0]).format("YYYY-MM-DD");
            sendData.EndDate = dayjs(this.dateBE[1]).format("YYYY-MM-DD");

            this.$store.dispatch("gerAccountFlow", sendData).then(() => {
                this.loading1 = true;
            });
        },
        handlePageChange: function(currentPage) {
            if (this.pageData.PN == currentPage || this.loading) {
                return;
            }
            this.pageData.PN = parseInt(currentPage);
            this.getNewData1();
        },
        getNewData() {
            this.$store.dispatch("getAccountList", {}).then(() => {
                this.loading = true;
                this.showForm = false;
            });
        },
        handleDeal(item) {
            if (this.$refs.form) this.$refs.form.resetFields();
            if (Object.keys(item).length > 0) {
                this.dealType = "edit";
                this.shouEit = true;
                this.ruleForm3 = Object.assign({}, item, {
                    ID: item.PAYTYPEID,
                    ISHIDE: item.ISHIDE == false ? true : false,
                    Account: item.PAYTYPENAME,
                    Money: item.FIRSTMONEY
                });
            }
            this.showForm3 = true;
        },

        transferfun() {
            this.$refs.ruleForm1.validate(valid => {
                if (valid) {
                    this.$store
                        .dispatch("inoutAccountPay", this.ruleForm1)
                        .then(() => {
                            this.formLoading = true;
                        });
                }
            });
        },
        addAccount() {
            this.$refs.ruleForm3.validate(valid => {
                if (valid) {
                    this.$store
                        .dispatch("setFirstAccountMoney", this.ruleForm3)
                        .then(() => {
                            this.formLoading = true;
                        });
                }
            });
            this.formLoading = false;
        }
    },
    mounted() {
        if (this.dataList.length == 0) {
            this.getNewData();
        }
    },
    components: {
        flowPage: () => import("./flowDetails.vue"),
        headerPage: () => import("@/components/header")
    }
};
</script>

<style scoped>
.member-header {
    display: flex;
    align-items: center;
    height: 50px;
}
.center-title {
    width: 100px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    border: solid 1px #edeeee;
}
.center-cont {
    width: 100px;
    text-align: center;
    height: 50px;
    line-height: 50px;
}
.el-header {
    padding: 0 !important;
}

.payment-top {
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    background: #fff;
    height: 80px;
    line-height: 80px;
}
</style>
