<template>
    <el-container>
        <el-header style="height:50px; padding: 0">
            <headerPage></headerPage>
        </el-header>
        <el-container>
            <el-aside width="100px">
                <section style="min-width:100px;">
                <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
                </section>
            </el-aside>
            <el-container>
                <el-main :style="{height:height+'px'}">
                    <div class="content-table1">
                        <div class="content-table-center">
                           <div class="system" style="width: 100%; float:left">
                                 <div class="setparametersock">
                                    <ul>
                                       <li v-for="(item,i) in lineData" :key="i">
                                             <span style="width: 100px; float:left"> <i></i>{{item.label}}</span>
                                             <span v-if='item.value == "IsVip" || item.value == "IsGoods"' style="color:#f00; margin-left: 20px">{{item.tip}}</span>
                                             <span v-else style="color:#999; margin-left: 20px">{{item.tip}}</span>
                                             <el-switch v-model="choose[item.value]" @change="modifyState(item, i)" active-color="#rgb(251, 120, 154)" inactive-color="##9E9E9E" class="pull-right"></el-switch>
                                       </li>
                                    </ul>
                                 </div>

                                 <div class="paddingTB-md full-width pull-left">
                                    <span class="font-14">确认清除以上选择的数据项</span>
                                    <a @click="makesure" class="inline-block vertical-middle m-left-sm">
                                       <span class="el-checkbox__inner inline-block" :class="{'active':sure}"></span>
                                    </a>
                                 </div>

                                 <div style="width:300px;">
                                    <el-input placeholder="请输入验证码" v-model="code">
                                       <template slot="append">
                                             <el-button type="primary" @click="getCode">
                                                <span v-text="timeDown.isClick?'获取验证码':'( '+timeDown.seconds+'s )'"></span>
                                             </el-button>
                                       </template>
                                    </el-input>
                                    <div class="paddingTB-sm" style="color:#868686">短信验证将发送至注册人手机 {{CompanyCode}}</div>
                                    <el-button
                                       type="primary"
                                       v-if="code"
                                       @click="handleSubmit"
                                       :loading="loading"
                                       class="full-width marginTB-sm"
                                    >确定清除</el-button>
                                    <el-button type="primary" v-else disabled class="full-width marginTB-sm">确定清除</el-button>
                                 </div>
                           </div>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getUserInfo, getHomeData } from "@/api/index";
import MIXINS_SETUP from "@/mixins/setup";
export default {
    mixins: [MIXINS_SETUP.SIDERBAR_MENU],
    data() {
        return {
            CompanyCode: "",
            choose: {
                IsVip: false,
                IsPay: false,
                IsOther: false,
                IsGoods: false,
                IsBusi: true
            },
            lineData: [
                {
                    label: "清除业务数据",
                    value: "IsBusi",
                    tip:"此项必选，将清除所有会员充值、赛事数据、商品进出等业务相关数据"
                },
                {
                    label: "清除会员数据",
                    value: "IsVip",
                    tip: "清除所有会员信息，请谨慎操作，清除之后全部会员信息不可恢复"
                },
                {
                    label: "清除商品数据",
                    value: "IsGoods",
                    tip: "清除所有商品信息，请谨慎操作，清除之后全部会员信息不可恢复"
                },
                {
                    label: "清除支出数据",
                    value: "IsPay",
                    tip: "清除所有支出数据"
                },
                {
                    label: "清除其他",
                    value: "IsOther",
                    tip: "清除所有店铺资料、桌台资料、员工资料、用户资料、支付方式等数据"
                }
            ],
            sure: false,
            code: "",
            codeState: false,
            timeDown: {
                isClick: true,
                seconds: 60
            },
            loading: false,
            height:window.innerHeight -60
        }
    },
    components: {
        headerPage: () => import("@/components/header")
    },
    computed: {
        ...mapGetters({
            verCodeState: "verCodeState",
            rebuildDataState: "rebuildDataState"
        })
    },
    watch: {
        verCodeState(data) {
            this.codeState = data.success ? true : false;
        },
        rebuildDataState(data) {
            this.$message({
                message: data.message,
                type: data.success ? "success" : "error"
            });
            this.loading = false;
        }
    },
    methods: {
        modifyState(item, idx){
            if(idx == 0){
               if( this.choose.IsBusi == false){
                   this.$message.warning('当前项为必选项 ！')
                   this.choose.IsBusi = true
               }
            }
        },
        makesure() {
            if (this.sure) {
                this.sure = false;
                return;
            }
            if (this.CompanyCode.length < 11) {
                this.$message.error("体验账号不能进行该操作");
                return;
            }
            let msg =
                "同意因我决定而清除的数据【无法恢复】智讯生意通将不负责任，请输入“确认清除”表示您已确认！";
            this.$prompt(msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPattern: /确认清除/,
                inputPlaceholder: '请输入“确认清除”表示您已确认',
                inputErrorMessage: "输入不正确"
            }).then(({ value }) => {
                this.sure = true;
            }).catch(() => {})
        },
        getCode() {
            if (this.CompanyCode.length < 11) {
                this.$message.error("体验账号不能进行该操作");
                return;
            }
            if (this.timeDown.isClick) {
                this.$store.dispatch("getVerCode", this.CompanyCode);
                let time = setInterval(() => {
                    if (this.timeDown.seconds == 0) {
                        this.timeDown.isClick = true;
                        clearInterval(time);
                        return;
                    }
                    this.timeDown.seconds--;
                    this.timeDown.isClick = false;
                }, 1000);
            }
        },
        handleSubmit() {
            if (!this.sure) {
                this.$message({
                    message: "请勾选，确认清除",
                    type: "error"
                });
                return;
            }
            if (!this.codeState) {
                this.$message({
                    message: "短信验证，有错",
                    type: "error"
                });
                return;
            }
            if (this.code && this.codeState && this.sure) {
                let sendData = Object.assign({}, this.choose, {
                    mobileno: this.CompanyCode,
                    VerifyCode: this.code
                });
                this.$store.dispatch("rebuildDataFun", sendData).then(() => {
                    this.loading = true;
                });
            }
        }
    },
    mounted() {
        let userInfo = getUserInfo();
        let homeInfo = getHomeData();
        this.CompanyCode = userInfo.CompanyID == homeInfo.shop.COMPANYID ? userInfo.CompanyCode : "";
        if (userInfo.CompanyID != homeInfo.shop.COMPANYID) {
            this.$notify({
                title: "警告",
                message: "商家账号有问题，请重新登录",
                type: "warning"
            })
        }
    }
};
</script>
<style scoped>
.el-checkbox__inner {
    width: 20px;
    height: 20px;
    background-color: #dedede;
}
.el-checkbox__inner.active {
    background-color: #409eff;
    border-color: #409eff;
}
.el-checkbox__inner.active:after {
    height: 9px;
    left: 6px;
    width: 4px;
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
}

.system .el-checkbox__label {
    font-size: 16px;
}

.setparametersock, .tm-top-lg{
  width: 100%; float: left;
}

.tm-top-lg{
  margin-top: 10px;

}
.setparametersock ul {
  float:left; width: 100%
}

.setparametersock ul li {
  padding: 12px 0 12px 12px;
  width: 100%;
  float:left;
  border-bottom: 1px dashed #ddd
}
</style>

