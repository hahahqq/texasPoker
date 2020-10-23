<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="2">
                <img :src="vipInfo.IMAGEURL" alt="" width="60px" height="60px" class='pull-left' style="border-radius:10px">
            </el-col>
            
            <el-col :span='20'>
                <el-row class="m-bottom-md">
                    <el-col class='font-600 font-14'>{{vipInfo.NAME}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class='m-right-sm'>手机号 ：{{vipInfo.MOBILENO}}</span> |
                        <span class='marginLR-sm'>注册时间 ：{{ new Date(vipInfo.CREATEDATE) | time}}</span> |
                        <span class='m-left-sm'>会员等级 ：{{vipInfo.LEVELNAME}}  </span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row>
            <el-col :xs='24' :sm='24' style='border-bottom:1px solid #e4e7ed; margin:3px 0; '></el-col>
        </el-row>

        <!-- 收益详情 -->
        <el-row class='m-left-sm text-center' style='margin-left:50px'>
            <el-col :span="3" style='border-right: 1px solid #e4e7ed'>
                <el-row> 邀请会员 </el-row>
                <el-row> {{vipInfo.SHARECOUNT}} </el-row>
            </el-col>

            <el-col :span="3" style='border-right: 1px solid #e4e7ed'>
                <el-row> 累计积分 </el-row>
                <el-row> {{vipInfo.SHAREINTEGRAL}} </el-row>
            </el-col>

            <el-col :span="3" style='border-right: 1px solid #e4e7ed'>
                <el-row> 累计余额 </el-row>
                <el-row> ￥ 10 </el-row>
            </el-col>

            <el-col :span="3" style='border-right: 1px solid #e4e7ed'>
                <el-row> 累计佣金 </el-row>
                <el-row> ￥ {{vipInfo.SHAREBROKERAGEMONEY}} </el-row>
            </el-col>

            <el-col :span="3">
                <el-row> 剩余佣金 </el-row>
                <el-row> <span style='color:#ff6600'> ￥ 10 </span> </el-row>
            </el-col>
        </el-row>

        <el-row>
            <el-col :xs='24' :sm='24' style='border-bottom:1px solid #e4e7ed; margin:3px 0;'></el-col>
        </el-row>

        <el-tabs v-model="activeName">
            <el-tab-pane label="收益详情" name="first">
                <el-table :data='tableData1' border size='small' height="400" header-row-class-name="bg-theme text-white" style="width: 100%;">
                    <el-table-column align="center" prop="BILLTYPE" label="消费单据"></el-table-column>
                    <el-table-column align="center" label="消费时间">
                        <template slot-scope='scope'>
                            <span>{{new Date(scope.row.BILLDATE) | time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="PAYMONEY" label="消费金额"></el-table-column>
                    <el-table-column align="center" prop="VIPNAME" label="客户信息"></el-table-column>
                    <el-table-column align="center" prop="MOBILENO" label="手机号"></el-table-column>
                    <el-table-column align="center" prop="MONEY" label="获赠积分"></el-table-column>
                    <el-table-column align="center" prop="INTEGRAL" label="获赠余额"></el-table-column>
                    <el-table-column align="center" prop="BROKERAGEMONEY" label="获赠佣金"></el-table-column>
                    <!-- <el-table-column align="center" label="操作">
                        <template slot-scope='scope'>
                            <el-button size="small" type="text" @click='viewCurItem(scope.row)'>详情</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>

                <!-- 分页 -->
                <div class="m-top-sm clearfix elpagination">
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

            </el-tab-pane>
            <el-tab-pane label="推荐会员" name="second">
                <el-table :data='tableData2' border size='small' header-row-class-name="bg-theme text-white" style="width: 100%;">
                    <el-table-column align="center" prop="VIPNAME" label="客户信息"></el-table-column>
                    <el-table-column align="center" prop="MOBILENO" label="手机号"></el-table-column>
                    <el-table-column align="center" prop="LEVELNAME" label="会员等级"></el-table-column>
                    <el-table-column align="center" prop="DATESTR" label="注册时间"></el-table-column>
                    <el-table-column align="center" prop="PAYMONEY" label="消费总额"></el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    props: {
        curVipInfo: Object,
        shareVipInfo:Object,
        choseDate: Object
    },
    data(){
        return{
            activeName: 'first',
            tableData1:[],
            tableData2:[],
            vipInfo:{},
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 1
            },
        }
    },
    computed: {
        ...mapGetters({
            RecommendVipItemState:'RecommendVipItemState'
        })
    },
    watch:{
        RecommendVipItemState(data){
            if(data.success){
                this.tableData1 = data.data.PageData.DataArr
                this.pagination = {
                    TotalNumber: data.data.PageData.TotalNumber,
                    PageNumber: data.data.PageData.PageNumber,
                    PageSize: data.data.PageData.PageSize,
                    PN: data.data.PageData.PN
                }
            }
        },
        curVipInfo(data){
            this.tableData1 = data.PageData.DataArr
            this.pagination = {
                TotalNumber: data.PageData.TotalNumber,
                PageNumber: data.PageData.PageNumber,
                PageSize: data.PageData.PageSize,
                PN: data.PageData.PN
            }
        },
        shareVipInfo(data){
            this.vipInfo = data.Obj
            this.tableData2 = data.ShareVipList
        }
    },
    methods:{
        viewCurItem(row){
            console.log(row)
        },
        handlePageChange: function(currentPage) {
            if (this.PN == currentPage || this.loading) {
                return
            }
            this.$store.dispatch('getIncomeItem',  {
                BeginDate: this.choseDate.BeginDate,
                EndDate: this.choseDate.EndDate,
                VipId: this.vipInfo.VIPID,
                PN: parseInt(currentPage)
            })
        },
    }
}
</script>

<style>

</style>
