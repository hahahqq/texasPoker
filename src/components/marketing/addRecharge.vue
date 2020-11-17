<template>
   <!-- 充值赠送 -->
   <div>
      <!-- 基本信息 -->
      <div class="rechargeTop">
         <div class="paddingTB-sm bg-f7f8fa m-bottom-sm">
            <span
               class="bg-theme4 inline-block vertical-middle"
               style="margin: 0 10px 0 15px; height: 16px; width: 6px"
            ></span>
            <span class="inline-block vertical-middle">基本信息</span>
         </div>
         <el-form
            ref="ruleForm"
            :model="ruleForm"
            label-width="80px"
            :hide-required-asterisk="true"
            :inline-message="true"
         >
            <el-form-item label="活动名称">
               <el-input
                  v-model="ruleForm.Name"
                  placeholder="如: 充值满100送20"
                  size="small"
               ></el-input>
            </el-form-item>
            <el-form-item label="活动时间">
               <el-date-picker
                  v-model="ruleForm.dateBE[0]"
                  value-format="timestamp"
                  align="right"
                  type="date"
                  size="small"
                  placeholder="选择开始日期"
                  style="width: 47%; margin-right: -4px"
               ></el-date-picker>
               <span class="text-muted inline-block text-center" style="width: 6%">至</span>
               <el-date-picker
                  v-model="ruleForm.dateBE[1]"
                  value-format="timestamp"
                  align="right"
                  type="date"
                  size="small"
                  placeholder="选择结束日期"
                  style="width: 47%; margin-left: -4px"
               ></el-date-picker>
            </el-form-item>
            <el-form-item label="参与店铺">
               <el-radio-group v-model="chooseShopState" @change="chooseShopFun">
                  <el-radio :label="true">全部店铺</el-radio>
                  <el-radio :label="false">部分店铺</el-radio>
               </el-radio-group>
               <div v-if="!chooseShopState">
                  <el-checkbox-group v-model="chooseShopList" size="small">
                     <el-checkbox border v-for="(item, i) in shopList" :key="i" :label="item.ID">
                        {{ item.NAME }}
                     </el-checkbox>
                  </el-checkbox-group>
               </div>
            </el-form-item>
            <el-form-item label="是否启用">
               <el-radio-group v-model="ruleForm.IsStart">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">停用</el-radio>
               </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="是否翻倍">
					<el-tooltip
						effect="dark"
						content="启用后按基础充值方案的倍数赠送金额，未启用自定义设置每个等级的赠送金额"
						placement="top-start"
					>
						<el-button
							type="text"
							style="color: #999"
							icon="el-icon-question"
						></el-button>
					</el-tooltip>
					<el-switch
						v-model="ruleForm.IsDouble"
						inactive-color="#999999"
						@change="changeIsDouble"
					></el-switch>
				</el-form-item> -->
         </el-form>
      </div>

      <!-- 营销内容 -->
      <div class="rechargeTop m-top-sm">
         <div class="paddingTB-sm bg-f7f8fa m-bottom-sm">
            <span
               class="bg-theme4 inline-block vertical-middle"
               style="margin: 0 10px 0 15px; height: 16px; width: 6px"
            ></span>
            <span class="inline-block vertical-middle">营销内容</span>
         </div>
         <div class="overflowY-scroll m-bottom-sm" style="max-height: 260px">
            <div
               v-for="(itemlist, indexs) in RechargeList"
               :key="indexs"
               class="row-flex flex-items-center"
               v-show="itemlist.showRules"
               :class="{ ' m-top-sm': indexs > 0 && itemlist.showRules }"
            >
               <div class="text-right p-right-sm" style="min-width: 80px">
                  规则{{ itemlist.title }}
               </div>
               <div class="full-width rulesStyleBg">
                  <div class="rulesStyleBg-money">
                     充值
                     <el-input
                        v-model.number="itemlist.Addmoney"
                        style="width: 100px"
                        size="mini"
                        @change="inputMoney(itemlist)"
                     ></el-input>
                     元 , 送
                     <el-input
                        v-model.number="itemlist.Money"
                        style="width: 100px"
                        size="mini"
                     ></el-input>
                     积分
                  </div>
                  <span class="del" @click="delRule(itemlist, indexs)">删除</span>
               </div>
            </div>
         </div>
         <div class="row-flex flex-items-center m-bottom-sm">
            <div style="min-width: 80px"></div>
            <div class="full-width">
               <el-button
                  @click="addButtom"
                  v-if="!ruleForm.IsDouble"
                  icon="el-icon-plus"
                  type="primary"
                  size="small"
               >
                  添加规则
               </el-button>
            </div>
         </div>
      </div>

      <div class="full-width text-center m-top-md">
         <el-button type="primary" size="small" @click="onSubmit" :loading="loading">
            保 存
         </el-button>
         <el-button size="small" @click="closeModal('closeModal')">取 消</el-button>
      </div>
   </div>
</template>

<script>
import { GOODS_IMGURL } from "@/util/define";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";
export default {
   props: {
      dealType: {
         type: Object,
         default: function() {
            return {
               type: "add",
               state: false,
               itemData: {}
            };
         }
      }
   },
   data() {
      return {
         loading: false,
         delList: [], // 编辑时删除的规则
         ruleForm: {
            Name: "",
            IsStart: 1,
            IsDouble: false,
            dateBE: [],
            GiftList: [],
            ShopName: [],
            ShopList: [],
            Id: ""
         },
         RechargeList: [
            {
               Id: "",
               title: "一",
               Addmoney: "",
               Money: "",
               Integral: 0,
               showRules: true,
               IsCancel: 0
            }
         ],
         rTitleArr: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
         chooseShopState: true,
         chooseShopList: []
      };
   },
   computed: {
      ...mapGetters({
         shopList: "shopList",
         marketingRechargeAdd: "marketingRechargeAdd",
         dealState: "marketingRechargeeit",
         marketingRechargedetailed: "marketingRechargedetailed"
      })
   },
   watch: {
      dealType(data) {
         if (data.state) {
            this.defaultData(data.type);
         }
      },
      dealState(data) {
         if (data.success) {
            this.closeModal("resetList");
         }
         this.$message({
            type: data.success ? "success" : "error",
            message: data.message
         });
      },
      marketingRechargeAdd(data) {
         if (data.success) {
            this.closeModal("resetList");
         }
         this.$message({
            type: data.success ? "success" : "error",
            message: data.message
         });
      }
   },

   methods: {
      closeModal(type) {
         Object.assign(this.$data, this.$options.data());
         if (type == "resetList") {
            this.$emit("resetList");
         } else {
            this.$emit("closeModal");
         }
      },
      chooseShopFun(v) {
         if (!v) {
            this.chooseShopList = [];
         }
      },
      changeIsDouble(e) {
         if (e == true) {
            if (this.RechargeList.length > 1) {
               this.$confirm("启用后，新增规则将自动删除只保留第一条规则", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
               })
                  .then(() => {
                     this.RechargeList = [this.RechargeList[0]];
                  })
                  .catch(() => {
                     this.ruleForm.IsDouble = false;
                  });
            }
         }
      },

      inputMoney(itemList) {
         let haveSameMoney = this.RechargeList.filter(item => item.Addmoney == itemList.Addmoney);
         if (haveSameMoney.length > 1) {
            this.$message({
               message: "规则充值金额不可重复,请重新输入充值金额!",
               type: "warning"
            });
            itemList.Addmoney = "";
         }
      },

      //删除规则
      delRule(item, idx) {
         let IsCancel;
         if (this.RechargeList.length == 1) {
            this.$message.warning("至少要有一条规则 !");
         } else {
            for (var i in this.RechargeList) {
               if (item.title == this.RechargeList[i].title) {
                  this.RechargeList[i].showRules = false;
                  this.RechargeList[i].IsCancel = 1;
                  if (item.Id != "") {
                     if (this.RechargeList[i].Id == item.Id) {
                        this.delList.push(this.RechargeList[i]);
                        this.RechargeList.splice(i, 1);
                     }
                  } else {
                     this.RechargeList.splice(i, 1);
                  }
               }
            }
         }
         this.titleIdxName();
      },
      titleIdxName() {
         let arr = [];
         for (var i in this.RechargeList) {
            this.rTitleArr[i], arr.push(this.RechargeList[i]);
         }
         this.RechargeList = arr;
      },
      addButtom() {
         if (this.RechargeList.length < 10) {
            let Obj = {
               Id: "",
               title: this.rTitleArr[this.RechargeList.length],
               Addmoney: "",
               Integral: 0,
               Money: "",
               GoodsCountList: [],
               showRules: true,
               IsCancel: 0
            };
            this.RechargeList.push(Obj);
         } else {
            this.$message.warning("最多只能添加10个规则");
         }
      },
      onSubmit() {
         if (!this.ruleForm.Name) {
            this.$message.warning("请输入活动名称");
            return;
         }
         if (
            this.ruleForm.dateBE.length < 2 ||
            !this.ruleForm.dateBE[0] ||
            !this.ruleForm.dateBE[1]
         ) {
            this.$message.warning("请选择时间");
            return;
         }

         let arr1 = [],
            arr2 = [];
         if (this.chooseShopState) {
            this.shopList.forEach(element => {
               arr1.push(element.ID);
               arr2.push(element.NAME);
            });
            this.chooseShopList = [...arr1];
         } else {
            this.chooseShopList.forEach(v => {
               let idx = this.shopList.findIndex(item => (item.ID = v));
               arr2.push(this.shopList[idx].NAME);
            });
         }
         if (this.chooseShopList.length == 0) {
            this.$message.warning("请选择店铺");
            return;
         }

         let newArr = this.RechargeList.concat(this.delList);
         let sendData = {
            Id: this.ruleForm.Id,
            Name: this.ruleForm.Name,
            GiftList: JSON.stringify(newArr),
            BeginDate: this.ruleForm.dateBE[0],
            EndDate: this.ruleForm.dateBE[1],
            IsStart: this.ruleForm.IsStart,
            IsDouble: this.ruleForm.IsDouble ? 1 : 0,
            ShopList: this.chooseShopList.join(","),
            ShopName: arr2.join(",")
         };
         this.$store.dispatch(
            this.dealType.type == "add" ? "getMarketingRechargeAdd" : "getMarketingRechargeEit",
            { data: sendData }
         );
      },
      defaultData(type) {
         if (type == "add") {
            Object.assign(this.$data, this.$options.data());
            let btime = new Date().getTime(),
               etime = new Date(this.getCustomDay(7)).getTime();
            this.ruleForm.dateBE = [btime, etime];
         }
         if (type == "edit") {
            let dataObj = this.dealType.itemData.Obj,
               countList = this.dealType.itemData.CountList,
               giftList = this.dealType.itemData.GiftList;
            let theShop = dataObj.SHOPLIST ? dataObj.SHOPLIST.split(",") : [],
               garr = [];
            if (theShop.length == this.shopList.length) {
               this.chooseShopState = true;
               this.chooseShopList = [];
            } else {
               this.chooseShopState = false;
               this.chooseShopList = [...theShop];
            }
            this.ruleForm = {
               Id: dataObj.ID,
               Name: dataObj.NAME,
               IsStart: dataObj.ISSTART ? 1 : 0,
               IsDouble: dataObj.ISDOUBLE,
               dateBE: [dataObj.BEGINDATE, dataObj.ENDDATE],
               GiftList: [],
               ShopName: "",
               ShopList: ""
            };
            for (let i = 0; i < giftList.length; i++) {
               let element = giftList[i];
               garr.push({
                  Id: element.ID,
                  title: this.rTitleArr[i],
                  Addmoney: element.ADDMONEY,
                  Money: element.MONEY,
                  showRules: true,
                  Integral: 0,
                  IsCancel: element.ISCANCEL == false ? 0 : 1
               });
            }
            this.RechargeList = garr;
         }
      }
   },
   mounted() {
      this.$store.dispatch("getShopList", {});
   }
};
</script>

<style scoped>
.rulesStyleBg {
   position: relative;
   background: #ffffff;
   border: 1px solid #e4e4e4;
   border-radius: 4px;
   padding: 10px 10px;
}

.del {
   position: absolute;
   right: 25px;
   top: 16px;
   color: #fe825e;
}
.del:hover {
   cursor: pointer;
   color: #197deb;
}
</style>
