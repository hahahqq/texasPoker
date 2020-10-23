
<template>
    <div v-loading="loading" class="relative">
        <!-- 选择套餐 -->
        <div class>
            <el-row :gutter="10">
                <el-col
                    :xs="24"
                    :sm="12"
                    :md="12"
                    :lg="12"
                    :xl="8"
                    v-for="(item,i) in dataList"
                    :key="i"
                >
                    <div class="relative border padding-sm m-bottom-sm pointer font-12"  @click="handleSubmit(item)">
 
                        <div class="font-14">
                            <span>{{item.NAME}}</span>
                            <span class="text-theme pull-right">&yen;{{item.PRICE}}</span>
                        </div>
                        <div class="text-muted paddingTB-xs" style="min-height:40px;">内容：{{item.LONGGOODSNAME}}</div>
                        <div class="text-muted">备注：{{item.REMARK}}</div>

                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 分页 -->
        <div v-show="dataList.length>0" class="m-top-sm clearfix elpagination">
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
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
    props: {
        itemData: {
            type: Object,
            default: {
                isShow: false,
                dataArr: []
            }
        }
    },
    data() {
        return {
            loading: false,
            pageData: {
                PN: 1,
                Status: 0, // -1=全部，0=启用，1=停用
                Filter: ""
            },
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
            dataState: "setmealrselectlistState",
            dataList: "setmealrselectList"
        })
    },
    watch: {
        itemData(data) {
            this.pageData.PN = 1;
            this.getNewData();
        },
        dataState(data) {
            this.loading = false;
            if (data.success) {
                this.pagination = {
                    TotalNumber: data.paying.TotalNumber,
                    PageNumber: data.paying.PageNumber,
                    PageSize: data.paying.PageSize,
                    PN: data.paying.PN
                };
            }
        }
    },
    methods: {
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
        handleSubmit(item) {
            console.log(item)
            this.$emit("resultArr", item);
        }
    },
    created() {
        this.pageData.PN = 1;
        this.getNewData();
    }
};
</script>
