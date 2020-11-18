<template>
  <div class="shop">
    <div class="shop-list">
      <div class="content-eighty" style="padding-top: 24px">
        <div class="content-center">
          <div class="shop-bottom">
            <el-row>
              <el-col :span="18">
                <el-button size="small" type="primary" @click="handleDeal({})">新增员工</el-button>
              </el-col>
              <el-col :span="6" style="text-align: right">
                <span>归属店铺&nbsp;&nbsp;</span>
                <el-select
                  v-model="value1"
                  clearable
                  placeholder="请选择"
                  @change="scletShop"
                  size="small"
                >
                  <el-option
                    v-for="item in shopList"
                    :key="item.SHOPID"
                    :label="item.SHOPNAME"
                    :value="item.SHOPID"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <!--列表-->
    <div class="content-table m-top-sm" style="height: auto">
      <div class="content-table-center">
        <el-table
          :data="pagelist"
          v-loading="loading"
          :height="clientHeight"
          size="small"
          header-row-class-name="bg-theme2 text-white "
        >
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="NAME" label="员工信息" width="120"></el-table-column>
          <el-table-column prop="CODE" label="工号"></el-table-column>
          <el-table-column prop="POSITION" label="职务"></el-table-column>
          <el-table-column prop="SHOPNAME" label="归属店铺"></el-table-column>
          <el-table-column
            prop="SEX"
            label="性别"
            :formatter="formatSex"
            align="center"
          ></el-table-column>

          <el-table-column prop="MOBILENO" label="手机号码"></el-table-column>

          <el-table-column
            prop="BIRTHDATE"
            label="出生日期"
            :formatter="formatbirthdate"
          ></el-table-column>
          <el-table-column label="操作" width="180" align="right">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="text"
                  size="small"
                  @click="handleDeal(scope.row)"
                  icon="el-icon-edit"
                >
                  编辑
                </el-button>
                <!-- <el-button
                  size="small"
                  v-if="!scope.row.ISINIT"
                  @click="handleDel(scope.$index, scope.row)"
                  icon="el-icon-delete"
                >删除</el-button> -->
              </el-button-group>
              <div class="hide">{{ scope.row }}</div>
            </template>
          </el-table-column>
        </el-table>
    </div>
    </div>
    <!-- deal -->
    <el-dialog
      :title="dealType == 'add' ? '新增员工' : '编辑员工'"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <editEmployeePage
        @closeModal="dialogVisible = false"
        @resetList="
          dialogVisible = false;
          getNewData();
        "
        :propsData="{ state: dialogVisible }"
      ></editEmployeePage>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getUserInfo, setHomeData } from "@/api/index";
export default {
  data() {
    return {
      value1: "",
      pagelist: [],
      shopList: [],
      loading: false,
      dialogVisible: false,
      dealType: "add",
      options: [],
      value: "",
      input2: "",
      clientHeight: document.body.clientHeight - 180
    };
  },
  computed: {
    ...mapGetters({
      dataList: "employeeList",
      dataListState: "employeeListState",
      dealState: "delemployeestate",
      jobList: "jobList"
    })
  },
  watch: {
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagelist = [...this.dataList];
      }
      let userInfo = getUserInfo();
      this.shopList = userInfo.ShopList;
      console.log(this.shopList);
    },
    dealState(data) {
      if (data.success) {
        this.getNewData();
      }
      this.$message({
        message: data.message,
        type: data.success ? "success" : "error"
      });
    }
  },
  methods: {
    scletShop(e) {
      this.$store.dispatch("getEmployeeList", { Filter: "", ShopId: e }).then(() => {
        this.loading = true;
      });
    },
    scletJob(v) {
      this.$store.dispatch("getEmployeeList", { Position: v, ShopId: "" }).then(() => {
        this.loading = true;
      });
    },
    formatSex: function (row, column) {
      //性别显示转换
      return row.SEX == 1 ? "男" : row.SEX == 2 ? "女" : "未知";
    },
    formatbirthdate: function (row, column) {
      //性别显示转换
      return row.BIRTHDATE > 0 ? this.filterTimeOut(row.BIRTHDATE) : "";
    },
    getNewData() {
      this.$store.dispatch("getEmployeeList", { Filter: "", Category: "" }).then(() => {
        this.loading = true;
      });
      this.$store.dispatch("getJobList", {});
    },
    handleDeal(item) {
      this.$store.dispatch("selectingEmployee", item).then(() => {
        this.dialogVisible = true;
        this.dealType = Object.keys(item).length > 0 ? "edit" : "add";
      });
    },
    handleDel(index, item) {
      console.log(item);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("getdelemployeestate", { index: index, data: item }).then(() => {
            this.loading = false;
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
  components: {
    editEmployeePage: () => import("@/components/setup/editEmployee")
  },
  mounted() {
    this.getNewData();
  }
};
</script>
<style scoped>
.shop-list {
  width: 100%;
  position: relative;
}
.shop-bottom {
  background: #fff;
}
.seach-input {
  position: absolute;
  right: 30px;
}
.employeeTable {
  margin-top: 20px;
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  background: #fff;
}
</style>
