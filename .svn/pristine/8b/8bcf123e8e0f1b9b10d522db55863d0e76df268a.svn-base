<template>
  <div>
    <!-- 展示房台列表 -->
    <div :class="{'spaceBorder-right':dtype>1}">
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
      <div
        class="row-flex flex-items-center text-center"
        style="background-color:#FED3DE;height:34px;"
      >
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
              v-if="dtype>1"
              class="m-left-sm"
            >总时长：{{dataItem.data.Obj.SERIVCETIME?parseFloat(dataItem.data.Obj.SERIVCETIME):0}}分钟</span>
            <span v-if="dtype>1" class="m-left-sm">计时：{{sub.NEWSERIVICETIME}}分钟</span>
          </div>
          <div v-for="(item,i) in sub.List" :key="i" class="marginTB-xs p-bottom-xs goodsItem">
            <div class="row-flex flex-items-center" style="color: black;">
              <div class="full-width text-overflow-fag text-left">{{item.NAME}}</div>
              <div class="full-width">{{item.retailprice}}</div>
              <div class="full-width">{{item.num}}</div>
              <div class="full-width"><span v-text="(Object.keys(selmember).length>0&&item.VIPPRICE>0)?parseFloat(item.discount).toFixed(4):parseFloat(item.discount).toFixed(2)"></span></div>
              <div class="full-width">{{item.price|money}}</div>
              <div
                class="full-width"
              >{{parseFloat(item.price * item.num).toFixed(2)}}</div>
            </div>
            <!-- emp -->
            <div v-if="item.empListLabel&&item.empListLabel.length>0" class="text-left font-12 text-muted" style="background-color: #f6f6f6;">
              <span class="opacity-">&nbsp;&rArr;</span>
              <span>业绩员工：</span>
              <span v-for="(emp,eidx) in item.empListLabel" :key="eidx" class="marginLR-xs">{{emp}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dtype>1" style=" margin:0 -20px;  border-top: 6px solid rgb(224, 220, 220);"></div>
    <div class="text-right padding-sm m-top-sm m-right-sm font-14">
      <div :class="{'tt':dtype>1}">
        <span class="m-right-sm">共{{totalTotal.num}}份商品</span>
        <span class="font-16 font-600 text-theme2">&yen;{{totalTotal.price}}</span>
      </div>
    </div>
    <div v-if="dtype==1" class="text-right p-top-sm">
      <el-button type="default" @click="closeModal(false)">取消</el-button>
      <el-button type="primary" @click="closeModal(true)">确认下单</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: ["theOrderList", "totalTotal", "dtype"],
  computed: {
    ...mapGetters({
      selmember: "selmember",
      dataItem: "roomOrderItem"
    })
  },
  methods: {
    closeModal(status) {
      this.$emit("closeModal", status);
    }
  }
};
</script>
<style scoped>
.goodsList {
  height: 250px;
      height: 269px;
  overflow-y: auto;
}
.goodsList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.goodsList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background: #c1c1c1;
}
.goodsList::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: #f1f1f1;
}

.spaceBorder-right {
  padding-right: 10px;
  border-right: 6px solid rgb(224, 220, 220);
}

@media screen and (max-width: 991px) {
  .spaceBorder-right {
    border-color: white;
  }
  .tt {
    text-align: left;
  }
}
</style>

