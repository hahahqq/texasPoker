<template>
    <div class="category">
        <div class="m-bottom-sm">
            <el-button size="small" @click="handleDeal({})" icon="el-icon-plus">新增</el-button>
            <div class="hide">{{dataList}}</div>
        </div>
        <!--列表-->
        <el-table
            border
            :data="dataList"
            v-loading="loading"
            height="500"
            header-row-class-name="bg-theme text-white"
        >
            <el-table-column prop="NAME" label="名称" width="120" sortable></el-table-column>
            <el-table-column prop="REMARK" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                            size="small"
                            @click="handleDeal(scope.row)"
                            icon="el-icon-edit"
                        >编辑</el-button>
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

        <!-- 分页 -->
        <div v-if="dataList.length>0" class="m-top-sm clearfix elpagination">
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
        <!-- add -->
        <el-dialog title="商品分类" :visible.sync="dialogVisible" width="400px">
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
        var checkNumber = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("不能为空"));
            }
            setTimeout(() => {
                if (value > 100 || value < 1) {
                    callback(new Error("请输入1~100内数值"));
                } else {
                    callback();
                }
            }, 500);
        };
        return {
            loading: false,
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
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
            dataList: "categoryList",
            dataListState: "categoryListState",
            dataState: "categoryState",
            dealState: "dealCategoryState"
        })
    },
    watch: {
        dataListState(data) {
            this.loading = false;
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                };
                this.SumBillCount = data.SumBillCount
                    ? parseInt(data.SumBillCount)
                    : 0;
                this.SumMoney = data.SumMoney ? parseInt(data.SumMoney) : 0;
            }
        },
        dealState(data) {
            if (data.success) {
                this.getNewData();
            } else {
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
            this.$store.dispatch("getCategoryList").then(() => {
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
        getCategoryItem() {},
        handleDeal(item) {
            if (this.$refs.form) this.$refs.form.resetFields();
            if (Object.keys(item).length > 0) {
                this.form = Object.assign({}, item, {
                    ID: item.ID,
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
                    _this.$store
                        .dispatch("dealCategoryItem", _this.form)
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
            console.log(item);
            this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store
                        .dispatch("delCategoryItem", {
                            index: index,
                            data: item
                        })
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
        }
    }
};
</script>
