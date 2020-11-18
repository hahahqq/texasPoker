<template>
  <el-container>
    <el-header style="height: 50px; padding: 0">
      <headerPage></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <el-main
          :style="`height:${height}px`"
          v-loading="loading"
          element-loading-text="会员详情数据加载中..."
          element-loading-background="rgba(242,242,242, 0.8)"
        >
          <div
            class="full-width pull-left"
            style="padding: 10px 10px 0; background: #fff; box-shadow: 10px 10px 10px -10px #aaa"
          >
            <div
              style="
                width: 100%;
                float: left;
                padding: 10px 20px;
                border-radius: 4px;
                background: #f2f2f2;
              "
            >
              <span style="float: left; vertical-align: middle">
                <img
                  :src="memberItem.IMAGEURL ? memberItem.IMAGEURL : 'static/images/header.png'"
                  style="width: 60px; height: 60px; border-radius: 100%; margin-top: 5px"
                />
              </span>

              <span style="float: left; padding-left: 10px">
                <div style="line-height: 34px">
                  <i style="font-size: 14px; font-weight: bold">{{ memberItem.NAME }}</i>
                  <img
                    :src="
                      memberItem.SEX == 0
                        ? 'static/images/icon_man.png'
                        : 'static/images/icon_woman.png'
                    "
                    style="width: 13px; height: 13px; vertical-align: middle; margin-left: 8px"
                  />
                  <i
                    style="
                      padding: 4px 8px;
                      border-radius: 2px;
                      color: #fff;
                      background: #ff8800;
                      margin-left: 10px;
                    "
                  >
                    {{ memberItem.DISCOUNTNAME }}
                  </i>
                </div>
                <div style="line-height: 34px">
                  <i>{{ memberItem.MOBILENO }}</i>
                  <i v-if="memberItem.LASTSALETIME != undefined" style="margin-left: 20px">
                    最近一次消费：
                    {{ new Date(memberItem.LASTSALETIME) | timehf }}
                  </i>
                  <i v-else style="margin-left: 20px">无消费记录</i>
                  <i v-if="memberItem.LASTSALETIME != undefined" style="margin-left: 20px">
                    【 距今
                    <a style="color: #f00; font-size: 14px">
                      {{ new Date(memberItem.LASTSALETIME) | dateBetweenDay }}
                    </a>
                    天 】
                  </i>
                </div>
              </span>

              <span style="float: right; line-height: 70px">
                <el-button type="primary" plain size="small" @click="modifyPasswd()">
                  修改密码
                </el-button>
                <el-button type="danger" plain size="small" @click="delVip">删除</el-button>
              </span>
            </div>

            <ul class="colNavGroup">
              <li v-for="(item, index) in navGroup" :key="index" v-show="item.show">
                <div>{{ item.title }}</div>
                <div @click="linkAnchorPoint(item.activeName)" :class="`${item.activeName != '' ? 'pointerColor' : ''}`">{{ memberItem[item.field] ? memberItem[item.field] : 0 }}</div>
              </li>
            </ul>
          </div>

          <div
            class="full-width pull-left"
            :style="`padding: 10px 20px; min-height:${tableHeight}px; margin-top:10px; background:#fff`"
          >
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="first" label="会员信息">
                <div style="font-size: 14px; font-weight: bold">
                  基本信息
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="toEditVipFun()"
                    style="margin-left: 16px"
                  >
                    编辑
                  </el-button>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 200px">
                    <i class="basicInfoTitle">卡 &nbsp;&nbsp;号:</i>
                    {{ memberItem.CODE }}
                  </span>

                  <span style="float: left">
                    <i class="basicInfoTitle">等 &nbsp;&nbsp;级：</i>
                    {{ memberItem.DISCOUNTNAME }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 200px">
                    <i class="basicInfoTitle">顾 &nbsp;&nbsp;问：</i>
                    {{ memberItem.SALEEMPNAME ? memberItem.SALEEMPNAME : "--" }}
                  </span>

                  <span style="float: left">
                    <i class="basicInfoTitle">身份证：</i>
                    {{ memberItem.IDCARDNO ? memberItem.IDCARDNO : "--" }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 200px">
                    <i class="basicInfoTitle">性 &nbsp;&nbsp;别：</i>
                    {{ memberItem.SEX == 0 ? "男" : "女" }}
                  </span>

                  <span style="float: left">
                    <i class="basicInfoTitle">标 &nbsp;&nbsp;签</i>
                    {{ memberItem.VIPFLAG != undefined ? memberItem.VIPFLAG : "--" }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 200px">
                    <i class="basicInfoTitle">生 &nbsp;&nbsp;日：</i>
                    <span v-if="memberItem.BIRTHDATE != undefined">
                      {{ new Date(memberItem.BIRTHDATE) | time }}
                    </span>
                    <span v-else>--</span>
                  </span>

                  <span style="float: left">
                    <i class="basicInfoTitle">注册日期：</i>
                    {{ new Date(memberItem.CREATEDATE) | time }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 100%">
                    <i class="basicInfoTitle">有效期：</i>
                    {{ new Date(memberItem.INVALIDDATE) | time }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 100%">
                    <i class="basicInfoTitle">地 &nbsp;&nbsp;址：</i>
                    {{ memberItem.ADDRESS != undefined ? memberItem.ADDRESS : "--" }}
                  </span>
                </div>

                <div class="basicInfoItem">
                  <span style="float: left; width: 100%">
                    <i class="basicInfoTitle">备 &nbsp;&nbsp;注：</i>
                    {{ memberItem.REMARK ? memberItem.REMARK : "--" }}
                  </span>
                </div>
              </el-tab-pane>

              <el-tab-pane name="second" label="储值积分记录">
                <balancePage v-if="activeName == 'second'"></balancePage>
              </el-tab-pane>

              <el-tab-pane name="third" label="竞技积分记录" v-if="splitIntegral">
                <integralPage v-if="activeName == 'third'"></integralPage>
              </el-tab-pane>

              <el-tab-pane name="fouth" label="参赛记录">
                <participatePage v-if="activeName == 'fouth'"></participatePage>
              </el-tab-pane>

              <el-tab-pane name="fifth" label="消费记录">
                <consumePage v-if="activeName == 'fifth'"></consumePage>
              </el-tab-pane>

              <el-tab-pane name="sixth" label="欠款记录">
                <arrearsPage v-if="activeName == 'sixth'"></arrearsPage>
              </el-tab-pane>

              <el-tab-pane name="seventh" label="大师分">
                <contestPage v-if="activeName == 'seventh'"></contestPage>
              </el-tab-pane>

              <el-tab-pane name="eighth" label="优惠券">
                <couponPage v-if="activeName == 'eighth'"></couponPage>
              </el-tab-pane>
            </el-tabs>
          </div>

          <el-dialog width="60%" title="编辑会员" :visible.sync="toEdit" append-to-body>
            <edit-member
              @closeModal="toEdit = false"
              @resetList="
                toEdit = false;
                getMemberItemFun();
              "
              :dealType="{ type: 'edit', state: toEdit }"
            ></edit-member>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MEMBER from "@/mixins/member";
import CRYPTO from "crypto-js";
import { getHomeData, getUserInfo } from "@/api/index";
export default {
  mixins: [MIXINS_MEMBER.MEMBER_MENU],
  data() {
    return {
      navGroup: [
        { title: "储值积分", field: "MONEY", show: true, activeName: 'second' },
        { title: "竞技积分", field: "INTEGRAL", show: getUserInfo().CompanyConfig.INTEGRALTYPE, activeName : 'third' },
        { title: "欠款金额", field: "OWEMONEY", show: true, activeName: 'sixth' },
        { title: "优惠券", field: "COUPONNUM", show: true, activeName: 'eighth' },
        { title: "大师分", field: "CONTESTQTY", show: true, activeName: 'seventh' },
        { title: "参赛次数", field: "MATCHCOUNT", show: true, activeName: 'fouth' },
        { title: "累计参赛积分", field: "MATCHMONEY", show: true, activeName: '' }
      ],
      activeName: "first",
      height: window.innerHeight,
      tableHeight: document.body.clientHeight - 268,
      loading: false,
      toEdit: false,
      queryUrl: {},
      memberItem: {},
      vipPassword: "",
      IsUsePasswd: false,
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE
    };
  },
  computed: {
    ...mapGetters({
      delMemberState: "delMember",
      modifyVipPasswdState: "modifyVipPasswdState",
      memberItemState: "memberItemState"
    })
  },
  watch: {
    memberItemState(data) {
      this.loading = false;
      if (data.success) {
        this.memberItem = data.data.obj;
      } else {
        this.$message({ message: data.message, type: "error" });
      }
    },
    modifyVipPasswdState(data) {
      this.$message({ message: data.message, type: data.success ? "success" : "error" });
    },
    delMemberState(data) {
      if (data.success) {
        this.$router.push({
          path: "/member/MemberList"
        });
      }
      this.$message({ message: data.message, type: data.success ? "success" : "error" });
    }
  },
  methods: {
     linkAnchorPoint(activeName){
        if(activeName != ''){
           this.activeName = activeName
        }
     },
    modifyPasswd() {
      this.$prompt("", "请输入密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
        inputPattern: /^\d{6}$/,
        inputPlaceholder: "请输入六位数字组成的密码",
        inputErrorMessage: "密码格式不正确 ！"
      })
        .then(({ value }) => {
          this.$store.dispatch("modifyVipPasswd", {
            VipId: this.memberItem.ID,
            Md5Pass: CRYPTO.MD5(value).toString()
          });
        })
        .catch(() => {});
    },
    handleClick() {
      console.log(this.activeName);
    },
    toEditVipFun() {
      this.$store.dispatch("getMemberItem2", { ID: this.memberItem.ID }).then(() => {
        this.toEdit = true;
      });
    },
    delVip() {
      this.$confirm("确认删除该会员 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("getMemberDel", this.memberItem.ID);
        })
        .catch(() => {});
    },
    getMemberItemFun() {
      this.$store.dispatch("getMemberItem2", { ID: this.queryUrl.ID });
    }
  },
  components: {
    headerPage: () => import("@/components/header"),
    editMember: () => import("@/components/member/add"),
    arrearsPage: () => import("@/components/member/arrears"),
    couponPage: () => import("@/components/member/couponList"),
    contestPage: () => import("@/components/member/contest"),
    participatePage: () => import("@/components/member/participate"),
    consumePage: () => import("@/components/member/consume"),
    integralPage: () => import("@/components/member/integral"),
    balancePage: () => import("@/components/member/balance")
  },
  mounted() {
    let queryUrl = this.getSearchString();
    this.queryUrl = queryUrl;
    this.$store.dispatch("getMemberItem2", { ID: queryUrl.ID });
  }
};
</script>


<style scoped>
.colNavGroup {
  padding: 16px 20px;
  width: 100%;
  float: left;
}
.colNavGroup li {
  text-align: center;
  float: left;
  width: 10%;
  margin: 0 2%;
}
.colNavGroup li div:last-child {
  margin-top: 16px;
  color: #409eff;
  font-size: 18px;
  font-weight: bold;
}
.basicInfoItem {
  line-height: 40px;
  width: 100%;
  float: left;
}
.basicInfoTitle {
  width: 66px;
  float: left;
}
.pointerColor:hover{
   cursor: pointer;
}
</style>
