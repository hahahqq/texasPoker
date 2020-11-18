<template>
   <div>
      <div class="bg-white m-bottom-sm">
         <div class="content-center paddingTB-md">
            <div class="m-bottom-sm font-14">商品类型</div>
            <ul>
               <li
                  v-for="(item, i) in goodsStateArr"
                  :key="i"
                  class="inline-block padding-sm text-center m-right-sm border font-18 pointer"
                  :class="{ 'border-theme text-theme': activeState == item.value }"
                  style="width:200px;line-height:60px"
                  @click="activeStateFun(item.value)"
               >
                  <span>{{ item.label }}</span>

                  <el-tooltip placement="top" v-if="item.value == 0">
                     <div slot="content" style="max-width:200px">
                        电子卡券为虚拟商品，兑换成功后会员在我的背包中查看，兑换时可到店核销；会员也可将券转赠给好友
                     </div>
                     <i class="el-icon-question"></i>
                  </el-tooltip>
               </li>
            </ul>
         </div>
      </div>
      <div class="bg-white m-bottom-sm">
         <div class="content-center paddingTB-sm">
            <div class="m-bottom-sm font-14 m-top-sm">基本信息</div>
            <div>
               <el-form
                  ref="formData"
                  :model="formData"
                  :rules="rules"
                  label-width="100px"
                  size="small"
                  style="max-width:500px"
               >
                  <el-form-item label="商品名称" prop="name">
                     <el-input type="text" v-model="formData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="所需积分" prop="aa">
                     <el-input type="number" v-model.number="formData.aa"></el-input>
                  </el-form-item>
                  <el-form-item label="商品库存" prop="bb">
                     <el-input type="number" v-model.number="formData.bb"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期">
                     <el-radio-group v-model="formData.cc">
                        <el-radio :label="0">永久有效</el-radio>
                        <el-radio :label="1">固定期间可用</el-radio>
                     </el-radio-group>
                     <div style="line-height:1" v-if="formData.cc == 1">
                        <el-date-picker
                           v-model="formData.BeginDate"
                           value-format="timestamp"
                           format="yyyy-MM-dd HH:mm"
                           align="right"
                           type="date"
                           size="small"
                           placeholder="选择开始日期"
                           style="width: 180px"
                        ></el-date-picker>
                        <span class="text-muted text-center">至</span>
                        <el-date-picker
                           v-model="formData.EndDate"
                           value-format="timestamp"
                           format="yyyy-MM-dd HH:mm"
                           align="right"
                           type="date"
                           size="small"
                           placeholder="选择结束日期"
                           style="width: 180px"
                        ></el-date-picker>
                     </div>
                  </el-form-item>
                  <el-form-item label="参与店铺">
                     <el-radio-group v-model="chooseShopState" @change="chooseShopFun">
                        <el-radio :label="true">全部店铺</el-radio>
                        <el-radio :label="false">部分店铺</el-radio>
                     </el-radio-group>
                     <div v-if="!chooseShopState">
                        <el-checkbox-group v-model="chooseShopList" size="small">
                           <el-checkbox
                              border
                              v-for="(item, i) in shopList"
                              :key="i"
                              :label="item.ID"
                           >
                              {{ item.NAME }}
                           </el-checkbox>
                        </el-checkbox-group>
                     </div>
                  </el-form-item>

                  <el-form-item label="支付方式">
                     <el-checkbox-group v-model="formData.dd">
                        <el-checkbox
                           v-for="(item, i) in payWayList"
                           :key="i"
                           :label="item.NAME"
                           :value="item.ID"
                        ></el-checkbox>
                     </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="">
                     <template slot="label">
                        <div>
                           <span>兑换须知</span>
                           <el-tooltip placement="top-start">
                              <div slot="content" style="max-width:200px">
                                 注：您可对使用场景、兑换时间、兑换方式、退换情况等进行说明。例如：
                                 <br />
                                 1. 本券仅可在XXX时使用
                                 <br />
                                 2. 请准时兑换，过期作废
                                 <br />
                                 3. 兑换时请向店员出示二维码
                                 <br />
                                 4. 本商品一经兑换不可退换
                                 <br />
                                 5. 请准时兑换，过期作废
                              </div>
                              <i class="el-icon-info"></i>
                           </el-tooltip>
                        </div>
                     </template>
                     <el-input type="textarea" v-model="formData.ee"></el-input>
                  </el-form-item>
                  <el-form-item label="下架设置">
                     <el-checkbox v-model="formData.ff">定时下架</el-checkbox>
                     <div class="inline-block m-left-sm" v-if="formData.ff">
                        <el-date-picker
                           v-model="formData.fff"
                           value-format="timestamp"
                           format="yyyy-MM-dd HH:mm"
                           align="right"
                           type="date"
                           size="small"
                           placeholder="选择下架时间"
                           style="width: 180px"
                        ></el-date-picker>
                     </div>
                  </el-form-item>
                  <el-form-item label="是否上架">
                     <el-radio-group v-model="formData.gg">
                        <el-radio :label="0">上架</el-radio>
                        <el-radio :label="1">下架</el-radio>
                     </el-radio-group>
                  </el-form-item>
                  <el-form-item label="商品图片">
                     <upload-img
                        :imgData="imgData"
                        class="inline-block"
                        ref="uploadImgDiv"
                     ></upload-img>
                  </el-form-item>
                  <el-form-item label="图文介绍"></el-form-item>

                  <el-form-item>
                     <el-button @click="resetForm">取消</el-button>
                     <el-button type="primary" @click="submitForm">保存</el-button>
                  </el-form-item>
               </el-form>
            </div>
         </div>
      </div>
      <div class="content-center paddingTB-sm"></div>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
   data() {
      return {
         loading: false,
         pageData: {
            shopId: "",
            id: null
         },
         formData: {
            BeginDate: "",
            EndDate: "",
            name: "",
            aa: "",
            bb: "",
            cc: "",
            dd: [],
            ff: "",
            fff: "",
            gg: ""
         },
         rules: {
            name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
            aa: [{ required: true, message: "请输入积分", trigger: "blur" }],
            bb: [{ required: true, message: "请输入库存", trigger: "blur" }]
         },
         goodsStateArr: [
            { label: "电子卡券", value: 0 }
            // { label: "实物商品", value: 1 },
            // { label: "优惠券", value: 2 }
         ],
         activeState: 0,
         chooseShopState: true,
         chooseShopList: [],
         imgData: { name: "" }
      };
   },
   computed: {
      ...mapGetters({
         shopList: "shopList",
         payWayList: "rechargeListList",
         dataState: "mallGoodsState",
         dataItem: "mallGoodsItem"
      })
   },
   watch: {
      dataState(data) {
         if (data.success && this.loading) {
            if (data.type == "item") {
               this.defaultData();
            } else {
               this.$message({
                  message: "保存成功",
                  type: "success"
               });
               this.resetForm();
            }
         }
         if (!data.success && this.loading) {
            this.$message({
               message: data.message,
               type: "error"
            });
         }
         this.loading = false;
      }
   },
   methods: {
      activeStateFun(v) {
         this.activeState = v;
      },
      chooseShopFun(v) {
         if (!v) {
            this.chooseShopList = [];
         }
      },
      submitForm() {
         let formName = "formData";
         this.$refs[formName].validate(valid => {
            if (valid) {
               this.onSubmit();
            } else {
               console.log("error submit!!");
               return false;
            }
         });
      },
      resetForm() {
         let formName = "formData";
         this.$refs[formName].resetFields();
      },
      onSubmit() {
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
         let sendData = Object.assign({}, this.formData);

         console.log("提交", sendData);
         // this.$store.dispatch("dealMallGoodsItem", sendData).then(() => {
         // 	this.loading = true;
         // });
      },
      getNewData() {
         let sendData = {
            shopId: this.pageData.shopId,
            id: this.pageData.id
         };
         this.$store.dispatch("getMallGoodsItem", sendData).then(() => {
            this.loading = true;
         });
      },
      defaultData() {
         console.log(111, this.dataItem);
      }
   },
   beforeCreate() {
      this.$store.dispatch("getrechargeList", {});
   },
   created() {
      let rData = this.$route.query;
      if (rData.id && rData.sid) {
         this.pageData.shopId = rData.sid;
         this.pageData.id = rData.id;
         this.getNewData();
      }
   },
   components: {
      uploadImg: () => import("@/components/other/uploadImg.vue")
   }
};
</script>
<style scoped>
.el-checkbox.is-bordered.el-checkbox--small {
   padding-top: 7px !important;
}
</style>
