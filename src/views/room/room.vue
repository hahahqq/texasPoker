<template>
    <div class="selroom font-12">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane
                name="tab"
                :style="{'height':(height-80) +'px'}"
                class="overflowX-hidden overflowY-scroll p-top-xs"
            >
                <div slot="label">
                    <a class="block" @click="handleClick">全部</a>
                </div>
                <div v-if="noData && dataList.length==0" class="padding-sm text-a9">暂无房台</div>
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-refresh"
                    @click="getNewData()"
                    class="pull-right absolute"
                    style="z-index:1;right:20px;top:0px"
                    circle
                ></el-button>

                <a
                    v-for="(item,i) in alltableTabs"
                    :key="i"
                    v-if="!item.ISSTOP && !item.DISTRICISSTOP"
                    class="m-right-sm m-bottom-sm pointer relative roomItem"
                    :class="item.ROOMID?'inline-block':'block'"
                >
                    <div
                        v-if="item.ROOMID"
                        @click="chooseRoom(-1,-1,item)"
                        class="border text-center"
                        :class="{'text-theme2':item.BILLID}"
                        style="width:130px;"
                    >
                        <div v-if="item.active" class="checkActive">
                            <i class="el-icon-success text-success"></i>
                        </div>
                        <div class="relative" :style="{'height':item.BILLID?'auto':'76px'}">
                            <div v-if="item.BILLID" class="text-left padding-xs">
                                <div class="m-bottom-xs">
                                    <span class="font-600">{{item.ROOMNAME}}</span>
                                    <span
                                        class="pull-right"
                                    >{{item.SERVICEMINUTE - item.NEWSERIVICETIME}}分钟</span>
                                </div>
                                <div class="actionRoom">{{item.LONGGOODSNAME}}</div>
                            </div>
                            <div
                                v-else
                                class="translateY-center block full-width paddingLR-xs"
                            >{{item.ROOMNAME}}</div>
                        </div>
                        <div
                            class="text-white padding-xs block"
                            :class="item.BILLID?'bg-theme2':'bg-theme3'"
                        >
                            <span v-text="item.BILLID?item.SERVICEMINUTE+'分钟':'空闲中'"></span>
                        </div>
                    </div>
                    <div v-else>{{item.DISTRICTNAME}}</div>
                </a>
            </el-tab-pane>
            <el-tab-pane
                v-for="(tabItem,tabIndex) in editableTabs"
                :key="tabIndex"
                :label="tabItem.title"
                :name="tabItem.name"
                :style="{'height':(height-80) +'px','overflow-y':'auto','overflow-x':'hidden'}"
                v-if="!tabItem.DISTRICISSTOP"
            >
                <a
                    v-for="(item,i) in tabItem.sub"
                    :key="i"
                    @click="chooseRoom(tabIndex,i,item)"
                    class="m-right-sm marginTB-sm border text-center inline-block pointer relative roomItem"
                    :class="{'text-theme2':item.BILLID}"
                    style="width:130px;"
                >
                    <div v-if="item.active" class="checkActive">
                        <i class="el-icon-success text-success"></i>
                    </div>
                    <div class="relative" :style="{'height':item.BILLID?'auto':'76px'}">
                        <div v-if="item.BILLID" class="text-left padding-xs">
                            <div class="m-bottom-xs">
                                <span class="font-600">{{item.ROOMNAME}}</span>
                                <span
                                    class="pull-right"
                                >{{item.SERVICEMINUTE - item.NEWSERIVICETIME}}分钟</span>
                            </div>
                            <div class="actionRoom">{{item.LONGGOODSNAME}}</div>
                        </div>
                        <div
                            v-else
                            class="translateY-center block full-width paddingLR-xs"
                        >{{item.ROOMNAME}}</div>
                    </div>
                    <div
                        class="text-white padding-xs block"
                        :class="item.BILLID?'bg-theme2':'bg-theme3'"
                    >
                        <span v-text="item.BILLID?item.SERVICEMINUTE+'分钟':'空闲中'"></span>
                    </div>
                </a>
            </el-tab-pane>
        </el-tabs>

        <!-- 订单详情 -->
        <el-dialog
            v-if="showItem"
            :title="'房台：'+theOrderItem2.ROOMNAME"
            :visible.sync="showItem"
            width="500"
        >
            <editPage @closeModal="resetData" :theData="theOrderItem2"></editPage>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import img from "@/assets/room.png";
import MIXINS_ROOM from "@/mixins/room";
export default {
    props: {
        height: {
            type: Number,
            default: 0
        }
    },
    mixins: [MIXINS_ROOM.DEAL_ORDER],
    data() {
        return {
            img: img,
            searchText: "",
            activeItem: {},
            activeName: "tab",
            alltableTabs: [],
            editableTabs: [],
            activeRoom: [],
            noData: false,
            loading: false,
            showItem: false,
            theOrderItem: {},
            theOrderItem2: {},
            time: null
        };
    },
    computed: {
        ...mapGetters({
            dataList: "roomList", // 注意 getRoomList
            dataListState: "roomListState",
            dataItem: "roomOrderItem",
            selroom: "selroom"
        })
    },
    watch: {
        dataListState(data) { 
            if (data.success && this.loading) {
                if (this.dataList.length > 0) this.tabsData();
                this.noData = this.dataList.length > 0 ? false : true;
            }
            this.loading = false;
        },
        dataItem(data) {
            if (data.success && this.loading) {
                // this.showItem = true;
                this.theOrderItem = Object.assign({}, data.data);
                this.dealselRoomData(data.data, this.theOrderItem2);// 单据详情数据处理
                this.$emit("returnData", this.theOrderItem);
            }
            this.loading = false;
        },
        selroom(arr) {
            if (arr.length == 0) {
                this.resetActiveItem();
            }
        }
    },
    methods: {
        getNewData() {
            // Status: 0=全部，1=空闲房台
            this.$store.dispatch("getRoomList",{Status:0}).then(() => {
            // this.$store.dispatch("getRoomList2").then(() => {
                this.loading = true;
                this.$store.dispatch("selectingRoom", []);
                console.log("reset room list");
            });
        },
        chooseRoom(tabIndex, i, item) {
            if (item.BILLID) {
                this.theOrderItem2 = Object.assign({}, item);
                this.$store
                    .dispatch("getRoomOrderItem", {
                        RoomId: "",
                        rid: item.ROOMID,
                        BillId: item.BILLID
                    })
                    .then(() => {
                        this.loading = true;
                    });
                return;
            }
            let index = -1;
            if (this.activeRoom.length > 0) {
                index = this.activeRoom.findIndex(obj =>
                    Object.is(parseFloat(item.ROOMID), parseFloat(obj.ROOMID))
                );
            }
            if (index > -1) {
                this.activeRoom.splice(index, 1);
            } else {
                this.activeRoom.push(Object.assign({}, item));
            }
            this.$store.dispatch("selectingRoom", this.activeRoom);
            this.toActiveItem();
        },
        handleClick(tab, event) {
            if (this.dataList.length == 0) {
                this.getNewData();
            }
        },
        toActiveItem() {
            let arr = [...this.alltableTabs],
                arr2 = [...this.editableTabs],
                tabIdx = 0,
                tsIdx = 0,
                subIdx = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].ROOMID) {
                    subIdx = i - tsIdx - 1;
                    arr[i].active = false;
                    arr2[tabIdx - 1].sub[subIdx].active = false;
                    this.activeRoom.forEach(aItem => {
                        if (arr[i].ROOMID == aItem.ROOMID) {
                            arr[i].active = true;
                            arr2[tabIdx - 1].sub[subIdx].active = true;
                        }
                    });
                } else {
                    tabIdx++;
                    tsIdx = i;
                }
            }

            this.alltableTabs = [...arr];
            this.editableTabs = [...arr2];
        },
        resetActiveItem() {
            for (let i = 0; i < this.alltableTabs.length; i++) {
                if (this.alltableTabs[i].ROOMID) {
                    this.alltableTabs[i].active = false;
                }
            }
            this.alltableTabs = [...this.alltableTabs]
            for (let i = 0; i < this.editableTabs.length; i++) {
                for (let j = 0; j < this.editableTabs[i].sub.length; j++) {
                    this.editableTabs[i].sub[j].active = false;
                }
            }
            this.activeRoom = [];
        },
        tabsData() {
            let arr = [...this.dataList],
                newArr = [],
                index = -1;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].ROOMID) {
                    let isStop = newArr[index].DISTRICISSTOP;
                    let dd = Object.assign({}, arr[i], { active: false,ISSTOP:isStop });
                    newArr[index].sub.push(dd);
                    arr[i] = Object.assign({}, arr[i], { active: false,ISSTOP:isStop });
                } else {
                    index++;
                    let item = Object.assign({}, arr[i], {
                        sub: [],
                        title: arr[i].DISTRICTNAME,
                        name: "tab" + index
                    });
                    newArr.push(item);
                }
            }
            this.editableTabs = [...newArr];
            this.alltableTabs = [...arr];
            console.log( this.alltableTabs)
            this.toActiveItem();
        },
        resetData: function(status) {
            if (status) {
                this.$store.dispatch("clearRoomAll", 1).then(() => {
                    this.getNewData();
                });
            }
            this.showItem = false;
        },
        defaultData() {
            if (this.selroom.length > 0) {
                this.activeRoom = [...this.selroom];
            } else {
                this.activeRoom = [];
            }
            if (this.dataList.length == 0) {
                this.getNewData();
            } else {
                this.loading = true;
                this.tabsData();
            }
        }
    },
    created() {
        this.defaultData();
    },
    components: {
        editPage: () => import("@/components/room/order/edit.vue")
    }
};
</script>
<style scoped>
.checkActive {
    position: absolute;
    right: -2px;
    top: -7px;
    font-size: 20px;
}
.actionRoom {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    height: 46px;
}
</style>
