<template>
  <div>
    <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24">
          <el-form-item label="店铺名称" prop="ShopName" style="width: 60%; margin-bottom: 15px">
            <el-input v-model="ruleForm.ShopName" clearable placeholder="请输入店铺名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-form-item label="店铺照片" style="width: 60%; margin-bottom: 15px">
            <el-upload
              style="height: 60px"
              action
              class="avatar-uploader"
              ref="upload"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="changeFile"
            >
              <img v-if="imageUrl" :src="imageUrl" onerror="this.src='static/images/logo2.png'" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="text-align: center; width: 100px; color: #aaa">上传店铺照片</div>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24">
          <el-form-item label="联系人" style="width: 60%; margin-bottom: 15px">
            <el-input
              v-model="ruleForm.Manager"
              clearable
              placeholder="请输入联系人姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-form-item label="联系电话" style="width: 60%; margin-bottom: 15px">
            <el-input
              v-model.number="ruleForm.PhoneNo"
              type="number"
              clearable
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24">
          <el-form-item label="地址" style="width: 60%; margin-bottom: 6px">
            <el-cascader
              :options="areaOptions"
              v-model="selectedAreaOptions"
              show-all-levels
              clearable
              placeholder="请选择省市区"
              expand-trigger="hover"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="" style="width: 80%; margin-bottom: 15px">
            <el-input
              v-model="ruleForm.Address"
              clearable
              style="width: 100%"
              placeholder="请输入店铺详细地址"
            >
              <el-button type="primary" slot="append" @click="showBaiDuMapFun()">
                搜索地图
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24">
          <el-form-item label="店铺简介" style="width: 80%">
            <el-input
              type="textarea"
              placeholder="介绍一下你的店铺吧，微信分享给好友时会显示这里的文案"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" style="text-align: center; margin-top: 20px">
          <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
          <el-button @click="closeModal">取 消</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 百度地图搜索 -->
    <el-dialog :visible.sync="showBaiDuMap" title="请选择地点" width="80%" append-to-body>
      <el-input v-model="addressKeyword" placeholder="请输入地址来直接查找相关位置"></el-input>
      <baidu-map
        class="bmView"
        :scroll-wheel-zoom="true"
        :center="location"
        :zoom="zoom"
        @click="getLocationPoint"
      >
        <bm-view style="width: 100%; height: 500px; margin-top: 10px; flex: 1"></bm-view>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="showAddressBar"
          :autoLocation="autoLocation"
        ></bm-geolocation>

        <bm-local-search
          :keyword="addressKeyword"
          :auto-viewport="true"
          style="display: none"
        ></bm-local-search>
      </baidu-map>

      <div style="text-align: right; margin-top: 20px">
        <el-button plain @click="showBaiDuMap = false">取消</el-button>
        <el-button type="primary" @click="submitAddress">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { CityInfo } from "@/assets/js/area.js";
const imageConversion = require("image-conversion");
import { SHOPIMAGESIMG } from "@/util/define";
export default {
  props: ["propsData"],
  data() {
    return {
      ruleForm: {
        ShopCode: "",
        ShopName: "",
        Manager: "",
        Address: "",
        ProvinceID: "",
        CityID: "",
        DistrictID: "",
        PhoneNo: "",
        Longitude: "",
        Latitude: ""
      },
      showAddressBar: true,
      autoLocation: true,
      rules: {
        ShopName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      showBaiDuMap: false,
      location: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 12.8,
      addressKeyword: "",
      areaOptions: CityInfo,
      selectedAreaOptions: [],
      getLocationInfo: {},
      imageUrl: "",
      imgFile: {}
    };
  },
  computed: {
    ...mapGetters({
      dataItem: "selshop",
      dataState: "dealShopState",
      provinceList: "provinceList",
      cityList: "cityList",
      districtList: "districtList",
      addressState: "addressState",
      ImgUploadState: "goodsImgUploadState"
    })
  },
  watch: {
    ImgUploadState(data) {
      if (data.success) {
        this.$refs.ruleForm.resetFields();
        this.closeModal("resetList");
      }
    },
    propsData(data) {
      if (data.state) this.defaultData();
    },
    dataState(data) {
      this.loading = false;
      if (data.success) {
        this.$message({
          message: data.message,
          type: "success"
        });

        if (this.imgFile.size != undefined) {
          let shopImg = SHOPIMAGESIMG + data.data.ShopID + ".png";
          let that = this;
          this.blobToBase64(this.imgFile, function (dataUrl) {
            let sendData = {
              name: data.data.ShopID + `.png`,
              filePath: "shopimage",
              file: dataUrl
            };
            that.$store.dispatch("uploadGoodsImg", sendData);
          });
        } else {
          this.loading = false;
          this.$refs.ruleForm.resetFields();
          this.$message({ message: data.message, type: "success" });
          this.closeModal("resetList");
        }
      } else {
        this.$message.error(data.message);
      }
    }
  },
  methods: {
    changeFile(file, fileList) {
      const isPNG =
        file.name.substring(file.name.lastIndexOf(".") + 1) === "png" ||
        file.name.substring(file.name.lastIndexOf(".") + 1) === "jpg" ||
        file.name.substring(file.name.lastIndexOf(".") + 1) === "jpeg";
      if (!isPNG) {
        this.$message.error("上传头像图片只能是 PNG、jpg、jpeg 格式!");
        file = {};
      }

      let p = new Promise(function (resolve, reject) {
        let isLt2M = file.size / 1024 / 1024 < 1; // 判定图片大小是否小于1MB
        if (isLt2M) {
          resolve(file.raw);
        }
        // 压缩到100KB,这里的100就是要压缩的大小,可自定义
        imageConversion
          .compressAccurately(file.raw, {
            size: 100,
            scale: 0.4
          })
          .then((res) => {
            resolve(res);
          });
      });

      p.then((data) => {
        this.imgFile = data;
        let that = this;
        this.blobToBase64(data, function (dataUrl) {
          that.imageUrl = dataUrl;
        });
      });
    },
    blobToBase64(blob, callback) {
      // Blob对象转Base64
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        callback(e.target.result);
      };
    },
    submitAddress() {
      console.log(this.getLocationInfo);
      if (this.getLocationInfo.address != undefined) {
        let addressComponents = this.getLocationInfo.addressComponents;
        let provinceStr = addressComponents.province;
        let province = provinceStr.substr(provinceStr.length - 1, 1);
        if (province == "省" || province == "市") {
          province = provinceStr.substr(0, provinceStr.length - 1);
        }
        let addressGroup =
          province + " " + addressComponents.city + " " + addressComponents.district;
        console.log(addressGroup);
        this.setAddress(addressGroup);
        this.ruleForm.Address = this.getLocationInfo.address;
        this.ruleForm.Latitude = this.getLocationInfo.point.lat;
        this.ruleForm.Longitude = this.getLocationInfo.point.lng;

        this.showBaiDuMap = false;
      } else {
        this.ruleForm.Latitude = 0;
        this.ruleForm.Longitude = 0;
      }
    },
    showBaiDuMapFun() {
      let selectAddressTxt = this.getAreaLabel();
      let address = selectAddressTxt + this.ruleForm.Address;
      console.log(address);
      this.addressKeyword = address;
      this.showBaiDuMap = true;
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
              if (this.areaOptions[i].children[j].children != undefined) {
                let karr = [...this.areaOptions[i].children[j].children];
                for (let k = 0; k < karr.length; k++) {
                  if (karr[k].value == seled[2] && seled.length > 2) {
                    areaStr += karr[k].label + "";
                    break;
                  }
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
              if (defauleArr[i].children[j].children != undefined) {
                let karr = [...defauleArr[i].children[j].children];
                for (let k = 0; k < karr.length; k++) {
                  if (karr[k].label == seled[2]) {
                    areaStr.push(karr[k].value);
                    break;
                  }
                }
              }
              break;
            }
          }
          break;
        }
      }
      this.selectedAreaOptions = [...areaStr];
      this.ruleForm.ProvinceID = [...areaStr][0];
      this.ruleForm.CityID = [...areaStr][1];
      this.ruleForm.DistrictID = [...areaStr][2];
    },
    getLocationPoint(e) {
      this.lng = e.point.lng;
      this.lat = e.point.lat;
      /* 创建地址解析器的实例 */
      let geoCoder = new BMap.Geocoder();
      /* 获取位置对应的坐标 */
      geoCoder.getPoint(this.addressKeyword, (point) => {
        this.selectedLng = point.lng;
        this.selectedLat = point.lat;
      });
      /* 利用坐标获取地址的详细信息 */
      geoCoder.getLocation(e.point, (res) => {
        console.log(res);
        this.getLocationInfo = res;
        this.addressKeyword = res.address;
      });
    },
    closeModal(type) {
      // Object.assign(this.$data, this.$options.data());

      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    submitForm() {
      let address =
        this.ruleForm.Address == ""
          ? this.getAreaLabel()
          : this.getAreaLabel() + this.ruleForm.Address;
      console.log(address);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch("dealShopItem", this.ruleForm).then(() => {
            this.loading = true;
          });
        }
      });
    },
    defaultData() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      if (Object.keys(this.dataItem).length > 0) {
        for (let key in this.ruleForm) {
          let UCkey = key.toUpperCase();
          this.ruleForm[key] = this.dataItem[UCkey] ? this.dataItem[UCkey] : "";
        }
        if (!this.ruleForm.ShopName) {
          this.ruleForm.ShopName = this.dataItem.NAME;
        }
        this.ruleForm.ShopID = this.dataItem.ID;

        if (this.dataItem.PROVINCEID != undefined) {
          this.selectedAreaOptions = [
            Number(this.dataItem.PROVINCEID),
            Number(this.dataItem.CITYID),
            Number(this.dataItem.DISTRICTID)
          ];
        } else {
          this.selectedAreaOptions = [];
        }

        this.imageUrl = SHOPIMAGESIMG + this.dataItem.ID + ".png?" + new Date().getTime();
      } else {
        this.imageUrl = "";
        this.imgFile = {};
        this.getLocationInfo = {};
        this.selectedAreaOptions = [];
        this.addressKeyword = "";
        this.ruleForm = {
          ShopCode: "",
          ShopName: "",
          Manager: "",
          Address: "",
          ProvinceID: "",
          CityID: "",
          DistrictID: "",
          PhoneNo: "",
          Longitude: "",
          Latitude: ""
        };
      }
    }
  },
  mounted() {
    this.defaultData();
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
