<template>
    <div v-loading="loading">
        <div class="m-bottom-md">
            <el-button-group class="m-right-sm">
                <el-button
                    type="default"
                    icon="el-icon-plus"
                    @click="showAddNew=true;dealType='add'"
                >新增商品</el-button>
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
                    @click="ExportGoodsData"
                    :loading="exportLoading"
                >批量导出</el-button>
            </el-button-group>
            <el-button-group>
                <el-button type="default" icon="el-icon-plus">
                    <a href="static/images/商品导入模板.xls" class="producttemplate">下载模板</a>
                </el-button>
            </el-button-group>
            <!-- add -->
            <el-dialog
                v-if="showAddNew&&dealType=='add'"
                title="新增普通商品/服务项目"
                :visible.sync="showAddNew"
                width="770px"
            >
                <el-tabs tab-position="top" type="border-card">
                    <el-tab-pane label="普通商品">
                        <add-new-goods
                            @closeModal="showAddNew=false"
                            @resetList="showAddNew=false;getNewData();"
                            :dataType="{value:1,dealState:'add'}"
                        ></add-new-goods>
                    </el-tab-pane>
                    <el-tab-pane label="服务项目">
                        <add-new-goods
                            @closeModal="showAddNew=false"
                            @resetList="showAddNew=false;getNewData();"
                            :dataType="{value:2,dealState:'add'}"
                        ></add-new-goods>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>
            <!-- search -->
            <el-input
                type="default"
                v-model="searchText"
                placeholder="商品编码/名称"
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
            <!-- 筛选商品 -->
            <el-button-group class="pull-right m-right-sm">
                <el-popover placement="bottom" v-model="isFilter">
                    <div>
                        <el-form label-width="100px">
                            <el-form-item label="商品状态：">
                                <el-radio-group v-model="pageData.Status">
                                    <el-radio-button size="mini" label="-1">全部</el-radio-button>
                                    <el-radio-button size="mini" label="0">停用</el-radio-button>
                                    <el-radio-button size="mini" label="1">启用</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="商品类型：">
                                <el-radio-group v-model="pageData.Mode">
                                    <el-radio-button size="mini" label="-1">全部</el-radio-button>
                                    <el-radio-button size="mini" label="0">商品</el-radio-button>
                                    <el-radio-button size="mini" label="1">服务</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="商品类别：">
                                <el-select v-model="pageData.TypeID" placeholder="请选择">
                                    <el-option label="请选择" value></el-option>
                                    <el-option
                                        v-for="item in categoryList"
                                        :key="item.ID"
                                        :label="item.NAME"
                                        :value="item.ID"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="排序条件：">
                                <el-radio-group v-model="pageData.DescType">
                                    <el-radio-button size="mini" label="0">商品排序</el-radio-button>
                                    <el-radio-button size="mini" label="1">销售量</el-radio-button>
                                    <el-radio-button size="mini" label="2">库存预警</el-radio-button>
                                    <el-radio-button size="mini" label="3">库存</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="isFilter = false">取消</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="getNewData"
                            :loading="loading"
                        >确定</el-button>
                    </div>
                    <el-button type="default" icon="icon-filter" slot="reference">&nbsp;&nbsp;筛选商品</el-button>
                </el-popover>
            </el-button-group>
        </div>
        <!--列表-->
        <el-table
            border
            size="small"
            :data="pagelist"
            @selection-change="handleSelectionChange"
            height="500"
            header-row-class-name="bg-theme text-white"
            style="width: 100%;"
        >
            <el-table-column type="selection" width="36" fixed="left"></el-table-column>
            <el-table-column prop="NAME" label="商品名称" width="120" sortable></el-table-column>
            <el-table-column prop="CODE" label="商品编码" width="130"></el-table-column>
            <el-table-column prop="TYPENAME" label="商品分类" width="80"></el-table-column>
            <el-table-column prop="PRICE" label="商品价格" width="80"></el-table-column>
            <el-table-column prop="PURPRICE" label="商品成本" :formatter="formatPurprice"></el-table-column>
            <el-table-column prop="STOCKQTY" label="库存"></el-table-column>
            <el-table-column prop="STATUS" label="状态" :formatter="formatStatus"></el-table-column>
            <el-table-column prop="GOODSMODE" label="类型" :formatter="formatMode"></el-table-column>
            <el-table-column label="操作" :width="ispurview?200:90" fixed="right">
                <template slot-scope="scope">
                    <el-button-group v-if="ispurview&&scope.row.GOODSMODE==0">
                        <el-button size="small" @click="handleInventory(scope.row,-1)">出库</el-button>
                        <el-button size="small" @click="handleInventory(scope.row,1)">入库</el-button>
                        <el-button size="small" @click="handleInventory(scope.row,0)">记录</el-button>
                    </el-button-group>
                    <el-button-group>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
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

        <!-- 商品详情 -->
        <el-dialog
            title="商品详情"
            :visible.sync="showItem"
            width="70%"
            top="2%"
            style="max-width:100%;"
        >
            <add-new-goods
                v-if="showItem"
                @closeModal="showItem=false"
                @resetList="showItem=false;getNewData();"
                :dataType="{value:parseInt(goodsMode)+1,dealState:'edit'}"
            ></add-new-goods>
        </el-dialog>
        <!-- 商品出库入库 -->
        <el-dialog :title="'商品'+Inventory.title" :visible.sync="Inventory.isShow" width="400px">
            <el-form ref="form" :model="Inventory.data" :rules="Inventory.rules" label-width="80px">
                <el-form-item label="商品名称">
                    <div class="text-red paddingLR-sm">{{Inventory.item.NAME}}</div>
                </el-form-item>
                <el-form-item label="当前库存">
                    <div class="text-red paddingLR-sm">{{Inventory.item.STOCKQTY}}</div>
                </el-form-item>
                <el-form-item :label="Inventory.title+'数量'" prop="QTY">
                    <el-input v-model.number="Inventory.data.QTY" type="number" placeholder="请输入数量"></el-input>
                </el-form-item>
                <el-form-item :label="Inventory.title+'类型'">
                    <el-select
                        v-model="Inventory.data.BillType"
                        placeholder="请选择类型"
                        class="full-width"
                    >
                        <el-option label="进货" value="1"></el-option>
                        <el-option label="退货" value="2"></el-option>
                        <el-option label="丢损" value="3"></el-option>
                        <el-option label="调整" value="4"></el-option>
                        <el-option label="调拨" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="Inventory.data.Remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="setGoodsMoving"
                        :loading="Inventory.loading"
                    >保存</el-button>
                    <el-button @click="Inventory.isShow=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 记录 -->
        <el-dialog
            title="商品记录"
            :visible.sync="Record.isShow"
            width="680px"
            top="2%"
            style="max-width:100%;"
        >
            <recordPage :dataType="Record" @closeModal="Record.isShow=false"></recordPage>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXNINS_EXPORT from "@/mixins/exportData.js";
import { isPurViewFun } from "@/util/com/common.js";
let _ = require("lodash");
export default {
    mixins: [MIXNINS_EXPORT.TOEXCEL, MIXNINS_EXPORT.TODATA],
    data() {
        var ISPURVIEW = isPurViewFun(601050102);
        return {
            ispurview: ISPURVIEW,
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
                Mode: -1,
                TypeID: "", //商品类别ID
                DescType: 0
            },
            multipleSelection: [],
            showAddNew: false,
            showItem: false,
            exportLoading: false,
            dealType: "add",
            goodsMode: 0,
            Inventory: {
                title: "",
                data: {
                    QTY: 0,
                    Remark: "",
                    id: 0,
                    BillType: "1", // 1=进货，2=退货，3=丢损 4=调整 5=调拨
                    movemode: -1
                },
                item: { NAME: "", STOCKQTY: 0 },
                rules: {
                    QTY: [
                        {
                            required: true,
                            validator: function(rule, value, callback) {
                                if (!Number.isInteger(value)) {
                                    callback(new Error("请输入整数数值"));
                                } else {
                                    callback();
                                }
                            },
                            trigger: "blur"
                        }
                    ]
                },
                loading: false,
                isShow: false
            },
            Record: {
                item: { NAME: "", STOCKQTY: 0 },
                list: [],
                isShow: false,
                goodsImg: ""
            }
        };
    },
    computed: {
        ...mapGetters({
            dataList: "goodsList",
            dataListState: "goodsListState",
            dataState: "goodsState",
            exportGoodsState: "exportGoodsState",
            dataItem: "goodsItem",
            goodsMovingState: "goodsMovingState",
            GIList: "goodsInventoryList",
            GIListState: "goodsInventoryListState",
            categoryList: "categoryList",
            importState: "importGoodsState",
            dgoodsdeleteState: "goodsdeleteState"
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
                };
            }
        },
        searchText() {
            this.searchfun();
        },
        exportGoodsState(data) {
            this.exportLoading = false;
            if (data.success) {
                this.exportExcel(data.data.PageData);
            }
        },
        dataState(data) {
            if (data.success && this.loading && this.dealType == "edit") {
                this.showItem = true;
            }
            this.loading = false;
        },
        outputsState(data) {
            // 导入 mixins
            if (data.state) {
                this.importExcel(this.outputs);
            } else {
                this.$message({
                    showClose: true,
                    message: "数据为空",
                    type: "error"
                });
            }
        },
        goodsMovingState(data) {
            this.$message({
                showClose: true,
                message: data.message,
                type: data.success ? "success" : "error"
            });
            if (data.success) {
                this.Inventory.loading = false;
                this.Inventory.isShow = false;
                this.Inventory.title = "";
                this.Inventory.data = {
                    QTY: 0,
                    Remark: "",
                    id: 0,
                    BillType: "1",
                    movemode: -1
                };
                this.Inventory.item = { NAME: "", STOCKQTY: 0 };
                if (this.$refs.form) {
                    this.$refs.form.resetFields();
                }
                this.getNewData();
            }
        },
        GIListState(data) {
            this.loading = false;
            if (data.success) {
                this.Record = Object.assign({}, this.Record, {
                    list: [...this.GIList],
                    isShow: true
                });
            } else {
                this.$message.error(data.message);
            }
        },
        importState(data) {
            if (data.success) {
                this.$message("导入成功");
                this.$store.dispatch("getGoodsList", {
                    Status: -1,
                    Mode: -1,
                    Filter: "",
                    PN: 1
                });
            } else {
                this.$message(data.message);
            }
        },
        dgoodsdeleteState(data) {
            this.loading = false;
            if (data.success) {
                this.getNewData();
            }
        }
    },
    methods: {
        formatPurprice: function(row, column) {
            return this.isPurViewFun(210040601) ? row.PURPRICE : "******";
        },
        formatStatus: function(row, column) {
            // -1=all  1=启用 0=停用
            return row.STATUS == 0 ? "停用" : row.STATUS == 1 ? "启用" : "未知";
        },
        formatMode: function(row, column) {
            // 0=商品   1=服务项目
            return row.GOODSMODE == 0 ? "商品" : "服务项目";
        },
        getNewData() {
            this.$store.dispatch("getGoodsList", this.pageData).then(() => {
                this.loading = true;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleEdit(idx, item) {
            this.$store.dispatch("getGoodsItem", item).then(() => {
                this.goodsMode = parseInt(item.GOODSMODE);
                this.dealType = "edit";
                this.loading = true;
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
                        .dispatch("getGoodsdelete", { ID: item.ID })
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
        },
        handleInventory(item, type) {
            if (type == 0) {
                this.$store
                    .dispatch("getGoodsInventory", { ID: item.ID, PN: 1 })
                    .then(() => {
                        this.Record.item = Object.assign({}, item);
                        this.loading = true;
                    });
            } else {
                this.Inventory.data.id = item.ID;
                this.Inventory.data.movemode = type; // -1=出 1=进
                this.Inventory.title = type == -1 ? "出库" : "入库";
                this.Inventory.isShow = true;
                this.Inventory.item = Object.assign({}, item);
            }
        },
        setGoodsMoving() {
            // 商品出库入库
            this.$store.dispatch("setGoodsMoving", this.Inventory.data);
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
                this.$message.error("请输入查询内容");
                return;
            }
            this.pageData.Filter = this.searchText;
            this.getNewData();
        },
        ExportGoodsData() {
            // 获取导出数据
            if (this.multipleSelection.length > 0) {
                this.exportExcel(this.multipleSelection);
                return;
            }
            this.$store
                .dispatch("getExportGoodsData", {
                    FilterStr: this.searchText,
                    Mode: this.pageData.Mode,
                    TypeID: this.pageData.TypeID,
                    Status: this.pageData.Status
                })
                .then(() => {
                    this.exportLoading = true;
                });
        },
        exportExcel(arr) {
            // 导出到excel
            var list = [...arr];
            for (var i = 0; i < list.length; i++) {
                list[i].GOODSMODE = this.formatMode(list[i].GOODSMODE);
            }
            // GOODSMODE=> 0=商品   1=服务项目
            var head = [
                "商品名称",
                "商品编码",
                "商品分类",
                "商品价格",
                "商品成本",
                "库存",
                "单位",
                "状态",
                "类型",
                "备注"
            ];
            var val = [
                "NAME",
                "CODE",
                "TYPENAME",
                "PRICE",
                "PURPRICE",
                "STOCKQTY",
                "UNITNAME",
                "STATUS",
                "GOODSMODE",
                "REMARK"
            ];
            var title = "商品导出" + this.getNowDateTime();
            this.export2Excel(head, val, list, title);
        },
        importExcel(arr) {
            // 导入数据
            let newData = [];
            for (let i = 1; i < arr.length; i++) {
                let strCode;
                for (var index in arr[i]) {
                    let strlen = index.replace(/\s*/g, "").length;
                    if (strlen > 40) {
                        strCode = arr[i][index];
                    }
                }

                let item = {
                    Code: strCode,
                    Name: arr[i].__EMPTY == undefined ? "" : arr[i].__EMPTY,
                    GoodsMode:
                        arr[i].__EMPTY_1 == undefined ||
                        arr[i].__EMPTY_1 == "商品" ||
                        arr[i].__EMPTY_1 == 0
                            ? 0
                            : 1,
                    TypeName:
                        arr[i].__EMPTY_2 == undefined ? "" : arr[i].__EMPTY_2,
                    Specs: "",
                    Remark:
                        arr[i].__EMPTY_4 == undefined ? "" : arr[i].__EMPTY_4,
                    UnitName:
                        arr[i].__EMPTY_5 == undefined ? "" : arr[i].__EMPTY_5,
                    Price:
                        arr[i].__EMPTY_6 == undefined ? "" : arr[i].__EMPTY_6,
                    PurPrice:
                        arr[i].__EMPTY_7 == undefined ? "" : arr[i].__EMPTY_7,
                    StockQty:
                        arr[i].__EMPTY_8 == undefined ? "" : arr[i].__EMPTY_8
                };
                newData.push(item);
            }
            // console.log(newData); return;
            this.$store.dispatch("getImportGoodsData", newData).then(() => {
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
    },
    components: {
        addNewGoods: () => import("@/components/goods/add"),
        recordPage: () => import("@/components/goods/record"),
        itemPage: () => import("./item")
    },
    beforeCreate() {
        let list = this.$store.state.goods.goodsList;
        let arr = this.$store.state.category.categoryList;
        if (list.length == 0) {
            this.$store.dispatch("getGoodsList", {
                Status: -1,
                Mode: -1,
                Filter: ""
            });
        }
        if (arr.length == 0) {
            this.$store.dispatch("getCategoryList");
        }
    }
};
</script>
<style scoped>
</style>
