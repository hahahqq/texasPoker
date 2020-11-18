<template>
   <el-container>
      <el-header style="height: 50px; padding: 0">
         <headerPage :pageList="buttonGroup"></headerPage>
      </el-header>
      <el-container>
         <el-aside width="100px">
            <section style="min-width: 100px">
               <memberMenu
                  :activePath="activePath"
                  :routesList="routesList"
                  :width="100"
               ></memberMenu>
            </section>
         </el-aside>
         <el-main style="padding: 10px">
            <div class="bg-white padding-sm overflowY-scroll" :style="{ height: height + 'px' }">
               <el-row>
                  <el-col :span="12">
                     <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        :hide-required-asterisk="true"
                        label-width="100px"
                     >
                        <!-- <el-form-item label="会员名称" prop="Name">
									<el-input
										size="small"
										v-model="ruleForm.Name"
										autocomplete="off"
										placeholder="如 “微信会员” "
										style="width: 400px"
									></el-input>
								</el-form-item> -->
                        <el-form-item label="会员等级" prop="LevelId">
                           <el-select
                              size="small"
                              v-model="ruleForm.LevelId"
                              @change="curLevel"
                              clearable
                              placeholder="请选择微信会员注册对应的等级"
                              style="width: 400px"
                           >
                              <el-option
                                 v-for="item in memberLevelList"
                                 :key="item.NAME"
                                 :label="item.NAME"
                                 :value="item.ID"
                              ></el-option>
                           </el-select>
                        </el-form-item>

                        <el-form-item label="权益说明">
                           <el-input
                              type="textarea"
                              v-model="ruleForm.Explain"
                              size="small"
                              placeholder="请输入会员权益说明"
                              style="width: 400px"
                           ></el-input>
                        </el-form-item>

                        <el-form-item label="文字颜色">
                           <div style="line-height: 1">
                              <div
                                 v-for="(item, i) in colorList"
                                 :key="i"
                                 class="inline-block relative pointer m-right-sm m-right-sm m-top-sm"
                                 @click="
                                    colorActive = i;
                                    setCurBg(item);
                                 "
                              >
                                 <span
                                    class="inline-block border vertical-middle font-12 text-center"
                                    style="width: 50px; height: 25px;line-height: 25px; border-radius: 3px"
                                    :style="{
                                       color: colorActive == i && i > 0 ? 'white' : 'initial',
                                       'background-color':
                                          colorActive == i && i > 0 ? item.value : 'white',
                                       'border-color':
                                          colorActive == i && i > 0 ? item.value : item.border
                                    }"
                                 >
                                    {{ item.label }}
                                 </span>
                                 <span
                                    v-if="colorActive == i"
                                    class="absolute inline-block"
                                    style="right: -9px; top: -9px; height: 20px"
                                 >
                                    <i class="el-icon-success text-theme4 font-16 vertical-top"></i>
                                 </span>
                              </div>
                           </div>
                        </el-form-item>
                        <el-form-item label="背景图片选择">
                           <div style="width: 400px">
                              <div class="img-bottom" v-if="haveNewAddImg.length > 0">
                                 <div class="img-bottom-right" style="text-align: right">
                                    <span
                                       style="cursor: pointer"
                                       @click="success = false"
                                       v-if="success"
                                    >
                                       <i class="el-icon-check"></i>
                                       &nbsp;完成
                                    </span>
                                    <span v-else style="cursor: pointer" @click="success = true">
                                       <i class="el-icon-edit-outline"></i>
                                       &nbsp;编辑
                                    </span>
                                 </div>
                              </div>
                              <div class="imgupload">
                                 <ul>
                                    <li class="pointer">
                                       <test v-on:addBgImg="addBgImg"></test>
                                    </li>
                                    <li
                                       class="pointer upload_warp_img_div"
                                       v-for="(items, index) in marketingListImg"
                                       :key="index"
                                    >
                                       <el-button
                                          v-if="success && items.ISSYS == 0"
                                          @click="
                                             bgActive = index;
                                             deleteImgUrl(index, items.ID);
                                          "
                                          class="el-icon-delete"
                                       ></el-button>
                                       <img
                                          :src="items.IMAGE"
                                          alt
                                          @click="
                                             bgActive = index;
                                             slectImgUrl(items);
                                          "
                                          width="45px"
                                          height="90px"
                                       />
                                       <span
                                          v-if="bgActive == index"
                                          class="absolute inline-block"
                                          style="right: -4px; top: 0px; height: 20px"
                                       >
                                          <i
                                             class="el-icon-success text-theme4 font-18 vertical-top"
                                          ></i>
                                       </span>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </el-form-item>
                        <el-form-item>
                           <el-button type="primary" @click="handleSubmit" :loading="loading">
                              保 存
                           </el-button>
                        </el-form-item>
                     </el-form>
                  </el-col>
                  <el-col :span="12">
                     <div class="imgUrl" :style="`color: ${ruleForm.Color}`">
                        <div
                           class="backgroundImg"
                           v-if="ruleForm.Image != undefined"
                           :style="`background:url(${ruleForm.Image})`"
                        >
                           <div class="row-flex flex-start flex-items-center">
                              <div style="min-width: 50px">
                                 <img
                                    :src="logoImg"
                                    alt
                                    width="40px"
                                    height="40px"
                                    style="border-radius: 50%"
                                    class="block"
                                 />
                              </div>
                              <div class="full-width font-12">
                                 <div>
                                    <span
                                       v-text="ruleForm.Name ? ruleForm.Name : '会员名称'"
                                    ></span>
                                 </div>
                                 <div>
                                    <span v-text="levelName ? levelName : '无'"></span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </el-col>
               </el-row>
            </div>
         </el-main>
      </el-container>
   </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { CityInfo } from "@/assets/js/area.js";
import { getUserInfo, getHomeData } from "@/api/index";
import MIXINS_MARKETING from "@/mixins/marketing.js";
import { IMG_URL, IMG_FILEPATH, ROOT_STATE } from "@/util/define";
import { textColor } from "@/util/com/common";
export default {
   mixins: [MIXINS_MARKETING.MARKETING_MENU],
   data() {
      return {
         height: window.innerHeight - 70,
         logoImg: "static/images/sysLogo.png",
         success: false,
         ruleForm: {
            Name: "",
            LevelId: "",
            Image: "",
            Color: "#FFFFFF",
            Explain: ""
         },
         dialogImageUrl: [],
         rules: {
            Name: [
               {
                  required: true,
                  message: "请输入会员名称",
                  trigger: "blur"
               }
            ]
         },
         loading: false,
         imgUrl: "",
         choseImg: {},
         haveNewAddImg: [],
         levelName: "",
         vipCardDetails: {
            Name: ""
         },
         colorList: textColor,
         colorActive: 0,
         bgActive: 0,
         buttonGroup: [
            { label: "拓客工具", value: "/marketing/bespeakList" },
            { label: "微信会员卡", value: "" }
         ]
      };
   },
   computed: {
      ...mapGetters({
         dataItem: "marketingItem",
         memberLevelList: "memberLevelList",
         dealState: "setVipCardBackGround",
         marketingListImg: "marketingListImg",
         ImageMaxNum: "ImageMaxNum",
         marketingSaveImg: "marketingSaveImg",
         marketingDelImg: "marketingDelImg",
         goodsImgUploadState: "goodsImgUploadState",
         getVipCardBackGround: "getVipCardBackGround"
      })
   },
   watch: {
      getVipCardBackGround(data) {
         if (data.success) {
            let info = data.data.Obj;
            this.ruleForm = {
               Name: info.NAME,
               Color: info.COLOR,
               Image: info.IMAGE,
               LevelId: info.LEVELID,
               Explain: info.EXPLAIN
            };
            this.levelName = info.LEVELNAME;
         }
      },
      goodsImgUploadState(data) {
         if (data.success) {
            this.getMarketingListImg();
         }
      },
      dealState(data) {
         this.loading = false;
         this.$message({
            message: data.message,
            type: data.success ? "success" : "error"
         });

         if (data.success) {
            if (this.choseImg.isNewAdd != undefined) {
               let homeInfo = getHomeData();
               let id = homeInfo.shop.COMPANYID + "_";
               let max = this.ImageMaxNum + 1;
               let name = id + max;
               let sendData = {
                  Image: IMG_URL + IMG_FILEPATH[2] + name + ".png",
                  SmallImage: IMG_URL + IMG_FILEPATH[2] + "s" + name + ".png",
                  ImageNum: this.ImageMaxNum + 1,
                  Id: "",
                  Type: 2
               };
               this.$store.dispatch("getMarketingSaveImg", sendData);
            }
         }
      },
      marketingSaveImg(data) {
         let homeInfo = getHomeData();
         let id = homeInfo.shop.COMPANYID + "_";
         let max = this.ImageMaxNum + 1;
         let name = id + max;
         this.$store.dispatch("uploadGoodsImg", {
            name: name + ".png",
            filePath: "backgroundimage",
            file: this.ruleForm.Image
         });
         this.$store.dispatch("uploadGoodsImg", {
            name: "s" + name + ".png",
            filePath: "backgroundimage",
            file: this.ruleForm.Image
         });
         this.$store.dispatch("getVipCardBg");
      },
      marketingDelImg(data) {
         if (data.success) {
            this.getMarketingListImg();
         }
         this.$message({
            type: data.success ? "success" : "error",
            message: data.message
         });
      }
   },
   methods: {
      curLevel(event, item) {
         let levelName = this.memberLevelList.filter(item => item.ID == this.ruleForm.LevelId);
         this.levelName = levelName[0].NAME;
      },
      setCurBg(item) {
         this.ruleForm.Color = item.value;
         // this.ruleForm.TextColorName = item.label;
         // this.imgIcon = "static/images/icon_right_" + item.id + ".png";
      },
      addBgImg(data) {
         this.success = false;
         this.marketingListImg.unshift({
            IMAGE: data,
            ISSYS: 0,
            isNewAdd: true,
            ID: ""
         });
         this.haveNewAddImg = this.marketingListImg.filter(item => item.ISSYS == 0);
      },
      deleteImgUrl(indexs, id) {
         if (id == "") {
            this.marketingListImg.splice(indexs, 1);
            this.haveNewAddImg = this.marketingListImg.filter(item => item.ISSYS == 0);
            return;
         }
         this.$confirm("该图片删除会影响正在使用该图片的活动，是否继续删除？", "提示", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
         })
            .then(() => {
               this.$store.dispatch("delImg", { id });
            })
            .catch(() => {});
      },
      slectImgUrl(item) {
         this.ruleForm.Image = item.IMAGE;
         this.choseImg = item;
      },
      handleSubmit() {
         let sendData = Object.assign({}, this.ruleForm);
         if (this.choseImg.isNewAdd == true) {
            let homeInfo = getHomeData();
            let id = homeInfo.shop.COMPANYID + "_";
            let max = this.ImageMaxNum + 1;
            let name = id + max;
            sendData.ImgName = IMG_URL + IMG_FILEPATH[2] + name + ".png";
         } else {
            sendData.ImgName = this.ruleForm.Image;
         }
         this.$refs.ruleForm.validate(valid => {
            if (valid) {
               this.$store.dispatch("setVipCardBg", sendData).then(() => {
                  this.loading = true;
               });
            } else {
               this.loading = false;
            }
         });
      },
      handleRemove(file, fileList) {
         console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
         this.dialogVisible = true;
      },
      getMarketingListImg() {
         this.$store.dispatch("getMarketingListImg", { Type: 2 });
      }
   },
   mounted() {
      this.getMarketingListImg();
      this.$store.dispatch("getMemberLevel");
      this.$store.dispatch("getVipCardBg");
   },
   components: {
      Test: () => import("@/components/marketing/test1"),
      headerPage: () => import("@/components/header/headBC")
   }
};
</script>
<style scoped>
.half {
   width: 50%;
   margin-right: 0px;
   float: left;
}
.imgUrl {
   width: 100%;
   text-align: left;
}

.img-bottom {
   display: flex;
   width: 100%;
   height: 30px;
   align-items: center;
}
.img-bottom-right {
   width: 100%;
   color: #fb789a;
}
.imgupload {
   width: 100%;
   display: flex;
   align-items: center;
}
.imgupload img {
   width: 70px;
   height: 45px;
   margin-top: 6px;
   border-radius: 3px;
}
.imgupload ul li {
   float: left;
   margin-right: 6px;
   position: relative;
}
.el-icon-delete {
   position: absolute;
   top: 10px;
   text-align: center;
   color: #fff;
   opacity: 0.6;
   width: 70px;
   height: 45px;
   background: #333;
}
.imgupload ul {
   overflow: auto;
   max-height: 190px;
}
.title {
   width: 100%;
   float: left;
   margin-top: 26px;
   font-size: 16px;
   font-family: "宋体";
}
.backgroundImg {
   background-size: 100% 100% !important;
   background-repeat: no-repeat !important;
   height: 160px;
   width: 300px;
   background-position: center !important;
   padding: 10px 20px;
}
</style>
