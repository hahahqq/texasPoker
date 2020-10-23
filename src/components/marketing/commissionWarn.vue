<template>
    <div class='Specials'>
        <div class="content-eighty">
            <div class="content-center">
                <el-row :gutter="10" >
                    <el-col>
                        <el-radio-group size="small" v-model='radioStatus' @change='curRadioStatus()'>
                            <el-radio-button v-for='(item,index) in choseList' :key='index' :label='item.id'>{{item.name}}</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div style="height:10px;width:100%;background-color: #F4F5FA;"></div>
        <div class="content-table">
            <div class="content-table-center">
                <el-table 
                    :data="tableData" 
                    size='small' 
                    v-loading='loading' 
                    element-loading-text='数据加载中...' 
                    border 
                    header-row-class-name="bg-theme2 text-white" 
                    style="width: 100%;">
                    <el-table-column prop="billNo" align="center" label="提现单号"></el-table-column>
                    <el-table-column prop="date" align="center" label="申请时间"></el-table-column>
                    <el-table-column prop="name" align="center" label="申请人"></el-table-column>
                    <el-table-column prop="money" align="center" label="提现金额"></el-table-column>
                    <el-table-column prop="state" align="center" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.state == 0 ? '已完成' : scope.row.state == 1 ? '待审核' : '待打款' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="right">
                        <template slot-scope="scope">
                            <el-button size='small' type="text" @click='viewCurItem(scope.row)'>详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="showStepsState" title='提现进度详情' width="70%">
            <el-steps :active="active" finish-status="success" style="width:800px" >
                <el-step title="待确认审核" :description="`订单号：${billid}， 时间：${date}， 金额：${moeny}`"></el-step>
                <el-step title="待确认打款" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="提现已完成" description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>

            <el-button style="margin-top: 12px;" @click="next">{{buttonText}}</el-button>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
export default {
    data(){
        return{
            choseList:[ { id:0, name:'全 部' },{ id:1, name:'待审核' },{ id:2, name:'待打款' },{ id:3, name:'已完成' } ],
            radioStatus:0,
            tableData:[
                { billNo: '20190801S000001', date: '2019-07-31 15:30', name: '张三', money: '10000', state : 0 },
                { billNo: '20190801S000001', date: '2019-07-31 15:30', name: '张三', money: '10000', state : 1 }
            ],
            loading:false,
            PN: 1,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 1
            },
            showStepsState: false,
            active: 0,
            billid: '6666666',
            date: '2019-05-10',
            moeny: '100',
            buttonText:'审核通过'
        }
    },
    computed: {
        ...mapGetters({
 
        })
    },
    watch:{

    },
    methods:{
        next() {
            if (this.active++ > 2) {
                this.active = 0
            }
            if(this.active == 0){
                this.buttonText = '审核通过'
            }else if(this.active == 1){
                this.buttonText = '确认打款'
            }
        },
        curRadioStatus(){
            let IsValid = ''
            if(this.radioStatus == 0){
                IsValid = -1
            }else if(this.radioStatus == 1){
                IsValid = 1
            }else if(this.radioStatus == 2){
                IsValid = 2
            }else{
                IsValid = 0
            }
            console.log(IsValid)
        },
        viewCurItem(item){
            console.log(item)
            this.showStepsState = true
        },
    },
    mounted(){
        
    },
    components: {
        
    },
}
</script>

