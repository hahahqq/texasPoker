<template>
  <div class="CouponList" v-loading="loading">
    <div class="com_header">
      <div class="selectmemberid">
        <i class="icon-search iconfont com_search"></i>
        <input
          type="text"
          v-model="couponval"
          placeholder="输入优惠券号码直接使用"
          class="search_selectmember"
        />
      </div>
    </div>
    <div class="discountCouponList">
      <ul>
        <li v-for="(item, index) in dataList" :key="index">
          <div
            @click="selectonecoupon(index, item)"
            class="rounded-xs pointer margin-sm padding-sm"
            :class="item.LIMITMONEY <= money ? 'bg-theme' : 'bg-gw'"
          >
            <div class="m-bottom-sm">
              <div class="inline-block">
                <em>&yen;</em>
                <span class="font-20">{{ item.MONEY }}</span>
              </div>
              <span class="pull-right">满{{ item.LIMITMONEY }}元可用</span>
            </div>
            <div>
              <span>有效期：</span>
            </div>
            <div>
              <span>{{ item.BEGINDATE }}-{{ item.ENDDATE }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="commodityfooter el-dialog__header">
      <el-button type="info" @click="closeModal">取消</el-button>
      <el-button type="danger" @click="selectcouponok">确认</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "barCodePay",
  props: ["vipId", "money"],
  data() {
    return {
      loading: false,
      couponval: "",
      couponcodemoney: "",
      couponcode: "",
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      pageData: {
        CouponType: 2,
        openID: "",
        vipID: "",
        Type: 0,
        PN: 1
      }
    };
  },
  computed: {
    ...mapGetters({
      dataListState: "couponListState",
      dataList: "couponList",
      couponcheckState: "couponcheckState"
    })
  },
  watch: {
     vipId(data){
        console.log(data)
     },
    dataListState(data) {
       console.log(data)
      if (data.success && this.loading) {
        if (data.success) {
          this.pagination = {
            TotalNumber: data.paying.TotalNumber,
            PageNumber: data.paying.PageNumber,
            PageSize: data.paying.PageSize,
            PN: data.paying.PN
          };
        }
      }
      console.log(111, data);
      this.loading = false;
    },
    couponcheckState(data) {
      if (data.success) {
        if (data.data.StatusName == "未使用") {
          let combackdata = {
            couponcode: this.couponval,
            couponcodemoney: data.data.Money
          };
          this.$emit("CouponListclick", combackdata);
        } else if (data.data.StatusName == null) {
          this.$message("输入正确的卡券优惠码");
          return;
        } else {
          this.$message("已失效");
          return;
        }
      } else {
        this.$message(data.message);
      }
    }
  },
  methods: {
    getNewData() {
      this.pageData.openID = this.vipId;
      this.pageData.vipID = this.vipId;
      this.$store.dispatch("getcouponListState", this.pageData).then(() => {
        this.loading = true;
      });
    },
    handlePageChange: function (currentPage) {
      if (this.pageData.PN == currentPage || this.loading) {
        return;
      }
      this.pageData.PN = parseInt(currentPage);
      this.getNewData();
    },
    selectonecoupon(index, item) {
      if (item.LIMITMONEY > this.money) {
        return;
      }

      this.couponcode = item.COUPONCODE;
      this.couponcodemoney = item.MONEY;
      this.$emit("CouponListclick", {
        couponcode: this.couponcode,
        couponcodemoney: this.couponcodemoney
      });
    },
    closeModal(type) {
      this.$emit("CouponListclick", {});
    },
    selectcouponok() {
      if (this.couponcode != "") {
        let combackdata = {
          couponcode: this.couponcode,
          couponcodemoney: this.couponcodemoney
        };
        this.$emit("CouponListclick", combackdata);
      } else {
        if (this.couponval != "") {
          this.$store
            .dispatch("getcouponcheckState", {
              Code: this.couponval
            })
            .then(() => {});
        }
      }
    }
  },
  mounted(){
     this.getNewData
  }
//   created() {
//     this.getNewData();
//   }
};
</script>
<style scoped>
.com_header {
  position: relative;
  margin-bottom: 20px;
}

.com_header .search_selectmember {
  height: 32px;
  background: #fff;
  border: 1px solid #cccccc;
  outline: none;
  padding: 0 24px;
  border-radius: 5px;
  color: #000;
  width: 94%;
  margin: 0 auto;
  display: block;
}

.com_header .com_search {
  position: absolute;
  left: 23px;
  top: 7px;
  color: #ffa112;
}

.discountCouponList {
  overflow: hidden;
  height: 200px;
  overflow-y: auto;
  padding: 5px 0;
}

.discountCouponList ul li {
  float: left;
  width: 50%;
  color: #fff;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
}

.discountCouponList ul li .CouponListimg {
  height: 87px;
  width: 90%;
  margin: 0 auto;
  background: #f56c6c;
  border-radius: 5px;
}

.CouponListtop {
  text-align: right;
  font-size: 16px;
  padding-right: 10px;
  padding-top: 15px;
  font-weight: bold;
}

.CouponListbottom {
  padding-left: 10px;
  padding-top: 5px;
  font-size: 12px;
}

.isselectcoupon {
  position: absolute;
  color: #e91e63;
  font-size: 18px;
  right: 10px;
  top: -4px;
}
</style>
