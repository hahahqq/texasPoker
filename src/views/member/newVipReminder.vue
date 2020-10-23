<template>
   <el-container>
      <div class="content-new-fex">
         <div class="content-eighty">
            <div class="content-center">
            <filtePage @getNewData="getNewData" :isAll="true"></filtePage>
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
                              <i class="text-3399ff pull-left inline-block" style="color:#2589FF;width:92px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap;">
                                 {{scope.row.NAME ? scope.row.NAME : ' '}}
                                 &nbsp;&nbsp;<img :src="scope.row.SEX == 0 ? 'static/images/icon_man.png' : 'static/images/icon_woman.png'" style="width:13px;height:13px; vertical-align: middle">
                                 </i>
                              <i class="text-3399ff pull-left inline-block" style="width:92px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap ">{{scope.row.MOBILENO}}</i>
                           </span>
                     </template>
                  </el-table-column>
                  <el-table-column prop="SHOPNAME" label="归属店铺"></el-table-column>
                  <el-table-column prop="DISCOUNTTYPENAME" label="折扣类型"></el-table-column>
                  <el-table-column prop="VIPFLAG" label="标签"></el-table-column>
                  <!-- <el-table-column label="生日时间">
                     <template slot-scope="scope">
                        {{new Date(scope.row.BIRTHDATE) | time}}
                     </template>
                  </el-table-column> -->
                  <el-table-column prop="SALEEMPNME" label="顾问"></el-table-column>
                  <el-table-column prop="MONEY" label="储值积分"></el-table-column>
                  <el-table-column prop="INTEGRAL" label="竞技积分"></el-table-column>
                  <el-table-column prop="OWEMONEY" label="欠款"></el-table-column>
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
                    class="text-center"
                  ></el-pagination>
                </div>

            </div>
         </div>
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
         activeName: "first",
         ruleFrom: {
            ShopId: "",
            PN: 1,
            BeginDate: "1",
            EndDate: "9999999999999"
         },
         tableHeight:document.body.clientHeight-240,
         tableData: [],
         bussinessTime: getUserInfo().CompanyConfig.TIMEDIFFERENCE,
         pagination: {
            TotalNumber: 0,
            PageNumber: 0,
            PageSize: 20,
            PN: 1
         },
         loading: false
      }
   },
   computed: {
        ...mapGetters({
           getNewVipListState: 'getNewVipListState'
        })
   },
   watch: {
      getNewVipListState(data){
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
      handleItem(item, idx){

      },
      getNewData(data) {
         this.ruleFrom = data
         this.ruleFrom.PN = 1
         this.getNewDataFun()
      },
      getNewDataFun(){
         this.$store.dispatch('getNewVipList', this.ruleFrom).then(() => {
            this.loading = true
         })
      },
      handlePageChange: function(currentPage) {
         if (this.ruleFrom.PN == currentPage || this.loading) {
            return;
         }
         this.ruleFrom.PN = parseInt(currentPage);
         this.getNewDataFun()
      }

   },
   mounted(){
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
            BeginDate: firstDate,
            EndDate: lastDate,
            PN : 1
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
