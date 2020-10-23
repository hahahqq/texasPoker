<template>
    <div>
        <el-row :gutter="10">
            <el-col
                :xs="12"
                :sm="8"
                :md="6"
                :lg="6"
                :xl="4"
                v-if="Object.keys(dataItem.data.Obj).length>0"
                v-for="(item,i) in pageList"
                :key="i"
            >
                <div class="p-bottom-sm">
                    <span class="inline-block" style="min-width:62px;">{{item.label}}</span>
                    <span class="inline-block">{{dataItem.data.Obj[item.value]}}</span>
                </div>
            </el-col>
        </el-row>

        <!-- table-->
        <el-table
            border
            :data="dataItem.data.GoodsObj"
            v-loading="loading"
            header-row-class-name="bg-theme text-white"
            class="full-width"
        >
            <!-- <el-table-column prop="" label="序号"></el-table-column> -->
            <el-table-column prop="GOODSNAME" label="商品"></el-table-column>
            <el-table-column prop="GOODSPRICE" label="单价"></el-table-column>
            <el-table-column prop="QTY" label="数量"></el-table-column>
            <el-table-column prop="MONEY" label="金额"></el-table-column>
        </el-table>

        <div class="text-right p-top-sm">
            <!-- <el-button type="info" plain @click="toCancelFun()" size="small">作废</el-button> -->
            <el-button type="primary" @click="toPrintFun()" size="small">打印</el-button>
            <el-button type="primary" @click="closeModal" plain size="small">关闭</el-button>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getDayindate } from "@/util/Printing";
export default {
    data() {
        return {
            pageList: [
                { label: "销售单号", value: "BILLNO" },
                { label: "销售日期", value: "BILLDATE" },
                { label: "销售门店", value: "SHOPNAME" },
                { label: "会员", value: "VIPNAME" },
                { label: "商品金额", value: "GOODSMONEY" },
                { label: "优惠金额", value: "COUPONMONEY" },
                { label: "实收金额", value: "PAYMONEY" }
                // {label:'支付方式',value:''}
            ],
            loading: false
        };
    },
    computed: {
        ...mapGetters({
            dataItem: "CCGoodsItem",
            guadancdlState: "guadancdlState"
        })
    },
    watch: {
        guadancdlState(data) {
            if (data.success) {
                this.$message({
                    type: "success",
                    message: "作废成功"
                });
                this.closeModal();
            }
        }
    },
    methods: {
        closeModal(type) {
            this.$emit("closeModal");
        },
        toCancelFun() {
            console.log("toCancelFun");
            if (!this.isPurViewFun(601050207)) {
                this.$notify({
                    title: "警告",
                    message: "没有权限",
                    type: "warning"
                });
                return;
            }
            let BillId = this.dataItem.data.Obj.BILLID;
            let BillNo = this.dataItem.data.Obj.BILLNO;
            this.$confirm("是否作废单号：" + BillNo + "?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store
                        .dispatch("getguadancdlState", { BillId: BillId })
                        .then(() => {
                            this.loading = true;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消作废"
                    });
                });
        },
        toPrintFun() {
            console.log("toPrintFun", this.dataItem);
            let BillId = this.dataItem.data.Obj.BILLID;
            let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
            getDayindate("601020406", BillId, 1, qresurl);
        },
        notifyFun(number) {
            if (!this.isPurViewFun(number)) {
                this.$notify({
                    title: "警告",
                    message: "没有权限",
                    type: "warning"
                });
            }
        }
    }
};
</script>
