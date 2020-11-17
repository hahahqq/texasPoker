<template>
    <div>
        <!-- 会员充值，余额调整  -->
        <div class="m-bottom-sm clearfix">
            <span v-if="pagelist.length>0" class="inline-block">储值积分：{{dataInfo.MONEY}}</span>
            <el-button-group v-if="pagelist.length>0" class="m-left-sm">
                <el-button size="mini" type="primary" @click="changeFun('recharge',92100105)">充值</el-button>
                <el-button
                    size="mini"
                    type="primary"
                    @click="changeFun('balanceAdjust',92100105)"
                >调整</el-button>
            </el-button-group>
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-refresh"
                plain
                class="pull-right"
                @click="pageData.PN=1;getNewData()"
            >刷新</el-button>
        </div>
        <!--列表-->
        <el-table
            :data="pagelist"
            v-loading="loading"
            height="350"
            size="small"
            header-row-class-name="bg-theme2 text-white"
            style="width: 100%;"
        >
            <el-table-column
                prop="BILLDATE"
                label="时间"
                width="140"
                sortable
                :formatter="formatDate"
            ></el-table-column>
            <el-table-column prop="BILLTYPE" label="类型" width="150px"></el-table-column>
            <el-table-column prop="MONEY" label="变动积分" align="center" width="150px">
               <template slot-scope="scope">
                  <span :style='`color:${scope.row.MONEY >= 0 ? "#ff6655" : ""}`'>{{scope.row.MONEY }} </span>
               </template>
            </el-table-column>
            <el-table-column label="变动后积分" align="center" width="150px">
               <template slot-scope="scope">
                  <span>{{scope.row.MONEY + scope.row.CURRMONEY }} </span>
               </template>
            </el-table-column>
            <el-table-column prop="SHOPNAME" label="店铺" align="center" width="150px"></el-table-column>
            <el-table-column prop="SM" label="说明"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
            <el-pagination
                @size-change="handlePageChange"
                @current-change="handlePageChange"
                :current-page.sync="pagination.PN"
                :page-size="pagination.PageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.TotalNumber"
                class="text-center"
            ></el-pagination>

        </div>
        <el-dialog :width="width" :title="title" :visible.sync="isShowDeal" append-to-body>
            <components
                :is="componentName"
                @closeModal="isShowDeal=false"
                @resetData="getNewData();isShowDeal=false"
                :theState="isShowDeal"
                :theData="dataInfo"
            ></components>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
    props: ["pageState"],
    data() {
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
            pageData: { ID:'',PN: 1 },
            isShowDeal: false,
            componentName: "",
            title: "",
            width: "50%"
        };
    },
    computed: {
        ...mapGetters({
            dataList: "memberBalanceList",
            dataListState: "memberBalanceState",
            dataInfo: "memberItemInfo",
            memberItem: "memberItem"
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
                this.SumBillCount = data.SumBillCount
                    ? parseInt(data.SumBillCount)
                    : 0;
                this.SumMoney = data.data.SumMoney ? parseInt(data.data.SumMoney) : 0;
            }else{
               this.$message({ message: data.message, type: "error" });
            }
        }
    },
    methods: {
        formatDate: function(row, column) {
            return this.filterTime(new Date(row.BILLDATE));
        },
        getNewData() {
            if (Object.keys(this.dataInfo).length == 0) {
                this.$message.error("会员信息出错！");
                return;
            }
            this.pageData.ID = this.dataInfo.ID;
            this.$store.dispatch("getMemberBalance", this.pageData).then(() => {
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
        changeFun(name, number) {
            if (!this.isPurViewFun(number)) {
                this.$notify({
                    title: "警告",
                    message: "没有权限",
                    type: "warning"
                });
                return;
            }
            this.componentName = name;
            this.width = "500px";
            switch (name) {
                case "recharge":
                    this.title = "储值积分充值";
                    this.width = "800px";
                    break;
                case "balanceAdjust":
                    this.title = "积分调整";
                    break;
            }
            this.isShowDeal = true;
        }
    },
    mounted() {
      this.getNewData();
    },
    components: {
        balanceAdjust: () => import("@/components/member/balanceAdjust.vue"),
        recharge: () => import("@/components/member/storageCardRecharge.vue")
    }
};
</script>

