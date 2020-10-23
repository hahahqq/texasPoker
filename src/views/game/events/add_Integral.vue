<template>
    <div>
        <!-- {{dataType}} -->
        <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="24">
                    <el-form-item label="项目名称" prop='Name'>
                        <el-input placeholder="请输入积分赛项目名称" v-model.trim='ruleForm.Name' clearable size="small"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Buyin积分" prop="BuyinMoney">
                        <el-input placeholder="请输入参赛报名积分" size="small" oninput="value=value.replace(/\D/g,'')" v-model.trim="ruleForm.BuyinMoney">
                            <template slot="append">积分</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item label="记分牌">
                        <el-input placeholder="请输入Buyin记分牌" size="small" oninput="value=value.replace(/\D/g,'')" v-model="ruleForm.ChipsQty"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="服务费方式">
                        <el-select size="small" v-model='ruleForm.ChargesType' placeholder="请选择服务费方式" style='width:100%'>
                            <el-option v-for="item in serviceChargeMethod" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12">
                    <el-form-item label="服务费比例" v-if='ruleForm.ChargesType == 0'>
                        <el-input placeholder="请输入服务费比例" size="small" oninput="value=value.replace(/\D/g,'')" v-model="ruleForm.ChargesRate">
                            <template slot="append"> % </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="服务费金额" v-if='ruleForm.ChargesType == 1'>
                        <el-input placeholder="请输入服务费金额" size="small" oninput="value=value.replace(/\D/g,'')" v-model="ruleForm.ChargesMoney">
                            <template slot="append"> 元 </template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :xs='24' :sm='24'>
                    <el-form-item label="备注说明">
                        <el-input size="small" placeholder="请输入备注说明" v-model="ruleForm.Remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :xs='24' :sm='24'>
                    <el-form-item label="">
                        <el-button plain @click="closeDialog">取消</el-button>
                        <el-button type='primary' @click="submitBtn" :loading='loadingBtn'> 确认</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

export default {
    props: {
        dataType: {
            type: Object,
            default: function() {
                return { EventId: 1, dealState: "add", info: {} };
            }
        }
    },
    data(){
        return {
            ruleForm: {
                Id: '',
                Name: '',
                BuyinMoney: '',
                ChipsQty: '',
                ChargesType: 0,
                ChargesRate: '',
                ChargesMoney: '',
                Remark: '',
                RewardType: 0
            },
            serviceChargeMethod: [{ value: 0, label: '从报名费按比例扣除'}, { value: 1, label: '服务费不计入奖池'}],
            DelArr: [],
            loadingBtn: false,
            rules:{
                Name: [{ required: true, message: '请输入积分赛项目名称', trigger: 'blur' ,}],
                BuyinMoney: [{ required: true, message: '请输入参赛报名积分', trigger: 'blur' }]                
            },
        }
    },
    computed: {
        ...mapGetters({
            saveEventsState: 'saveEventsState',
            saveRewardWayState: 'saveRewardWayState'
        })
    },
    watch: {
        saveEventsState(data){
            if(data.success){
                this.loadingBtn = false
                this.cleanData()
                this.$refs["ruleForm"].resetFields();
                this.$emit("resetList")
            }else{
                this.$message({ message: data.message, type: "error" })
            }
        },
        saveRewardWayState(data){
            this.loadingBtn = false
            if(data.success){
                this.cleanData()
                this.$refs["ruleForm"].resetFields();
                this.$emit("resetList")
            }else{
                this.$message({ message: data.message, type: "error" })
            }
        },
        dataType(data){
            this.cleanData()
            
            if(this.dataType.dealState == 'edit'){
                let obj = this.dataType.info.EventObj
                this.ruleForm = {
                    Id: obj.ID,
                    Name: obj.NAME,
                    BuyinMoney: obj.BUYINMONEY,
                    ChipsQty: obj.CHIPSQTY,
                    ChargesType: obj.CHARGESTYPE,
                    ChargesRate: Number(obj.CHARGESRATE) * 100,
                    ChargesMoney: obj.CHARGESMONEY,
                    Remark: obj.REMARK != undefined ? obj.REMARK : '',
                    RewardType: 0
                }
            }else{
                this.cleanData()
            }
        }
    },
    methods:{
        cleanData(){
            this.ruleForm = {
                Id: '',
                Name: '',
                BuyinMoney: '',
                ChipsQty: '',
                ChargesType: 0,
                ChargesRate: '',
                ChargesMoney: '',
                Remark: '',
                RewardType: 0
            }
        },
        closeDialog(){
            this.cleanData()
            this.$refs["ruleForm"].resetFields();
            this.$emit("closeModal");
        },
        submitBtn(){
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let sendData = {
                        Id: this.ruleForm.Id,
                        Type: 3,
                        Name: this.ruleForm.Name,
                        Status: 0,
                        Category: '',
                        Remark: this.ruleForm.Remark,
                        BuyinMoney: this.ruleForm.BuyinMoney,
                        ChipsQty: Number(this.ruleForm.ChipsQty),
                        ChargesType: this.ruleForm.ChargesType,
                        ChargesMoney: this.ruleForm.ChargesType == 0 ? '' : this.ruleForm.ChargesMoney,
                        ChargesRate: this.ruleForm.ChargesType == 1 ? '' : Number(this.ruleForm.ChargesRate) / 100,
                        RewardType: 0
                    }
                    this.$store.dispatch("saveEvents", sendData).then(() =>{
                        this.loadingBtn = true
                    })
                }
            })
        }
    },
    mounted(){
  
    }
}
</script>

<style scoped>
.textCenter >>> .el-input__inner{
  text-align:center !important
}
</style>