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
                            <el-row :gutter="10" class="content-center-cont">
                                <el-col :span="8">
                                    <el-dropdown size='small' class="pull-left" @command="checkProjectTypeFun">
                                        <el-button size="small" type="primary">
                                            新增比赛项目<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command='0'>SNG比赛</el-dropdown-item>
                                            <el-dropdown-item command='1'>MTT比赛</el-dropdown-item>
                                            <el-dropdown-item command='3' v-if="IsIntegralMatch">自由积分赛</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-col>
                            </el-row>
                        </div>
                    </div>

                    <div class="content-table4">
                        <div class="content-table-center">

                            <el-tabs type="card" v-model="activeName" @tab-click='selectEventsFun(activeName)'>
                                <el-tab-pane name="-1" label="全部赛事"></el-tab-pane>
                                <el-tab-pane name="0" label="SNG比赛"></el-tab-pane>
                                <el-tab-pane name="1" label="MTT比赛"></el-tab-pane>
                                <el-tab-pane name="3" label="自由积分赛" v-if="IsIntegralMatch"></el-tab-pane>
                            </el-tabs>

                            <!-- 列表 -->
                            <el-table
                                size="small"
                                :data="tableData"
                                header-row-class-name="bg-F1F2F3"
                                style="width: 100%;"
                                :height="tableHeight"
                                v-loading="loading"
                                element-loading-text="数据加载中"
                                element-loading-spinner="el-icon-loading"
                            >
                                <el-table-column prop="NAME" label="比赛项目">
                                   <template slot-scope="scope">
                                      <el-button type="text" @click="handleViewItem(scope.row, scope.$index)">{{scope.row.NAME}}</el-button>
                                   </template>
                                </el-table-column>

                                <el-table-column prop="TYPE" label="比赛类型" :formatter="formatType" align="center"></el-table-column>

                                <el-table-column prop="BUYINMONEY" label="参赛积分" align="center"></el-table-column>

                                <el-table-column label="服务费" align="center">
                                    <template slot-scope="scope">
                                        {{ scope.row.CHARGESTYPE == 0 ? Number(scope.row.CHARGESRATE) * 100+'%' : scope.row.CHARGESMONEY+'元'}}
                                    </template>
                                </el-table-column>

                                <el-table-column prop="REMARK" label="备注">
                                   <template slot-scope='scope'>
                                      {{ scope.row.REMARK != undefined ? scope.row.REMARK : '--' }}
                                   </template>
                                </el-table-column>

                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button size='small' type="text" @click="handleViewItem(scope.row, scope.$index)">详情</el-button>
                                        <el-button size='small' type="text" @click="handleDel(scope.row, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <!-- 分页 -->
                            <div v-show="tableData.length>0" class="m-top-sm clearfix elpagination">
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

        <!-- 新增比赛项目 -->
        <el-dialog :title="`${EventId == '' ? '新增 ' : '编辑 '}${title}`" :visible.sync="showAddDialog" :close-on-click-modal="false" width="60%" :before-close="handleClose">

            <addSng
                v-if='projectType == 0'
                @closeModal="showAddDialog=false; EventId= ''"
                @resetList="showAddDialog=false; EventId= ''; getNewData(activeName, 1)"
                :dataType="{EventId: EventId, dealState: EventId == '' ? 'add' : 'edit', info: eventsDetails }">
            </addSng>

            <addMtt
                v-if='projectType == 1'
                @closeModal="showAddDialog=false; EventId= ''"
                @resetList="showAddDialog=false; EventId= ''; getNewData(activeName, 1)"
                :dataType="{EventId: EventId, dealState: EventId == '' ? 'add' : 'edit', info: eventsDetails }">
            </addMtt>

            <addIntegral
                v-if='projectType == 3'
                @closeModal="showAddDialog=false; EventId= ''"
                @resetList="showAddDialog=false; EventId= ''; getNewData(activeName, 1)"
                :dataType="{EventId: EventId, dealState: EventId == '' ? 'add' : 'edit', info: eventsDetails }">
            </addIntegral>
        </el-dialog>
    </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_GAME from "@/mixins/game.js";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
    mixins: [ MIXINS_GAME.GAME_MENU ],
    data() {
        return {
            tableHeight:document.body.clientHeight-300,
            projectType: -1,
            activeName: '-1',
            loading: false,
            tableData: [],
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 1
            },
            PN: 1,
            title: '',
            showAddDialog: false,
            EventId: '',
            eventsDetails: {},
            IsIntegralMatch: getUserInfo().CompanyConfig.ISINTEGRALMATCH
        }
    },
    computed: {
        ...mapGetters({
            getEventsListState: "getEventsListState",
            delEventsState: 'delEventsState',
            getEventsDetailsState: 'getEventsDetailsState'
        })
    },
    watch: {
        getEventsListState(data){
            console.log(data)
            this.loading = false
            if(data.success){
                let _data = data.data.PageData
                this.tableData = _data.DataArr
                this.pagination = {
                    TotalNumber: _data.TotalNumber,
                    PageNumber: _data.PageNumber,
                    PageSize: _data.PageSize,
                    PN: _data.PN
                }
            }else{
                this.$message({ message: data.message, type: "error" })
            }
        },
        delEventsState(data){
            console.log(data)
            if(data.success){
                this.$message({ message: '删除成功', type: "success" })
                this.getNewData(this.activeName, 1)
            }else{
                this.$message({ message: data.message, type: "error" })
            }
        },
        getEventsDetailsState(data){
            console.log(data)
            if(data.success){
                this.eventsDetails = data.data
            }
        }
    },
    methods:{
        checkProjectTypeFun(type){
            this.projectType = type
            this.showAddDialog = true
            if(type == 0){
                this.title = 'SNG 比赛项目'
            }else if(type == 1){
                this.title = 'MTT 比赛项目'
            }else if(type == 3){
                this.title = '自由积分赛项目'
            }
        },
        selectEventsFun(activeName){
            this.getNewData(activeName, 1)
        },
        getNewData(Type, PN){
            this.$store.dispatch("getEventsList", { Type : Type, PN : PN, IsIntegralMatch: this.IsIntegralMatch }).then(() => {
                this.loading = true
            })
        },
        handleClose(){
            this.EventId = ''
            this.showAddDialog = false
        },
        handleDel(row, idx){
            this.$confirm("确认删除【"+ row.NAME +"】赛事?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.dispatch("delEvents", { Id : row.ID })
            }).catch(() => { })
        },
        handleViewItem(row, idx){
            this.EventId = row.ID
            this.$store.dispatch("getEventsDetails", { Id : row.ID }).then(() =>{
                this.checkProjectTypeFun(row.TYPE)
            })
        },
        formatType: function(row, column) {
            let type = ''
            if(row.TYPE == 0){
                type = 'SNG'
            }else if(row.TYPE == 1){
                type = 'MTT'
            }else if(row.TYPE == 2){
                type = '猎人赛'
            }else if(row.TYPE == 3){
                type = '自由积分赛'
            }
            return type
        },
        handlePageChange: function(currentPage) {
            if (this.PN == currentPage || this.loading) {
                return;
            }
            this.PN = parseInt(currentPage);
            this.getNewData(this.activeName, this.PN);
        },
    },
    components: {
        headerPage: () => import("@/components/header"),
        addSng: () => import("./add_SNG.vue"),
        addMtt: () => import("./add_MTT.vue"),
        addIntegral: () => import("./add_Integral.vue")
    },
    mounted(){
        this.getNewData( -1 , 1 )
    }
}
</script>


<style scoped>
.member-header{
    display: flex;
    align-items: center;
    height: 50px;
}

.el-header{
    padding: 0 !important;
}

.el-header, .el-footer {
    background-color: #fff;
    color: #333;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #F4F5FA;
    color: #333;
}
</style>
