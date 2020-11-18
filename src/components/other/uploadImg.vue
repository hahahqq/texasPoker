<template>
   <div class="uploadIMg">
      <el-upload
         ref="upload"
         class="avatar-uploader"
         action
         :show-file-list="false"
         :auto-upload="false"
         :on-change="changeFile"
         :before-upload="changeFile2"
      >
         <div v-if="!imageUrl" slot="trigger" class="el-upload el-upload--picture-card">
            <img
               v-if="imgData.name"
               :src="imgOld"
               :onerror="imgError"
               class="avatar"
               style="width:100%; height: 100%"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
         </div>
      </el-upload>
      <div
         v-if="imageUrl"
         class="el-upload el-upload--picture-card uploadActions"
         style="margin-top: -32px"
      >
         <img :src="imageUrl" class="avatar" style="height: 100%; width: 100%" />
         <span class="el-upload-list__item-delete">
            <a class="el-icon-delete pointer" @click="clearfun"></a>
         </span>
      </div>
   </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { GOODS_IMGURL } from "@/util/define.js";
import img from "@/assets/newimg.jpg";

export default {
   props: {
      imgData: {
         type: Object,
         default: {
            name: "",
            isClear: false
         }
      }
   },
   data() {
      return {
         imageUrl: "",
         imgOld: img,
         imgError: 'this.src="' + img + '"',
         loading: false
      };
   },
   computed: {
      ...mapGetters({
         uploadState: "goodsImgUploadState"
      })
   },
   watch: {
      imgData(data) {
         console.log(data);
         this.defaultData();
         if (data.isClear) {
            this.clearfun();
         }
      },
      uploadState(data) {
         this.loading = false;
         console.log(1112, data);
         this.clearfun();
      }
   },
   methods: {
      changeFile2(file) {
         console.log(222);
         this.imageUrl = file;
      },
      changeFile(file, fileList) {
         var that = this;
         //this.imageUrl = URL.createObjectURL(file.raw);
         var reader = new FileReader();
         reader.readAsDataURL(file.raw);
         reader.onload = function(e) {
            this.result; // 这个就是base64编码了
            that.imageUrl = this.result;
            console.log(111);
         };
      },
      uploadFun(data) {
         let sendData = Object.assign({}, this.imgData);
         if (data) {
            sendData = Object.assign({}, data);
         }
         // console.log(sendData,this.imageUrl,this.loading);
         if (sendData.name && this.imageUrl && !this.loading) {
            this.$store
               .dispatch("uploadGoodsImg", {
                  name: sendData.name + ".png",
                  filePath: "goodsimage",
                  file: this.imageUrl
               })
               .then(() => {
                  this.imgOld = img;
                  this.loading = true;
               });
         } else {
            this.loading = false;
            //  this.$notify.error({
            //      title: "错误",
            //      message: "图片上传失败，请重新上传！"
            //  });
         }
      },
      clearfun() {
         this.$refs.upload.clearFiles();
         this.imageUrl = "";
         // this.imgOld = "";
      },
      defaultData() {
         this.imgOld = this.imgData.name
            ? GOODS_IMGURL + this.imgData.name + ".png?" + Math.random()
            : img;
      }
   },
   mounted() {
      this.clearfun();
      this.defaultData();
   }
};
</script>
<style scoped>
.uploadActions {
   position: relative;
}
.uploadActions:hover .el-upload-list__item-delete {
   position: absolute;
   width: 100%;
   height: 100%;
   left: 0;
   top: 0;
   cursor: default;
   text-align: center;
   color: #fff;
   font-size: 20px;
   background-color: rgba(0, 0, 0, 0.5);
   display: block;
}
.uploadIMg .el-upload {
   overflow: hidden;
}
.uploadIMg .el-upload--picture-card {
   width: 88px;
   height: 88px;
   line-height: 98px;
}
</style>
