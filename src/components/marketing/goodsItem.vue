<template>
   <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
         <el-form-item label="商品名称">
            <span v-if="dealType.type == 'edit'" class="padding-sm marginLR-xs inline-block">
               {{ dataItem.GOODSNAME }}
            </span>
            <a
               v-if="dealType.type == 'add'"
               @click="isShowFirstPopup = true"
               class="inline-block paddingTB-sm paddingLR-xs pointer"
               style="line-height: 1"
            >
               <span
                  v-text="Object.keys(selgoods).length > 0 ? selgoods.NAME : '请选择商品'"
               ></span>
               <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
         </el-form-item>
         <!-- <el-form-item label="背景图文件名" class="half">
        <el-input v-model="ruleForm.ImgName"></el-input>
      </el-form-item> -->
         <el-form-item label="原价" class="half clearfix">
            <el-input v-model.number="ruleForm.Price" type="number" min="0"></el-input>
         </el-form-item>
         <el-form-item label="优惠价" class="half">
            <el-input v-model.number="ruleForm.DisPrice" type="number" min="0"></el-input>
         </el-form-item>
         <!-- <el-form-item label="品牌" class="half">
        <el-input v-model="ruleForm.GoodsBrand"></el-input>
      </el-form-item> -->
         <div class="clearfix"></div>
         <el-form-item label="商品描述">
            <el-input
               type="textarea"
               autosize
               placeholder="请输入内容"
               v-model="ruleForm.GoodsRemark"
            ></el-input>
         </el-form-item>

         <el-form-item label="有效时间">
            <el-date-picker
               v-model="dateBE[0]"
               value-format="timestamp"
               align="right"
               type="date"
               size="small"
               placeholder="选择开始日期"
               style="width: 47%; margin-right: -4px"
            ></el-date-picker>
            <span class="text-muted inline-block text-center" style="width: 6%">至</span>
            <el-date-picker
               v-model="dateBE[1]"
               value-format="timestamp"
               align="right"
               type="date"
               size="small"
               placeholder="选择结束日期"
               style="width: 47%; margin-left: -4px"
            ></el-date-picker>
         </el-form-item>
         <el-form-item label="联系方式" class="half">
            <el-input v-model.number="ruleForm.Tel" type="number" min="0"></el-input>
         </el-form-item>
         <!-- <el-form-item label="地区">
        <el-cascader :options="areaOptions" v-model="selectedAreaOptions" show-all-levels expand-trigger="hover" class="full-width">
        </el-cascader>
      </el-form-item> -->
         <el-form-item label="地址" class="half">
            <el-input v-model="ruleForm.Address"></el-input>
         </el-form-item>
         <div class="clearfix"></div>
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

            <!-- <el-checkbox-group v-model="ShopList">
					<el-checkbox v-for="(item, i) in shopList" :key="i" :label="item.ID" border>
						{{ item.NAME }}
					</el-checkbox>
				</el-checkbox-group> -->
         </el-form-item>

         <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
            <el-button @click="closeModal">取 消</el-button>
         </el-form-item>
      </el-form>

      <!-- goodsTable -->
      <el-dialog
         width="70%"
         title="选择商品"
         :visible.sync="isShowFirstPopup"
         append-to-body
         style="max-width: 100%"
      >
         <selGoods @closeModal="isShowFirstPopup = false"></selGoods>
      </el-dialog>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { CityInfo } from "@/assets/js/area.js";
import MIXINS from "@/mixins/index";
export default {
   props: {
      dealType: {
         type: Object,
         default: function() {
            return {
               type: "add",
               state: false
            };
         }
      }
   },
   mixins: [MIXINS.IS_SHOW_POPUP],
   data() {
      var checkTel = (rule, value, callback) => {
         if (!value) {
            return callback(new Error("手机号码不能为空"));
         }
         setTimeout(() => {
            if (!Number.isInteger(value)) {
               callback(new Error("请输入数字值"));
            } else {
               var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
               if (!myreg.test(value)) {
                  callback(new Error("请输入正确的手机号码"));
               } else {
                  callback();
               }
            }
         }, 800);
      };
      return {
         ruleForm: {
            ImgName: "",
            GoodsId: "",
            Price: 0,
            DisPrice: 0,
            GoodsBrand: "",
            GoodsRemark: "",
            BeginDate: "",
            EndDate: "",
            Tel: null,
            Address: ""
         },
         rules: {
            GoodsId: [
               {
                  required: true,
                  message: "请选择商品",
                  trigger: "blur"
               }
            ],
            Tel: [
               {
                  required: true,
                  validator: checkTel,
                  trigger: "blur"
               }
            ]
         },
         dateBE: [],
         ShopList: [], //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空 . add
         areaOptions: CityInfo,
         selectedAreaOptions: [],
         loading: false,
         showGoodsTable: false,
         chooseShopState: true,
         chooseShopList: []
      };
   },
   computed: {
      ...mapGetters({
         dataItem: "marketingItem",
         shopList: "shopList",
         dealState: "dealMarketingState",
         selgoods: "selgoods"
      })
   },
   watch: {
      dealType(data) {
         console.log("数据传值", data);
         this.defaultData();
      },
      dealState(data) {
         if (this.loading) {
            this.$message({
               message: data.message,
               type: data.success ? "success" : "error"
            });
            if (data.success) {
               this.closeModal("resetList");
            }
         }
         this.loading = false;
      },
      selgoods(data) {
         this.ruleForm.Price = data.PRICE;
         this.ruleForm.GoodsRemark = data.REMARK;
         this.ruleForm.GoodsId = data.ID;
      }
   },
   methods: {
      closeModal(type) {
         if (this.$refs.ruleForm) {
            this.$refs.ruleForm.resetFields();
         }
         if (type == "resetList") {
            this.$emit("resetList");
         } else {
            this.$emit("closeModal");
         }
      },
      handleSubmit() {
         // let address = this.getAreaLabel() + sendData.Address;
         //  let sendData = Object.assign({}, sendData, {
         //   Address: address
         // });
         let sendData = Object.assign({}, this.ruleForm);
         console.log("数据结构", sendData);
         if (this.dateBE.length > 0) {
            sendData.BeginDate = this.dateBE[0];
            sendData.EndDate = this.dateBE[1];
         }
         if (this.chooseShopState) {
            let arr1 = [];
            this.shopList.forEach(element => {
               arr1.push(element.ID);
            });
            this.chooseShopList = [...arr1];
         }
         if (this.chooseShopList.length == 0) {
            this.$message.warning("请选择店铺");
            return;
         }
         sendData.ShopList = this.chooseShopList.join(",");
         if (this.dealType.type == "edit") {
            sendData.BillId = this.dataItem.BILLID;
         }
         this.$refs.ruleForm.validate(valid => {
            if (valid) {
               this.$store
                  .dispatch("dealGoodsAction", {
                     type: this.dealType.type,
                     data: sendData
                  })
                  .then(() => {
                     this.loading = true;
                  });
            } else {
               this.loading = false;
            }
         });
      },
      getAreaLabel() {
         let seled = [...this.selectedAreaOptions];
         let areaStr = "";
         if (seled.length == 0) return areaStr;
         for (let i = 0; i < this.areaOptions.length; i++) {
            if (this.areaOptions[i].value == seled[0]) {
               areaStr += this.areaOptions[i].label + " ";
               for (let j = 0; j < this.areaOptions[i].children.length; j++) {
                  if (this.areaOptions[i].children[j].value == seled[1]) {
                     areaStr += this.areaOptions[i].children[j].label + " ";
                     let karr = [...this.areaOptions[i].children[j].children];
                     for (let k = 0; k < karr.length; k++) {
                        if (karr[k].value == seled[2]) {
                           areaStr += karr[k].label + " ";
                           break;
                        }
                     }
                     break;
                  }
               }
               break;
            }
         }
         return areaStr;
      },
      setAddress(address) {
         let seled = address.split(" ");
         let areaStr = [];
         let defauleArr = [...this.areaOptions];
         for (let i = 0; i < defauleArr.length; i++) {
            if (defauleArr[i].label == seled[0]) {
               areaStr.push(defauleArr[i].value);
               for (let j = 0; j < defauleArr[i].children.length; j++) {
                  if (defauleArr[i].children[j].label == seled[1]) {
                     areaStr.push(defauleArr[i].children[j].value);
                     let karr = [...defauleArr[i].children[j].children];
                     for (let k = 0; k < karr.length; k++) {
                        if (karr[k].label == seled[2]) {
                           areaStr.push(karr[k].value);
                           break;
                        }
                     }
                     break;
                  }
               }
               break;
            }
         }
         this.selectedAreaOptions = [...areaStr];
         this.ruleForm.Address = seled[3];
      },
      chooseShopFun(v) {
         if (!v) {
            this.chooseShopList = [];
         }
      },
      defaultData() {
         Object.assign(this.$data, this.$options.data());
         if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
         if (this.shopList.length == 0) {
            this.$store.dispatch("getShopList", {});
         }
         if (this.dealType.type == "add") {
            this.dateBE = [new Date().getTime(), new Date(this.getCustomDay(7)).getTime()];
         }
         if (this.dealType.type == "edit") {
            for (let key in this.ruleForm) {
               let kk = key.toUpperCase();
               this.ruleForm[key] = this.dataItem[kk];
            }
            if (this.dataItem.BEGINDATE != 1) {
               this.dateBE = [this.dataItem.BEGINDATE, this.dataItem.ENDDATE];
            }
         }
      }
   },
   mounted() {
      this.defaultData();
   },
   components: {
      selGoods: () => import("@/components/selected/selgoods")
   }
};
</script>
<style scoped>
.half {
   width: 50%;
   margin-right: 0px;
   float: left;
}
</style>
