<template>
  <div class="category">
    <div class="m-bottom-sm">
      <el-button size="small" @click="handleDeal({})" icon="el-icon-plus">新增</el-button>
      <div class="hide">{{dataList}}</div>
    </div>
    <!--列表-->
    <el-table
      border
      :data="pagelist"
      v-loading="loading"
      height="500"
      header-row-class-name="bg-theme text-white"
    >
      <el-table-column prop="NAME" label="名称" width="120" sortable></el-table-column>
      <el-table-column prop="ISSTOP" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" @click="handleDeal(scope.row)" icon="el-icon-edit">编辑</el-button>
            <el-button
              size="small"
              @click="handleDel(scope.$index, scope.row)"
              icon="el-icon-delete"
            >删除</el-button>
          </el-button-group>
          <div class="hide">{{scope.row}}</div>
        </template>
      </el-table-column>
    </el-table>
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
          <el-button @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
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
      dealType: "add"
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
    handlePageChange: function(currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    handleDeal(item) {
      console.log("新增数据")
      if (this.$refs.form) this.$refs.form.resetFields();
      if (Object.keys(item).length > 0) {
        console.log("11111111111111111111")
        this.form = Object.assign({}, item, {
          ID: item.ID,
          Name: item.NAME,
          Remark: item.REMARK
        });
        this.dealType = "edit";
      } else {
        console.log("2222222222222222222222")
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
      this.$refs.form.validate(valid => {
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
          this.$store
            .dispatch("dealPaymentItem", { type: "del", data: item })
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
  }
};
</script>
