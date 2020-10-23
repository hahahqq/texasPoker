<template>
    <div class="setAppointment" v-loading='loading'>
        <!-- 预约设置 -->
        <div class="padding-sm m-bottom-sm bg-default font-16 font-600">
            <span>预约设置</span>
        </div>
        <el-button
            type="primary"
            icon="el-icon-refresh"
            circle
            @click="defaultData"
            class="pull-right"
        ></el-button>

        <div class="padding-sm" >
            <el-form ref="form" :model="form" label-width="120px" label-position="left">
                <el-form-item label="营业时间">
                    <span>顾客在“{{saleTimeMessage}}”范围内预约服务</span>
                    <el-button type="primary" size="small" @click="showSaleTime=true">修改预约时间</el-button>
                </el-form-item>

                <el-form-item label="预约员工时间">
                    <el-radio-group v-model="form.ServiceType">
                        <el-radio :label="0" class="radioItem">顾客按按照营业时间预约技师</el-radio>
                        <el-radio :label="1" class="radioItem">
                            <span>顾客按照准确排班时间预约技师</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="预约占用时长">
                    <el-radio-group v-model="UseHour">
                        <el-radio :label="0" class="radioItem">
                            <span class="m-right-md">顾客预约服务时将占用固定时长 
                                <el-select v-model='form.ServiceTime' size="small" style='width:120px' placeholder="请选择时长">
                                    <el-option 
                                        v-for='item in ServiceTimeList'
                                        :key='item.value' 
                                        :label='item.label'
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </span>
                        </el-radio>

                        <el-radio :label="1" class="radioItem">
                            <span>顾客预约时按准确服务时长来占用时间，可通过编辑服务详情</span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限制数量">
                    <div>
                        <span>每段时间最多可预约</span>
                        <el-input size="small"
                            v-model.number="form.ServiceQty"
                            placeholder="请输入人数"
                            style="width:100px"
                        ></el-input>
                        <span>人</span>
                    </div>
                </el-form-item>
                <el-form-item label="预约范围">
                    <div>
                        <span>顾客可预约</span>
                        <el-select size="small"
                            v-model="ServiceBeginTime"
                            @change="ServiceBeginTime_change"
                            placeholder="请选择"
                            style="width:130px"
                        >
                            <el-option
                                v-for="value in [0,1,2,3,4,5,6,7,8,9,10,11,12,24,48]"
                                :key="value"
                                :label="value>0?value+'小时后':'从现在开始'"
                                :value="value"
                            ></el-option>
                        </el-select>
                        <span>到</span>
                        <el-select v-model="form.ServiceEndMonth" size="small" style="width:70px" placeholder="请选择">
                            <el-option
                                v-for="value in [1,2,3,6,12]"
                                :key="value"
                                :label="value"
                                :value="value"
                            ></el-option>
                        </el-select>
                        <span>个月, 以内的时间到店</span>
                    </div>
                </el-form-item>

                <el-form-item label="取消预约">
                    <span>到店时间前</span>
                    <el-select size='small' :disabled="CancelHour == 0"  v-model="form.CancelHour" placeholder="请选择" style="width:130px">  
                        <el-option
                            v-for="item in CancelHourOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <span>，可取消预约单</span>
                </el-form-item>
                <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog title="营业预约时间" :visible.sync="showSaleTime" width="600px" append-to-body style="max-width:100%">
            <div>
                <el-form ref="form" label-width="80px">
                    <el-form-item label="星期">
                        <el-checkbox-group v-model="SaleWeek">
                            <el-checkbox border v-for="(value , i) in weekList" :key="i" :label="i" :class="{'no-margin':i==4}">{{value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-for="(item,i) in SaleTimeList" :key="i" :label="'时间段'+(i>0?i:'')">
                        <el-time-select
                            placeholder="起始时间"
                            v-model="SaleTimeList[i].BeginTime"
                            :picker-options="options"
                            style="width:120px"
                        ></el-time-select>
                        <el-time-select
                            placeholder="结束时间"
                            v-model="SaleTimeList[i].EndTime"
                            :picker-options="Object.assign({minTime: SaleTimeList[i].BeginTime},options)"
                            style="width:120px"
                        ></el-time-select>
                        <el-button v-if="i==0" type="primary" plain @click="dealRestList(1,0)">添加时段</el-button>
                        <el-button v-else type="primary" plain @click="dealRestList(2,i)">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSure">确定</el-button>
                        <el-button
                            @click="showSaleTime=false;"
                        >取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
    data() {
        return {
            loading: false,
            form: {
                SaleWeek: "", // 营业周期
                SaleTime: [], // 营业时间 [{"BeginTime":"09:00","EndTime":"12:00"},{"BeginTime":"14:00","EndTime":"18:00"}]
                ServiceType: 0, // 0=按营业时间，1=按员工时间
                ServiceTime: 60, // 预约时段间隔
                ServiceQty: 0, // 预约时段人数
                ServiceBeginHour: 0, // 开始预约时间
                ServiceEndMonth: 1, // 最长预约时间
                IsTips: 0, // 是否通知
                CancelHour: 1, // 取消预约时间 小时
                arriveShopTipsTime: 2 //到店提醒
            },
            CancelHour: 1,
            UseHour:0,
            IsTips: false,
            ServiceBeginTime: 0,
            ServiceTimeList:[
                { value: 15, label: '15分钟' },
                { value: 30, label: '30分钟' },
                { value: 60, label: '60分钟' },
                { value: 90, label: '90分钟' },
                { value: 120, label: '120分钟' },
                { value: 150, label: '150分钟' },
                { value: 180, label: '180分钟' },
                // { value: 240, label: '4小时'},
                // { value: 300, label: '5小时'},
                // { value: 360, label: '6小时'},
            ],
            CancelHourOptions: [
                { value: 1, label: "1小时" },
                { value: 2, label: "2小时" },
                { value: 6, label: "6小时" },
                { value: 12, label: "12小时" },
                { value: 24, label: "24小时" },
                { value: 48, label: "48小时" },
                { value: 168, label: '7天'}
            ],
            showSaleTime: false,
            SaleWeek: [{BeginTime: '10:00', EndTime: '22:00'}],
            weekList: ["星期一","星期二", "星期三","星期四", "星期五","星期六", "星期日"],
            SaleTimeList: [],
            saleTimeMessage: "",
            options: {
                start: "00:00",
                step: "00:15",
                end: "23:45"
            }
        }
    },
    computed: {
        ...mapGetters({
            dataState: "appointmentsState",
            Get_appointmentsState:'Get_appointmentsState',
            dataData: "appointments"
        })
    },
    watch:{
        Get_appointmentsState(data){
            this.loading = false 
            if(data.success){
                let obj = data.data.Obj
                this.form.CancelHour = obj.CANCELHOUR
                this.IsTips = obj.ISTIPS
                this.form.SaleTime = obj.SALETIME
                this.SaleTimeList = obj.SALETIME
                this.form.ServiceEndMonth = obj.SERVICEENDMONTH
                this.form.ServiceQty = obj.SERVICEQTY
                this.form.ServiceTime = obj.SERVICETIME
                this.UseHour = obj.SERVICETIME == 0 ? 1 : 0
                this.form.ServiceBeginHour = obj.SERVICEBEGINHOUR
                this.form.SaleWeek = obj.SALEWEEK
                this.saleTimeMessage = obj.SALEWEEK
                let saleweek = obj.SALEWEEK.split(',') , val = []
                for(var i in saleweek){
                    if(saleweek[i] == '星期一'){
                        val.push(0)
                    }else if(saleweek[i] == '星期二'){
                        val.push(1)
                    }else if(saleweek[i] == '星期三'){
                        val.push(2)
                    }else if(saleweek[i] == '星期四'){
                        val.push(3)
                    }else if(saleweek[i] == '星期五'){
                        val.push(4)
                    }else if(saleweek[i] == '星期六'){
                        val.push(5)
                    }else if(saleweek[i] == '星期日'){
                        val.push(6)
                    }
                }
                this.SaleWeek = val
            }
        },
        dataState(data){
            if(data.success){
                this.$message.success('保存成功!')
                this.defaultData()
            }else{
                this.$message.warning(data.message)
            }
        }
    },
    methods: {
        onSubmit() {
            if (this.CancelHour == 0) {
                this.form.CancelHour = 0
            }
            this.form.IsTips = this.IsTips == false ? 0 : 1
            this.form.ServiceTime = this.UseHour == 1 ? 0 : this.form.ServiceTime
            if(this.UseHour == 0 && this.form.ServiceTime == 0){
                this.$message.warning('请选择固定时长时间')
                return
            }
            this.$store.dispatch('setAppointments', this.form )
        },
        ServiceBeginTime_change(value) {
            let d = new Date();
            if (value > 0) {
                let h = d.getHours() + value;
                let n = 0;
                if (h >= 24) {
                    h -= 24;
                    n = 1;
                }
                let timeStamp = new Date(d.setHours(h, 0, 0, 0));
                this.form.ServiceBeginHour = timeStamp - 86400 * n * 1000;
            } else {
                this.form.ServiceBeginHour = d.getTime();
            }
        },
        dealRestList(type, i) {
            // 添加删除 休息时段
            if (type == 1) {
                this.SaleTimeList.push({ BeginTime: "", EndTime: "" });
            } else {
                this.SaleTimeList.splice(i, 1);
                this.SaleTimeList = [...this.SaleTimeList];
            }
        },
        onSure() {
            let ss = this.SaleWeek.sort((a, b) => {
                return a - b;
            })
            this.saleTimeMessage = "";
            this.form.SaleWeek = "";
            this.form.SaleTime = [...this.SaleTimeList];
            for (let i = 0; i < ss.length; i++) {
                this.form.SaleWeek += (i > 0 ? "," : "") + this.weekList[ss[i]];
                this.saleTimeMessage += this.weekList[ss[i]] + "，";
            }
            if(this.arrayEqual(ss, [0,1,2,3,4,5,6])){
                this.saleTimeMessage = '周一至周日'
            }else if(this.arrayEqual(ss, [0,1,2,3,4,5])){
                this.saleTimeMessage = '周一至周六'
            }else if(this.arrayEqual(ss, [0,1,2,3,4])){
                this.saleTimeMessage = '周一至周五'
            }else if(this.arrayEqual(ss, [1,2,3,4,5,6])){
                this.saleTimeMessage = '周二至周日'
            }else if(this.arrayEqual(ss, [1,2,3,4,5])){
                this.saleTimeMessage = '周二至周六'
            }

            for (let i = 0; i < this.SaleTimeList.length; i++) {
                let msg =
                    (i > 0 ? "，" : "") +
                    this.SaleTimeList[i].BeginTime +
                    "至" +
                    this.SaleTimeList[i].EndTime;
                this.saleTimeMessage += ' ' + msg;
            }
            this.showSaleTime=false;
        },
        arrayEqual(arr1, arr2)  {
            if(arr1 === arr2) return true;
            if(arr1.length != arr2.length) return false;
            for(var i = 0; i < arr1.length; ++i) {
                if(arr1[i] !== arr2[i]) return false;
            }
            return true;
        },
        defaultData(){
            this.$store.dispatch("getAppointments").then(()=>{
                this.loading = true
            })
        }
    },
    mounted() {
        this.defaultData()
    }
};
</script>
<style>
.setAppointment .radioItem {
    line-height: 40px;
    margin: 0 !important;
    display: block !important;
}
</style>
