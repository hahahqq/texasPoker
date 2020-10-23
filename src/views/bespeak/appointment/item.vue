<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row :gutter="10" class="text-left">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="会员" prop="VipId">
            <a
              v-if="dealType.type=='add'"
              @click="showComponent('selMember')"
              class="inline-block paddingTB-sm paddingLR-xs pointer"
              style="line-height:1.3;min-width:100px"
            >
              <span v-text="Object.keys(selmember).length>0?selmember.NAME:'请选择会员'"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="客户姓名" prop="Name">
            <el-input size="small" v-model="ruleForm.Name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="手机号码" prop="PhoneNo">
            <el-input size="small" type='number' v-model.number="ruleForm.PhoneNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="预约时间"  prop="Servicetime">
            <el-date-picker size="small"
              v-model="ruleForm.Servicetime"
              type="date"
              :clearable='false'
              :picker-options="pickerOptions"
              value-format="timestamp"
              placeholder="选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="预约项目" prop="GoodsId">
            <!-- <span v-if="dealType.type=='edit'" class="padding-sm marginLR-xs inline-block">{{dataItem.GOODSNAME}}</span> -->
            <a
              v-if="dealType.type=='add'"
              @click="showComponent('selGoods')"
              class="inline-block paddingTB-sm paddingLR-xs pointer"
              style="line-height:1.3;min-width:100px"
            >
              <span v-text="Object.keys(selgoods).length>0?selgoods.NAME:'请选择预约项目'"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </a>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="数量">
            <el-input size="small" v-model.number="ruleForm.Qty" type="number" min="1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="店铺" prop="ShopId">
            <el-select size="small" v-model="ruleForm.ShopId" placeholder="请选择店铺" class="full-width">
              <!-- <el-option label="请选择店铺" value></el-option> -->
              <el-option
                v-for="item in shopList"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="员工" prop="EmpId">
            <el-select size="small" v-model="ruleForm.EmpId" clearable placeholder="请选择员工" class="full-width">
              <el-option
                v-for="(item,ii) in employeeList"
                :key="ii"
                :label="item.NAME"
                :value="item.ID"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="备注">
            <el-input size="small"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ruleForm.Remark"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item>
            <el-button type="primary" @click="handleSubmit()" :loading="loading">保 存</el-button>
            <el-button @click="closeModal">取 消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- sel -->
    <el-dialog width="70%" :title="title" :visible.sync="isShowChoose" append-to-body style="max-width:100%;" >
      <components :is="componentName" @closeModal="isShowChoose=false"></components>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS from "@/mixins/index";
import { getHomeData } from '@/api/index'
export default {
  props: {
    dealType: {
      type: Object,
      default: function() {
        return {
          type: "add",
          state: false,
          itemData:{}
        }
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
        // if (!Number.isInteger(value)) {
        //   callback(new Error("请输入数字值"));
        // } else {
          var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
          if (!myreg.test(value)) {
            callback(new Error("请输入正确的手机号码"));
          } else {
            callback();
          }
        // }
      }, 800);
    };
    var checkTitme = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("预约时间不能为空"));
      }
    };
    return {
      ruleForm: {
        VipId: "",
        Name: "",
        PhoneNo: "",
        Servicetime:  new Date().getTime(),
        GoodsId: "",
        Qty: 1,
        EmpId: "",
        Remark: "",
        ShopId: ""
      },
      rules: {
        VipId: [
          {
            required: true,
            message: "请输入会员",
            trigger: "blur"
          }
        ],
        Name: [
          {
            required: true,
            message: "请输入客户姓名",
            trigger: "blur"
          }
        ],
        PhoneNo: [
          {
            required: true,
            validator: checkTel,
            trigger: "blur"
          }
        ],
        Servicetime: [
          {
            required: true,
            validator: checkTitme,
            trigger: "change"
          }
        ],
        EmpId: [
          {
            required: true,
            message: "请输入员工",
            trigger: "change"
          }
        ],
        ShopId: [
          {
            required: true,
            message: "请输入店铺",
            trigger: "change"
          }
        ],
        GoodsId: [
          {
            required: true,
            message: "请选择商品",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      componentName: "",
      title:'',
      isShowChoose:false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() <= new Date(this.getCustomDay(-1)).getTime()
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      dataItem: "bespeakItem",
      dataState: "bespeakState",
      selmember: "selmember",
      employeeList: "employeeList",
      shopList: "shopList",
      selgoods: "selgoods"
    })
  },
  watch: {
    dealType(data) {
      this.defaultData();
    },
    selmember(data) {
      console.log(data)
      if (Object.keys(data).length > 0) {
        this.ruleForm.VipId = data.ID
        this.ruleForm.Name = data.NAME
        this.ruleForm.PhoneNo = data.MOBILENO
      }
    },
    selgoods(data) {
      if (Object.keys(data).length > 0) {
        this.ruleForm.GoodsId = data.ID;
      }
    },
    dataState(data) {
      this.loading = false
      this.$message({ message: data.message, type: data.success ? "success" : "error" })
      if (data.success) {
        this.$refs.ruleForm.resetFields();
        this.closeModal("resetList")
      }
    }
  },
  methods: {
    closeModal(type) {
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      if (type == "resetList") {
        this.$emit("resetList")
      } else {
        this.$emit("closeModal")
      }
    },
    handleSubmit() {
      if (Object.keys(this.selmember).length > 0) {
        this.ruleForm.VipId = this.selmember.ID;
      }
      if (Object.keys(this.selgoods).length > 0) {
        this.ruleForm.GoodsId = this.selgoods.ID;
      }
      let sendData = Object.assign({}, this.ruleForm,this.dealType.itemData);
      this.$refs.ruleForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.$store.dispatch("dealBespeakItem", {
            type: this.dealType.type,
            data: sendData
          }).then(() => {
            this.loading = true
          })
        }
      })
    },
    showComponent(name) {
      this.componentName = name;
      this.title = name == 'selMember' ? '选择会员' : '选择项目';
      setTimeout(() => {
        this.isShowChoose = true;
      }, 300)
    },
    defaultData() {
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
      if (this.employeeList.length == 0) {
        this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID });
      }
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList")
      }
      this.ruleForm.ShopId = getHomeData().shop.ID
    }
  },
  mounted() {
    this.defaultData()
  },
  components: {
    selMember: () => import("@/components/selected/selmember"),
    selGoods: () => import("@/components/selected/selgoods")
  }
};
</script>
