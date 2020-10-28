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
      <div class="content-new-fex">
        <div class="content-eighty">
            <div class="content-center">
              <div class="m-bottom-sm">
                <el-button size="small" @click="handleDeal({})" icon="el-icon-plus">新增</el-button>
                <div class="hide">{{dataList}}</div>
              </div>
            </div>
        </div>
        <!--列表-->
        <div class="content-table4">
            <div class="content-table-center">
              <el-table :data="pagelist" size='small'
              v-loading="loading"
              :height="tableHeight"
              header-row-class-name="bg-theme2 text-white"
              >
               <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
                <el-table-column prop="NAME" label="名称" width="150">
                </el-table-column>
                <el-table-column prop="REMARK" label="备注">
                </el-table-column>
                <el-table-column label="操作" align="right">
                  <template slot-scope="scope">
                    <el-button-group>
                      <el-button type="text" size="small" @click="handleDeal(scope.row)" icon="el-icon-edit" style="margin-right:8px;">编辑</el-button>
                      <el-button  type="text" size="small" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete">删除</el-button>
                    </el-button-group>
                    <div class="hide">{{scope.row}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </div>
        <el-dialog title="商品单位" :visible.sync="dialogVisible" width="400px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="form.Name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.Remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dealData">保存</el-button>
              <el-button @click="dialogVisible=false">取消</el-button>
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
import MIXINS_GOOD from "@/mixins/good.js";

export default {
  mixins: [MIXINS_GOOD.GOOD_MENU],
  data() {
    return {
            activeName: "first",
            pagelist: [],
            tableHeight:document.body.clientHeight-220,
            value1:"",
            options1:"",
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
            dialogVisible: false,
            form: {
              Name: "",
              Remark: ""
            },
            rules: {
              Name: [
                {
                  required: true,
                  message: "请输入等级名称",
                  trigger: "blur"
                }
              ],
            },
            dealType: "add"
    };
  },
  computed: {
    ...mapGetters({
      dataList: "unitList",
      dataListState: "unitListState",
      dataState: "unitState",
      dealState: "dealUnitState",
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
        // this.pagelist = [...this.dataList];
        this.getNewData();
      }else{
        this.loading = false;
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
      this.$store.dispatch("getUnitList").then(() => {
        this.loading = true;
      });
    },
    getUnitItem() {},
    handleDeal(item) {
      if (this.$refs.form) this.$refs.form.resetFields();
      if (Object.keys(item).length > 0) {
        this.form = Object.assign({}, item, {
          Id: item.ID,
          Name: item.NAME,
          Remark: item.REMARK
        });
        this.dealType = "edit";
      } else {
        this.form = {
          Name: "",
          Remark: ""
        };
        this.dealType = true;
      }
      this.dialogVisible = true;
    },
    dealData() {
      var _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          _this.loading = true;
          _this.$store.dispatch("dealUnitItem", _this.form).then(() => {
            _this.loading = true;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDel(index, item) {
       this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("delUnitItem", { index: index, data: item })
            .then(() => {
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
    },
};
</script>
<style scoped>
.member-header{
  display: flex;
  align-items: center;
  height: 50px;
}
.center-title{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border: solid 1px #d7d7d7;
}
.center-cont{
  width: 100px;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.el-header{
  padding: 0 !important;
}
.shop{
  display: flex;
  align-items: center;
  height: 50px;
  position: relative;
}
.shop .name{
  position: absolute;
  right: 50px;
  height: 50px;
  line-height: 50px;
  width: 150px;
  text-align: center;
  top: 0;
  /* background: rebeccapurple; */
}
  .el-header, .el-footer {
    background-color: #fff;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #F4F5FA;
    color: #333;
  }
  .member-main-top{
    width: 99%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    height: 150px;
    background: #fff;
  }
  .member-main-table{
    margin-top: 8px;
    width: 99%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    height: 600px;
    background: #fff;
  }
  .member-main-top-buttom{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
  .member-main-top-type{
    height: 70px;
    width: 100%;
    line-height: 70px;
  }
  .unit-index{
    width: 98%;
    margin-left: 1%;
    margin-right:1%;
    background: #fff;
    margin-top: 15px;
  }
</style>


