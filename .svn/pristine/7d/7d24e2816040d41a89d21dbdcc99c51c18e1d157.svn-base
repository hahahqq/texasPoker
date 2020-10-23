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
                            <div class="content-center-cont">
                                <div class="left">
                                    <el-date-picker
                                        v-model="dateBE"
                                        style="width:300px;"
                                        type="daterange"
                                        size="small"
                                        value-format="timestamp"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                    ></el-date-picker>
                                    <div class="inline-block m-left-md m-right-xs">跟进顾问</div>
                                    <el-select v-model="pageData.SaleEmpId" placeholder="请选择" style="width:150px;" size="small">
                                        <el-option label="全部" value="-1"></el-option>
                                        <el-option v-for="(item,ii) in employeeList" :key="ii" :label="item.NAME" :value="item.ID"></el-option>
                                    </el-select>
                                    <div class="inline-block m-left-md m-right-xs">店铺</div>
                                    <el-select v-model="pageData.ShopId" placeholder="请选择" style="width:150px;" size="small">
                                        <el-option label="全部" value></el-option>
                                        <el-option v-for="item in shopList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
                                    </el-select>
                                </div>
                                <div class="right">
                                    <el-input
                                        size="small"
                                        type="default"
                                        v-model="searchText"
                                        placeholder="编号/姓名"
                                        class="pull-right"
                                        style="width: 250px;"
                                    >
                                        <template slot="append" @click="searchfun2(1)"><span style="font-size:12px;" @click="getNewData">查询</span></template>
                                        <!-- <el-button slot="append" type="default" @click="getNewData" :loading="loading">查询</el-button> -->
                                    </el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                        <!--列表-->
                        <div class="content-table4">
                            <div class="content-table-center">
                                <el-table
                                    border
                                    :data="pagelist"
                                    v-loading="loading"
                                    :height="tableHeight"
                                    header-row-class-name="bg-theme2 text-white"
                                    class="full-height"
                                    >
                                    <el-table-column prop="NAME" label="会员" width="130"></el-table-column>
                                    <el-table-column prop="PHONENO" label="手机号码" width="130"></el-table-column>
                                    <el-table-column prop="SEX" label="性别" width="80" :formatter="formatSex"></el-table-column>
                                    <el-table-column prop="VISITLASTTIME" label="最后回访日期" width="190" :formatter="formatDate"></el-table-column>
                                    <el-table-column prop="EMPNAME" label="跟进顾问" width="130"></el-table-column>
                                    <el-table-column prop="REMARK" label="备注"></el-table-column>
                                    <el-table-column label="操作" width="160" fixed="right" align="right">
                                        <template slot-scope="scope">
                                        <el-button-group>
                                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)" style="margin-left:8px;">详情</el-button>
                                        <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)" style="margin-left:8px;">删除</el-button>
                                        </el-button-group>
                                        <div class="hide">{{scope.row}}</div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页 -->
                                <div v-show="pagelist.length>0" class="m-top-smts clearfix elpagination">
                                    <el-pagination
                                        @size-change="handlePageChange"
                                        @current-change="handlePageChange"
                                        :current-page.sync="pagination.PN"
                                        :page-size="pagination.PageSize"
                                        :pager-count="5"
                                        :page-sizes="[20]"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="pagination.TotalNumber"
                                        class="text-right"
                                    ></el-pagination>
                                    <!-- <div class="text-center clearfix">
                                        <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                        <!-- item -->
                        <el-dialog title="意向客户详情" :visible.sync="showItem" width="770px" style="max-width:100%;">
                        <item-page @closeModal="showItem=false" @resetData="getNewData()" :dataType="{value: showItem, dealState: 'edit'}"></item-page>
                        </el-dialog>
                </div>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
let _ = require("lodash");
import { getHomeData } from "@/api/index";

export default {
    mixins: [MIXINS_MEMBER.MEMBER_MENU],
    data(){
        return {
            pagelist: [],
            loading: true,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 0
            },
            pageData: {
                ShopId: "",
                BeginDate: "",
                EndDate: "",
                PN: 1,
                SaleEmpId: "",
                Filter: "",
                WillLevel: ""
            },
            dateBE: [],
            multipleSelection: [],
            showItem: false,
            searchText: "",
            tableHeight: document.body.clientHeight - 280
        }
    },
    computed: {
        ...mapGetters({
            dataList: "sIntentionList",
            dataListState: "sIntentionListState",
            dataState: "sIntentionState",
            shopList: "shopList",
            dataItem: "sIntentionItem",
            employeeList: "employeeList",
            sIntentionDeal: "sIntentionDeal"
        })
    },
    watch: {
        sIntentionDeal(data){
            console.log(data)
            this.loading = false;
            // this.$message({
            //     message: data.message,
            //     type: data.success ? "success" : "error"
            // });
            this.getNewData();
        },
        dataListState(data) {
            if (this.loading) {
                this.loading = false;
                this.defaultData();
            }
        },
        searchText() {
            this.searchfun();
        },
        dataState(data) {
            this.showItem = data.success?true:false;
        }
    },
    methods: {
        formatDate: function(row, column) {
            return row.BILLDATE
                ? this.filterTime(new Date(row.BILLDATE))
                : "没有回访";
        },
        formatSex: function(row, column) {
            //性别显示转换
            return row.SEX == 0 ? "男" : "女";
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handlePageChange: function(currentPage) {
            if (this.pageData.PN == currentPage || this.loading) {
                return;
            }
            this.pageData.PN = parseInt(currentPage);
            this.getNewData();
        },
        getNewData() {
            this.pageData.BeginDate = this.dateBE == '' || this.dateBE == null ? 1 : this.dateBE[0]
            this.pageData.EndDate = this.dateBE == '' || this.dateBE == null ? 9999999999999 : this.dateBE[1]
            this.$store.dispatch("getSIntentionList", this.pageData).then(() => {
                this.loading = true;
            });
        },
        handleEdit(idx, item) {
            this.$store.dispatch("getSIntentionItem", item)
        },

        handleDel(idx,item){
            let sendData=item.ID
            this.$confirm('此操作将永久删除客户：'+item.NAME+', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store
                    .dispatch("dealSIntentionItem", sendData)
                    .then(() => {
                        this.loading = true;
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
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
        defaultData() {
            if (this.shopList.length == 0) {
                this.$store.dispatch("getShopList");
            }
            if (this.employeeList.length == 0) {
                this.$store.dispatch("getEmployeeList",{ ShopId: getHomeData().shop.ID });
            }
            if (this.dataList.length > 0) {
                this.pagelist = [...this.dataList];
            }
            this.loading = false;
            this.pagination = {
                TotalNumber: this.dataListState.paying.TotalNumber,
                PageNumber: this.dataListState.paying.PageNumber,
                PageSize: this.dataListState.paying.PageSize,
                PN: this.dataListState.paying.PN
            };
            this.pageData.ShopId = getHomeData().shop.ID;
        }
    },
    components: {
        headerPage: () => import("@/components/header"),
        itemPage: () => import("@/components/service/intentionItem")
    },
    beforeCreate() {
        let list = this.$store.state.sIntention.sIntentionList;
        if (list.length == 0) {
            this.$store.dispatch("getSIntentionList", {
                ShopId:getHomeData().shop.ID,
                PN:1
            })
        }
    },
    mounted() {
        this.defaultData();
    }

}

</script>

<style scoped>
    .el-main{
    height: 660px!important;
    }
  .el-header{
    background-color: #fff;
    color: #333;
    padding: 0 !important;
  }
    .el-aside{
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.content-center-cont{
    display: flex;
    align-items: center;
    width: 100%;
}
.content-center-cont .left{
    width: 70%;
}
.content-center-cont .right{
    width: 30%;
    text-align: right;
}
</style>
