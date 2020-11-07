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
                    padding-right: 0px;
                    padding-left: 0px;
                    background: rgb(248, 248, 249);
                  "
                >
                  <div class="commodityc-top">
                    <span class="title">计次充值</span>
                    <span class="commodityc-top-text" @click="resetData">清空页面</span>
                  </div>
                  <div style="padding-top: 10px; padding-left: 10px; padding-right: 10px">
                    <dropdown
                      @getmemberID="getmemberID"
                      :details="Object.keys(selmember).length > 0 ? selmember : new Object()"
                    ></dropdown>
                    <div class="timescountc_left overflowscroll" ref="addsockheight">
                      <ul id="addshopList">
                        <li
                          class="danpintr"
                          v-for="(item, i) in addobjCountList"
                          :key="i"
                          @click="editChange(item, i)"
                          v-if="addobjCountList.length > 0"
                        >
                          <div class="goodList">
                            <el-row class="goodList-top">
                              <el-col :span="12">
                                <div class="goodList-top-name">{{ item.goodsname }}</div>
                              </el-col>
                              <el-col :span="12" class="goodList-top-price">
                                <i
                                  class="el-icon-delete"
                                  @click.stop="deleteGoods(i)"
                                  style="margin-right: 5px"
                                ></i>
                              </el-col>
                            </el-row>
                            <el-row class="goodList-center">
                              <el-col :span="8">
                                <div class="goodList-top-discountMoney">
                                  ￥{{ item.discountMoney }}
                                </div>
                              </el-col>
                              <el-col :span="8" style="text-align: center">
                                <el-input-number
                                  style="width: 100px"
                                  @click.native.stop
                                  @change="addjiajianhao1(i, item.Qty)"
                                  size="mini"
                                  v-model.number="item.Qty"
                                  :min="1"
                                ></el-input-number>
                              </el-col>
                              <el-col :span="8" class="shopMoney">
                                <span style="margin-right: 5px">
                                  ￥{{ (item.discountMoney * item.Qty).toFixed(2) }}
                                </span>
                              </el-col>
                            </el-row>
                            <el-row class="goodList-bottom">
                              <div class="cateringProductMoreinfo">
                                <el-row>
                                  <el-col :span="10">
                                    <div class="cateringProductMoreinfo-time">
                                      <div class="tiele">
                                        <span>有效期</span>
                                      </div>
                                      <div class="selettime">
                                        <span style="padding: 0px">{{ item.showInvalidDate }}</span>
                                      </div>
                                    </div>
                                  </el-col>
                                  <el-col :span="14" style="text-align: right">
                                    <div
                                      class="validityright inline-block pull-right"
                                      style="width: 240px; margin-right: 5px"
                                    >
                                      <span
                                        class="el-tag"
                                        v-for="(itemd, index) in selectTimedata"
                                        :key="index"
                                        :class="{ selected: index == item.statusactive }"
                                        @click.stop="selectmouthTime(i, index, itemd.mouthday)"
                                      >
                                        {{ itemd.name }}
                                      </span>
                                      <el-date-picker
                                        v-model="otherDate"
                                        type="date"
                                        placeholder="选择日期"
                                        style="wdith: 1px; height: 0px"
                                        class="inline-block overflow-hidden pull-right"
                                        ref="otherDate"
                                        @change="selectmouthTime2"
                                      ></el-date-picker>
                                    </div>
                                  </el-col>
                                </el-row>
                              </div>
                            </el-row>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="timescountc_left_footer" ref="footer">
                      <div style="margin-left: 10px; margin-right: 10px">
                        <div style="margin-bottom: 5px" v-if="addobjCountList.length > 0">
                          <el-select
                            class="g-public-multi-select"
                            v-model="value"
                            placeholder="请选择销售员"
                            multiple
                            style="width: 100%"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </div>
                        <div style="margin-bottom: 5px">
                          <el-input
                            :rows="2"
                            v-model="Remark"
                            placeholder="请输入备注信息"
                          ></el-input>
                        </div>
                        <div style="margin-bottom: 5px">
                          <el-row
                            style="height: 40px; width: 100%; line-height: 40px; margin-top: 5px"
                          >
                            <el-col :span="9" class="discount">
                              <div class="discount-title">￥</div>
                              <el-input
                                :rows="2"
                                style="width: 120px"
                                v-model="GiftMoney"
                                @input="changeGiftMoney"
                                placeholder="请输入优惠金额"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </div>
                        <div
                          class="footer_top"
                          style="
                            margin: 6px 0;
                            background-color: #fff;
                            height: 60px;
                            line-height: 60px;
                          "
                        >
                          <el-row>
                            <el-col :span="12">
                              <span>收款</span>
                              <span class="priceTolTime">￥{{ TotalPrice }}</span>
                              <el-popover placement="top" width="180" v-model="visible">
                                <p style="text-align: center">实收金额</p>
                                <el-input
                                  :rows="2"
                                  size="small"
                                  style="margin-bottom: 20px"
                                  v-model="changeTotalPrice"
                                  placeholder="请输入实收金额"
                                ></el-input>
                                <div style="text-align: right; margin: 0">
                                  <el-button size="mini" type="info" @click="visible = false">
                                    取消
                                  </el-button>
                                  <el-button type="primary" size="mini" @click="changeTotal">
                                    确定
                                  </el-button>
                                </div>
                                <i slot="reference" class="el-icon-edit-outline"></i>
                              </el-popover>
                            </el-col>
                            <el-col :span="6">
                              <div style="width: 10px; height: 10px"></div>
                            </el-col>
                            <el-col :span="6">
                              <el-button
                                style="width: 95%"
                                type="danger"
                                @click="co_reckoning()"
                                size="medium"
                              >
                                收款
                              </el-button>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16" style="padding-left: 0px; padding-right: 0px">
                  <div class="commodity-right">
                    <div class="search_sock">
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
                      <div class="commodityc_rightsock" :style="{ height: tableHeight + 'px' }">
                        <div
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
                              v-if="item.GIFTINTEGRAL == 0 || item.GIFTINTEGRAL > 0"
                            >
                              <div class="tablelcenter" @click="addcommodityc(item)">
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
                                      <div
                                        style="
                                          height: 30px;
                                          width: 110px;
                                          line-height: 35px;
                                          text-overflow: ellipsis;
                                          overflow: hidden;
                                          white-space: nowrap;
                                        "
                                      >
                                        {{ item.NAME }}
                                      </div>
                                      <div style="height: 30px; width: 110px; line-height: 25px">
                                        <el-row>
                                          <el-col :span="10">
                                            <span class="font-600 text-theme2" style="width: 60%">
                                              <span>
                                                &yen;{{
                                                  item.DISPRICE == undefined
                                                    ? item.PRICE
                                                    : item.DISPRICE
                                                }}
                                              </span>
                                            </span>
                                          </el-col>
                                          <el-col :span="14">
                                            <span style="color: #a3a3a3">
                                              <i style="color: rgb(25, 23, 23)">库</i>
                                              {{ item.STOCKQTY }}
                                            </span>
                                          </el-col>
                                        </el-row>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                      <div v-show="pagelist.length > 0" class="m-top-sm clearfix elpagination">
                        <el-pagination
                          background
                          @size-change="handlePageChange"
                          @current-change="handlePageChange"
                          :current-page.sync="pagination.PN"
                          :page-size="pagination.PageSize"
                          layout="total,prev, pager, next, jumper"
                          :total="pagination.TotalNumber"
                          class="text-right"
                        ></el-pagination>
                      </div>
                    </div>
                    <div class="eitcontant-conttan">
                      <el-dialog :visible.sync="eitcontant" title="修改选择的商品" width="35%">
                        <div>
                          <div class="eitcontant-shop">
                            <el-row class="showEit-top">
                              <el-col :span="6">
                                <img
                                  :src="eitDatashop.showgoodsimg"
                                  onerror="this.src='static/images/shopmore.png'"
                                />
                              </el-col>
                              <el-col :span="9" class="showEit-title">
                                <div>{{ eitDatashop.goodsname }}</div>
                                <div>{{ eitDatashop.CODE }}</div>
                              </el-col>
                              <el-col
                                :span="8"
                                style="text-align: right; margin-top: 40px; color: #db4a41"
                              >
                                <span>￥{{ eitDatashop.Price }}</span>
                              </el-col>
                            </el-row>
                            <el-row class="showEit-center">
                              <div class="showEit-center-money">
                                <div class="showEit-center-money-tt">
                                  <span>本次售价</span>
                                  <input
                                    class="showEit-input"
                                    v-model="eitprice"
                                    @input="eitpriceChange"
                                  />
                                </div>
                              </div>
                              <div class="showEit-center-money">
                                <div class="showEit-center-money-tt">
                                  <span>本次折扣</span>
                                  <input
                                    class="showEit-input"
                                    v-model="eitdiscount"
                                    @change="discountChange"
                                  />
                                </div>
                              </div>
                              <div class="showEit-center-money">
                                <el-row class="showEit-center-money-tt">
                                  <el-col style="display: flex">
                                    <div>销售数量</div>
                                    <div class="sumchange" style="margin-left: 30px">
                                      <el-input-number
                                        style="width: 100px"
                                        @click.native.stop
                                        @change="addjiajianhao1(eitDatashop.i, eitDatashop.Qty)"
                                        size="mini"
                                        v-model.number="eitDatashop.Qty"
                                        :min="1"
                                      ></el-input-number>
                                    </div>
                                  </el-col>
                                </el-row>
                              </div>
                              <div class="showEit-center-money">
                                <div class="showEit-center-money-tt">
                                  <el-row>
                                    <el-col :span="5" style="line-height: 30px">
                                      <span>有限期至</span>
                                    </el-col>
                                    <el-col :span="11" style="line-height: 30px">
                                      <el-date-picker
                                        style="width: 180px"
                                        v-model="value1"
                                        type="date"
                                        size="small"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期"
                                      ></el-date-picker>
                                    </el-col>
                                    <el-col :span="8" style="text-align: right; line-height: 30px">
                                      <el-checkbox class="showEit-input" v-model="checked">
                                        永久有限
                                      </el-checkbox>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                              <el-row class="showEit-bottom">
                                <el-col :span="13">
                                  <el-button
                                    type="info"
                                    size="medium"
                                    @click="deleteGoods(eitDatashop.i)"
                                  >
                                    删除商品
                                  </el-button>
                                </el-col>
                                <el-col :span="7" style="text-align: center">
                                  <el-button plain size="medium" @click="eitcontant = false">
                                    取消
                                  </el-button>
                                </el-col>
                                <el-col :span="4" style="text-align: right">
                                  <el-button
                                    type="primary"
                                    size="medium"
                                    @click="saveShop(eitDatashop.i)"
                                  >
                                    确定
                                  </el-button>
                                </el-col>
                              </el-row>
                            </el-row>
                          </div>
                        </div>
                      </el-dialog>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-dialog v-if="showRecharge" title="收银" :visible.sync="showRecharge" width="800px">
            <recharge
              @closeModalrecharge="showRecharge = false"
              :totalprice="{
                price: TotalPrice,
                discount: 0,
                integral: integral,
                title: '充值日期'
              }"
              :isselectvip="VipId"
              @CashRecharge="CashRecharge"
              :rechargestatus="5"
              ref="SurveyForm"
            ></recharge>
          </el-dialog>
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
        </div>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import Vue from "vue";
import { GOODS_IMGURL } from "@/util/define";
import { getDayindate } from "@/util/Printing";
import { nscreenexCodeFun } from "@/util/objectivity";
import { getparametersetup } from "@/util/com/index";
import { mapState, mapGetters } from "vuex";
import { getHomeData, getUserInfo } from "@/api/index";

import royaltySel from "@/components/selected/selroyalty2.vue";
import recharge from "@/components/Recharge/Recharge";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
let _ = require("lodash");
import MIXINS_CHECKOUT from "@/mixins/checkout";
import MIXINS_MONEY from "@/mixins/money";
import MIXINS_CLEAR from "@/mixins/clearAllData";
export default {
  mixins: [MIXINS_CHECKOUT.CHOOSE_MEMBER, MIXINS_MONEY.MONEY_MENU, MIXINS_CLEAR.LOGOUT],
  data() {
    return {
      checked: false,
      value1: "",
      options: [],
      changeTotalPrice: "",
      visible: false,
      value: "",
      timescountrstatus: false,
      getgoodsIMGURL: "",
      current: 0,
      index: "ok",
      searchText: "",
      objCount: [],
      addobjCountList: [],
      total: 0,
      TotalPrice: 0,
      TotalPrices: 0,
      checkedreceipt: false,
      checkedmessage: false,
      pagelist: [],
      input: "",
      Remark: "",
      GiftMoney: "",
      selectTimedata: [
        {
          name: "1个月",
          mouthday: 1
        },
        {
          name: "6个月",
          mouthday: 6
        },
        {
          name: "1年",
          mouthday: 12
        },
        {
          name: "永久有效",
          mouthday: "ok"
        }
      ],
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
        Status: 1,
        Mode: 1,
        TypeID: "", //商品类别ID
        DescType: 0
      },
      showyjemployee: false,
      showRecharge: false,
      shopitemList: {},
      datalistval: {},
      showTishi: "",
      empList: [],
      SaleEmpMoneyArray: [],
      showRecharge: false,
      otherDate: "",
      selectmouthTime_data: {},
      pageItemData: { EmpAddRate: 0, TotalPrice: 0, isShow: false },
      royaltyData: {
        data: {},
        default: []
      },
      eitcontant: false,
      eitDatashop: [],
      eitprice: "",
      eitdiscount: "",
      value2: "",
      goodType: "",
      isneedsaler: "",
      tableHeight: document.body.clientHeight - 175,
      isneedsaler: "",
      shopInfo: getHomeData().shop,
      isShowShop: false,
      theshopList: [],
      activePath: "",
      shopName: getUserInfo().CompanyName,
      num: "1",
      integral: ""
    };
  },
  computed: {
    ...mapGetters({
      memberState: "memberState",
      employeeList: "employeeList",
      commoditycflListState: "commoditycflListState",
      commoditycflList: "commoditycflList",
      setmealrtimesrechargeState: "setmealrtimesrechargeState",
      dataList: "goodsListNew",
      dataListState: "goodsListNewState",
      shopList: "shopList",
      shopListState: "shopListState"
    })
  },
  created() {
    //生命周期里接收参数
    let getInfo = getUserInfo();
    this.isneedsaler = getInfo.CompanyConfig.ISNEEDSALER;
  },
  watch: {
    employeeList(data) {
      this.options = [];
      let employeemen = data;
      for (var i in employeemen) {
        let Obj = {
          value: employeemen[i].ID,
          label: employeemen[i].NAME
        };
        this.options.push(Obj);
      }
    },
    memberState(data) {
      if (data.success) {
        this.objCount = data.data.objCount;
      }
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
    setmealrtimesrechargeState(data) {
      if (this.timescountrstatus) {
        if (data.success) {
          this.$message({
            message: "计次充值成功",
            type: "success"
          });
          this.setmealrPrice = "";
          this.setmealrName = "";
          this.rechargecount = "";
          this.writetime = "";
          this.GoodsPackId = "";
          this.rechargeGoodsList = [];
          this.timescountrstatus = false;
          this.resetData();
          let qresurl = this.$store.state.commodityc.saveQRcodeIMG;
          if (this.$store.state.recharge.isPrintsatus) {
            getDayindate("210020150_1", data.data.BillId, 5, qresurl);
          }
        } else {
          this.$message(data.message);
          this.timescountrstatus = false;
        }
      }
    },
    searchText() {
      this.searchfun();
    }
  },
  methods: {
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
        this.$store.dispatch("getShopList",{});
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
    changeGiftMoney() {
      if (this.GiftMoney < this.TotalPrice) {
        this.dealTotalData();
      } else {
        this.GiftMoney = 0;
        this.$message.error("优惠金额不可以大于选购的商品总金额");
        this.dealTotalData();
      }
    },
    //改变商品数量
    changeQty(event, i) {
      this.addobjCountList[i].Qty = event.Qty;
      this.dealTotalData();
    },
    //修改实收金额
    changeTotal() {
      this.visible = false;
      console.log(this.TotalPrice);
      this.GiftMoney = this.TotalPrices - this.changeTotalPrice;
      this.TotalPrice = this.changeTotalPrice;
      console.log(this.TotalPrice);
    },
    //删除商品事件
    deleteGoods(i) {
      this.addobjCountList.splice(i, 1);
      this.dealTotalData();
      this.eitcontant = false;
    },
    selectmouthTime(i, index, mouthday) {
      let item = this.addobjCountList[i];

      if (index == 4) {
        console.log(this.$refs.otherDate[i]);
        this.$refs.otherDate[i].showPicker();
        this.selectmouthTime_data = { i, index };
        return;
      }
      if (mouthday == "ok") {
        item.IsInvalid = 0;
        item.InvalidDate = "9999999999999";
        item.showInvalidDate = "永久有效";
      } else {
        let InvalidDate = this.getMouthorYearDay(mouthday);
        item.IsInvalid = 1;
        item.InvalidDate = this.getTimeStampstatuesOutput(InvalidDate);
        item.showInvalidDate = this.filterTimeOut(new Date(InvalidDate));
      }

      item.statusactive = index;

      this.addobjCountList = [...this.addobjCountList];
    },
    selectmouthTime2(v) {
      let item = this.addobjCountList[this.selectmouthTime_data.i];
      item.IsInvalid = 1;
      item.InvalidDate = v.getTime();
      item.showInvalidDate = this.filterTimeOut(v);

      item.statusactive = this.selectmouthTime_data.index;
      this.addobjCountList = [...this.addobjCountList];
      this.selectmouthTime_data = {};
    },
    getmemberDetail(item) {
      this.$store.dispatch("getMemberItem", item).then(() => {});
    },
    getmemberID(id, data) {
      console.log("积分", data.INTEGRAL);
      (this.integral = data.INTEGRAL), (this.VipId = id);
      this.$store.dispatch("selectingMember", {
        isArr: false,
        data: data
      });
    },
    getNewData() {
      this.$store.dispatch("getGoodsListNew", this.pageData).then(() => {
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
    //选择商品的方法
    addcommodityc(item) {
      this.setcommonHeight();
      let count = 1;
      if (this.addobjCountList.length > 0) {
        for (let i = 0; i < this.addobjCountList.length; i++) {
          if (this.addobjCountList[i].GoodsId == item.ID) {
            this.addobjCountList[i].Qty = this.addobjCountList[i].Qty + 1;
            break;
          } else {
            if (i + 1 < this.addobjCountList.length) {
              continue;
            } else {
              this.addobjCountList.push({
                goodsname: item.NAME,
                Qty: count,
                GoodsId: item.ID,
                retailprice: item.PRICE,
                Discount: 1,
                Price: item.PRICE,
                itemObj: item,
                statusactive: 3,
                IsInvalid: 0,
                InvalidDate: "",
                showInvalidDate: "永久有效",
                IsInvalid2: item.IsInvalid2,
                discountMoney: item.PRICE,
                showgoodsimg: item.showgoodsimg,
                CODE: item.CODE
              });
              break;
            }
          }
        }
      } else {
        this.addobjCountList.push({
          goodsname: item.NAME,
          Qty: count,
          GoodsId: item.ID,
          retailprice: item.PRICE,
          Discount: 1,
          Price: item.PRICE,
          itemObj: item,
          statusactive: 3,
          IsInvalid: 0,
          InvalidDate: "",
          showInvalidDate: "永久有效",
          IsInvalid2: false,
          discountMoney: item.PRICE,
          showgoodsimg: item.showgoodsimg,
          CODE: item.CODE
        });
      }
      this.dealTotalData();
    },
    //计算总价钱
    dealTotalData() {
      this.total = 0;
      this.TotalPrice = 0;
      for (let i in this.addobjCountList) {
        this.total += this.addobjCountList[i].Qty;
        this.TotalPrice += this.addobjCountList[i].discountMoney * this.addobjCountList[i].Qty;
      }
      this.TotalPrices = this.TotalPrice;
      this.TotalPrice = this.TotalPrice - this.GiftMoney;
    },
    addjiajianhao1(i, e) {
      this.$nextTick(() => {
        console.log(this.addobjCountList[i].Qty);
        let flag = new RegExp("^[1-9]([0-9])*$").test(e);
        if (!flag) {
          this.$message({
            showClose: true,
            message: "请输入正整数",
            type: "warning"
          });
          this.addobjCountList[i].Qty = 1;
          this.dealTotalData();
        }
      });
      this.dealTotalData();
    },
    editChange(e, i) {
      this.eitcontant = true;
      this.eitprice = e.discountMoney;
      this.eitDatashop = e;
      this.value1 = this.eitDatashop.showInvalidDate;
      this.$set(this.eitDatashop, "i", i);
      this.eitdiscount = parseFloat(e.discountMoney) / parseFloat(e.Price);
      if (e.showInvalidDate == "永久有效") {
        this.checked = true;
        this.value1 = "";
      } else {
        this.checked = false;
      }
    },
    //保存编辑商品的事件
    saveShop(i) {
      this.addobjCountList[i].discountMoney = parseFloat(this.eitprice);
      this.addobjCountList[i].shopMoney = parseFloat(this.eitprice) * this.addobjCountList[i].Qty;
      this.addobjCountList[i].retailprice = parseFloat(this.eitprice);
      this.addobjCountList[i].showInvalidDate = this.value1;
      this.eitcontant = false;
      this.dealTotalData();
      if (this.checked == true) {
        this.addobjCountList[i].showInvalidDate = "永久有效";
      }
    },
    eitpriceChange() {
      this.eitdiscount = parseFloat(this.eitprice) / parseFloat(this.eitDatashop.Price);
    },
    //输入折扣改变商品价格的方法
    discountChange() {
      this.eitprice = this.eitdiscount * this.eitprice;
    },
    //请空页面数据
    resetData() {
      this.VipId = "";
      this.datalistval = {};
      this.addobjCountList = [];
      this.total = "";
      this.TotalPrice = "";
      this.SaleEmpMoneyArray = [];
      this.royaltyData = {
        data: {},
        default: []
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
    // 充值
    co_reckoning() {
      if (this.VipId == "") {
        this.$message("请选择会员");
        return;
      }
      if (this.isneedsaler == true) {
        if (this.value.length > 0) {
        } else {
          this.$message("请选择销售员");
          return;
        }
      }
      nscreenexCodeFun(4, String(this.TotalPrice));
      this.showRecharge = true;
    },
    // 确认支付
    CashRecharge(data) {
      this.showRecharge = false;
      let gList = [];
      for (let i = 0; i < this.addobjCountList.length; i++) {
        let item = this.addobjCountList[i];
        gList.push({
          GoodsId: item.GoodsId,
          Qty: item.IsInvalid2 ? 0 : item.Qty,
          Price: item.Price,
          IsInvalid: item.IsInvalid2 ? 2 : 0,
          InvalidDate: item.IsInvalid == 1 ? item.InvalidDate : "9999999999999"
        });
      }

      let param = this.value,
        str = ""; // 销售员
      for (let i in param) {
        str += param[i] + ",";
      }
      if (str.length > 0) {
        //去掉最后一个逗号
        str = str.substring(0, str.length - 1);
      }

      let otherdata = {
        GoodsList: JSON.stringify(gList),
        GiftMoney: this.GiftMoney,
        VipId: this.VipId,
        Remark: this.Remark,
        SaleEmpList: str
      };
      let AllsendData = Object.assign({}, otherdata, data);

      AllsendData.PayTypeID = AllsendData.PaytypeId;
      delete AllsendData.PaytypeId;
      this.$store.dispatch("getsetmealrtimesrechargeState", AllsendData).then(() => {
        this.timescountrstatus = true;
      });
    },
    setcommonHeight() {
      var elememtheight = this.$refs.elememt.offsetHeight;
      var footerheight = this.$refs.footer.offsetHeight;
      this.$refs.addsockheight.style.height = elememtheight - footerheight - 132 + "px";
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
    recharge,
    royaltySel
  },
  beforeCreate() {
    let list = this.$store.state.commodityc.commoditycflList;
    if (list.length == 0) {
      this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    }
    this.$store.dispatch("getGoodsListNew", {
      Status: 1,
      Mode: -1,
      Filter: "",
      PN: 1,
      TypeID: ""
    });

    let list1 = this.$store.state.employee.employeeList;
    if (list1.length == 0) {
      this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID }).then(() => {
        console.log(this.$store.state.employee.employeeList);
      });
    }
  },
  mounted() {
    this.$store.dispatch("getEmployeeList", { ShopId: getHomeData().shop.ID }).then(() => {
      console.log(this.$store.state.employee.employeeList);
    });
    this.$store.dispatch("getcommoditycflList", {}).then(() => {});
    this.setcommonHeight();
    // this.setfenleiWidth();
    this.fenleiscrollwidth();
  }
};
</script>
<style scoped>
/* .sumchange-goods{
    margin-top: 28px;
} */
.t-botton-timescountc .el-tag {
  line-height: 20px;
  height: inherit;
  padding: 0 5px;
  margin-left: 5px;
}

.t-botton-timescountc .el-tag.selected {
  background: #2589ff;
  color: #fff;
}

.classification_List {
  overflow: hidden;
  /* border-bottom: 2px solid #ccc; */
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
  /* background: #2589FF; */
  margin-top: 12px;
}

.employee_ms .el-form-item__content {
  width: 70%;
}

.f-botton-fs .el-form-item__label {
  text-align: left !important;
}

.f-botton-fs .fastc_top {
  margin-top: 50px;
}

.timescountc_left ul#addshopList li {
  margin-top: 6px;
  width: 100%;
  overflow: hidden;
  padding: 4px 0;
  background: #fff;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo {
  overflow: hidden;
  width: 100%;
  float: left;
  color: #9e9e9e;
  font-size: 12px;
  cursor: pointer;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo .validityleft {
  line-height: 25px;
}

.timescountc_left ul#addshopList li .cateringProductMoreinfo .validityleft span:last-child {
  border-bottom: 1px solid red;
  padding: 0 12px;
  padding-bottom: 2px;
}
.cateringProductMoreinfo-time {
  display: flex;
}
.cateringProductMoreinfo-time .tiele {
  width: 40px;
  padding-top: 5px;
}
.cateringProductMoreinfo-time .selettime {
  width: 70px;
  border-bottom: 1px solid red;
  padding-top: 5px;
  color: #333333;
  text-align: center;
}

.timescountc_left ul#addshopList .cateringProductNamebox {
  width: 16%;
  float: left;
}

.timescountc_left_footer {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
}

/*模板样式*/
.timescountc_right .tablelcenter {
  height: 60px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e3e3e3;
  /* padding: 8px; */
  cursor: pointer;
}
.commodityc-top {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  /* text-align: center; */
  font-size: 9px;
  background: #fff;
  font-weight: 400;
  /* border-right: solid 1px #EBEDF0; */
  color: rgba(0, 0, 0, 1);
}
.commodityc-top .title {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  padding-left: 20px;
}
.commodityc-top-text {
  position: absolute;
  right: 20px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 300;
  color: rgba(37, 137, 255, 1);
  cursor: pointer;
}
.goodList {
  height: 107px;
  width: 100%;
  background: #fff !important;
}
.goodList-top {
  display: flex;
  align-items: center;
  height: 35px;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.goodList-center {
  display: flex;
  align-items: center;
  height: 35px;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.goodList-bottom {
  display: flex;
  align-items: center;
  height: 35px;
  width: 96%;
  margin-left: 2%;
  margin-right: 2%;
}
.f_commodityc-left-bottm {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
}
.el-icon-edit-outline {
  font-size: 18px;
  margin-left: 10px;
}
.el-icon-delete {
  color: #b6b6b6;
  cursor: pointer;
}
.search_sock {
  height: 50px;
  line-height: 50px;
  background: #fff;
  width: 100%;
  border-left: solid 1px #ebedf0;
  border-bottom: solid 1px #ebedf0;
}
.commodity-right-good-list {
  padding-top: 10px;
  /* border-left: solid 1px #EBEDF0; */
  width: 100%;
  padding-right: 10px;
}
.commodity-right {
  position: relative;
  width: 100%;
  height: 100%;
}
.eitcontant-shop {
  width: 94%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 20px;
}
.eitcontant-title {
  height: 50px;
  width: 100%;
  line-height: 50px;
  text-align: center;
  border-bottom: solid 1px #ededed;
}
.eitcontant {
  width: 510px;
  height: 550px;
  position: absolute;
  top: 112px;
  left: 0px;
  background: #fff;
  z-index: 9999;
  border-radius: 6px;
  border: solid 1px #ededed;
}
.showEit-top {
  width: 100%;
  height: 100px;
  border: solid 1px #dddddd;
}
.showEit-top img {
  height: 50px;
  width: 50px;
  margin-top: 25px;
  margin-left: 25px;
}
.showEit-title {
  margin-top: 30px;
}
.showEit-center {
  margin-top: 15px;
  width: 100%;
  height: 335px;
  border: solid 1px #dddddd;
}
.showEit-center-money {
  position: relative;
  height: 60px;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  border-bottom: solid 1px #dddddd;
}
.showEit-center-money-tt {
  position: absolute;
  bottom: 8px;
}
.showEit-bottom {
  margin-top: 30px;
  height: 50px;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}
.showEit-input {
  border: none !important;
  margin-left: 30px;
}
.showEit-input1 {
  border: none !important;
  margin-left: 5px;
}
.showEit-center-money >>> .el-picker-panel__body {
  z-index: 9999 !important;
}
.goodList-top-name {
  height: 28px;
  line-height: 28px;
  width: 100%;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #444444;
}
.goodList-top-price {
  text-align: right;
}
.goodList-top-discountMoney {
  font-size: 14px;
  font-weight: bold;
  color: #838282;
}
.swiper-container {
  display: flex;
  align-items: center;
  background: #fff;
  /* margin-top: 5px; */
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
.timescountc_left_footer >>> .el-textarea__inner {
  border: 1px solid #fff !important;
  background: #fff;
  font-size: 12px;
  color: #d2d6d6;
}
.shop {
  line-height: 50px;
  height: 50px;
  text-align: right;
  padding-right: 20px;
  /* background: #fff; */
}
.shop .name {
  margin-right: 8px;
}
.icon-reorder {
  color: #2589ff;
  cursor: pointer;
}
.eitcontant-conttan >>> .el-dialog__body {
  padding: 0px 20px 30px 20px !important;
}
.eitcontant-conttan >>> .el-dialog__header {
  padding: 20px 20px 0px !important;
}
.shopMoney {
  text-align: right;
  font-size: 14px;
  font-family: HelveticaCyr Upright;
  font-weight: bold;
  color: rgba(255, 0, 0, 1);
}
.priceTolTime {
  color: #dc2823;
  font-weight: bold;
  font-size: 20px;
}
.discount {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
}
.discount-title {
  margin-left: 5px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  background: #3399ff;
  color: #fff;
  border-radius: 100%;
  font-size: 4px;
}
</style>
