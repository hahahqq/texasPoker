<template>
  <div class="editEmployee">
    <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <el-form-item label="员工姓名" prop="Name" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.Name"
              autocomplete="off"
              clearable
              placeholder="请输入员工姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="员工工号" prop="Code" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.Code"
              autocomplete="off"
              clearable
              placeholder="请输入员工工号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="员工职务" style="margin-bottom: 10px">
            <el-input
              placeholder="请输入或选择员工职务"
              v-model="ruleForm.Position"
              size="small"
              @change="Position = ''"
              clearable
              class="input-with-select"
            >
              <el-select
                slot="append"
                v-model="ruleForm.Position"
                @change="Position = ''"
                placeholder="选择"
                size="small"
                style="width: 80px"
              >
                <el-option value>全部</el-option>
                <el-option
                  v-for="(item, index) in jobList"
                  :key="index"
                  :label="item.POSITION"
                  :value="item.POSITION"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="所属店铺" prop="ShopID" style="margin-bottom: 10px">
            <el-select size="small" v-model="ruleForm.ShopID" placeholder="请选择店铺">
              <el-option
                v-for="item in shopList"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="联系电话" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.MobileNo"
              clearable
              placeholder="请输入电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="性别" style="margin-bottom: 10px">
            <el-radio-group size="small" v-model="ruleForm.Sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12">
          <el-form-item label="出生日期" class="halfhh" style="margin-bottom: 10px">
            <el-date-picker
              size="small"
              v-model="ruleForm.BirthDate"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
              class="full-width"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="入职日期" class="halfhh" style="margin-bottom: 10px">
            <el-date-picker
              size="small"
              v-model="ruleForm.InWorkDate"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
              class="full-width"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="身份证号" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.IDCardNo"
              clearable
              placeholder="请输入员工身份证号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">
          <el-form-item label="状态" style="margin-bottom: 10px">
            <el-radio-group size="small" v-model="ruleForm.Status">
              <el-radio :label="0">在职</el-radio>
              <el-radio :label="1">离职</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-form-item label="地址" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.Remark"
              clearable
              placeholder="请输入地址"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24">
          <el-form-item label="备注" style="margin-bottom: 10px">
            <el-input
              size="small"
              v-model="ruleForm.Remark"
              clearable
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" style="text-align: center; margin-top: 20px">
          <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
          <el-button @click="closeModal">取 消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";

export default {
  props: ["propsData"],
  data() {
    return {
      ruleForm: {
        ID: "",
        Code: "",
        Name: "",
        Sex: 1,
        Position: "",
        MobileNo: "",
        ShopID: getHomeData().shop.ID,
        BirthDate: "",
        IDCardNo: "",
        Remark: "",
        MobileNo: "",
        Category: "",
        BaseWages: "",
        InWorkDate: "",
        IDCardNo: "",
        Status: 0
      },
      Position: "",
      status: true,
      rules: {
        Name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        Code: [
          {
            required: true,
            message: "请输入员工工号",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      employeeitemState: "employeeitemState",
      dataItem: "selemployee",
      shopList: "shopList",
      jobList: "jobList"
    })
  },
  watch: {
    propsData(data) {
      if (data.state) this.defaultData();
    },
    employeeitemState(data) {
      this.loading = false;
      if (data.success) {
        this.$message({
          message: data.message,
          type: "success"
        });
        this.closeModal("resetList");
      } else {
        this.$message.error(data.message);
      }
    }
  },
  methods: {
    closeModal(type) {
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let sendData = Object.assign({}, this.ruleForm);
          if (this.Position) {
            sendData.Position = this.Position;
          }
          this.$store.dispatch("dealEmployeeItem", sendData).then(() => {
            this.loading = true;
          });
        }
      });
    },
    defaultData() {
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList",{});
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      if (Object.keys(this.dataItem).length > 0) {
        for (let key in this.ruleForm) {
          let UCkey = key.toUpperCase();
          this.ruleForm[key] = this.dataItem[UCkey] ? this.dataItem[UCkey] : "";
        }
        if (!this.ruleForm.Name) {
          this.ruleForm.Name = this.dataItem.NAME;
        }

        this.ruleForm.Sex = Number(this.ruleForm.Sex); // // 0=启用,1=停用
        this.ruleForm.Status = Number(this.ruleForm.Status); // // 0=在职,1=离职
      } else {
        this.ruleForm = {
          ID: "",
          Code: "",
          Name: "",
          Sex: 1,
          Position: "",
          MobileNo: "",
          ShopID: getHomeData().shop.ID,
          BirthDate: "",
          IDCardNo: "",
          Remark: "",
          MobileNo: "",
          Category: "",
          BaseWages: "",
          InWorkDate: "",
          Status: 0,
          IDCardNo: ""
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
.editEmployee .halfhh .el-date-editor.el-input {
  width: 100% !important;
}
</style>
