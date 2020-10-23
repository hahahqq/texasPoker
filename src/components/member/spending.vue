<template>
    <div>
        <div class="paddingTB-sm">
            <span>累计消费</span>
            <span class="text-red marginLR-xs">{{SumBillCount}}</span>
            <span>笔，共</span>
            <span class="text-red marginLR-xs">{{SumMoney}}</span>元
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-refresh"
                plain
                class="pull-right"
                style="margin-top:-10px;"
                @click="pageData.PN=1;getNewData()"
            >刷新</el-button>
        </div>

        <!--列表-->
        <el-table
            border
            :data="pagelist"
            v-loading="loading"
            height="350"
            header-row-class-name="bg-theme2 text-white"
            style="width: 100%;"
        >
            <el-table-column prop="GOODSNAME" label="商品名称" sortable></el-table-column>
            <!-- <el-table-column prop="MONEY" label="单价" width="80" align="center"></el-table-column> -->
            <el-table-column prop="QTY" label="数量" width="80" align="center"></el-table-column>
            <el-table-column prop="CAPTION" label="消费金额" width="150"></el-table-column>
            <el-table-column prop="BILLTYPENAME" label="消费方式"></el-table-column>
            <el-table-column prop="DATESTR" label="消费时间"></el-table-column>
            <el-table-column label="消费店铺" width="120">
                <template slot-scope="scope">
                    <div class>{{shopName}}</div>
                    <div class="hide">{{scope.row}}</div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->

        <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
            <el-pagination
                @size-change="handlePageChange"
                @current-change="handlePageChange"
                :current-page.sync="pagination.PN"
                :page-size="pagination.PageSize"
                layout="prev, pager, next, jumper"
                :total="pagination.TotalNumber"
                class="text-center"
            ></el-pagination>
            <div class="text-center clearfix">
                <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
export default {
    props: ["pageState"],
    data() {
        var homeData = getHomeData();
        var shopName =
            homeData.shop && homeData.shop.SHOPNAME
                ? homeData.shop.SHOPNAME
                : "";
        return {
            pagelist: [],
            loading: false,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 0
            },
            SumBillCount: 0,
            SumMoney: 0,
            shopName: shopName,
            pageData: { ID: "", PN: 1 }
        };
    },
    computed: {
        ...mapGetters({
            dataList: "memberSpendingList",
            dataListState: "memberSpendingState",
            dataInfo: "memberItemInfo"
        })
    },
    watch: {
        pageState(value) {
            if (!value) return;
            if (this.dataList.length == 0) {
                this.getNewData();
            } else {
                this.pagelist = [...this.dataList];
            }
        },
        dataListState(data) {
            this.loading = false;
            this.pagelist = [...this.dataList];
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                };
                this.SumBillCount = data.data.SumBillCount
                    ? parseInt(data.data.SumBillCount)
                    : 0;
                this.SumMoney = data.data.SumMoney
                    ? parseInt(data.data.SumMoney)
                    : 0;
            }
        }
    },
    methods: {
        getNewData() {
            if (Object.keys(this.dataInfo).length == 0) {
                this.$message.error("会员信息出错！");
                return;
            }
            this.pageData.ID = this.dataInfo.ID;
            this.$store
                .dispatch("getMemberSpending", this.pageData)
                .then(() => {
                    this.loading = true;
                });
        },
        handlePageChange: function(currentPage) {
            if (this.pageData.PN == currentPage || this.loading) {
                return;
            }
            this.pageData.PN = parseInt(currentPage);
            this.getNewData();
        }
    },
    mounted() {
        if (this.dataList.length == 0) {
            this.getNewData();
        } else {
            this.pagelist = [...this.dataList];
        }
    }
};
</script>

