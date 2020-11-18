<template>
<el-container>
  <el-header style="height:50px;">
    <headerPage></headerPage>
  </el-header>
  <el-container>
    <el-aside width="100px">
        <section style="min-width:100px;">
        <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
    </el-aside>
    <el-container>
      <el-main :style="{height:height + 'px'}">
        <div class="content-eighty">
          <div class="content-center">
            <el-row>
              <el-col :span="12"><el-button type='primary' size="small" @click="handleDeal('add',{})">新增用户</el-button></el-col>
              <!-- <el-col :span="12" style="text-align:right">
                <el-input size="small" placeholder="请输入内容" v-model="input2" style="width:60%;">
                  <template slot="append"><span class="overall-font">搜索</span></template>
                </el-input>
              </el-col> -->
            </el-row>
          </div>
        </div>
        <div class="content-table">
          <div class="content-table-center">
              <el-table
                border
                :data="pagelist"
                v-loading="loading"
                max-height="500"
                header-row-class-name="bg-theme2 text-white"
                class="rull-width"
              >
                <el-table-column prop="USERNAME" label="名称" width="120" sortable></el-table-column>
                <el-table-column prop="USERCODE" label="编号"></el-table-column>
                <el-table-column prop="ISSTOP" label="是否停用" :formatter="formatterStop"></el-table-column>
                <el-table-column prop="SHOPCOUNT" label="管理店铺数"></el-table-column>
                <el-table-column prop="PURVIEWCOUNT" label="权限数"></el-table-column>
                <el-table-column label="操作" width="280px" align="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <!-- <el-button type="text" size="small" @click="delChange(scope.row)" style="margin-right:10px;">修改密码</el-button> -->
                      <el-button type="text" size="small" @click="delChange(scope.row)" style="margin-right:10px;">删除</el-button>
                      <el-button type="text" size="small" @click="handleDeal('edit',scope.row)" icon="el-icon-edit">编辑</el-button>
                      <el-button
                        v-if="!scope.row.ISADMIN"
                        size="mini"
                        type="primary"
                        @click="handlePer(scope.$index, scope.row)"
                        icon="el-icon-info"
                      >权限</el-button>
                    </el-button-group>
                    <div class="hide">{{scope.row}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
                <el-pagination
                  @size-change="handlePageChange"
                  @current-change="handlePageChange"
                  :current-page.sync="pagination.PN"
                  :pager-count="5"
                  :page-size="pagination.PageSize"
                  :page-sizes="[20]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pagination.TotalNumber"
                  class="text-right"
                ></el-pagination>
                <!-- <div class="text-center clearfix">
                  <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
                </div> -->
              </div>
            </div>
          </div>
          <el-dialog
            :title="dealType=='add'?'新增用户':'编辑用户'"
            :visible.sync="dialogVisible"
            width="400px"
          >
            <div>
              <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="用户姓名">
                  <el-input v-model="ruleForm.username" clearable placeholder="请输入用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="用户编码">
                  <el-input v-model="ruleForm.usercode" clearable placeholder="请输入用户编码"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" v-if="dealType=='add'">
                  <el-input
                    v-model="ruleForm.password"
                    type="password"
                    clearable
                    placeholder="请输入用户密码"
                  ></el-input>
                </el-form-item>
                <el-form-item label="是否停用" v-if="dealType=='edit'">
                  <el-switch v-model="ruleForm.IsStop" active-color="#13ce66" inactive-color="#ccc"></el-switch>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
                  <el-button @click="closeModal">取 消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
        <el-dialog title="设置用户权限" :visible.sync="isShowPermission" width="70%">
          <permission-page
            v-if="isShowPermission"
            @closeModal="isShowPermission=false"
            @resetList="isShowPermission=false;getNewData()"
            :uid="uid"
          ></permission-page>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_SETUP from "@/mixins/setup";
export default {
  mixins: [MIXINS_SETUP.SIDERBAR_MENU],
  data() {
    return {
      height:window.innerHeight - 60,
      pagelist: [],
      loading: false,
      dialogVisible: false,
      dealType: "add",
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      ruleForm: {
        username: "",
        password: "",
        usercode: "",
        isadmin: false,
        IsStop: false
      },
      rules: {},
      isShowPermission: false,
      pageData: { PN: 0 },
      uid: "",
      input2:"",
    };
  },
  computed: {
    ...mapGetters({
      dataList: "userList",
      dataListState: "userListState",
      dataState: "userState",
      dealState: "dealUserState",
      permissionListState: "permissionListState",
      deluser:"deluser"
    })
  },
  watch: {
    deluser(data){
      if(data.success){
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
    },
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.defaultData();
      }
    },
    dealState(data) {
      this.loading = false
      if (data.success) {
        this.dialogVisible = false;
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
    },
    permissionListState(data) {
      this.loading = false;
      if (data.success) {
        this.isShowPermission = true;
      } else {
        this.$message({
          message: data.message,
          type: "error"
        });
      }
    }
  },
  methods: {
    formatterStop:function(row){
      return row.ISSTOP?'停用':'启用'
    },
    getNewData() {
      this.$store.dispatch("getUserList", {PN:1}).then(() => {
        this.loading = true;
      });
    },
    handleDeal(type, item) {
      this.$store.dispatch("selectingUser", item).then(() => {
        this.dealType = type;
        if (this.dealType == "add") {
          delete this.ruleForm.IsStop;
          this.closeModal()
        }
        if (this.dealType == "edit") {
          if(item.USERCODE=='boss'){
            this.$message({
              message: '您没有权限修改！',
              type: 'warning'
            });
            return;

          }else{
            delete this.ruleForm.password;
            this.ruleForm.UserID = item.ID;
            for (let key in this.ruleForm) {
              let UCkey = key.toUpperCase();
              this.ruleForm[key] = item[UCkey];
            }

          }

        }
         this.dialogVisible = true;
      });
    },
    delChange(item){
            this.$confirm('确认删除用户 【'+ item.USERNAME +' 】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch("delUserItem", {UserID:item.USERID}).then(() => {
            });
            }).catch(() => { })

    },
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.$store.dispatch("getUserList", this.pageData).then(() => {
        this.loading = true;
      });
    },
    closeModal() {
      this.dialogVisible = false;
      this.ruleForm = {
        username: "",
        password: "",
        usercode: "",
        isadmin: false,
        IsStop: false
      };
    },
    submitForm() {
      let sendData = Object.assign({}, this.ruleForm);
      let method = "";
      if (this.dealType == "add") {
        method = "addUserItem";
      }
      if (this.dealType == "edit") {
        method = "editUserItem";
      }
      this.$store.dispatch(method, sendData).then(() => {
        this.loading = true;
      });
    },
    handlePer(idx, item) {
      this.$store.dispatch("getPermissionList", item.USERID).then(() => {
        this.loading = true;
        this.uid = item.USERID;
      });
    },
    defaultData() {
      this.pagelist = [...this.dataList];
      this.pagination = {
        TotalNumber: this.dataListState.paying.TotalNumber,
        PageNumber: this.dataListState.paying.PageNumber,
        PageSize: this.dataListState.paying.PageSize,
        PN: this.dataListState.paying.PN
      };
      this.pageData.PN = this.dataListState.paying.PN;
    }
  },
  components: {
    permissionPage: () => import("@/components/setup/setPermission.vue"),
    headerPage: () => import("@/components/header")
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.getNewData();
    } else {
      this.defaultData();
    }
  }
};
</script>
<style scoped>
.el-header{
  padding: 0 !important;
}
</style>
