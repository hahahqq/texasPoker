<template>
  <div class="goodsAdd">
    <!-- {{dataType}} -->

    <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="商品名称" prop="Name">
            <el-input
              v-model="ruleForm.Name"
              autocomplete="on"
              clearable
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="商品编码">
            <el-input v-model="ruleForm.CODE" clearable placeholder="请输入商品编码"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="商品分类">
            <el-select
              v-model="ruleForm.Typeid"
              @change="selectTypeFun"
              placeholder="请选择商品分类"
              class="full-width"
            >
              <el-option
                v-for="(item, i) in categoryList"
                :key="i"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
              <el-option
                style="
                  background: #f5f5f5;
                  border-top: 1px solid #ddd;
                  border-bottom: 1px solid #ddd;
                "
                value="10000"
              >
                + 新增
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="商品进价">
            <el-input
              v-model="ruleForm.Purprice"
              clearable
              oninput="value=value.replace(/[^0-9\.]/g,'')"
              placeholder="请输入商品进价"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="商品售价" style="clear: left">
            <el-input
              v-model.number="ruleForm.Price"
              type="number"
              min="0"
              clearable
              oninput="value=value.replace(/[^0-9\.]/g,'')"
              placeholder="请输入商品售价"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="会员售价">
            <el-input
              v-model.number="ruleForm.VipPrice"
              type="number"
              clearable
              oninput="value=value.replace(/[^0-9\.]/g,'')"
              placeholder="请输入会员售价"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12">
          <el-form-item label="商品单位">
            <el-select v-model="ruleForm.Unitid" placeholder="请选择单位" class="full-width">
                <el-option v-for="(item,i) in unitList" :key="i" :label="item.NAME" :value="item.ID"></el-option>
              </el-select>
          </el-form-item>
        </el-col>


        <el-col :xs="24" :sm="12">
          <el-form-item label="商品规格">
            <el-input
              v-model="ruleForm.Specs"
              clearable
              placeholder="请输入商品规格"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24">
          <el-form-item label="商品描述" class="clearfix">
            <el-input v-model="ruleForm.Remark" clearable placeholder="请输入商品描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-row>
            <el-col :span="10">
              <el-form-item label="是否奖品">
                <el-radio-group v-model="ruleForm.Isgift" @change="isgiftChange">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                v-if="ruleForm.Isgift == 1"
                label="所需积分"
                class="inline-block"
                style="width: 80%"
              >
                <el-input
                  v-model.number="ruleForm.Giftintegral"
                  type="number"
                  min="1"
                  clearable
                  placeholder="请输入积分"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="启用状态">
            <el-radio-group v-model="ruleForm.Status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-form-item label="图片" class="clearfix">
            <!-- 图片 -->
            <upload-img :imgData="imgData" class="inline-block" ref="uploadImgDiv"></upload-img>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" class="clearfix">
          <el-form-item class="fformFooter text-left">
            <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
            <el-button @click="closeModal">取 消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 新增商品分类 -->
    <el-dialog title="商品分类" :visible.sync="dialogVisible" width="400px" append-to-body>
      <el-form ref="formCategory" :model="formCategory" :rules="rulesCategory" label-width="80px">
        <el-form-item label="名称" prop="Name">
          <el-input v-model="formCategory.Name" placeholder="请输入商品分类名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="formCategory.Remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dealData" :loading="loadingCategory">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { CityInfo } from "@/assets/js/area.js";
import CRYPTO from "crypto-js";
export default {
  props: {
    dataType: {
      type: Object,
      default: function () {
        return { value: 1, dealState: "add" };
      }
    }
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      var myreg = /^[1-9]\d*\,\d*|[1-9]\d*$/;
      if (!myreg.test(value)) {
        callback(new Error("请输入正确的数值"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        Code: "",
        Name: "",
        Status: 1,
        Price: "",
        Purprice: "",
        Remark: "",
        Unitid: "",
        Typeid: "",
        CODE: "",
        Isgift: 2,
        Giftintegral: 0,
        GoodsMode: 0, // 0=商品   1=服务项目
        DescNo: 100,
        MinStockNumber: 0,
        VipPrice: "",
        ServiceMinute: 0,
        IsReturnVisit: false,
        ReturnVisitDay: 0,
        IsCycle: false,
        CycleDay: 0,
        Specs: "",
        OrderNo: ""
      },
      Purpriceshow: true,
      rules: {
        Name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        Price: [
          {
            required: true,
            validator: checkNumber,
            trigger: "blur"
          }
        ]
      },
      loading: false,
      imgData: { name: "" },
      sendate: {},
      dialogVisible: false,
      loadingCategory: false,
      formCategory: {
        Name: "",
        Remark: ""
      },
      rulesCategory: {
        Name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      employeeList: "employeeList",
      memberLevelList: "memberLevelList",
      dataState: "goodsState",
      unitList: "unitList",
      categoryList: "categoryList",
      dataItem: "goodsItem",
      uploadState: "goodsImgUploadState",
      goodsCode: "goodsCode",
      dealCategoryState: "dealCategoryState"
    })
  },
  watch: {
    dataItem(data) {
      this.sendate = data;
      this.defaultData();
    },
    goodsCode(data) {
      if (data.data.Code.length > 0) {
        this.ruleForm.CODE = data.data.Code;
      }
    },
    dataState(data) {
      if (this.loading) {
        this.$message({
          message: data.message,
          type: data.success ? "success" : "error"
        });
        this.loading = false;
        if (data.success) {
          console.log(data.data);
          this.imgData = { name: data.data.Outid, isClear: false };

          setTimeout(() => {
            this.$refs["uploadImgDiv"].uploadFun(this.imgData);
            this.$emit("resetList");
          }, 300);
        }
      }
    },
    uploadState(data) {
      if (!data.success) {
        this.$message.error(data.message);
      }
      this.isUpload = false;
      this.closeModal("resetList");
    },
    dataType(data) {
      this.defaultData();
    },
    dealCategoryState(data) {
      this.loadingCategory = false;
      if (data.success) {
        this.$store.dispatch("getCategoryList", {}).then(() => {});
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      this.dialogVisible = false;
    }
  },
  methods: {
     dealData() {
      var _this = this;
      this.$refs.formCategory.validate((valid) => {
        if (valid) {
          _this.$store.dispatch("dealCategoryItem", _this.formCategory).then(() => {
            this.loadingCategory = true;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    selectTypeFun() {
      if (this.ruleForm.Typeid == "10000") {
        this.ruleForm.Typeid = "";
        this.formCategory = {
          Name: "",
          Remark: ""
        };
        this.dialogVisible = true;
        return;
      }
    },
    isgiftChange(event) {
      this.ruleForm.Isgift = event;
    },
    closeModal(type) {
      Object.assign(this.$data, this.$options.data());
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    submitForm() {
      var _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          _this.loading = true;
          _this.sendDataFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendDataFun() {
      let sendData = Object.assign({}, this.ruleForm);
      sendData.IsReturnVisit = false;

      sendData.ServiceMinute = 0;

      if (this.dataType.dealState == "edit") {
        sendData.ID = this.dataItem.ID;
      }
      this.$store
        .dispatch("addNewGoods", {
          type: this.dataType.dealState,
          data: sendData
        })
        .then(() => {});
    },
    defaultData() {
      console.log("edit");
      console.log(this.sendate);
      this.imgData.name = "";
      if (this.dataType.dealState == "edit") {
        for (let key in this.ruleForm) {
          let kk = key.toUpperCase();
          this.ruleForm[key] = this.sendate[kk];
        }
        console.log("表单的数据", this.ruleForm);
        this.Purpriceshow = this.isPurViewFun(92100310) ? true : false;
        this.ruleForm.Status = this.sendate.STATUS == true ? 1 : 2;
        this.ruleForm.Isgift = this.sendate.ISGIFT == true ? 1 : 2;

        console.log("积分启动", this.ruleForm.Isgift);
        this.imgData = {
          name: this.sendate.ID,
          isClear: true
        };
      }
      this.showImg = !this.showImg;
    }
  },
  mounted() {
    // this.defaultData();
  },
  beforeCreate() {
    let list1 = this.$store.state.unit.unitList;
    let list2 = this.$store.state.category.categoryList;
    if (list1.length == 0) {
      this.$store.dispatch("getUnitList", {}).then(() => {});
    }
    if (list2.length == 0) {
      this.$store.dispatch("getCategoryList").then(() => {});
    }
  },
  components: {
    uploadImg: () => import("@/components/other/uploadImg.vue")
  }
};
</script>
<style>
.goodsAdd .half {
  width: 50%;
  margin-right: 0px;
  float: left;
}
.goodsAdd .half .el-date-editor.el-input {
  width: 100% !important;
}
.goodsAdd .el-form-item__content {
  line-height: 40px;
}
</style>
