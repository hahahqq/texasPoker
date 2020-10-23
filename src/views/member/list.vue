<template>
    <div>
        <div class="m-bottom-md">
            <el-button-group class="m-right-sm">
                <el-button type="default" icon="el-icon-plus" @click="showAddNew=true">新增会员</el-button>
                <el-button
                    type="default"
                    icon
                    for="input"
                    :loading="importLoading"
                    @click="$refs.upload.click()"
                >批量导入</el-button>
                <input
                    type="file"
                    ref="upload"
                    @change="readExcel"
                    accept=".xls, .xlsx"
                    class="outputlist_upload hide"
                />
            </el-button-group>
            <el-button-group>
                <el-button
                    type="default"
                    icon="el-icon-plus"
                    @click="ExportMemberData"
                    :loading="exportLoading"
                >批量导出</el-button>
                <el-button
                    type="default"
                    icon
                    @click="reportLossfun"
                    :loading="reportLoss.loading"
                >挂失</el-button>
            </el-button-group>
            <el-button-group>
                <el-button type="default" icon="el-icon-plus">
                    <a href="static/images/会员导入模板.xls" class="producttemplate">下载模板</a>
                </el-button>
            </el-button-group>
            <!-- add -->
            <el-dialog
                v-if="showAddNew"
                title="新增会员"
                :visible.sync="showAddNew"
                width="800px"
                style="max-width:100%;"
            >
                <add-new-member
                    @closeModal="showAddNew=false"
                    @resetList="showAddNew=false;getNewData();"
                ></add-new-member>
            </el-dialog>
            <!-- search -->
            <el-input
                type="default"
                v-model="searchText"
                placeholder="会员手机号/卡号/姓名"
                class="pull-right"
                style="width: 250px;"
            >
                <el-button
                    slot="append"
                    type="default"
                    icon="el-icon-search"
                    @click="searchfun2(1)"
                ></el-button>
            </el-input>
            <!-- 筛选会员 -->
            <el-button-group class="pull-right m-right-sm">
                <el-popover placement="bottom" v-model="isFilter">
                    <div>
                        <el-form label-width="100px">
                            <el-form-item label="会员状态：">
                                <el-radio-group v-model="pageData.Status">
                                    <el-radio-button size="mini" label="-1">全部</el-radio-button>
                                    <el-radio-button size="mini" label="0">正常</el-radio-button>
                                    <el-radio-button size="mini" label="2">挂失</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="会员等级：">
                                <el-select v-model="pageData.LevelName" placeholder="请选择">
                                    <el-option label value>全部</el-option>
                                    <el-option
                                        v-for="(item,i) in memberLevelList"
                                        :key="i"
                                        v-if="item.NAME"
                                        :label="item.NAME"
                                        :value="item.NAME"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="会员标签：" style="max-width:500px;">
                                <el-select v-model="pageData.VipFlag" placeholder="请选择">
                                    <el-option label value>全部</el-option>
                                    <el-option
                                        v-for="(item,i) in flagList"
                                        :key="i"
                                        v-if="i>0"
                                        :label="item.VIPFLAG"
                                        :value="item.VIPFLAG"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="店铺：" style="max-width:500px;">
                                <el-select v-model="pageData.ShopId" placeholder="请选择">
                                    <el-option label value>全部</el-option>
                                    <el-option
                                        v-for="(item,i) in shopList"
                                        :key="i"
                                        :label="item.NAME"
                                        :value="item.ID"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="isFilter = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="getNewData" :loading="loading">确定</el-button>
                    </div>
                    <el-button type="default" icon="icon-filter" slot="reference">&nbsp;&nbsp;筛选会员</el-button>
                </el-popover>
            </el-button-group>
        </div>

        <!--列表-->
        <el-table
            border size='small'
            :data="pagelist"
            v-loading="loading"
            @selection-change="handleSelectionChange"
            height="500"
            header-row-class-name="bg-theme text-white"
            style="width: 100%"
        >
            <el-table-column type="selection" width="36" fixed="left"></el-table-column>
            <el-table-column prop="NAME" label="姓名" width="120" sortable></el-table-column>
            <el-table-column prop="CODE" label="卡号" width="130"></el-table-column>
            <el-table-column prop="SEX" label="性别" width="100" :formatter="formatSex"></el-table-column>
            <el-table-column prop="MOBILENO" label="手机号码" width="120"></el-table-column>
            <el-table-column prop="LEVELNAME" label="等级"></el-table-column>
            <el-table-column prop="VIPFLAG" label="标签"></el-table-column>
            <el-table-column prop='SHAREVIPNAME' label="推荐人"></el-table-column>
            <el-table-column prop="SHOPNAME" label="所属店铺"></el-table-column>
            <el-table-column prop="INTEGRAL" label="积分"></el-table-column>
            <el-table-column prop="MONEY" label="余额"></el-table-column>
            <!-- <el-table-column prop="GIFTMONEY" label="赠送金额"></el-table-column> -->
            <el-table-column prop="CALCOUNT" label="剩余次卡"></el-table-column>
            <el-table-column prop="OWEMONEY" label="欠款"></el-table-column>
            <el-table-column prop="STATUS" label="状态" :formatter="formatStatus"></el-table-column>
            <el-table-column label="操作" width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button size="small" @click="handleDel(scope.$index, scope.row)">编辑</el-button> -->
                    <div class="hide">{{scope.row}}</div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div v-show="pagelist.length>0" class="m-top-sm clearfix elpagination">
            <el-pagination
                @size-change="handlePageChange"
                @current-change="handlePageChange"
                :current-page.sync="pagination.PN"
                :page-size="pagination.PageSize"
                layout="prev, pager, next, jumper"
                :total="pagination.TotalNumber"
                class="text-center"
            ></el-pagination>
            <div class="text-center clearfix">
                <span class="inline-block">共{{pagination.TotalNumber}}条，每页{{pagination.PageSize}}条</span>
            </div>
        </div>
        <!-- item -->
        <el-dialog title="会员详情" :visible.sync="showItem" width="770px" style="max-width:100%;">
            5555
            <div style="width: 100%; float:left;">
               <div style="width: 70%; float:left">
                  123456
               </div>
               <div style="width: 30%; float:left">
                  <el-button type="primary" size="small">修改密码</el-button>
                  <el-button type="primary" size="small">删除</el-button>
               </div>
            </div>


            <item-page @closeModal="showItem=false" :pageState="showItem"></item-page>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
let _ = require("lodash");
export default {
    mixins: [MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
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
            exportLoading: false
        };
    },
    computed: {
        ...mapGetters({
            dataList: "memberList",
            dataListState: "memberListState",
            dataState: "memberState",
            reportLossState: "reportLossState",
            exportMemberState: "exportMemberState",
            memberLevelList: "memberLevelList",
            flagList: "memberFlagList",
            importState: "importMemberState",
            memberItemInfo: "memberItemInfo",
            shopList: "shopList"
        })
    },
    watch: {
        dataListState(data) {
            this.loading = false;
            this.isFilter = false;
            this.pagelist = [...this.dataList];
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                }
            }
        },
        searchText() {
            this.searchfun();
        },
        reportLossState(data) {
            if (data.success) {
                this.reportLoss.num++;
                if (this.multipleSelection.length == this.reportLoss.num) {
                    this.$message({
                        message: "操作成功，已选会员已挂失/取消挂失",
                        type: "success"
                    });
                    this.reportLoss.loading = false;
                    this.getNewData();
                }
            } else {
                this.$message({ message: data.message, type: "error" })
            }
        },
        exportMemberState(data) {
            this.exportLoading = false;
            if (data.success) {
                this.exportExcel(data.data.PageData)
            }
        },
        dataState(data) {
            if (data.success && !this.loading && !this.showItem) {
                this.showItem = true
            }
            if (data.success && data.data.obj && this.showItem) {
                for (let i = 0; i < this.pagelist.length; i++) {
                    if (this.pagelist[i].ID == this.memberItemInfo.ID) {
                        this.pagelist[i] = Object.assign(
                            {},
                            this.pagelist[i],
                            this.memberItemInfo
                        );
                        break;
                    }
                }
                this.$store.state.member.memberList = [...this.pagelist];
                this.pagelist = [...this.pagelist];
            }
        },
        outputsState(data) {
            // 导入 mixins
            if (data.state) {
                this.importExcel(this.outputs)
            } else {
                this.$message({ showClose: true, message: "数据为空", type: "error" })
            }
        },
        importState(data) {
            if (data.success) {
                this.$message("导入成功")
                this.getNewData();
            } else {
                this.$message(data.message)
            }
        }
    },
    methods: {
        handleDel(row){
            console.log(row)

        },
        formatSex: function(row, column) {
            //性别显示转换
            return row.SEX == 0 ? "男" : row.SEX == 1 ? "女" : "未知";
        },
        formatStatus: function(row, column) {
            //-1=全部,0=正常，2=挂失
            return row.STATUS == 0 ? "正常" : row.STATUS == 2 ? "挂失" : "未知";
        },
        getNewData() {
            this.$store.dispatch("getMemberList", this.pageData).then(() => {
                this.loading = true;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(idx, item) {
            // console.log(this.memberItemInfo);
            if (
                Object.keys(this.memberItemInfo).length > 0 &&
                this.memberItemInfo.ID != item.ID
            ) {
                this.$store.dispatch("clearMember", 3);
                this.$store.dispatch("clearMember", 4);
                this.$store.dispatch("clearMember", 5);
                this.$store.dispatch("clearMember", 6);
            }
            this.$store.dispatch("getMemberItem", item).then(() => {
                this.$store.dispatch("getMemberItem2", item);
            });
        },
        handlePageChange: function(currentPage) {
            if (this.pageData.PN == currentPage || this.loading) {
                return;
            }
            this.pageData.PN = parseInt(currentPage);
            this.getNewData();
        },
        searchfun: _.debounce(function() {
            this.searchfun2(0);
        }, 1000),
        searchfun2(type) {
            if (type == 1 && !this.searchText) {
                return;
            }
            this.pageData.Filter = this.searchText;
            this.pageData.PN = 1
            this.getNewData();
        },
        reportLossfun() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: "请选择会员",
                    type: "warning"
                });
                return;
            }
            this.reportLoss.num = 0;
            this.$confirm("您确认挂失/取消挂失已选会员?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        let allsetdate = {
                            id: this.multipleSelection[i].ID,
                            Type: this.multipleSelection[i].STATUS == 0 ? 0 : 1
                        };
                        this.$store.dispatch("setReportLoss", allsetdate);
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        dealStringnull(str) {
            if (str == undefined) {
                return "";
            } else {
                return str.toString().replace(/\s*/g, "");
            }
        },
        ExportMemberData() {
            // 获取导出数据
            if (this.multipleSelection.length > 0) {
                this.exportExcel(this.multipleSelection);
                return;
            }
            this.$store
                .dispatch("getExportMemberData", {
                    Name: this.searchText,
                    VipFlag: this.pageData.VipFlag,
                    LevelName: this.pageData.LevelName
                })
                .then(() => {
                    this.exportLoading = true;
                });
        },
        exportExcel(arr) {
            // 导出到excel
            var list = [...arr];
            for (var i = 0; i < list.length; i++) {
                list[i].SEX = this.formatSex(list[i]);
                list[i].STATUS = this.formatStatus(list[i]);
                list[i].CREATEDATE = this.filterTime(
                    new Date(list[i].CREATEDATE)
                );
                list[i].INVALIDDATE = this.filterTime(
                    new Date(list[i].INVALIDDATE)
                );
                list[i].LASTTIME = this.filterTime(new Date(list[i].LASTTIME));
                list[i].BIRTHDATE =
                    list[i].BIRTHDATE > 0 && list[i].BIRTHDATE
                        ? this.filterTime(new Date(list[i].BIRTHDATE))
                        : "";
            }
            var head = [
                "名称",
                "卡号",
                "性别",
                "生日",
                "手机号",
                "余额",
                "等级",
                "标签",
                "积分",
                "次卡",
                "地址",
                "店铺",
                "创建日期",
                "有效日期",
                "最后登录日期",
                "状态",
                "备注"
            ];
            var val = [
                "NAME",
                "CODE",
                "SEX",
                "BIRTHDATE",
                "MOBILENO",
                "MONEY",
                "LEVELNAME",
                "VIPFLAG",
                "INTEGRAL",
                "PAYCOUNT",
                "ADDRESS",
                "SHOPNAME",
                "CREATEDATE",
                "INVALIDDATE",
                "LASTTIME",
                "STATUS",
                "REMARK"
            ];
            var title = "会员导出" + this.getNowDateTime();
            this.export2Excel(head, val, list, title);
        },
        importExcel(arr) {
            // 导入数据
            let newData = [];
            let that = this;
            for (let i = 1; i < arr.length; i++) {
                let strCode;
                for (var index in arr[i]) {
                    let strlen = index.replace(/\s*/g, "").length;
                    if (strlen > 40) {
                        strCode = arr[i][index];
                    }
                }
                let returnBirthDate;
                if (arr[i].__EMPTY_3 == undefined) {
                    returnBirthDate = 0;
                } else {
                    returnBirthDate = new Date(
                        arr[i].__EMPTY_3
                            .replace(/\s*/g, "")
                            .split(".")
                            .join("-")
                    ).getTime();
                }
                let item = {
                    Code: strCode.toString().replace(/\s*/g, ""),
                    Name: that.dealStringnull(arr[i].__EMPTY),
                    Sex: that.dealStringnull(arr[i].__EMPTY_1),
                    MobileNo:
                        arr[i].__EMPTY_2 == undefined
                            ? ""
                            : Number(arr[i].__EMPTY_2),
                    BirthDate: returnBirthDate,
                    DiscountTypeName: that.dealStringnull(arr[i].__EMPTY_4),
                    VipFlag: that.dealStringnull(arr[i].__EMPTY_5),
                    QQ: that.dealStringnull(arr[i].__EMPTY_6),
                    Wechat: that.dealStringnull(arr[i].__EMPTY_7),
                    DepositMoney:
                        arr[i].__EMPTY_8 == undefined ? "" : arr[i].__EMPTY_8,
                    Address: that.dealStringnull(arr[i].__EMPTY_9),
                    Remark: that.dealStringnull(arr[i].__EMPTY_10),
                    Money:
                        arr[i].__EMPTY_11 == undefined ? "" : arr[i].__EMPTY_11,
                    Integral:
                        arr[i].__EMPTY_12 == undefined ? "" : arr[i].__EMPTY_12
                };
                newData.push(item);
            }
            // console.log(newData);
            this.$store.dispatch("getImportMemberData", newData).then(() => {
                // this.importLoading = true;
            });
        }
    },
    mounted() {
        this.pagination = {
            TotalNumber: this.dataListState.paying.TotalNumber,
            PageNumber: this.dataListState.paying.PageNumber,
            PageSize: this.dataListState.paying.PageSize,
            PN: this.dataListState.paying.PN
        };
        this.pagelist = [...this.dataList];
        if (this.shopList.length == 0) {
            this.$store.dispatch("getShopList", {});
        }
    },
    components: {
        addNewMember: () => import("@/components/member/add"),
        itemPage: () => import("./item")
    },
    beforeCreate() {
        let list = this.$store.state.member.memberList;
        let list2 = this.$store.state.member.memberLevelList;
        let list3 = this.$store.state.member.memberFlagList;
        // if (list.length == 0) {
            this.$store.dispatch("getMemberList", {PN:1});
        // }
        if (list2.length == 0) {
            this.$store.dispatch("getMemberLevel");
        }
        if (list3.length == 0) {
            this.$store.dispatch("getMemberFlag");
        }
    }
};
</script>
<style scoped>

</style>
