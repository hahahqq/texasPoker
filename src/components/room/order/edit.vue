<template>
  <div class="roomOrderEdit">
    <div>
      <el-table
        v-if="theOrderList.length>0"
        :data="theOrderList"
        max-height="450"
        border
        style="width: 100%"
        header-row-class-name="bg-theme text-white"
      >
        <el-table-column prop="ROOMNAME" label="房台" sortable></el-table-column>
        <el-table-column prop="GOODSNAME" label="品名"></el-table-column>
        <el-table-column prop="PRICE" label="零售价"></el-table-column>
        <el-table-column prop="QTY" label="数量"></el-table-column>
        <el-table-column prop="DISCOUNT" label="折扣"></el-table-column>
        <el-table-column prop="GOODSPRICE" label="实销价"></el-table-column>
        <el-table-column label="小计" :formatter="formatter"></el-table-column>
      </el-table>
      <div class="text-right paddingTB-sm">
        <span class>共{{totalTotal.num}}份商品，总价</span>
        <span class="font-16 font-600 text-theme2">&yen;{{totalTotal.price}}</span>
      </div>

      <div v-if="theData.ROOMID" class="paddingTB-sm">
        <el-row :gutter="20" v-if="theOrderItem.Obj">
          <el-col :span="12">
            <div class>
              <span>下单时间</span>
              <span class="m-left-sm">{{theOrderItem.Obj.DATESTR}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class>
              <span>预计时长</span>
              <span class="m-left-sm">{{theOrderItem.Obj.SERIVCETIME}}分钟</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class>
              <span>开始时间</span>
              <span
                class="m-left-sm"
                v-if="theroomData.BEGINTIME"
              >{{new Date(theroomData.BEGINTIME) | time}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class>
              <span>剩余时长</span>
              <span
                class="m-left-sm"
              >{{theOrderItem.Obj.SERIVCETIME - theroomData.NEWSERIVICETIME}}分钟</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="row-flex">
              <span class="align-self-center" style="width:76px;">换台备注</span>
              <el-input v-model="remark" size="mini"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-if="theData.ROOMID" class="text-right">
        <el-button
          type="default"
          class="pull-left"
          v-if="theroomData.ISSTART==1"
          @click="handleClick('stopTime',theData)"
        >暂停计时</el-button>
        <el-button
          type="primary"
          class="pull-left"
          v-else
          @click="handleClick('startTime',theData)"
        >开始计时</el-button>

        <el-dropdown trigger="click" @command="changeRoom" class="pull-left m-left-sm">
          <el-button type="primary">
            换台
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item ,i) in roomList"
              v-if="item.ROOMID && item.ROOMID != theroomData.ROOMID && !item.BILLID"
              :key="i"
              :command="item"
            >{{item.ROOMNAME}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button-group>
          <el-button type="primary" class="m-left-sm" @click="handleClick('checkout',theData)">结账</el-button>
          <!-- <el-button type="primary" class="m-left-sm" @click="handleClick('edit',theData)">编辑</el-button> -->
          <el-button type="default" @click="closeModal(false)">关闭</el-button>
        </el-button-group>
      </div>
      <div v-else class="text-right">
        <el-button-group class="pull-left">
          <el-button type="default" icon="el-icon-delete" @click="handleClick('cancel',theData)">作废</el-button>
          <el-button
            type="primary"
            icon="el-icon-printer"
            @click="handleClick('print',theData)"
            :loading="loading"
          >打印</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" class="m-left-sm" @click="handleClick('checkout',theData)">结账</el-button>
          <!-- <el-button type="primary" class="m-left-sm" @click="handleClick('edit',theData)">编辑</el-button> -->
          <el-button type="default" @click="closeModal(false)">关闭</el-button>
        </el-button-group>
      </div>

      <el-dialog
        width="50%"
        title="结账"
        v-if="showCheckout"
        :visible.sync="showCheckout"
        append-to-body
      >
        <checkoutPage @closeModal="closeModal2" :theData="theData"></checkoutPage>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    theData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {},
      vipObj: {},
      loading: false,
      showCheckout: false,
      theOrderList: [],
      totalTotal: { price: 0, num: 0 },
      theOrderItem: {},
      theroomData: {},
      remark: ""
    };
  },
  computed: {
    ...mapGetters({
      dataItem: "roomOrderItem",
      dataState: "roomOrderState",
      printState: "printRoomOrderState",
      cancelState: "cancelRoomOrderState",
      paywayList: "paywayList",
      roomOrderTime: "roomOrderTime",
      roomList: "roomList",
      dealRoomOrder: "dealRoomOrder"
    })
  },
  watch: {
    dataState(data) {
      if (data.success && this.loading) {
        this.closeModal(true);
      }
      this.loading = false;
      this.$message({
        showClose: true,
        message: data.message,
        type: data.success ? "success" : "error"
      });
    },
    printState(data) {
      this.loading = false;
      console.log('print');
    },
    cancelState(data) {
      this.loading = false;
      if (data.success) {
        this.closeModal(true);
      }
      this.$message({
        showClose: true,
        message: data.message,
        type: data.success ? "success" : "error"
      });
    },
    roomOrderTime(data) {
      if (data.success) {
        this.theroomData.ISSTART = data.Status;
      }
    },
    dealRoomOrder(data) {
      this.loading = false;
      if (data.success) {
        this.closeModal(true);
      }
      this.$message({
        showClose: true,
        message: data.message,
        type: data.success ? "success" : "error"
      });
    }
  },
  methods: {
    closeModal(status) {
      this.$emit("closeModal", status);
    },
    closeModal2(status) {
      this.showCheckout = false;
      if (status) {
        this.closeModal(true);
      }
    },
    formatter(item, column) {
      let dd = parseFloat(
        item.PRICE * item.QTY * (item.discount ? item.DISCOUNT : 1)
      ).toFixed(2);
      return dd;
    },
    handleClick(type, item) {
      if (type == "checkout") {
        if (this.paywayList.length == 0) {
          this.$store.dispatch("getPaywayList");
        }
        this.showCheckout = true;
      }
      if (type == "print") {
        this.$store
          .dispatch("printRoomOrder", {
            BillId: item.BILLID
          })
          .then(() => {
            this.loading = true;
          });
      }
      if (type == "edit") {
        this.$store
          .dispatch("getRoomOrderItem", {
            RoomId: "",
            BillId: item.BILLID
          })
          .then(() => {
            this.loading = true;
          });
      }
      if (type == "cancel") {
        if (!this.isPurViewFun(601050207)) {
          this.$notify({
            title: "警告",
            message: "没有权限",
            type: "warning"
          });
          return;
        }

        this.$confirm("是否作废单号：" + item.BILLNO, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$store
              .dispatch("cancelRoomOrder", {
                BillId: item.BILLID
              })
              .then(() => {
                this.loading = true;
              });
          })
          .catch(() => {});
      }
      if (type == "startTime") {
        this.$store.dispatch("getRoomOrderTime", {
          RoomId: item.ROOMID,
          BillId: item.BILLID,
          Status: 1 // 1=开始，-1=暂停，其他=自动
        });
      }
      if (type == "stopTime") {
        this.$store.dispatch("getRoomOrderTime", {
          RoomId: item.ROOMID,
          BillId: item.BILLID,
          Status: -1 // 1=开始，-1=暂停，其他=自动
        });
      }
    },
    changeRoom(item) {
      this.$confirm("是否更换房台：" + item.ROOMNAME, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let sendData = {
            GoodsDetail: "",
            VipId: this.vipObj.ID,
            IsCancel: 0,
            Remark: this.remark
          };
          let gList = [...this.theOrderItem.GoodsList],
            newArr = [];
          gList.forEach(item => {
            let dd = {
              RoomId: arr[i].ROOMID,
              GoodsId: item.GOODSID,
              Id: item.ID,
              IsCancel: 0,
              Price: item.PRICE,
              Qty: item.QTY,
              Discount: item.DISCOUNT,
              Remark: ""
            };
            newArr.push(dd);
          });
          sendData.GoodsDetail = JSON.stringify(gList);
          this.$store.dispatch("saveRoomOrder", sendData).then(() => {
            this.loading = true;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dealItemList() {
      this.theOrderItem = Object.assign({}, this.dataItem.data);
      let gList = [...this.theOrderItem.GoodsList],
        rList = [...this.theOrderItem.RoomList],
        newArr = [];
      this.totalTotal = { price: 0, num: 0 };
      if (this.theOrderItem.VipObj) {
        this.vipObj = Object.assign({}, this.theOrderItem.VipObj);
      }
      gList.forEach(item => {
        this.totalTotal.num += item.QTY;
        this.totalTotal.price += item.PRICE;
        let aa = rList.find(element => element.ROOMID == item.ROOMID);
        newArr.push(Object.assign({}, item, aa));
      });
      this.theOrderList = [...newArr];
      this.theroomData = this.theData.ROOMID ? Object.assign({}, rList[0]) : {};
    }
  },
  mounted() { 
    this.dealItemList();
  },
  components: {
    checkoutPage: () => import("@/components/room/order/checkout.vue")
  }
};
</script>
