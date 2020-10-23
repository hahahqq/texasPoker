<template>
    <div>
        <div class="m-bottom-md">
            <!-- add -->
            <el-button-group class="m-right-sm">
                <el-button
                    type="default"
                    icon="el-icon-plus"
                    @click="showAddNew=true; title='新增套餐'; dealState='add';"
                >新增套餐</el-button>
            </el-button-group>
            <span>状态：</span>
            <el-select
                v-model="pageData.Status"
                @change="getNewData()"
                placeholder="请选择状态"
            >
                <el-option label="全部" value="-1"></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="停用" value="1"></el-option>
            </el-select>

            <!-- search -->
            <el-input
                type="default"
                v-model="pageData.Filter"
                placeholder="套餐编码/名称"
                class="pull-right"
                style="width: 250px;"
            >
                <el-button slot="append" type="default" icon="el-icon-search" @click="getNewData()"></el-button>
            </el-input>
        </div>
        <!--列表-->
        <el-table
            border
            :data="taotandatalist"
            v-loading="loading"
            height="500"
            header-row-class-name="bg-theme text-white"
            style="width: 100%;"
        >
            <el-table-column type="selection" width="46" fixed="left"></el-table-column>
            <el-table-column prop="NAME" label="商品名称" width="200" sortable></el-table-column>
            <el-table-column prop="LONGGOODSNAME" label="套餐内容"></el-table-column>
            <el-table-column prop="VALIDDAY" label="有效天数" width="150"></el-table-column>
            <el-table-column prop="PRICE" label="价格" width="150"></el-table-column>
            <el-table-column prop="ISSTOP" label="状态" :formatter="formatState"></el-table-column>
            <el-table-column label="操作" fixed="right"  width="150">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <div v-show="taotandatalist.length>0" class="m-top-sm clearfix elpagination">
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
        <el-dialog v-if="showAddNew" :title="title" :visible.sync="showAddNew" width="770px">
            <add-new-goods
                @closeModal="showAddNew=false"
                @resetList="showAddNew=false;getNewData();"
                :dataType="dealState"
            ></add-new-goods>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
    data() {
        return {
            pageData: {
                PN: 1,
                Status: "-1", // -1=全部，0=启用，1=停用
                Filter: ""
            },
            title: "新增套餐",
            loading: false,
            showAddNew: false,
            dealState: "add",
            pagination: {
                TotalNumber: 0,
                PageNumber: 0,
                PageSize: 20,
                PN: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            setmealrselectlistState: "setmealrselectlistState",
            goodsstemaealgState: "goodsstemaealgState",
            taotandatalist: "setmealrselectList"
        })
    },
    watch: {
        setmealrselectlistState(data) {
            this.loading = false;
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                };
            }
        },
        goodsstemaealgState(data) {
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
        formatState: function(row, column) {
            return row.ISSTOP ? "停用" : "启用";
        },
        getNewData() {
            this.$store
                .dispatch("getsetmealrselectlistState", this.pageData)
                .then(() => {
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

        handleEdit(index, item) {
            this.dealState = "edit";
            this.title = "编辑套餐";
            this.showAddNew = true;
            let sendData = {
                ID: item.ID
            };
            this.$store
                .dispatch("getGoodssetmealgdetails", sendData)
                .then(() => {});
        },
        handleDel(index, item) {
            this.$confirm("此操作将永久删除该套餐, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store.dispatch("getGoodssetmealg", item).then(() => {
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

    components: {
        addNewGoods: () => import("@/components/goods/addsetmealg")
    },
    beforeCreate() {
        this.$store.dispatch("getsetmealrselectlistState", {}).then(() => {
            this.loading = false;
        });
    }
};
</script>
<style scoped>
</style>
