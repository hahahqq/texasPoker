<template>
  <div class="category">
    <div class="m-bottom-sm">
      <el-button size="small" @click="handleDeal({})" icon="el-icon-plus">新增</el-button>

      <el-button size="small" @click="showForm=true" icon="el-icon-plus">账户互转</el-button>

      <el-button size="small" @click="showForm2=true" icon="el-icon-plus">账户流水</el-button>

      <div class="hide">{{dataList}}</div>
    </div>
    <!--列表-->
    <el-table
      border
      :data="dataList"
      v-loading="loading"
      height="500"
      header-row-class-name="bg-theme text-white"
    >
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="PAYTYPENAME" label="名称" width="120" sortable></el-table-column>
      <el-table-column prop="FIRSTMONEY" label="期初金额"></el-table-column>
      <el-table-column prop="CURMONEY" label="余额"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="handleDeal(scope.row)" icon="el-icon-edit">编辑</el-button>
          </el-button-group>
          <div class="hide">{{scope.row}}</div>
        </template>
      </el-table-column>
    </el-table>

    <!-- form1 -->
    <el-dialog
      width="500px"
      title="帐户互转"
      :visible.sync="showForm"
      append-to-body
      style="max-width:100%;"
    >
      <div>
        <el-form ref="ruleForm1" :model="ruleForm1" :rules="rules1" label-width="80px">
          <el-form-item label="转出帐户" prop="OutPaytypeId">
            <el-select v-model="ruleForm1.OutPaytypeId" placeholder="请选择转出帐户" class="full-width">
              <el-option
                v-for="(item,i) in dataList"
                :key="i"
                :label="item.PAYTYPENAME"
                :value="item.PAYTYPEID"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转入帐户" prop="InPaytypeId">
            <el-select v-model="ruleForm1.InPaytypeId" placeholder="请选择转入帐户" class="full-width">
              <el-option
                v-for="(item,i) in dataList"
                :key="i"
                :label="item.PAYTYPENAME"
                :value="item.PAYTYPEID"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转出金额">
            <el-input v-model.number="ruleForm1.Money" type="number"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="ruleForm1.Remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="transferfun" :loading="formLoading">保 存</el-button>
            <el-button @click="showForm=false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- flow -->
    <el-dialog
      width="700px"
      title="账户流水"
      :visible.sync="showForm2"
      append-to-body
      style="max-width:100%;"
    >
      <flowPage v-if="showForm2"></flowPage>
    </el-dialog>
    <!-- 新增弹窗 -->
    <el-dialog
      width="500px"
      title="新增账户"
      :visible.sync="showForm3"
      append-to-body
      style="max-width:100%;"
    >
      <div>
        <el-form ref="ruleForm3" :model="ruleForm3" :rules="rules2" label-width="80px">
          <el-form-item label="帐户名称" prop="Account">
             <el-input v-model="ruleForm3.Account"></el-input>
          </el-form-item>
          <el-form-item label="期初金额" v-show="shouEit">
             <el-input v-model="ruleForm3.Money" type="number"></el-input>
          </el-form-item>
          <el-form-item label="是否启用">
             <el-switch v-model="ruleForm3.ISHIDE"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addAccount" :loading="formLoading">保 存</el-button>
            <el-button @click="showForm3=false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    var checkTitme = (rule, value, callback) => {
      if (
        (this.ruleForm1.OutPaytypeId || this.ruleForm1.InPaytypeId) &&
        this.ruleForm1.OutPaytypeId == this.ruleForm1.InPaytypeId
      ) {
        return callback(new Error("转出转入帐户不能相同"));
      } else {
        return callback();
      }
    };
    return {
      shouEit:false,
      loading: false,
      ruleForm1: {
        OutPaytypeId: "",
        InPaytypeId: "",
        Money: 0,
        Remark: ""
      },
      ruleForm3:{
        ISHIDE:false,
        Account:"",
        Money:"",
      },
      rules1: {
        OutPaytypeId: [
          {
            required: true,
            message: "请选择转出帐户",
            validator: checkTitme,
            trigger: "change"
          }
        ],
        InPaytypeId: [
          {
            required: true,
            message: "请选择转入帐户",
            validator: checkTitme,
            trigger: "change"
          }
        ]
      },
      rules2: {
        Account: [
          {
            required: true,
            message: "请输入账户名称",
            trigger: "blur"
          }
        ],
        InPaytypeId: [
          {
            required: true,
            message: "请选择转入帐户",
            validator: checkTitme,
            trigger: "change"
          }
        ]
      },
      dealType: "add",
      showForm: false,
      formLoading: false,
      showForm2: false,
      showForm3: false
    };
  },
  computed: {
    ...mapGetters({
      dataList: "accountList",
      dataListState: "accountListState",
      dataState: "accountState",
      dealState: "dealAccountState",
      addaccount:"addaccount"
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
    },
    dealState(data) {
      if (data.success) {
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
    },
    addaccount(data) {
      this.formLoading = false;
      if (data.success) {
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      this.showForm3=false;
    }
  },
  methods: {
    formatStatus: function(row, column) {
      return row.ISSTOP ? "启用" : "停用";
    },
    getNewData() {
      this.$store.dispatch("getAccountList", {}).then(() => {
        this.loading = true;
      });
    },
    handleDeal(item) {
      if (this.$refs.form) this.$refs.form.resetFields();
      if (Object.keys(item).length > 0) {
        this.dealType = "edit";
        this.shouEit=true;
        this.ruleForm3 = Object.assign({}, item, {
          ID: item.PAYTYPEID,
          ISHIDE:item.ISHIDE == false ? true : false,
          Account: item.PAYTYPENAME,
          Money: item.FIRSTMONEY
        });
      } else {
        this.shouEit=false;
        this.ruleForm3 = {
          required:"",
          Account: "",
          Money: ""
        };
        this.dealType = "add";
      }
      this.showForm3=true;
    },
    transferfun() {
      this.$refs.ruleForm1.validate(valid => {
        if (valid) {
          this.$store.dispatch("inoutAccountPay", this.ruleForm1).then(() => {
            this.formLoading = true;
          });
        }
      });
    },
    addAccount() {
      this.$refs.ruleForm3.validate(valid => {
        if (valid) {
          this.$store.dispatch("addAccount",this.ruleForm3).then(() =>{
            this.formLoading = true;
          })
        }
      })
      this.formLoading = false;
    },
    flowfun() {}
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.getNewData();
    }
  },
  components: {
    flowPage: () => import("./flowDetails.vue")
  }
};
</script>
