<template>
  <el-container>
    <el-header style="height: 50px">
      <headerPage></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="content-new-fex">
          <div class="content-eighty">
            <div class="content-center">
              <el-button size="small" type="primary" @click="handleDeal({})">
                新增支出项目
              </el-button>
            </div>
          </div>
          <div class="content-table4">
            <div class="content-table-center">
              <el-table
                size="small"
                :data="pagelist"
                v-loading="loading"
                :height="tableHeight"
                header-row-class-name="bg-theme2 text-white"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="80"
                ></el-table-column>
                <el-table-column prop="NAME" label="名称" width="180"></el-table-column>
                <el-table-column prop="REMARK" label="备注"></el-table-column>
                <el-table-column label="操作" align="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button
                        size="small"
                        type="text"
                        @click="handleDel(scope.$index, scope.row)"
                      >
                        删除
                      </el-button>
                      <el-button
                        type="text"
                        size="small"
                        @click="handleDeal(scope.row)"
                        style="margin-left: 20px"
                      >
                        编辑
                      </el-button>
                    </el-button-group>
                    <div class="hide">{{ scope.row }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-dialog title="支出项目" :visible.sync="dialogVisible" width="400px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="名称" prop="Name">
                <el-input v-model="form.Name" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="form.Remark"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="dealData">保存</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_DEFRAY from "@/mixins/defray.js";

export default {
  mixins: [MIXINS_DEFRAY.DEFRAY_MENU],
  data() {
    return {
      activeName: "first",
      pagelist: [],
      value1: "",
      options1: "",
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      searchText: "",
      isFilter: false,
      pageData: {
        PN: 1,
        Filter: "",
        Status: -1,
        LevelName: "",
        VipFlag: "",
        ShopId: ""
      },
      multipleSelection: [],
      reportLoss: { loading: false, num: 0 },
      showAddNew: false,
      showItem: false,
      exportLoading: false,
      pagelist: [],
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 120,
        PN: 0
      },
      pageData: { PN: 1 },
      dialogVisible: false,
      form: {
        Name: "",
        Remark: ""
      },
      rules: {
        Name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      dealType: "add",
      tableHeight: document.body.clientHeight - 200
    };
  },
  computed: {
    ...mapGetters({
      dataList: "paymentList",
      dataListState: "paymentListState",
      dataState: "paymentState",
      dealState: "dealPaymentState"
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagelist = [...this.dataList];
      }
    },
    dealState(data) {
      if (data.success) {
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
      this.dialogVisible = false;
    }
  },
  methods: {
    getNewData() {
      this.$store.dispatch("getPaymentList", {}).then(() => {
        this.loading = true;
      });
    },
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    handleDeal(item) {
      if (this.$refs.form) this.$refs.form.resetFields();
      if (Object.keys(item).length > 0) {
        this.form = Object.assign({}, item, {
          ID: item.ID,
          Name: item.NAME,
          Remark: item.REMARK
        });
        this.dealType = "edit";
      } else {
        this.form = {
          Name: "",
          Remark: ""
        };
        this.dealType = "add";
      }
      this.dialogVisible = true;
    },
    dealData() {
      var _this = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          _this.loading = true;
          _this.$store
            .dispatch("dealPaymentItem", {
              type: this.dealType,
              data: _this.form
            })
            .then(() => {
              _this.loading = true;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDel(index, item) {
      this.$confirm("此操作将永久删除该支出项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("dealPaymentItem", { type: "del", data: item }).then(() => {
            this.loading = true;
            this.dealType = "del";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    if (this.dataList.length == 0) {
      this.getNewData();
    } else {
      this.pagelist = [...this.dataList];
    }
  },
  components: {
    headerPage: () => import("@/components/header")
  }
};
</script>
<style scoped>
.member-header {
  display: flex;
  align-items: center;
  height: 50px;
}
.center-title {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border: solid 1px #edeeee;
}
.center-cont {
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.el-header {
  padding: 0 !important;
}
.shop {
  display: flex;
  align-items: center;
  height: 50px;
  position: relative;
}
.shop .name {
  position: absolute;
  right: 50px;
  height: 50px;
  line-height: 50px;
  width: 150px;
  text-align: center;
  top: 0;
  /* background: rebeccapurple; */
}
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #f4f5fa;
  color: #333;
  /* text-align: center; */
}
.member-main-table {
  margin-top: 8px;
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 600px;
  background: #fff;
}
.member-main-top-buttom {
  height: 70px;
  width: 100%;
  line-height: 70px;
}
.member-main-top-type {
  height: 70px;
  width: 100%;
  line-height: 70px;
}
.payment-top {
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  background: #fff;
  height: 80px;
  line-height: 80px;
}
.payment-table {
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 20px;
  background: #fff;
}
</style>


