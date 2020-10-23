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
                                <el-date-picker
                                    size="small"
                                    style="width:300px;"
                                    v-model="dateBE"
                                    type="daterange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                                <div class="inline-block m-left-md m-right-xs">状态</div>
                                <el-select v-model="pageData.Status" placeholder="请选择" style="width:150px;" size="small">
                                    <el-option label="全部" value="-1"></el-option>
                                    <el-option label="未受理" value="0"></el-option>
                                    <el-option label="已受理" value="1"></el-option>
                                </el-select>
                                <el-button type="primary" class="m-left-md overall-font" @click="getNewData" :loading="loading" size="small">查 询</el-button>
                            </div>
                        </div>
                    </div>
                    <!--列表-->
                <div class="content-table4">
                    <div class="content-table-center">
                        <el-table
                            border
                            :data="pagelist"
                            :height="tableHeight"
                            v-loading="loading"
                            header-row-class-name="bg-theme2 text-white"
                            style="width: 100%;"
                            >
                            <el-table-column prop="VIPNAME" label="会员名"></el-table-column>
                            <el-table-column prop="MOBILENO" label="手机号码"></el-table-column>
                            <el-table-column prop="SEXNAME" label="性别" width='60' align="center"></el-table-column>
                            <el-table-column prop="SHOPNAME" label="店铺"></el-table-column>
                            <el-table-column prop="REMARK" label="反馈内容" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="CHECKREMARK" label="回复内容" show-overflow-tooltip></el-table-column>
                            <el-table-column label="状态">
                               <template slot-scope="scope">
                                  {{scope.row.ISCHECK ? '已受理' : '未受理'}}
                               </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" align="right">
                                <template slot-scope="scope">
                                <el-button-group>
                                    <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" style="margin-left:8px;">详情</el-button>
                                    <el-button size="small" type="text" @click="handleReply(scope.$index, scope.row)" style="margin-left:8px;">回复</el-button>
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
                                layout="total, prev, pager, next, jumper"
                                :total="pagination.TotalNumber"
                                class="text-center"
                            ></el-pagination>

                        </div>
                    </div>
                </div>

                </div>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
let _ = require("lodash");

export default {
    mixins: [MIXINS_MEMBER.MEMBER_MENU],
    data(){
        return {
            pagelist: [],
            tableHeight: document.body.clientHeight - 260,
            loading: true,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 0
            },
            pageData: {
                VipId: "",
                BeginDate: "",
                EndDate: "",
                PN: 1,
                Status: "-1" // -1=all 0=未受理,1=已受理
            },
            dateBE: [],

            ruleForm: {
                ShopId: "",
                VipId: "",
                Remark: ""
            },
            rules:{
                ShopId: [
                    { required: true, message: '请选择店铺', trigger: 'change' }
                ],
                Remark: [
                    { required: true, message: '请填写内容', trigger: 'blur' }
                ],
            },
            vipItem: {}
        }
    },
    computed: {
        ...mapGetters({
            dataList: "sOpinionList",
            dataListState: "sOpinionListState",
            dataState: "sOpinionState",
            memberItemInfo: "memberItemInfo"
        })
    },
    watch: {
       memberItemInfo(data){
            this.$router.push({
               name: 'acceptanceItem', query:{ ID: this.vipItem.VIPID, BILLID: this.vipItem.BILLID }
            })
         },
        dataListState(data) {
           console.log(data)
                this.loading = false;
                this.pagelist = [...this.dataList];
                if (data.success) {
                    this.pagination = {
                        TotalNumber: data.paying.TotalNumber,
                        PageNumber: data.paying.PageNumber,
                        PageSize: data.paying.PageSize,
                        PN: data.paying.PN
                    };
                }

        },
         dataState(data) {
            this.$message({
               message: data.message,
               type: data.success ? "success" : "error"
            });
            this.pageData.PN =1;
            this.getNewData();
         }
    },
    methods: {
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

            this.$store.dispatch("getSOpinionList", this.pageData).then(() => {
                this.loading = true;
            })
        },
        handleEdit(idx, item) {
            this.vipItem = item
            this.$store.dispatch('getMemberItem', { ID: item.VIPID })
        },
        handleReply(idx, item) {
            this.$prompt("", "回复内容", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputType: "textarea",
                inputPattern: /\S/,
                inputErrorMessage: "内容不能为空",
                inputPlaceholder: '请输入回复内容'
            }).then(({ value }) => {
                this.$store.dispatch("replySOpinionItem", {
                    BILLID: item.BILLID,
                    Remark: value
                })
            }).catch(() => {});
        }
    },
    components: {
        headerPage: () => import("@/components/header"),
        itemPage: () => import("@/components/service/opinionItem")
    },
    mounted() {
       this.$store.dispatch("getSOpinionList", { Status: "-1" });
    }

}

</script>

<style scoped>
  .el-header{
    background-color: #fff;
    color: #333;
    padding: 0 !important;
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
