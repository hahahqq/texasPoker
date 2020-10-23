<template>
    <div class="selmember2 relative">
        <el-input placeholder="输入会员手机号/卡号" size="small" v-model.trim="searchText" class="theinput">
            <template slot="append">
                <a
                    @click="handleSearch"
                    class="paddingLR-sm text-white pointer block paddingTB-xs"
                >选择</a>
            </template>
        </el-input>
        <div class="thepopover">
            <el-popover placement="bottom-end" :width="width" trigger="click" v-model="showList">
                <div
                    v-loading="loadingDiv"
                    class="infinite-list-wrapper overflowY-scroll overflowX-hidden p-right-sm"
                    :style="{height:height+'px'}"
                    :alt="pageList.length"
                >
                    <ul
                        class="list"
                        v-infinite-scroll="getNewData"
                        infinite-scroll-disabled="loadingDiv"
                        infinite-scroll-distance="10"
                    >
                        <li
                            v-for="(item,i) in pageList"
                            :key="i"
                            @click="activeItem(item)"
                            class="list-item block clearfix paddingTB-sm pointer border-bottom"
                        >
                            <img
                                :src="item.IMAGEURL?item.IMAGEURL:img"
                                class="pull-left p-right-xs"
                                style="width:44px;"
                            />
                            <div class="relative">
                                <span>{{item.NAME}}({{item.CODE}})</span>
                                <span class="pull-right text-theme">&yen;{{item.MONEY}}</span>
                            </div>
                            <div class="relative">
                                <span>{{item.MOBILENO}}</span>
                                <span class="pull-right">积分{{item.INTEGRAL}}</span>
                            </div>
                        </li>
                    </ul>
                    <div v-if="pageList.length>0" class="padding-sm text-center text-muted">
                        <span v-if="loading&&!noMore">加载中...</span>
                        <span v-if="noMore">没有更多了</span>
                    </div>
                    <div v-if="pageList.length==0&&!loading">暂无数据</div>
                </div>
                <el-button
                    slot="reference"
                    ref="clickPopover"
                    style="height:0px;padding:0;width:100%;"
                ></el-button>
            </el-popover>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/userdefault.png";
let _ = require("lodash");
export default {
    props: {
        isMLP: {
            // 是否使用 会员等级价
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                Filter: "",
                Status: 0,
                PN: 1
            },
            pageList: [],
            searchText: "",
            showList: false,
            loadingDiv: false,
            loading: false,
            noMore: false,
            img: img,
            width: 370,
            height: 200,
            vipData: {}
        };
    },
    computed: {
        ...mapGetters({
            dataList: "memberList2",
            dataListState: "memberListState2",
            selmember: "selmember",
            mLevelPriceListState: "mLevelPriceListState",
            mLevelPriceList: "mLevelPriceList"
        })
    },
    watch: {
        searchText(v) {
            this.formData.Filter = v;
            this.changeFilter();
        },
        dataListState(data) {
            if (this.loading && !this.noMore) {
                if (data.success && data.paying) {
                    if (data.paying.PN == 1) {
                        this.pageList = [];
                    }
                    this.pageList = [...this.pageList, ...this.dataList];
                    if (data.paying.TotalNumber == this.pageList.length) {
                        this.formData.PN = 1;
                        this.noMore = true;
                    } else {
                        this.formData.PN = data.paying.PN + 1;
                    }
                }
            }
            this.loading = false;
        },
        mLevelPriceListState(data) {
            if (this.loadingDiv) {
                if (data.success) {
                    this.closePopover();
                } else this.$message.error(data.message);
            }
            this.loadingDiv = false;
        }
    },
    methods: {
        getNewData() {
            this.$store.dispatch("getMemberList2", this.formData).then(() => {
                this.loading = true;
            });
        },
        handleSearch() {
            this.height = window.innerHeight - 200;
            this.formData.PN = 1;
            this.noMore = false;
            this.$refs.clickPopover.handleClick();
            this.showList = true;
            this.getNewData();
        },
        changeFilter: _.debounce(function() {
            if (!this.loading) {
                this.handleSearch();
            }
        }, 500),
        activeItem(item) {
            this.vipData = Object.assign({}, item);
            console.log(this.isMLP)
            if (this.isMLP) {
                this.$store
                    .dispatch("getMemberLevelPrice", {
                        LevelId: item.LEVELID
                    })
                    .then(() => {
                        this.loadingDiv = true;
                    });
            } else {
                this.closePopover();
            }
        },
        closePopover() {
            this.$refs.clickPopover.handleClick();
            this.showList = false;
            this.loadingDiv = false;
            let sendData = Object.assign(
                {
                    mLevelPriceList: this.mLevelPriceList
                },
                this.vipData
            );
            this.$store.dispatch("selectingMember", {
                isArr: false,
                data: sendData
            });
            this.$emit("activeItem", sendData);
        }
    },
    mounted() {
        this.noMore = false;
    }
};
</script>
<style scoped>
.selmember2 >>> .el-input-group__append {
    background-color: #fb789a;
    padding: 0;
}
.selmember2 .theinput {
    position: relative;
    z-index: 1;
}
.selmember2 .thepopover {
    margin-top: -20px;
    position: relative;
    z-index: -1;
}
</style>