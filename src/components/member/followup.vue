<template>
    <div>
        <!-- 跟进记录 -->
        <div class="m-bottom-sm clearfix">
            <!-- <span v-if="pagelist.length>0">{{pagelist[0].OWEMONEYTEXT}}</span> -->
            <el-button-group class="m-left-sm">
                <el-button size="mini" type="primary" @click="handleEdit">添加跟进记录</el-button>
            </el-button-group>
            <!-- <el-button
                size="mini"
                type="primary"
                icon="el-icon-refresh"
                plain
                class="pull-right"
                @click="pageData.PN=1;getNewData()"
            >刷新</el-button> -->
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
            <el-table-column
                prop="BILLDATE"
                label="时间"
                width="200"
                :formatter="formatDate"
            ></el-table-column>
            <el-table-column prop="REMARK" label="跟进内容"></el-table-column>
            <el-table-column prop="EMPNAME" label="跟进人"></el-table-column>
            <!-- <el-table-column prop="OWEMONEYTEXT" label="操作"></el-table-column> -->
            <el-table-column label="操作" width="100" fixed="right" align=right>
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" style="color:#2589FF">编辑</el-button>
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
        <el-dialog width="390px" title="编辑跟进记录" :visible.sync="isShowDeal" append-to-body>
            <el-input
            type="textarea"
            :rows="7"
            placeholder="请输入内容"
            v-model="textarea">
            </el-input>
            <el-row>
                <el-col :span="12" style="text-align:center;margin-top:20px;"><el-button plain size="small" @click="isShowDeal=false">取消</el-button></el-col>
                <el-col :span="12" style="text-align:center;margin-top:20px;"><el-button type="primary" size="small" @click="eitChange()">确定</el-button></el-col>
            </el-row>
        </el-dialog>
    </div>
    <!-- 欠款记录 -->
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
            pageData: { PN: 1,ID:'' },
            isShowDeal: false,
            textarea:'',
            setDate: {
                VipId:'',
                Remark:'',
                BillDate:'',
                BillId:'',
                InterfaceCode:''
             },
             folowup:'',
        };
    },
    computed: {
        ...mapGetters({
            dataList: "memberFollowupList",
            dataListState: "memberFollowupState",
            dataInfo: "memberItemInfo",
            memberFollowupDel:"memberFollowupDel",
            memberFollowupEit:"memberFollowupEit"
        })
    },
    watch: {
        memberFollowupDel(data){
            if (data.success) {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.getNewData();
            } else {
                this.$message({ message: data.message, type: "error" })
            }

        },
        memberFollowupEit(data){
            if (data.success) {
                    this.$message({
                        message: "操作成功",
                        type: "success"
                    });
                    this.isShowDeal = false;
                    this.getNewData();
            } else {
                this.$message({ message: data.message, type: "error" })
            }
        },
        pageState(value) {
            console.log("有会员ID吗",value)
            this.getNewData();
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
                this.SumMoney = data.SumMoney ? parseInt(data.SumMoney) : 0;
            }
        }
    },
    methods: {
        handleDel(event,e){
            let setDate={
                VipId:e.VIPID,
                BillId:e.BILLID
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch("getMemberFollowupDel", setDate).then(() => {
                            });
            }).catch(() => { })
        },
        handleEdit(event,e){
            console.log(e)
            if(e==undefined){
                this.folowup='add'
                console.log("add",this.folowup)
                this.textarea=''
                this.isShowDeal = true;
            }else{
                this.folowup='eit'
                console.log("eit",this.folowup)
                this.isShowDeal = true;
                this.textarea=e.REMARK;
                this.setDate={
                    VipId:e.VIPID,
                    Remark:'',
                    BillDate:e.BILLDATE,
                    BillId:e.BILLID,
                    InterfaceCode:''
                }
            }
             
        },
        eitChange(){
            if(this.folowup=='add'){
                this.setDate={
                    VipId:this.dataInfo.ID,
                    Remark:this.textarea,
                    BillDate:new Date().getTime(),
                    InterfaceCode:'210020161'
                }
            }else if(this.folowup=='eit'){
                this.setDate.Remark=this.textarea
                this.setDate.InterfaceCode='210020163'
            }
             this.$store.dispatch("getMemberFollowupEit", this.setDate).then(() => {});

        },
        formatDate: function(row, column) {
            return this.filterTime(new Date(row.BILLDATE));
        },
        getNewData() {
            if (Object.keys(this.dataInfo).length == 0) {
                this.$message.error("会员信息出错！");
                return;
            }
            this.pageData.ID = this.dataInfo.ID;
            this.$store.dispatch("getMemberFollowup", this.pageData).then(() => {
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
        changeFun(number) {
            if (!this.isPurViewFun(number)) {
                this.$notify({
                    title: "警告",
                    message: "没有权限",
                    type: "warning"
                });
            } else {
                this.isShowDeal = true;
            }
        }
    },
    mounted() {
        this.getNewData();
    },
};
</script>

