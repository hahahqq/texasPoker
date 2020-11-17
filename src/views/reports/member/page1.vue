<template>
   <section v-loading="loading">
      <div class="bg-white paddingTB-md m-bottom-sm" style="min-height: 73px">
         <div class="marginLR-md">
            <filtePage
               :isAll="true"
               :isExport="true"
               @getNewData="getNewData_fun"
               @exportState="exportState_fun"
            ></filtePage>
         </div>
      </div>
      <div class="bg-white m-bottom-sm paddingTB-sm">
         <div class="marginLR-md">
            <div
               v-for="(item, i) in pageList"
               :key="i"
               class="inline-block border padding-sm marginTB-sm m-right-sm pointer"
               :class="{ 'border-theme': echartAct == i }"
               style="min-width: 150px"
               @click="chooseType(i)"
            >
               <p>{{ item.label }}</p>
               <div class="font-16 font-600">{{ item.value }}</div>
            </div>
         </div>
      </div>
      <div class="bg-white m-bottom-sm">
         <div class="marginLR-md">
            <echartLine
               ref="memberEchart"
               :idName="'memberEchart'"
               :typeData="echartData"
               unit="人"
               class="padding-sm marginTB-sm"
            ></echartLine>
         </div>
      </div>
      <div class="bg-white m-bottom-sm">
         <div class="marginLR-md text-center">
            <el-row>
               <el-col :span="12">
                  <div>
                     <!-- 性别比例 -->
                     <echartPie
                        ref="memberEchartSexList"
                        :idName="'memberEchartSexList'"
                        :typeData="echartData_sex"
                        unit="人"
                        class="padding-sm marginTB-sm"
                     ></echartPie>
                  </div>
               </el-col>
               <el-col :span="12">
                  <div>
                     <!-- 等级分布 -->
                     <echartPie
                        ref="memberEchartLevelList"
                        :idName="'memberEchartLevelList'"
                        :typeData="echartData_level"
                        unit="人"
                        class="padding-sm marginTB-sm"
                     ></echartPie>
                  </div>
               </el-col>
            </el-row>
         </div>
      </div>
      <div class="bg-white m-bottom-sm p-bottom-sm">
         <div class="marginLR-md">
            <!-- 年龄分布 -->
            <echartLine
               ref="memberEchartAgeList"
               :idName="'memberEchartAgeList'"
               :typeData="echartData_age"
               unit="人"
               class="padding-sm marginTB-sm"
            ></echartLine>
         </div>
      </div>
      <!-- 数据导出 -->
      <el-dialog
         append-to-body
         :close-on-click-modal="false"
         :close-on-press-escape="false"
         :show-close="false"
         title="数据导出"
         :visible.sync="exportData.show"
         width="400px"
      >
         <exportPage
            :dataType="exportData"
            :isPage="true"
            @closeModal="exportData.show = false"
         ></exportPage>
      </el-dialog>
   </section>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
   data() {
      return {
         loading: false,
         formData: { ShopId: "", BeginDate: "", EndDate: "", Type: 0 },
         pageList: [
            { label: "会员总数", value: 0 },
            { label: "新增会员", value: 0 },
            { label: "到店客次", value: 0 },
            { label: "到店会员数", value: 0 }
         ],
         echartData: {
            show: false,
            data: {
               title: "会员总数",
               legend: ["人数"],
               xAxis: [],
               series: [[0]]
            }
         },
         echartAct: 0,
         exportData: { show: false },
         tableHeight: 300,
         echartData_sex: {
            show: false,
            data: {
               title: "性别比例",
               legend: ["男", "女", "无"],
               series: []
            }
         },
         echartData_level: {
            show: false,
            data: {
               title: "等级分布",
               legend: [],
               series: []
            }
         },
         echartData_age: {
            show: false,
            data: {
               title: "年龄分布",
               legend: ["人数"],
               xAxis: [],
               series: [[0]]
            }
         }
      };
   },
   computed: {
      ...mapGetters({}),
      dataState() {
         return this.$store.getters.cReportDataState.member;
      },
      dataState2() {
         return this.$store.getters.cReportDataState.memberRegChart;
      }
   },
   watch: {
      dataState(data) {
         if (this.loading) {
            if (data.success) {
               this.pageList[0].value = data.data.SumQty;
               this.pageList[1].value = data.data.AddQty;
               this.pageList[2].value = data.data.ComeinCount;
               this.pageList[3].value = data.data.ComeinQty;
               this.setEchartNewData(data.data.List);
            } else {
               this.$message.error(data.message);
            }
         }
         this.loading = false;
      },
      dataState2(data) {
         if (data.success) {
            this.setEchartNewData2(data.data);
         } else {
            this.$message.error(data.message);
         }
      }
   },
   methods: {
      exportState_fun(data) {
         this.exportData = {
            show: true,
            data: {},
            index: 1
         };
      },
      getNewData_fun(data) {
         this.formData = Object.assign({}, this.formData, data);
         this.getNewData();
      },
      getNewData() {
         this.loading = true;
         indexQuery.member(this, "member", this.formData);
         indexQuery.memberRegChart(this, "memberRegChart", this.formData);
      },
      chooseType(i) {
         this.echartAct = i;
         this.formData.Type = i;
         this.getNewData();
      },
      setEchartNewData(arr) {
         let idx = this.echartAct,
            item = this.pageList[idx],
            arr1 = [],
            arr2 = [[]];
         if (arr.length > 0) {
            arr.forEach(element => {
               arr1.push(element.DATENAME);
               switch (idx) {
                  case 1:
                     arr2.push(element.FCOUNT);
                     break;
                  case 2:
                     arr2.push(element.VIPCOUNT);
                     break;
                  case 3:
                     arr2.push(element.VIPCOUNT);
                     break;
                  default:
                     arr2.push(element.FSUMCOUNT);
               }
            });
         }

         this.echartData = {
            show: true,
            data: {
               title: item.label,
               legend: ["人数"],
               xAxis: [...arr1],
               series: [arr2]
            }
         };
      },
      setEchartNewData2(data) {
         console.log(data);
         let arr1 = [[], [], []],
            arr2 = [],
            arr22 = [],
            arr3 = [],
            arr33 = [];
         data.SexList.forEach(element => {
            if (element.NAME == 0) {
               arr1[0] = { value: element.QTY, name: "男", itemStyle: { color: "#0382F1" } };
            } else if (element.NAME == 1) {
               arr1[1] = { value: element.QTY, name: "女", itemStyle: { color: "#E879ED" } };
            } else {
               arr1[2] = { value: element.QTY, name: "无", itemStyle: { color: "#ccc" } };
            }
         });
         this.echartData_sex = {
            show: true,
            data: {
               title: "性别比例",
               legend: ["男", "女", "无"],
               series: [...arr1]
            }
         };
         let colorArr = ["#7EC0EE", "#FF9F7F", "#FFD700", "#C9C9C9", "#E066FF", "#C0FF3E"];
         for (let i = 0; i < data.LevelList.length; i++) {
            let element = data.LevelList[i];
            arr22.push(element.NAME);
            arr2.push({
               value: element.QTY,
               name: element.NAME,
               itemStyle: { color: colorArr[i] }
            });
         }
         this.echartData_level = {
            show: true,
            data: {
               title: "等级分布",
               legend: [...arr22],
               series: [...arr2]
            }
         };
         data.AgeList.forEach(element => {
            arr3.push(element.NAME);
            arr33.push(element.QTY);
         });
         this.echartData_age = {
            show: true,
            data: {
               title: "年龄分布",
               legend: ["人数"],
               xAxis: [...arr3],
               series: [arr33]
            }
         };
      },
      defaultData() {}
   },

   mounted() {
      let homeInfo = getHomeData();
      this.formData = {
         ShopId: homeInfo.shop.ID,
         BeginDate: this.getTimeStamp(),
         EndDate: new Date().getTime(),
         Type: 0
      };
      this.getNewData();
   },
   components: {
      filtePage: () => import("@/views/reports/filtePage.vue"),
      echartLine: () => import("@/components/echart/echartLine.vue"),
      echartPie: () => import("@/components/echart/echartPie.vue"),
      exportPage: () => import("@/components/export/common.vue")
   }
};
</script>
<style scoped></style>
