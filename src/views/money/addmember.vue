<template>
<el-container>
  <el-container>
    <el-aside width="100px">
        <section style="min-width:100px;">
          <sidebarMenu :activePath="activePath" :routesList="routesList" :width="100"></sidebarMenu>
        </section>
    </el-aside>
    <el-container>
        <div style="position: absolute;top: 0px;bottom: 0px;left:100px;right:0px; background: #fff;">
            <div class="search_sock">
                <el-row>
                    <el-col :span="16" class="member-header">
                        <div class="add-member">
                            新增会员
                        </div>
                    </el-col>
                    <el-col :span="8" class="shop">
                        <span class="name">{{shopInfo.SHOPNAME}}</span>
                        <span class="">
                            <el-popover placement="bottom" width="140" trigger="hover" popper-class="no-padding">
                                <el-button style="border: none!important;"  @click="changeShop()" class="full-width" icon='icon-exchange'>&nbsp;&nbsp;切换店铺</el-button>
                                <el-button style="border: none!important;"  class="full-width no-m-left border-top" icon='icon-user'>&nbsp;&nbsp; 账号信息</el-button>
                                <el-button style="border: none!important;"  @click="logout()" class="full-width no-m-left border-top" icon='icon-signout'>&nbsp;&nbsp;退出账号</el-button>
                                <a slot="reference" class="hitem">
                                    <i class='icon-reorder'></i>
                                </a>
                            </el-popover>
                        </span>
                    </el-col>
                </el-row>
            </div>
            <div class="addmember-cont">
                <el-row>
                    <el-col class="addmember">
                    <el-row class="addmember-list">
                        <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm">
                            <el-row :gutter="10">
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="姓名" prop="Name">
                                        <el-input v-model="ruleForm.Name" placeholder="请输入姓名" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="手机" prop="PhoneNo">
                                        <el-input v-model.number="ruleForm.PhoneNo" placeholder="请输入手机号码" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="卡号">
                                        <el-input size="small" placeholder="请输入卡号" v-model="ruleForm.Code"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="折扣">
                                        <el-select v-model="ruleForm.LevelID" placeholder="请选择" size="small" style="width:100%;">
                                                <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="性别">
                                                <el-select v-model="ruleForm.Sex" placeholder="请选择" size="small" style="width:100%;">
                                                <el-option label="男" value="男"></el-option>
                                                <el-option label="女" value="女"></el-option>
                                            </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="销售顾问">
                                        <el-select v-model="ruleForm.SaleEmpId" placeholder="请选择" size="small" style="width:100%;">
                                                <el-option
                                                v-for="item in disoptionsman"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="生日">
                                        <el-date-picker
                                            v-model="ruleForm.BirthDate"
                                            type="date"
                                            value-format="timestamp"
                                            placeholder="请输入会员生日"
                                            size="small"
                                            style="width:100%;"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="押金">
                                        <el-input v-model="ruleForm.DepositMoney" placeholder="请输入押金" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="QQ">
                                        <el-input v-model="ruleForm.QQ" size="small" placeholder="请输入会员的qq"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="微信">
                                        <el-input v-model="ruleForm.WeChat" size="small" placeholder="请输入会员的微信号"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="密码">
                                        <el-input v-model="ruleForm.Passwd" size="small" placeholder="请输入密码" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <el-form-item label="标识">
                                        <el-select v-model="ruleForm.VipFlag" placeholder="请选择" size="small" style="width:100%;">
                                            <el-option
                                            v-for="(item,index) in disoptions"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.label">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24">
                                    <el-form-item label="地址">
                                        <el-input v-model="ruleForm.Address" size="small" placeholder="请输入地址"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :xs="24" :sm="24">
                                    <el-form-item label="备注">
                                        <el-input v-model="ruleForm.Remark" size="small" placeholder="请输入备注"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :xs="24" :sm="24" style="text-align:center;">
                                    <el-form-item>
                                        <el-button size="small" style="margin-right:20px;">取  消</el-button>
                                        <el-button type="primary" size="small" @click="saveNewMember" :loading="loading">保  存</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-row>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog title="请选择门店" :visible.sync="isShowShop" width="300px" :before-close="handleClose">
            <div class='shopListClass'>
                <ul>
                    <li v-for='(item, index) in theshopList' :key="index" @click="setShop(item)">
                        {{item.SHOPNAME}}
                    </li>
                </ul>
            </div>
        </el-dialog>
    </el-container>
  </el-container>
</el-container>
</template>
<script>
import MIXINS_MONEY from "@/mixins/money";
import { mapState, mapGetters } from "vuex";
import MIXINS_CLEAR from "@/mixins/clearAllData";
import { getHomeData,getUserInfo } from '@/api/index'
export default {
    mixins: [MIXINS_MONEY.MONEY_MENU,MIXINS_CLEAR.LOGOUT],
    data() {
        var checkTel = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("手机号码不能为空"));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error("请输入数字值"));
                } else {
                    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                    if (!myreg.test(value)) {
                        callback(new Error("请输入正确的手机号码"));
                    } else {
                        callback();
                    }
                }
            }, 800);
        };
        return {
            ruleForm: {
                Code: "",
                Name:"",
                PhoneNo:"",
                QQ:"",
                WeChat:"",
                Passwd:"",
                Address:"",
                Remark:"",
                DepositMoney:"",
                LevelID: '',
                VipFlag: '',
                SaleEmpId: '',
                Sex:'',
                BirthDate:""
            },
            rules: {
                Name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur"
                    }
                ],
                PhoneNo: [
                    {
                        required: true,
                        validator: checkTel,
                        trigger: "blur"
                    }
                ]
            },
            options: [],
            disoptions: [],
            disoptionsman: [],
            loading:false,
            shopInfo: getHomeData().shop,
            isShowShop:false,
            theshopList: [],
            activePath: "",
            shopName:getUserInfo().CompanyName
        }
    },
    computed: {
        ...mapGetters({
            memberLevelList: "memberLevelList",
            commoditycflDiscountList:"commoditycflDiscountList",
            employeeList: "employeeList",
            dateState: "dealMemberState",
            shopList: "shopList",
            shopListState:'shopListState'
        })
    },
    watch: {
        commoditycflDiscountList(data) {
            this.options=[]
            let discount=data;
            for(var i in discount){
                let Obj={
                    value:discount[i].ID,
                    label:discount[i].NAME
                    }
                    this.options.push(Obj)
            }
        },
        memberLevelList(data) {
             this.disoptions=[];
             let memberLevel=data;
             for(var i in memberLevel){
                 let Obj= {
                    value:memberLevel[i],
                    label:memberLevel[i].VIPFLAG
                 }
                 this.disoptions.push(Obj)
             }
        },
        employeeList(data) {
            this.disoptionsman=[]
            let employeemen=data;
            for(var i in employeemen){
                let Obj={
                    value:employeemen[i].ID,
                    label:employeemen[i].NAME
                    }
                    this.disoptionsman.push(Obj)
            }
        },
        dateState(data) {
            this.$message({
                message: data.message,
                type: data.success ? "success" : "error"
            });
            this.loading = false;
        }

    },
    methods:{
        saveNewMember(){
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let sendData = Object.assign({},this.ruleForm)
                    this.$store.dispatch("addNewMember", sendData).then(() => {
                        this.loading = true
                    });
                } else {
                    return false;
                }
            });
        },
        handleClose(done) {
            this.isShowShop = false;
        },
        logout: function() { //退出登录
            var _this = this;
            this.$confirm("确认退出吗?", "提示").then(() => {
                _this.$store.dispatch("toLogOut").then(() => {
                    _this.clearAllData();
                    _this.$router.push("/login");
                })
            }).catch(() => {
                console.log("logout");
            })
        },
        setShop(item) { //切换店铺
            this.$store.dispatch("choosingShop", item).then(() => {
                this.isShowShop = false;
                this.clearAllData();
                this.defaultData();
                console.log("11111111111111111111111")
                this.$router.push({
                    path: "/home"
                })
            })
        },
        defaultData() {
            let homeData = getHomeData();
            if (homeData.shop) {
                this.shopInfo = Object.assign({}, homeData.shop);
            }
            this.UserName = getUserInfo().UserName;
            if (this.shopList.length == 0) {
                this.$store.dispatch("getShopList")
            }
        },
        changeShop() {
            let userInfo = getUserInfo();
            if (userInfo.CODE2 == "boss") {
                this.theshopList = [...this.shopList];
            } else {
                this.theshopList = [];
                for (let i = 0; i < userInfo.ShopList.length; i++) {
                    if (userInfo.ShopList[i].ISPURVIEW == 1) {
                    this.theshopList.push({
                        ID : userInfo.ShopList[i].SHOPID,
                        NAME : userInfo.ShopList[i].SHOPNAME
                    });
                    }
                }
            }
            this.isShowShop = true;
        },
    },
    beforeCreate() {
        let list1 = this.$store.state.employee.employeeList;
        if (list1.length == 0) {
            this.$store.dispatch("getMemberLevel", {})
        }
        let list2 = this.$store.state.commodityc.commoditycflDiscountList;
        if (list2.length == 0) {
            this.$store.dispatch("getcommoditycDiscountList", {})
        }
        let list3 = this.$store.state.employee.employeeList;
        if (list3.length == 0) {
            this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID })
        }
    },
    mounted() {
      //   this.$store.dispatch("getMemberLevel", {});
      //   this.$store.dispatch("getcommoditycDiscountList", {});
    }
}
</script>
<style scoped>
   .addmember{
       /* height: 615px; */
       width: 100%;
       /* border: solid 1px #E4E4E4; */
       /* border-radius: 2px; */
   }
   .addmember-title{
       height: 40px;
       width: 100%;
       /* background: rebeccapurple; */
       line-height: 40px;
       text-align: center;
       border-bottom: solid 1px #E4E4E4;
   }
.half{
  width: 100%;
  margin-right: 0px;
  float: left;
}
.addmember-list{
    margin-top: 20px;
    height: 560px;
    width: 90%;
    margin-left: 3%;
    margin-right: 5%;
}
.search_sock{
    height: 50px;
    line-height: 50px;
    background: #fff;
    width: 100%;
    /* border-left: solid 1px #EBEDF0; */
    border-bottom: solid 1px #EBEDF0;
}
.add-member{
    padding-left: 20px;
}
.shop{
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #EBEDF0;
  background: #fff;
}
.shop .name{
    margin-right: 8px;
}
.icon-reorder{
    color: #2589FF;
    cursor: pointer;
}
.addmember-cont{
    background: #fff;
}
</style>
