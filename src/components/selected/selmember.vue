<template>
  <div v-loading="loading">
    <el-form label-width="90px">
      <el-row :gutter="10" class="text-left">
        <el-col :xs="24" :sm="6" :md="8">
          <el-form-item label="会员等级：">
            <el-select
              size="small"
              v-model="pageData.LevelName"
              clearable
              placeholder="请选择"
              class="full-width"
            >
              <el-option
                v-for="(item, i) in memberLevelList"
                :key="i"
                :label="item.NAME"
                :value="item.NAME"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="会员标签：">
            <el-select
              size="small"
              v-model="pageData.VipFlag"
              clearable
              placeholder="请选择"
              class="full-width"
            >
              <el-option
                v-for="(item, j) in flagList"
                :key="j"
                :label="item.VIPFLAG"
                :value="item.VIPFLAG"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="号码/姓名：">
            <el-input
              size="small"
              v-model="pageData.Name"
              placeholder="请输入手机号/卡号/姓名"
              class="full-width"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="会员状态：">
            <el-radio-group size="small" v-model="pageData.Status">
              <el-radio-button size="small" label="-1">全部</el-radio-button>
              <el-radio-button size="small" label="0">正常</el-radio-button>
              <el-radio-button size="small" label="2">挂失</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="16">
          <el-form-item class="text-right full-width">
            <el-button size="small" @click="onSubmit(0)">重设</el-button>
            <el-button size="small" type="primary" @click="onSubmit(1)" :loading="loading">
              查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 单选 -->
    <el-table
      v-if="!isArr"
      ref="singleTable"
      size="small"
      :data="dataList"
      highlight-current-row
      @current-change="handleCurrentChange"
      header-row-class-name="bg-theme2 text-white"
      height="230px"
      style="width: 100%"
    >
      <el-table-column label="会员信息" width="160">
        <template slot-scope="scope">
          <img
            :src="scope.row.IMAGEURL"
            onerror="this.src='static/images/shopmore.png'"
            alt=""
            style="float: left; border-radius: 8px; width: 40px; height: 40px; margin-right: 8px"
          />
          <span>
            <i
              class="pull-left inline-block text-overflow"
              style="color: #2589ff; width: 92px; line-height: 20px"
            >
              <span>
                {{ scope.row.NAME ? scope.row.NAME : " " }}
              </span>
              &nbsp;&nbsp;
              <img
                :src="
                  scope.row.SEX == 0 ? 'static/images/icon_man.png' : 'static/images/icon_woman.png'
                "
                style="width: 13px; height: 13px; vertical-align: middle"
              />
            </i>
            <i class="pull-left inline-block text-overflow" style="width: 92px; line-height: 20px">
              {{ scope.row.MOBILENO }}
            </i>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="CODE" label="卡号"></el-table-column>
      <el-table-column prop="LEVELNAME" label="等级"></el-table-column>
      <el-table-column prop="VIPFLAG" label="标签"></el-table-column>
      <el-table-column prop="SHOPNAME" label="所属店铺" width="120"></el-table-column>
      <el-table-column prop="INTEGRAL" label="积分"></el-table-column>
      <el-table-column prop="MONEY" label="余额"></el-table-column>
      <el-table-column prop="QWEMONEY" label="欠款"></el-table-column>
      <el-table-column
        prop="STATUS"
        label="状态"
        :formatter="formatStatus"
        fixed="right"
      ></el-table-column>
    </el-table>
    <!-- 多选 -->
    <el-table
      v-if="isArr"
      size="small"
      :data="dataList"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      height="230"
      header-row-class-name="bg-theme2 text-white"
      style="width: 100%"
    >
      <el-table-column type="selection" width="50" fixed="left"></el-table-column>
      <el-table-column label="会员信息" width="160">
        <template slot-scope="scope">
          <img
            :src="scope.row.IMAGEURL"
            onerror="this.src='static/images/shopmore.png'"
            alt=""
            style="float: left; border-radius: 8px; width: 40px; height: 40px; margin-right: 8px"
          />
          <span>
            <i
              class="pull-left inline-block text-overflow"
              style="color: #2589ff; width: 92px; line-height: 20px"
            >
              <span>
                {{ scope.row.NAME ? scope.row.NAME : " " }}
              </span>
              &nbsp;&nbsp;
              <img
                :src="
                  scope.row.SEX == 0 ? 'static/images/icon_man.png' : 'static/images/icon_woman.png'
                "
                style="width: 13px; height: 13px; vertical-align: middle"
              />
            </i>
            <i class="pull-left inline-block text-overflow" style="width: 92px; line-height: 20px">
              {{ scope.row.MOBILENO }}
            </i>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="CODE" label="卡号"></el-table-column>
      <el-table-column prop="LEVELNAME" label="等级"></el-table-column>
      <el-table-column prop="SHOPNAME" label="所属店铺"></el-table-column>
      <el-table-column prop="INTEGRAL" label="积分" align="right"></el-table-column>
      <el-table-column prop="MONEY" label="余额" align="right"></el-table-column>
      <el-table-column prop="QWEMONEY" label="欠款" align="right"></el-table-column>
      <el-table-column prop="STATUS" label="状态" :formatter="formatStatus"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-if="pagination.TotalNumber > 20" class="m-top-sm clearfix elpagination">
      <el-pagination
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        :current-page.sync="pagination.PN"
        :page-size="pagination.PageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.TotalNumber"
        class="text-center"
      ></el-pagination>
    </div>
    <!-- handle -->
    <div class="text-right m-top-sm">
      <div v-if="!isArr" class="m-right-md inline-block pull-left">
        会员：
        <el-tag size="medium" class="font-16">{{ choseText }}</el-tag>
      </div>
      <el-button @click="closeModal">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS from "@/mixins/index";
let _ = require("lodash");
export default {
  mixins: [MIXINS.IS_SHOW_POPUP],
  props: {
    isArr: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagelist: [],
      loading: false,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      searchText: "",
      pageData: {
        PN: 1,
        Name: "",
        Status: -1,
        LevelName: "",
        VipFlag: ""
      },
      currentRow: {},
      choseText: "点击会员进行选择",
      multipleSelection: []
    };
  },
  computed: {
    ...mapGetters({
      dataList: "memberList",
      dataListState: "memberListState",
      memberLevelList: "memberLevelList",
      flagList: "memberFlagList"
    })
  },
  watch: {
    isShowFirstPopup(value) {
      if (value) {
        this.defaultData();
      }
    },
    dataListState(data) {
      this.loading = false;
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
        this.pageData.PN = data.paying.PN;
      }
    }
  },
  methods: {
    closeModal(type) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      if (type == "resetList") {
        this.$emit("resetList");
      } else {
        this.$emit("closeModal");
      }
    },
    formatSex: function (row, column) {
      //性别显示转换
      return row.SEX == 0 ? "男" : row.SEX == 1 ? "女" : "未知";
    },
    formatStatus: function (row, column) {
      //-1=全部,0=正常，2=挂失
      return row.STATUS == 0 ? "正常" : row.STATUS == 2 ? "挂失" : "未知";
    },
    getNewData() {
      this.$store.dispatch("getMemberList", this.pageData).then(() => {
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
    handleCurrentChange(val) {
      // 单选
      this.currentRow = val;
      this.choseText = this.currentRow.NAME;
      console.log(this.currentRow);
    },
    handleSelectionChange(val) {
      // 多选
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    cleanSelect(){
       this.multipleSelection = []
    },
    handleSubmit() {
      this.$store
        .dispatch("selectingMember", {
          isArr: this.isArr,
          data: this.isArr ? this.multipleSelection : this.currentRow
        })
        .then(() => {
          this.closeModal();
        });
    },
    onSubmit(v) {
      if (v == 1) {
        this.getNewData();
      } else {
        this.pageData = {
          PN: 1,
          Name: "",
          Status: -1,
          LevelName: "",
          VipFlag: ""
        };
      }
    },
    defaultData() {
      let list = this.$store.state.member.memberList;
      let list2 = this.$store.state.member.memberLevelList;
      let list3 = this.$store.state.member.memberFlagList;
      if (list.length == 0) {
        this.getNewData();
      }
      if (list2.length == 0) {
        this.$store.dispatch("getMemberLevel");
      }
      if (list3.length == 0) {
        this.$store.dispatch("getMemberFlag");
      }
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
  mounted() {
    this.defaultData();
  }
};
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
