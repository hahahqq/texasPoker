<template>
  <el-container>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <sidebarMenu :activePath="activePath" :routesList="routesList" :width="100"></sidebarMenu>
        </section>
      </el-aside>
      <el-container>
        <div class="t-botton-timescountc" style="height: 100%" ref="elememt">
          <div class="f-botton-fs" style="height: 100%">
            <div style="position: absolute; top: 0px; bottom: 0px; left: 100px; right: 0px">
              <el-row :gutter="24" style="height: 100%; margin-right: 0px; margin-left: 0px">
                <el-col
                  :span="8"
                  style="
                    height: 100%;
                    position: relative;
                    background: rgb(248, 248, 249);
                    padding-right: 0px;
                    padding-left: 0px;
                  "
                >
                  <div class="commodityc-top">
                    <span class="title">会员领奖</span>
                    <span class="commodityc-top-text" @click="clearData">清空页面</span>
                  </div>
                  <div style="">
                    <dropdown
                      @getmemberID="getmemberID"
                      :details="Object.keys(selmember).length > 0 ? selmember : new Object()"
                    ></dropdown>
                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                      <ul id="addshopList" class="p-bottom-sm">
                        <li v-for="(item, i) in addobjCountList" :key="i" class="addshopList-cont">
                          <el-row class="addshopList-cont-list">
                            <el-col :span="8" class="name">{{ item.goodsname }}</el-col>
                            <el-col :span="8" style="text-align: center" class="discountMoney">
                              ￥{{ item.PRICE }}
                            </el-col>
                            <el-col :span="8" style="text-align: right">
                              <i @click="delgoods(i)" class="el-icon-delete"></i>
                            </el-col>
                          </el-row>
                          <el-row class="addshopList-cont-list">
                            <el-col :span="8" class="discountMoney">
                              {{ item.GIFTINTEGRAL }}积分
                            </el-col>

                            <el-col :span="8" style="text-align: center">
                              <div class="sumchange">
                                <el-input-number
                                  style="width: 100px"
                                  @click.native.stop
                                  @change="addjiajianhao1(i, item.Qty)"
                                  size="mini"
                                  v-model.number="item.Qty"
                                  :min="1"
                                ></el-input-number>
                              </div>
                            </el-col>
                            <el-col :span="8" style="text-align: right" class="shopMoney">
                              {{ (item.allIntegral * item.Qty).toFixed(2) }}积分
                            </el-col>
                          </el-row>
                        </li>
                      </ul>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                      <div>
                        <el-input
                          :rows="2"
                          v-model="Remark"
                          placeholder="请输入备注信息"
                        ></el-input>
                      </div>

                      <div class="footer_top" style="margin-top: 10px; ">
                        <div
                          style="
                            width: 100%;
                            height: 40px;
                            background: #fff;
                            margin-bottom: 10px;
                            line-height: 40px;
                          "
                        >
                          <el-row>
                            <el-col :span="12" style="text-align: center">
                              <el-checkbox v-model="checkedreceipt">打印小票</el-checkbox>
                            </el-col>
                            <el-col :span="12" style="text-align: center">
                              <el-checkbox v-model="IsSms">短信通知</el-checkbox>
                            </el-col>
                          </el-row>
                        </div>

                        <el-row style="line-height: 40px; background:#fff; padding: 10px 0">
                          <el-col :span="12">
                            <span
                              style="display: inline-block; margin-left: 10px"
                              v-if="addobjCountList.length != 0"
                            >
                              数量 &nbsp;&nbsp;{{ totalTotal.num }} ,
                            </span>
                                 &nbsp;
                            <span
                              v-if="addobjCountList.length != 0"
                              style="
                                display: inline-block;
                                margin-left: 5px;
                                font-weight: bold;
                              "
                            >
                              <span class="priceTol text-red font-18">{{ totalTotal.GIFTINTEGRAL }} </span>
                              <i>积分</i>
                            </span>
                          </el-col>

                          <el-col :span="6">
                            <div style="width: 10px; height: 10px"></div>
                          </el-col>
                          <el-col :span="6" style="text-align: right">
                            <el-button
                              type="primary"
                              style="margin-right: 10px"
                              @click="co_reckoning"
                              :loading="submitLoading"
                            >
                              收款
                            </el-button>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16" style="padding-left: 0px; padding-right: 0px">
                  <div class="search_sock">
                    <!-- <el-input
                        type="default"
                        v-model="searchText"
                        placeholder="输入商品名称/编码"
                        size="small"
                        style="width:80%;margin-left:35px;"
                     ></el-input> -->
                    <el-row>
                      <el-col :span="16" class="member-header">
                        <div class="search_sock-input">
                          <el-input
                            type="default"
                            v-model="searchText"
                            placeholder="输入商品名称/编码"
                            size="small"
                            style="width: 100%; margin-left: 5%; margin-right: 5%"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col :span="8" class="shop">
                        <span class="name">{{ shopInfo.SHOPNAME }}</span>
                        <span class="">
                          <el-popover
                            placement="bottom"
                            width="140"
                            trigger="hover"
                            popper-class="no-padding"
                          >
                            <el-button
                              style="border: none !important"
                              @click="changeShop()"
                              class="full-width"
                              icon="icon-exchange"
                            >
                              &nbsp;&nbsp;切换店铺
                            </el-button>
                            <el-button
                              style="border: none !important"
                              class="full-width no-m-left border-top"
                              icon="icon-user"
                            >
                              &nbsp;&nbsp; 账号信息
                            </el-button>
                            <el-button
                              style="border: none !important"
                              @click="logout()"
                              class="full-width no-m-left border-top"
                              icon="icon-signout"
                            >
                              &nbsp;&nbsp;退出账号
                            </el-button>
                            <a slot="reference" class="hitem">
                              <i class="icon-reorder"></i>
                            </a>
                          </el-popover>
                        </span>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="commodity-right-good-list">
                    <div class="classification_List" ref="fenleiWidthsock">
                      <div class="swiper-container">
                        <ul class="swiper-wrapper" id="activityList" v-if="goodType.length > 0">
                          <li
                            class="swiper-slide"
                            v-for="(item, index) in goodType"
                            :key="index"
                            @click="ck_commoditycflList(item.ID, index)"
                            :class="{ selected: index == current }"
                          >
                            {{ item.NAME }}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      class="commodityc_rightsock p-left-sm p-right-sm"
                      :style="{ height: tableHeight + 'px' }"
                    >
                      <div
                        v-if="pagelist.length != 0"
                        class="tablelist scrollstyle font-12"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                      >
                        <el-row :gutter="20" class="timescountc_right">
                          <el-col
                            :span="6"
                            style="margin-bottom: 10px"
                            v-for="(item, i) in pagelist"
                            :key="i"
                            v-show="item.GIFTINTEGRAL == 0 || item.GIFTINTEGRAL > 0"
                          >
                            <div
                              class="tablelcenter"
                              @click="addcommodityc(item)"
                              id="tablelcenterID"
                            >
                              <div class="menu-img">
                                <div class="img-box">
                                  <div class="img">
                                    <div style="width: 60px; height: 60px">
                                      <img
                                        :src="item.showgoodsimg"
                                        onerror="this.src='static/images/shopzj.png'"
                                        style="width: 100%; height: 100%"
                                      />
                                    </div>
                                    <div style="margin-left: 7px">
                                      <div style="height: 30px; width: 100%; line-height: 35px">
                                        {{ item.NAME }}
                                      </div>
                                      <div style="height: 30px; width: 100%; line-height: 25px">
                                        <span class="font-600 text-theme2">
                                          {{
                                            item.DISGIFTINTEGRAL == undefined
                                              ? item.GIFTINTEGRAL
                                              : item.DISGIFTINTEGRAL
                                          }}积分
                                        </span>
                                        <span>
                                          <i style="color: rgb(25, 23, 23); padding: 0px 3px">库</i>
                                          {{ item.STOCKQTY }}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>

                      <div
                        v-if="pagelist.length == 0 && loading == false"
                        :style="`text-align:center; display: table; width: 100%; height: ${clientHeight}px`"
                      >
                        <span style="display: table-cell; padding-top: 160px">
                          <img
                            src="static/images/delf.png"
                            style="width: 180px; height: 170px; display: inline-block"
                            alt=""
                          />
                          <div style="color: #868686; margin-top: 20px">
                            暂无商品 ，点击立即添加
                            <el-button type="primary" size="small" @click="showAddNewChange">
                              添加商品
                            </el-button>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div class="men_porioven pull-right" style="margin-top: -10px">
                      <div v-show="pagelist.length > 0" class="m-top-sm clearfix elpagination">
                        <el-pagination
                          background
                          @size-change="handlePageChange"
                          @current-change="handlePageChange"
                          :current-page.sync="pagination.PN"
                          :page-size="pagination.PageSize"
                          layout="total,prev, pager, next, jumper"
                          :total="pagination.TotalNumber"
                          class="text-center"
                        ></el-pagination>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <el-dialog
          title="请选择门店"
          :visible.sync="isShowShop"
          width="300px"
          :before-close="handleClose"
        >
          <div class="shopListClass">
            <ul>
              <li v-for="(item, index) in theshopList" :key="index" @click="setShop(item)">
                {{ item.SHOPNAME }}
              </li>
            </ul>
          </div>
        </el-dialog>
      </el-container>
    </el-container>

    <el-dialog title="添加商品" :visible.sync="showAddNew" width="55%">
      <add-new-goods
        @closeModal="showAddNew = false"
        @resetList="
          showAddNew = false;
          getNewData();
        "
        :dataType="{ value: 2, dealState: 'add' }"
      ></add-new-goods>
    </el-dialog>
  </el-container>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { nscreenexCodeFun } from "@/util/objectivity";
import { mapState, mapGetters } from "vuex";

import yjemployee from "@/components/employee/YJemployee";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import MIXINS_MONEY from "@/mixins/money";
import { getOthersData, setOthersData, getHomeData, getUserInfo } from "@/api/index";
import { SYSTEM_INFO } from "@/util/define.js";
import dayjs from "dayjs";
import { getDayindata } from "@/util/testPrinting";

const settheVipGIFTINTEGRAL_Fun = function (goodsItem, selmember, type, value) {
  // 设置会员折扣 type：0=商品选择，1=挂单商品， 2=all, 3=更改折扣
  let gGIFTINTEGRAL = 0;
  let GIFTINTEGRAL = parseFloat(goodsItem.GIFTINTEGRAL),
    discount = 1,
    remark = "";
  return {
    GIFTINTEGRAL: GIFTINTEGRAL,
    Discount: discount,
    GIFTINTEGRALremark: remark,
    retailGIFTINTEGRAL: gGIFTINTEGRAL
  };
};
let _ = require("lodash");
import MIXINS_CHECKOUT from "@/mixins/checkout";
import MIXINS_CLEAR from "@/mixins/clearAllData";
export default {
  mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER, MIXINS_MONEY.MONEY_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      showAddNew: false,
      Goodscode: getUserInfo().CompanyConfig.AUTOGENGOODSCODE,
      getgoodsIMGURL: "",
      goodType: "",
      current: 0,
      index: "ok",
      searchText: "",
      VipId: "",
      VipIdrows: "",
      BillId: "",
      Remark: "",
      objCount: [],
      addobjCountList: [],
      totalTotal: {
        num: 0,
        GIFTINTEGRAL: 0,
        discount: 0
      },
      checkedreceipt: false,
      splitIntegral: getUserInfo().CompanyConfig.INTEGRALTYPE,
      IsSms: false,
      checkedmessage: false,
      pagelist: [],
      loading: true,
      pagination: {
        TotalNumber: 0,
        PageNumber: 0,
        PageSize: 20,
        PN: 0
      },
      pageData: {
        PN: 1,
        Filter: "",
        IsGift: 1,
        TypeID: "", //商品类别ID
        DescType: 0
      },
      showyjemployee: false,
      shopitemList: {},
      showTishi: "",
      putUpokstatus: "",
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      shopName: getUserInfo().CompanyName,
      tableHeight: document.body.clientHeight - 175,
      clientHeight: document.body.clientHeight - 50,
      memberdetails: {},
      payMoneyDetails: {
        money: 0,
        integral: 0
      },
      submitLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memberState: "memberState",
      commoditycflList: "commoditycflList",
      dataList: "goodsList4",
      dataListState: "goodsListState4",
      goodsState: "goodsState",
      goodsItem: "goodsItem",
      integralExchange: "integralExchange",
      shopList: "shopList",
      shopListState: "shopListState"
    })
  },
  watch: {
    searchText() {
      this.searchfun();
    },
    commoditycflList(data) {
      let good = [];
      for (var i in data) {
        good.push(data[i]);
      }
      good.unshift({
        ID: "0",
        NAME: "全部"
      });
      this.goodType = good;
      this.fenleiscrollwidth();
    },
    memberState(data) {
      if (data.success) {
        this.objCount = data.data.objCount;
      }
    },
    dataListState(data) {
      this.loading = false;
      this.isFilter = false;
      this.pagelist = [...this.dataList];
      this.getgoodsIMGURL = GOODS_IMGURL;
      for (let i = 0; i < this.pagelist.length; i++) {
        this.pagelist[i].showgoodsimg = this.getgoodsIMGURL + this.pagelist[i].ID + ".png";
      }
      if (data.success) {
        this.pagination = {
          TotalNumber: data.paying.TotalNumber,
          PageNumber: data.paying.PageNumber,
          PageSize: data.paying.PageSize,
          PN: data.paying.PN
        };
      }
    },
    goodsState(data) {
      if (data.success && !this.showyjemployee) {
        this.shopitemList.itemObj = Object.assign({}, this.goodsItem, this.shopitemList.itemObj);
        this.showyjemployee = true;
      }
    },
    integralExchange(data) {
      this.submitLoading = false;
      if (data.success) {
        this.$message({ message: "操作成功", type: "success" });

        let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print5");
        let jsonPrintData = JSON.parse(printRules);

        jsonPrintData.autoPrint = this.checkedreceipt ? true : false;
        localStorage.setItem(SYSTEM_INFO.PREFIX + "Print5", JSON.stringify(jsonPrintData));

        if (this.checkedreceipt) {
          this.testPrint(data.data.BillId, jsonPrintData);
        } else {
          this.clearData();
        }
      } else {
        this.$message.error(data.message);
      }

      if (data.data != null) {
        this.addobjCountList = [];
        this.totalTotal = {
          num: 0,
          GIFTINTEGRAL: 0,
          discount: 0
        };
      }
    }
  },
  methods: {
    showAddNewChange() {
      this.showAddNew = true;
      if (this.Goodscode == true) {
        this.$store.dispatch("getGoodsCode");
      }
    },
    testPrint(billid, jsonPrintData) {
      let billInfo = [
        {
          label: "结账单号：",
          value: billid
        },
        {
          label: "结账日期：",
          value: dayjs().format("YYYY-MM-DD hh:mm")
        }
      ];

      let GoodsDetaila = this.addobjCountList,
        newGoodsList = [],
        totalPrice = 0;
      for (var i in GoodsDetaila) {
        newGoodsList.push({
          name: GoodsDetaila[i].goodsname,
          purPrice: GoodsDetaila[i].GIFTINTEGRAL,
          qty: GoodsDetaila[i].Qty,
          price: GoodsDetaila[i].GIFTINTEGRAL * GoodsDetaila[i].Qty
        });
        totalPrice += GoodsDetaila[i].GIFTINTEGRAL * GoodsDetaila[i].Qty;
      }

      let payMoney = Number(this.totalTotal.GIFTINTEGRAL);

      let saleInfo = [
        {
          label: "兑换总数：",
          value: newGoodsList.length
        },
        {
          label: "消耗积分：",
          value: totalPrice.toFixed(2)
        },
        {
            label: '储值积分：',
            value: this.payMoneyDetails.money
         }
      ];

      if(this.splitIntegral){
         saleInfo.push({
            label: '竞技积分：',
            value: this.payMoneyDetails.integral
         })
      }

      let vipInfo = jsonPrintData.vipInfo;
      if (this.VipId == undefined || this.VipId == "") {
        vipInfo = [];
      } else {
        vipInfo[0].value = this.memberdetails.CODE;
        vipInfo[1].value = this.memberdetails.NAME;
        vipInfo[2].value =
          Number(this.memberdetails.INTEGRAL) - Number(this.payMoneyDetails.integral);
        if (this.splitIntegral) {
          vipInfo.push({
            label: "储值积分",
            value: this.memberdetails.MONEY - this.payMoneyDetails.money,
            isShow: vipInfo[2].isShow
          });
        }
      }

      jsonPrintData.remark.value = this.Remark;
      if (this.SaleEmpList != undefined && this.SaleEmpList != "") {
        let saleEmployName = this.options.filter((item) => item.value == this.SaleEmpList);
        console.log(saleEmployName);
        jsonPrintData.saleEmploy.value = saleEmployName[0].label;
      }

      let printData = Object.assign(
        {},
        jsonPrintData,
        { billInfo: billInfo },
        { saleInfo: saleInfo },
        { vipInfo: vipInfo },
        { goodsList: newGoodsList }
      );
      let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
      getDayindata(printData, "Print5", qresurl);
      this.clearData();
    },
    handleClose(done) {
      this.isShowShop = false;
    },
    logout: function () {
      //退出登录
      var _this = this;
      this.$confirm("确认退出吗?", "提示")
        .then(() => {
          _this.$store.dispatch("toLogOut").then(() => {
            _this.clearAllData();
            _this.$router.push("/login");
          });
        })
        .catch(() => {
          console.log("logout");
        });
    },
    setShop(item) {
      //切换店铺
      this.$store.dispatch("choosingShop", item).then(() => {
        this.isShowShop = false;
        this.clearAllData();
        this.defaultData();
        this.$router.push({
          path: "/home"
        });
      });
    },
    defaultData() {
      let homeData = getHomeData();
      if (homeData.shop) {
        this.shopInfo = Object.assign({}, homeData.shop);
      }
      this.UserName = getUserInfo().UserName;
      if (this.shopList.length == 0) {
        this.$store.dispatch("getShopList", {});
      }
    },
    changeShop() {
      let userInfo = getUserInfo();
      if (userInfo.CODE2 == "boss") {
        this.theshopList = [...this.shopList];
      } else {
        this.theshopList = [];
        for (let i = 0; i < userInfo.ShopList.length; i++) {
          if (userInfo.ShopList[i].ISPURVIEW == 1) {
            this.theshopList.push({
              ID: userInfo.ShopList[i].SHOPID,
              NAME: userInfo.ShopList[i].SHOPNAME
            });
          }
        }
      }
      this.isShowShop = true;
    },
    seletGoodsType(data) {
      if (data == "reduce") {
        if (this.current != 0) {
          this.current--;
        }
      } else {
        if (this.current < this.goodType.length - 1) {
          this.current++;
        }
      }
      for (var i in this.goodType) {
        if (this.current == i) {
          this.pageData.TypeID = this.current == 0 ? "" : this.goodType[i].ID;
          this.pageData.PN = 1;
          this.getNewData();
        }
      }
    },
    //触发分类
    ck_commoditycflList(flID, index) {
      this.current = index;
      if (this.current == 0) {
        this.pageData.PN = 1;
        this.pageData.TypeID = "";
        this.getNewData();
      } else {
        this.pageData.TypeID = flID;
        this.pageData.PN = 1;
        this.getNewData();
      }
    },
    clearData() {
      this.VipId = "";
      this.memberdetails = {};
      this.addobjCountList = [];
      this.totalTotal = {
        num: 0,
        GIFTINTEGRAL: 0,
        discount: 0
      };
      this.payMoneyDetails = {
        money: 0,
        integral: 0
      };
      this.$store
        .dispatch("selectingMember", {
          isArr: false,
          data: new Object()
        })
        .then(() => {
          this.VipId = "";
        });
    },
    getmemberDetail(item) {
      this.$store.dispatch("getMemberItem", item).then(() => {});
    },
    // 会员选择
    getmemberID(id, data) {
      this.VipId = id;
      this.memberdetails = data;
      this.$store.dispatch("selectingMember", {
        isArr: false,
        data: data
      });
      if (this.addobjCountList.length > 0) {
        for (var i = 0; i < this.addobjCountList.length; i++) {
          let item = this.addobjCountList[i];
          let dd = this.settheVipGIFTINTEGRAL(item, 2);
          this.addobjCountList[i] = Object.assign({}, item, dd);
        }
        this.dealTotalData();
      }
    },
    getNewData() {
      this.$store.dispatch("getGoodsList4", this.pageData).then(() => {
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
    searchfun: _.debounce(function () {
      this.searchfun2(0);
    }, 1000),
    searchfun2(type) {
      if (type == 1 && !this.searchText) {
        return;
      }
      this.pageData.Filter = this.searchText;
      this.getNewData();
    },
    settheVipGIFTINTEGRAL(goodsItem, type, value) {
      return settheVipGIFTINTEGRAL_Fun(goodsItem, this.VipIdrows, type, value);
    },
    //选择商品
    addcommodityc(item) {
      let dd = this.settheVipGIFTINTEGRAL(item, 0);
      let count = 1;
      if (this.addobjCountList.length > 0) {
        for (let i = 0; i < this.addobjCountList.length; i++) {
          if (this.addobjCountList[i].GoodsId == item.ID) {
            this.addobjCountList[i].Qty = this.addobjCountList[i].Qty + 1;
            break;
          }
          if (i + 1 < this.addobjCountList.length) {
            continue;
          } else {
            let newItem = Object.assign(
              {
                goodsname: item.NAME,
                Qty: 1,
                GoodsId: item.ID,
                itemObj: item,
                allIntegral: item.GIFTINTEGRAL
              },
              item,
              dd
            );
            this.addobjCountList.unshift(newItem);
            break;
          }
        }
      } else {
        let newItem = Object.assign(
          {
            goodsname: item.NAME,
            Qty: 1,
            GoodsId: item.ID,
            itemObj: item,
            allIntegral: item.GIFTINTEGRAL
          },
          item,
          dd
        );
        this.addobjCountList.unshift(newItem);
      }
      this.dealTotalData();
    },
    delgoods(i) {
      //  移除商品
      this.addobjCountList.splice(i, 1);
      this.dealTotalData();
    },
    //统计总积分
    dealTotalData() {
      let tnum = 0,
        tGIFTINTEGRAL = 0,
        tdiscount = 0;
      for (let i = 0; i < this.addobjCountList.length; i++) {
        let tt =
          parseFloat(this.addobjCountList[i].GIFTINTEGRAL) *
          parseFloat(this.addobjCountList[i].Qty);
        tnum += parseFloat(this.addobjCountList[i].Qty);
        tGIFTINTEGRAL += tt;
      }
      console.log(tGIFTINTEGRAL);
      this.totalTotal = {
        num: tnum,
        GIFTINTEGRAL: tGIFTINTEGRAL,
        discount: tdiscount
      };
    },
    changeQty(i) {
      this.$prompt("请输入数值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "Number",
        inputPattern: /^[0-9]*[1-9][0-9]*$/,
        inputErrorMessage: "数值格式不正确"
      })
        .then(({ value }) => {
          this.addobjCountList[i].Qty = value;
          this.dealTotalData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    addjiajianhao1(i, e) {
      this.addobjCountList[i].Qty = e;
      this.dealTotalData();
    },
    co_reckoning() {
      if (this.addobjCountList.length == 0) {
        this.$message("请选择商品！");
        return;
      }

      if (this.memberdetails.ID == undefined) {
        this.$message.warning("请选择会员！");
        return;
      }

      let a = this.totalTotal.GIFTINTEGRAL,
        b = this.memberdetails.INTEGRAL,
        c = this.memberdetails.MONEY,
        d = 0,
        e = 0;
      if (this.splitIntegral) {
        if (b >= a) {
          d = a;
          e = 0;
        } else if (b + c >= a) {
          d = b;
          e = a - b;
        } else if (c >= a) {
          d = 0;
          e = a;
        }
      } else {
        if (c >= a) {
          e = a;
          d = 0;
        }
      }

      this.payMoneyDetails = {
        money: e,
        integral: d
      };

      console.log("竞技积分：" + d, "储值积分：" + e);
      let payMoney = e,
        payIntegral = d;

      let goodsList = [];
      for (var i in this.addobjCountList) {
        let Obj = {
          GoodsId: this.addobjCountList[i].GoodsId,
          Qty: this.addobjCountList[i].Qty,
          Price: this.addobjCountList[i].PRICE,
          PayIntegral: this.addobjCountList[i].allIntegral * this.addobjCountList[i].Qty,
          giftName: this.addobjCountList[i].goodsname,
          giftCode: this.addobjCountList[i].CODE
        };
        goodsList.push(Obj);
      }

      this.submitLoading = true;

      this.$store.dispatch("getIntegralExchange", {
        PayIntegral: payIntegral,
        PayMoney: payMoney,
        Remark: this.Remark,
        VipId: this.VipId,
        IsSms: this.IsSms,
        goodsdetail: JSON.stringify(goodsList)
      });

      nscreenexCodeFun(4, String(this.totalTotal.GIFTINTEGRAL));
    },
    setcommonHeight() {
      let elememtheight = this.$refs.elememt.offsetHeight;
      let footerheight = this.$refs.footer.offsetHeight;
      this.$refs.addsockheight.style.height = elememtheight - footerheight - 140 + "px";
    },
    setfenleiWidth() {
      let elefenleiWidthsock = this.$refs.fenleiWidthsock.offsetWidth;
      this.$refs.swipercontainersock.style.width = elefenleiWidthsock - 179 + "px";
    },
    fenleiscrollwidth() {
      this.$nextTick(function () {
        var mySwiper = new Swiper(".swiper-container", {
          slidesPerView: 12,
          paginationClickable: !0,
          spaceBetween: 4,
          freeMode: !0
        });
      });
    }
  },
  components: {
    yjemployee,
    recharge
  },
  beforeCreate() {
    let list = this.$store.state.commodityc.commoditycflList;
    if (list.length == 0) {
      this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    }
    this.$store.dispatch("getGoodsList4", {
      IsGift: 1,
      Filter: "",
      PN: 1
    });
  },
  mounted() {
     let printRules = localStorage.getItem(SYSTEM_INFO.PREFIX + "Print5");
    let jsonPrintData = JSON.parse(printRules);
    this.checkedreceipt = jsonPrintData.autoPrint;

    this.$store.dispatch("getGoodsList4", {}).then(() => {});
    this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    this.setcommonHeight();
    this.fenleiscrollwidth();
    this.pagination = {
      TotalNumber: this.dataListState.paying.TotalNumber,
      PageNumber: this.dataListState.paying.PageNumber,
      PageSize: this.dataListState.paying.PageSize,
      PN: this.dataListState.paying.PN
    };
    this.pagelist = [...this.dataList];
  }
};
</script>
<style scoped>
.classification_List {
  overflow: hidden;
  margin-left: 10px;
}

.classification_List ul li {
  float: left;
  width: 58px;
  text-align: center;
  cursor: pointer;
  line-height: 38px;
  margin-right: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  color: #333333;
}

.classification_List ul li.selected {
  color: #2589ff;
  border-bottom: 2px solid #2589ff;
}

.commodityc_rightsock {
  width: 100%;
  /* height: 660px; */
  /* background: #2589FF; */
  margin-top: 12px;
}

.f-botton-fs .el-form-item__label {
  text-align: left !important;
}

.f-botton-fs .fastc_top {
  margin-top: 50px;
}

.f-botton-fssock .el-dialog__body {
  padding: 5px 20px;
}

.timescountc_left ul.productNav {
  /*padding: 0 12px;*/
  overflow: hidden;
  height: 26px;
  line-height: 26px;
  color: #795548;
  background-color: rgba(251, 120, 154, 0.3294117);
}

.timescountc_left ul.productNav li {
  float: left;
  text-align: center;
}

.timescountc_left ul#addshopList li {
  margin-top: 6px;
  width: 100%;
  overflow: hidden;
  padding: 4px 0;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo {
  overflow: hidden;
  width: 100%;
  float: left;
  color: #9e9e9e;
  font-size: 12px;
  margin-top: 5px;
  cursor: pointer;
}

.timescountc_left ul#addshopList .cateringProductNamebox {
  width: 15%;
  float: left;
  text-align: center;
}

.timescountc_left_footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

/*模板样式*/
.timescountc_right .tablelcenter {
  /* height: 60px; */
  overflow: hidden;
  position: relative;
  border: 1px solid #ded9d9;
  cursor: pointer;
  background: #fff;
}
.timescountc_right .tablelcenter .menu-img img {
  height: 50px;
  width: 50px;
  vertical-align: middle;
  border: 0;
  float: left;
  margin-right: 5px;
  overflow: hidden;
}

.timescountc_right .tablelcenter .menu-txt {
  position: absolute;
  bottom: 9px;
  right: 8px;
  padding-top: 25px;
}
.addshopList-cont {
  height: 80px;
  width: 100%;
  background: #fff;
}
.addshopList-cont-list {
  display: flex;
  height: 35px;
  align-items: center;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.addshopList-cont-list .name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.addshopList-cont-list .discountMoney {
  font-size: 14px;
  font-family: HelveticaCyr Upright;
  font-weight: bold;
  color: rgba(153, 153, 153, 1);
}
.shopMoney {
  text-align: right;
  font-size: 14px;
  font-family: HelveticaCyr Upright;
  font-weight: bold;
  color: rgba(255, 0, 0, 1);
}
.footer_btn {
  height: 40px;
  line-height: 40px;
}
.search_sock {
  height: 50px;
  line-height: 50px;
  background: #fff;
  width: 100%;
  border-left: solid 1px #ebedf0;
  border-bottom: solid 1px #ebedf0;
}
.search_sock-input {
  width: 100%;
}
.search_sock-shop {
  width: 50%;
  text-align: right;
}
.footer_top {
  /* height: 60px; */
  width: 100%;
  /* background: #fff; */
}
.footer_btn {
  width: 93%;
  margin-left: 5%;
  margin-right: 2%;
  height: 60px;
  display: flex;
  align-items: center;
}
.swiper-container {
  display: flex;
  align-items: center;
  background: #fff;
}
.commodity-right-good-list {
  padding-top: 10px;
  width: 100%;
  padding-right: 10px;
}
.swiper-container-left {
  width: 20px;
  text-align: right;
  background: #fff;
  z-index: 99999;
}
.swiper-container-right {
  width: 20px;
  text-align: left;
  z-index: 99999;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-track {
  background-color: #e3e3e5;
}
::-webkit-scrollbar-thumb {
  background-color: #979799;
}

.img-box {
  width: 100%;
  height: 60px;
  overflow: hidden;
}
.img {
  display: flex;
  align-items: center;
  width: 100%;
  height: 59px;
}
.img:hover {
  transform: scale(1.03, 1.03);
}
.timescountc_left_footer >>> .el-input__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #444444;
}
.el-icon-delete {
  color: #b6b6b6;
  cursor: pointer;
}
.integralTol {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  border-bottom: 1px solid #ebedf0;
  background: #fff;
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
  cursor: pointer;
}
</style>
