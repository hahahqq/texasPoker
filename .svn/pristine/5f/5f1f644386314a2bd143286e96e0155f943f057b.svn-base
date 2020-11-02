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
          <div class="integral">
            <div class="content-eighty">
              <div class="content-center">
                <el-row>
                  <el-col :span="12">
                    <el-button size="small" @click="handleAdd()" icon="el-icon-plus">
                      新增
                    </el-button>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-input
                      type="default"
                      size="small"
                      v-model="Filter"
                      placeholder="请输入供应商名称"
                      clearable
                      style="width: 250px"
                      @keyup.enter.native="getNewData()"
                    >
                      <el-button
                        slot="append"
                        type="default"
                        icon="el-icon-search"
                        @click="getNewData()"
                      ></el-button>
                    </el-input>
                    <div class="hide">{{ dataList }}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!--列表-->
            <div class="content-table4">
              <div class="content-table-center">
                <el-table
                  :data="pagelist"
                  v-loading="loading"
                  element-loading-text="数据加载中..."
                  size="small"
                  :height="tableHeight"
                  header-row-class-name="bg-theme2 text-white"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="80"
                  ></el-table-column>
                  <el-table-column prop="NAME" label="供应商名称" sortable></el-table-column>
                  <el-table-column prop="LINKER" label="联系人"></el-table-column>
                  <el-table-column prop="PHONENO" label="手机号"></el-table-column>
                  <el-table-column prop="FIRSTMONEY" label="期初欠款"></el-table-column>
                  <el-table-column prop="CURRMONEY" label="欠供应商款"></el-table-column>
                  <el-table-column label="操作" align="right">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="text"
                        @click="handleDeal(scope.row)"
                        icon="el-icon-edit"
                      >
                        编辑
                      </el-button>
                      <el-button
                        size="small"
                        type="text"
                        @click="handleDel(scope.$index, scope.row)"
                        icon="el-icon-delete"
                      >
                        删除
                      </el-button>
                      <div class="hide">{{ scope.row }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <el-dialog
            :title="titleName"
            width="770px"
            :visible.sync="showAddSupplier"
            :close-on-click-modal="false"
            :before-close="handleDialogClose"
            append-to-body
          >
            <add-new-supplier
              @closeModal="showAddSupplier = false"
              @resetList="
                showAddSupplier = false;
                handleDialogClose();
              "
              :dealSupplier="{ value: 1, dealState: isAddSupplier ? 'add' : 'edit' }"
            ></add-new-supplier>
          </el-dialog>
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
// import MIXNINS_EXPORT from "@/mixins/exportData.js";
import MIXINS_GOOD from "@/mixins/good.js";

export default {
  mixins: [MIXINS_GOOD.GOOD_MENU],
  data() {
    return {
      pagelist: [],
      loading: false,
      dialogVisible: false,
      showAddSupplier: false,
      Filter: "",
      isAddSupplier: false,
      form: { Name: "", Money: 0, Integral: 0, Rate: 0 },
      rules: { Name: [{ required: true, message: "请输入等级名称", trigger: "blur" }] },
      dealType: "add",
      delIndex: "",
      titleName: "",
      tableHeight: document.body.clientHeight - 200
    };
  },
  computed: {
    ...mapGetters({
      dataList: "supplierList",
      dataListState: "supplierListState",
      dataState: "integralState",
      dealState: "dealIntegralState",
      cancelSupplierState: "cancelSupplierState",
      dataItem: "supplierItem"
    })
  },

  watch: {
    dataItem(data) {
      console.log(data);
    },
    cancelSupplierState(data) {
      this.loading = false;
      if (data.success) {
        this.pagelist.splice(this.delIndex, 1);
      }
      this.$message({
        type: data.success ? "success" : "error",
        message: data.message
      });
    },
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
      this.$message({ message: data.message, type: data.success ? "success" : "error" });
      this.dialogVisible = false;
    }
  },
  methods: {
    handleDialogClose() {
      this.showAddSupplier = false;
      this.$store
        .dispatch("getSupplierList", { Filter: this.Filter, IsCurr: 0, IsStop: -1 })
        .then(() => {
          this.loading = true;
        });
      this.$store.dispatch("clearSupplierItem");
    },
    pullSupplierList(arr) {
      this.pagelist = [...arr];
    },
    getNewData() {
      this.$store
        .dispatch("getSupplierList", { Filter: this.Filter, IsCurr: 0, IsStop: -1 })
        .then(() => {
          this.loading = true;
        });
    },
    getIntegralItem() {},
    handleAdd() {
      this.showAddSupplier = true;
      this.isAddSupplier = true;
      this.titleName = "新增供应商";
    },
    handleDeal(item) {
      this.showAddSupplier = true;
      this.titleName = "供应商详情";
      this.$store.dispatch("getSupplierItem", { id: item.ID }).then(() => {
        this.isAddSupplier = false;
      });
    },
    handleDel(index, item) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("cancelSupplier", { id: item.ID }).then(() => {
          this.loading = true;
          this.delIndex = index;
        });
      });
    }
  },
  mounted() {
    this.getNewData();
  },

  beforeCreate() {},
  components: {
    headerPage: () => import("@/components/header"),
    addNewSupplier: () => import("@/components/goods/addNewSupplier.vue")
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
  border: solid 1px #d7d7d7;
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
.member-main-top {
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 150px;
  background: #fff;
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
</style>


