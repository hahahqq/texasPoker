<template>
    <div>
        <!-- 营业概况->房台消费->详情 -->
        <div class="row-flex" style="height:26px;">
            <span class="inline-block align-self-center flex-grow-6">
                姓名:
                <span class="text-theme2">{{selmember.NAME}}</span>
            </span>
            <span class="inline-block align-self-center flex-grow-6">
                等级:
                <span class="text-theme2">{{selmember.LEVELNAME}}</span>
            </span>
            <span class="inline-block align-self-center flex-grow-6">
                余额:
                <span class="text-theme2">{{selmember.MONEY}}</span>
            </span>
            <span class="inline-block align-self-center flex-grow-6">
                积分:
                <span class="text-theme2">{{selmember.INTEGRAL}}</span>
            </span>
        </div>
        <div class="row-flex flex-items-center text-center goodsHead">
            <div class="full-width">品名</div>
            <div class="full-width">零售价</div>
            <div class="full-width">数量</div>
            <div class="full-width">折扣</div>
            <div class="full-width">实销价</div>
            <div class="full-width">小计</div>
        </div>
        <div class="text-center goodsList font-14">
            <div v-for="(sub,tabIndex) in theOrderList" :key="tabIndex">
                <div class="m-top-sm text-left font-14">
                    <span class="font-600">房台：{{sub.ROOMNAME}}</span>
                    <span
                        class="m-left-sm"
                    >总时长：{{dataItem.data.Obj.SERIVCETIME?parseFloat(dataItem.data.Obj.SERIVCETIME):0}}分钟</span>
                    <span class="m-left-sm">计时：{{sub.NEWSERIVICETIME}}分钟</span>
                </div>
                <div
                    v-for="(item,i) in sub.List"
                    :key="i"
                    class="marginTB-xs p-bottom-xs goodsItem"
                >
                    <div class="row-flex flex-items-center" style="color: black;">
                        <div class="full-width text-overflow-fag text-left">{{item.NAME}}</div>
                        <div class="full-width">{{item.PRICE}}</div>
                        <div class="full-width">{{item.num}}</div>
                        <div class="full-width">{{item.discount?item.discount:1}}</div>
                        <div
                            class="full-width"
                        >{{parseFloat(item.price * (item.discount>0?item.discount:1)).toFixed(2)}}</div>
                        <div
                            class="full-width"
                        >{{parseFloat(item.price * item.num * (item.discount?item.discount:1)).toFixed(2)}}</div>
                    </div>
                    <!-- emp -->
                    <div
                        v-if="item.empListLabel&&item.empListLabel.length>0"
                        class="text-left font-12 text-muted"
                        style="background-color: #f6f6f6;"
                    >
                        <span class="opacity-">&nbsp;&rArr;</span>
                        <span>业绩员工：</span>
                        <span
                            v-for="(emp,eidx) in item.empListLabel"
                            :key="eidx"
                            class="marginLR-xs"
                        >{{emp}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-right p-top-sm">
            <el-button type="default" @click="closeModal()">关闭</el-button>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_ROOM from "@/mixins/room";
export default {
    mixins: [MIXINS_ROOM.DEAL_ORDER],
    data() {
        return { theOrderList: [] };
    },
    computed: {
        ...mapGetters({
            dataList: "roomOrderList",
            dataItem: "roomOrderItem",
            selroomorder: "selroomorder",
            selroom: "selroom"
        })
    },
    watch: {
        dataItem(data) {
            if (data.success) {
                this.defaultData();
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeModal");
        },
        defaultData() {
            if (
                this.dataItem.success &&
                Object.keys(this.selroomorder).length > 0
            ) {
                this.dealselRoomData(this.dataItem.data, this.selroomorder); // 单据详情数据处理
                this.theOrderList = [...this.selroom];
            }
        }
    },
    mounted() {
        console.log(111);
        this.defaultData();
    }
};
</script>
<style <style scoped>
.goodsHead {
    background-color: #fed3de;
    height: 34px;
}
.goodsList {
    min-height: 200px;
}
</style>
