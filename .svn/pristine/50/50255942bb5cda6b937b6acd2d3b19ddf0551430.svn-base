<template>
    <div class="selgoods2" v-loading="loading" ref="selgoods2">
        <el-input
            placeholder="输入商品名称/编码"
            size="small"
            v-model.trim="formData.Filter"
            class="theinput m-bottom-sm"
            style="width: 370px;max-width:100%"
        >
            <template slot="append">
                <a
                    @click="handleSearch"
                    class="paddingLR-sm text-white pointer block paddingTB-xs"
                >查询</a>
            </template>
        </el-input>
        <el-tabs v-model="tabsValue" type="card" @tab-click="handleTabClick" class="m-bottom-sm-">
            <el-tab-pane
                v-for="cLitem in cList"
                :key="cLitem.ID"
                :label="cLitem.NAME"
                :name="cLitem.ID.toString()"
                class="col-flex flex-start"
            >
                <el-row
                    :gutter="10"
                    :style="{'overflow-x':'hidden','overflow-y':'auto','height':(height-50)+'px'}"
                    v-if="cgList.length>0"
                >
                    <el-col
                        :xs="24"
                        :sm="24"
                        :md="12"
                        :lg="6"
                        :xl="6"
                        v-for="(item,i) in cgList"
                        :key="i"
                        class="p-bottom-sm"
                    >
                        <a
                            @click="addOrderItem(item)"
                            class="border padding-sm block relative pointer"
                        >
                            <img
                                :src="imgUrl+item.ID + '.png'"
                                class="pull-left m-right-sm"
                                width="55"
                                height="55"
                                onerror="this.src='static/images/shopmore.png'"
                            >
                            <div class="block goodsName">{{item.NAME}}</div>
                            <div>
                                <span class="font-600 text-theme2">&yen;{{item.PRICE}}</span>
                                <span class="pull-right" v-if="item.GOODSMODE==0">
                                    <span>库</span>
                                    <span class="font-600 text-theme2">{{item.STOCKQTY}}</span>
                                </span>
                            </div>
                        </a>
                    </el-col>
                </el-row>
                <div v-if="cgList.length>0" class="text-right p-top-sm full-height">
                    <!-- paging -->
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="cgListState.paying.PN"
                        :page-size="cgListState.paying.PageSize"
                        layout="prev, pager, next, jumper"
                        background
                        :total="cgListState.paying.TotalNumber"
                    ></el-pagination>
                </div>
                <div v-else class="padding-md text-center text-muted">该分类没有商品</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
// 用于房台下单
import { mapState, mapGetters } from "vuex";
import { GOODS_IMGURL } from "@/util/define";
import MIXINS_ROOM from "@/mixins/room";
export default {
    props: ["activeRoomId"],
    mixins: [MIXINS_ROOM.ADD_GOODS],
    data() {
        return {
            height: 0,
            imgUrl: GOODS_IMGURL,
            loading: false,
            theOrderList: [],
            tabsValue: 0,
            formData: { Filter: "", TypeID: "", PN: 0, Mode: -1 },
            cList: []
        };
    },
    computed: {
        ...mapGetters({
            selroom: "selroom",
            categoryList: "categoryList",
            categoryListState: "categoryListState",
            cgList: "goodsList2",
            cgListState: "goodsListState2"
        })
    },
    watch: {
        categoryListState(data) {
            if (data.success) {
                this.defaultData();
            }
        },
        cgListState(data) {
            this.loading = false;
            if (data.success) {
                this.formData.PN = data.paying.PN;
                this.defaultData();
            }
        },
        selroom(data) {
            this.defaultData();
        }
    },
    methods: {
        getNewData() {
            this.$store.dispatch("getGoodsList2", this.formData).then(() => {
                this.loading = true;
            });
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            if (this.formData.PN != val) {
                this.formData.PN = val;
                this.getNewData();
            }
        },
        handleSearch() {
            this.tabsValue = "0";
            this.formData.TypeID = "";
            this.formData.PN = 1;

            this.getNewData();
        },
        handleTabClick(tab, event) {
            console.log(tab.name);
            if (parseInt(tab.name) > 0) {
                this.formData.Filter = "";
                this.formData.TypeID = tab.name;
            } else {
                this.formData.TypeID = "";
            }
            this.getNewData();
        },

        addOrderItem(item) {
            // 添加商品
            let arr = [...this.theOrderList],
                activeIndex = 0,
                dd = this.settheVipPrice(item, 0);

            for (let i = 0; i < arr.length; i++) {
                let sub = arr[i];
                if (sub.ROOMID == this.activeRoomId) {
                    if (!sub.List || sub.List.length == 0) sub.List = [];
                    sub.List.push(
                        Object.assign({ num: 1, empList: [] }, item, dd)
                    );
                    activeIndex = i;
                    break;
                }
            }
            this.theOrderList = [...arr];

            // console.log(this.theOrderList);
            this.$emit("resultFun", this.theOrderList);
        },

        defaultData() {
            this.theOrderList = [...this.selroom];
            this.cList = [{ NAME: "全部", ID: 0 }, ...this.categoryList];

            let aa = this.$refs.selgoods2.getBoundingClientRect().top;
            this.height = window.innerHeight - aa - 100;
        }
    },
    beforeCreate() {
        this.$store.dispatch("getGoodsList2", {
            Filter: "",
            TypeID: "",
            PN: 1,
            Mode: -1
        });
    },

    mounted() {
        if (this.categoryList.length == 0) {
            this.$store.dispatch("getCategoryList");
        }
        this.defaultData();
    }
};
</script>
<style scoped>
.goodsName {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 36px;
}
</style>
