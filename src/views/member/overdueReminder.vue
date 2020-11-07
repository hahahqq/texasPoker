<template>
   <el-container>
      <div class="content-new-fex">
         <div class="content-eighty">
            <div class="content-center">
            <filtePage @getNewData="getNewData" :isAll="true" :isHideOther='true'></filtePage>
            </div>
         </div>

         <div class="content-table4">
            <div class="content-table-center">
               <el-table
                  size='small'
                  :data="tableData"
                  ref="Table"
                  style="width: 100%;"
                  :height="tableHeight"
                  header-row-class-name="bg-F1F2F3"
                  v-loading="loading"
               >
                  <el-table-column prop="NAME" label="会员信息" width="160">
                     <template slot-scope="scope">
                           <img :src="scope.row.IMAGEURL" alt="" style='float:left; border-radius:8px; width:40px; height:40px; margin-right:8px'>
                           <span style='height:40px;width:102px'>
                              <i class="pull-left inline-block" style="color:#2589FF;width:92px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap;">
                                 {{scope.row.NAME ? scope.row.NAME : ' '}}
                                 &nbsp;&nbsp;<img :src="scope.row.SEX == 0 ? 'static/images/icon_man.png' : 'static/images/icon_woman.png'" style="width:13px;height:13px; vertical-align: middle">
                                 </i>
                              <i class="pull-left inline-block" style="width:92px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap ">{{scope.row.CODE}}</i>
                           </span>
                     </template>
                  </el-table-column>
                  <el-table-column prop='SHOPNAME' label="归属店铺"></el-table-column>
                  <el-table-column prop="DISCOUNTTYPENAME" label="会员等级"></el-table-column>
                  <el-table-column prop="MONEY" label="储值积分"></el-table-column>
                  <el-table-column prop="INTEGRAL" label="竞技积分"></el-table-column>

                  <el-table-column label="最近消费时间">
                     <template slot-scope="scope">
                        {{new Date(scope.row.LASTSALETIME) | timehf}}
                     </template>
                  </el-table-column>

                  <el-table-column label="到期时间">
                     <template slot-scope="scope">
                        {{new Date(scope.row.INVALIDDATE) | time}}
                     </template>
                  </el-table-column>

                  <el-table-column label="操作">
                     <template slot-scope="scope">
                        <el-button type='text' @click='handleItem(scope.row, scope.$index)'>续期</el-button>
                     </template>
                  </el-table-column>
               </el-table>

               <!-- 分页 -->
                <div class="m-top-sm clearfix elpagination">
                  <el-pagination
                    background
                    @size-change="handlePageChange"
                    @current-change="handlePageChange"
                    :current-page.sync="pagination.PN"
                    :page-size="pagination.PageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.TotalNumber"
                    class="text-right"
                  ></el-pagination>
                </div>

            </div>
         </div>

         <el-dialog title="续期" :visible.sync='showRechargeDialog' append-to-body width="500px">

            <el-form label-width="100px">
               <el-form-item label="会员信息：" style="margin-bottom:10px">
                  {{vipInfo.NAME}} ( {{vipInfo.CODE}} )
               </el-form-item>

               <el-form-item label="过期时间：" style="margin-bottom:10px">
                  <span style='color:#f00; size: 14px'>{{new Date(overdueTime) | time }}</span>
               </el-form-item>

               <el-form-item label="延长后时间：" style="margin-bottom:10px">
                  <el-date-picker
                        v-model="newDate"
                        type="date"
                        size="small"
                        style="width: 200px"
                        placeholder="选择日期">
                     </el-date-picker>
               </el-form-item>

               <el-form-item label="">
                  <el-radio-group v-model="radio1" @change='selectTimeFun' size="small" style="width: 350px">
                     <el-radio-button label="0">1个月</el-radio-button>
                     <el-radio-button label="1">3个月</el-radio-button>
                     <el-radio-button label="2">6个月</el-radio-button>
                     <el-radio-button label="3">1 年</el-radio-button>
                     <el-radio-button label="4">10 年</el-radio-button>
                  </el-radio-group>
               </el-form-item>

               <el-form-item label="" style='margin-top: 60px'>
                  <el-button type="info" plain @click="showRechargeDialog = false; "> 取 消 </el-button>
                  <el-button type='primary' @click="submitVipCode"> 确 认 </el-button>
               </el-form-item>
            </el-form>

         </el-dialog>
      </div>
   </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
import dayjs from 'dayjs';
export default {
   data() {
      return {
         newDate: '',
         radio1:'',
         activeName: "first",
         ruleFrom: {
            ShopId: "",
            InvalidDate: "9999999999999",
            Filter: '',
            PN: 1
         },
         overdueTime:'',
         showRechargeDialog: false,
         tableHeight:document.body.clientHeight-230,
         tableData: [],
         vipInfo: {},
         bussinessTime: getUserInfo().CompanyConfig.TIMEDIFFERENCE,
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 1
         },
         loading: false,
         loadingBtn: false
      }
   },
   computed: {
        ...mapGetters({
           vipOverdueReminderListState: 'vipOverdueReminderListState',
           vipCodeAddDateState: 'vipCodeAddDateState'
        })
   },
   watch: {
      vipCodeAddDateState(data){
         console.log(data)
         this.loadingBtn = false
         this.showRechargeDialog = false
         this.$message({ message: data.message, type: data.success ? 'success' : "error" })
         if(data.success){
            this.getNewDataFun()
         }
      },
      vipOverdueReminderListState(data){
         console.log(data)
         this.loading = false
         if(data.success){
            this.tableData = data.data.PageData.DataArr
            this.pagination={
               TotalNumber: data.data.PageData.TotalNumber,
               PageNumber: data.data.PageData.PageNumber,
               PageSize: data.data.PageData.PageSize,
               PN: data.data.PageData.PN
            }
         }else{
            this.$message({ message: data.message, type: "error" })
         }
      }
   },
   methods: {
      selectTimeFun(){
         console.log(this.radio1)
         if(this.radio1 == 0){
            this.newDate = dayjs(this.vipInfo.INVALIDDATE).add(30, 'day').format('YYYY-MM-DD');
         }else if(this.radio1 == 1){
            this.newDate = dayjs(this.vipInfo.INVALIDDATE).add(90, 'day').format('YYYY-MM-DD');
         }else if(this.radio1 == 2){
            this.newDate = dayjs(this.vipInfo.INVALIDDATE).add(180, 'day').format('YYYY-MM-DD');
         }else if(this.radio1 == 3){
            this.newDate = dayjs(this.vipInfo.INVALIDDATE).add(365, 'day').format('YYYY-MM-DD');
         }else if(this.radio1 == 4){
            this.newDate = dayjs(this.vipInfo.INVALIDDATE).add(3650, 'day').format('YYYY-MM-DD');
         }
      },
      handleItem(item, idx){
         this.vipInfo = item
         this.overdueTime = item.INVALIDDATE
         this.showRechargeDialog = true
      },
      getNewData(data) {
         this.ruleFrom.InvalidDate = data.EndDate
         this.ruleFrom.ShopId = data.ShopId
         this.ruleFrom.PN = 1
         this.getNewDataFun()
      },
      getNewDataFun(){
         this.$store.dispatch('getVipOverdueReminder', this.ruleFrom).then(() => {
            this.loading = true
         })
      },
      handlePageChange: function(currentPage) {
         if (this.ruleFrom.PN == currentPage || this.loading) {
            return;
         }
         this.ruleFrom.PN = parseInt(currentPage);
         this.getNewDataFun()
      },
      submitVipCode(){
         if(this.newDate == ''){
            this.$message.warning({ message: '请选择延长时间' })
            return
         }
         let sendData = {
            ValidDate: dayjs(this.newDate).valueOf(),
            VipId: this.vipInfo.ID
         }
         console.log(sendData)
         this.$store.dispatch('vipCardAddDate', sendData).then(() =>{
            this.loadingBtn = true
         })
      }
   },
   mounted(){
      console.log(dayjs())
         let bussinessTimeToNumber = Number(this.bussinessTime.replace(":",""));
         let curMonth = Number(dayjs().month())+1;
         let todayDate = dayjs(new Date().getTime());
         let nowHourMius = todayDate.format('HH:mm');
         let yesterdayDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
         let nowHourMiusToNumber = Number(nowHourMius.replace(":", ""));

         let beginFormat = nowHourMiusToNumber >= bussinessTimeToNumber ? todayDate.format('YYYY-MM-DD') : yesterdayDate;

         let beginTime = beginFormat + " " + this.bussinessTime+':00' ;
         let endTime = todayDate.format('YYYY-MM-DD HH:mm');

         let firstDate = new Date(beginTime).getTime();
         let lastDate = new Date(endTime).getTime();
         this.ruleFrom = {
            ShopId: getHomeData().shop.ID,
            InvalidDate: lastDate,
            PN: 1
         };
         this.getNewDataFun()
   },
   components: {
      filtePage: () => import("@/views/member/vipFilterPage"),
   },
   created(){

   },
}
</script>

<style scoped>
.infoTitle{
   width: 100px; float:left
}
</style>
