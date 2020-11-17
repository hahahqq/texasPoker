/***
 *
 *优惠券
 *
 * */
import commonSend from "@/api/api";
import {
   MARKETING_SHOP_LIST,
   MARKETING_SHOP_LIST2,
   MARKETING_SHOP_LISTS,
   MARKETING_LIST,
   MARKETING_ITEM,
   STOP_MARKETING_ACTION,
   DEAL_MARKETING_ACTION,
   MARKETING_RECHARGE_SMSSIGN,
   MARKETING_LOT_LIST,
   MARKETING_LIST_IMG,
   GET_REGISTERGIFTS_DATA,
   GET_REGISTERGIFTS_ITEM,
   DEAL_REGISTERGIFTS,
   DEL_REGISTERGIFTS,
   MARKETING_DEL_IMG,
   MARKETING_RECHARGE_LIST,
   MARKETING_SAVE_IMG,
   MARKETING_RECHARGE_ADD,
   MARKETING_RECHARGE_DETAILED,
   MARKETING_RECHARGE_EIT,
   MARKETING_RECHARGE_STATYS,
   SAVE_SPECIALS,
   GET_SPECIALS_LIST,
   SPECIALS_ITEM,
   DEL_SPECIALS,
   SAVE_RecommendGifts,
   GET_RecommendGifts_ITEM,
   GET_RECOMMEND_LIST,
   GET_INCOME_ITEM,
   GET_INCOME_INFO,
   GET_BespeakDate_LIST,
   GET_BespeakTime_LIST,
   GET_APPLICATION_LIST,
   SET_APPLICATION_STATE,
   GET_REGISTERGIFTS_DEL,
   SET_VIPCARD_BACKGROUND,
   GET_VIPCARD_BACKGROUND,
   GET_INTEGRAL_RESET_LIST,
   DEL_INTEGRAL_RESET,
   SAVE_INTEGRAL_RESET,
   DETAIL_INTEGRAL_RESET,
   GETGAMEGOODS_COUPON_LIST,
   ADD_GAMEGOODS_COUPON,
   OPEN_CLOSE_COUPON,
   COUPON_GET_DETAILS,
   DEL_GETCOUPON,
   CANCEL_ALL_COUPON
} from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";
import { stat } from "fs";
import { data } from "jquery";

let selected = {};
var ListARR = {
   coupon: {
      title: "优惠券",
      InterfaceCode: "210021023_02",
      ItemCode: "601020824",
      CodeStop: "210021025",
      paying: { TotalNumber: 0, PageNumber: 0, PageSize: 20, PN: 0 },
      List: []
   },
   member: {
      InterfaceCode: "",
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   sms: {
      InterfaceCode: "",
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   goods: {
      title: "优惠商品",
      InterfaceCode: "210021012",
      ItemCode: "210021013",
      CodeStop: "210021014",
      paying: { TotalNumber: 0, PageNumber: 0, PageSize: 20, PN: 0 },
      List: []
   },
   promotion: {
      title: "优惠活动",
      InterfaceCode: "210021002",
      ItemCode: "210021003",
      CodeStop: "210021004",
      paying: { TotalNumber: 0, PageNumber: 0, PageSize: 20, PN: 0 },
      List: []
   }
};

// init state
const state = {
   cancelAllCouponState: {},
   delGetCouponState: {},
   coupouGetDetailsState: {},
   openCloseCoupouState: {},
   addGameGoodsCouponState: {},
   getGameGoodsCouponListState : {},
   detailIntegralResetState: {},
   saveIntegralResetState: {},
   delIntegralResetState: {},
   IntegralResetListState: {},
   marketingList: [],
   marketingListARR: Object.assign({}, ListARR),
   marketingListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   marketingRechargeListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   marketingShopListState2: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   marketingState: {},
   marketingItem: {},
   dealMarketingState: {},
   markeShopList: [],
   markeShopList1: [],
   marketingShopListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   marketingShopListState1: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   marketingLotList: {},
   registerGiftsData: [],
   registerGiftsDataState: {},
   delRegisterGiftsState: {},
   dealRegisterGiftsState: {},
   registerGiftsItem: {},
   marketingListImg: [],
   ImageMaxNum: "",
   marketingRechargeList: [],
   marketingSaveImg: "",
   marketingDelImg: "",
   specialsDataState: {},
   delSpecialsState: {},
   specialsItemState: {},
   saveSpecialsState: {},
   marketingRechargeAdd: {},
   marketingRechargedetailed: [],
   marketingRechargeeit: {},
   saveRecommendGiftsState: {},
   RecommendGiftsItemState: {},
   RecommendListState: {},
   RecommendVipItemState: {},
   RecommendVipInfoState: {},
   bespeakDateListState: {},
   bespeakTimeListState: {},
   applicationListState: {},
   setApplicationState: {},
   bespeakTimeListState: {},
   marketingRechargeDel: {},
   marketingRechargeStatus: {},
   marketingSmStage: {},
   setVipCardBackGround: {},
   getVipCardBackGround: {}
};

// getters
const getters = {
   cancelAllCouponState: state => state.cancelAllCouponState,
   delGetCouponState: state => state.delGetCouponState,
   coupouGetDetailsState: state => state.coupouGetDetailsState,
   openCloseCoupouState: state => state.openCloseCoupouState,
   getGameGoodsCouponListState: state => state.getGameGoodsCouponListState,
   addGameGoodsCouponState: state => state.addGameGoodsCouponState,
   detailIntegralResetState: state => state.detailIntegralResetState,
   saveIntegralResetState: state => state.saveIntegralResetState,
   delIntegralResetState: state => state.delIntegralResetState,
   IntegralResetListState: state => state.IntegralResetListState,
   getVipCardBackGround: state => state.getVipCardBackGround,
   setVipCardBackGround: state => state.setVipCardBackGround,
   setApplicationState: state => state.setApplicationState,
   applicationListState: state => state.applicationListState,
   bespeakTimeListState: state => state.bespeakTimeListState,
   bespeakDateListState: state => state.bespeakDateListState,
   RecommendVipInfoState: state => state.RecommendVipInfoState,
   RecommendVipItemState: state => state.RecommendVipItemState,
   RecommendListState: state => state.RecommendListState,
   saveRecommendGiftsState: state => state.saveRecommendGiftsState,
   RecommendGiftsItemState: state => state.RecommendGiftsItemState,
   saveSpecialsState: state => state.saveSpecialsState,
   specialsItemState: state => state.specialsItemState,
   delSpecialsState: state => state.delSpecialsState,
   specialsDataState: state => state.specialsDataState,
   marketingList: state => state.marketingList,
   marketingListState: state => state.marketingListState,
   marketingState: state => state.marketingState,
   marketingItem: state => state.marketingItem,
   marketingListARR: state => state.marketingListARR,
   dealMarketingState: state => state.dealMarketingState,
   markeShopList: state => state.markeShopList,
   markeShopList1: state => state.markeShopList1,
   marketingShopListState: state => state.marketingShopListState,
   marketingLotList: state => state.marketingLotList,
   marketingShopListState1: state => state.marketingShopListState1,
   marketingShopListState2: state => state.marketingShopListState2,
   registerGiftsData: state => state.registerGiftsData,
   registerGiftsDataState: state => state.registerGiftsDataState,
   delRegisterGiftsState: state => state.delRegisterGiftsState,
   dealRegisterGiftsState: state => state.dealRegisterGiftsState,
   registerGiftsItem: state => state.registerGiftsItem,
   marketingListImg: state => state.marketingListImg,
   ImageMaxNum: state => state.ImageMaxNum,
   marketingRechargeList: state => state.marketingRechargeList,
   marketingRechargeListState: state => state.marketingRechargeListState,
   marketingSaveImg: state => state.marketingSaveImg,
   marketingDelImg: state => state.marketingDelImg,
   marketingRechargeAdd: state => state.marketingRechargeAdd,
   marketingRechargedetailed: state => state.marketingRechargedetailed,
   marketingRechargeeit: state => state.marketingRechargeeit,
   marketingRechargeDel: state => state.marketingRechargeDel,
   marketingRechargeStatus: state => state.marketingRechargeStatus,
   marketingSmStage: state => state.marketingSmStage
};

// actions
const actions = {
   openCloseCoupon({commit}, data){  // 启用、停用优惠券
      let sendData = {
         'InterfaceCode': data.type == 0 ? '210021025' : '210021028',
         BillId: data.BillId
      }
      commonSend.commonSend(
         "post",
         data => {
            commit(OPEN_CLOSE_COUPON, { data });
         },
         sendData
      );
   },
   couponGetDetails({commit}, data){  // 优惠券领取详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: '920804',
         PN: data.PN,
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BillId,
         IsObj: 1,
         Filter: data.Filter,
         Status: data.Status ? data.Status : -1
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(COUPON_GET_DETAILS, { data });
         },
         sendData
      );
   },
   getGameGoodsCouponList({commit}, data){  // 营销 - 优惠券列表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: '920802',
         PN: data.PN,
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid ? data.IsValid : -1,
         Type: data.Type ? data.Type : -1
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(GETGAMEGOODS_COUPON_LIST, { data });
         },
         sendData
      );
   },
   delGetCoupon({commit}, data){  // 优惠券领取删除
      let sendData = {
         'InterfaceCode': '920805',
         BillId: data.BillId,
         Id: data.Id,
         VipId: data.VipId
      }
      commonSend.commonSend(
         "post",
         data => {
            commit(DEL_GETCOUPON, { data });
         },
         sendData
      );
   },
   cancelAllCoupon({commit}, data){  // 优惠券作废
      let homeInfo = getHomeData();
      let sendData = {
         'InterfaceCode': '210021029',
         'CompanyId': homeInfo.shop.COMPANYID,
         BillId: data.BillId
      }
      commonSend.commonSend(
         "post",
         data => {
            commit(CANCEL_ALL_COUPON, { data });
         },
         sendData
      );
   },

   addGameGoodsCoupon({commit}, data){  // 营销 - 发行优惠券
      let homeInfo = getHomeData()
      let sendData = {
         InterfaceCode: "920801",
         ImgName: '',
         ShopList: homeInfo.shop.ID,
         Money: data.Money,
         Qty: data.Qty,
         Remark: data.Remark,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         LimitMoney: data.LimitMoney ? data.LimitMoney : 0,
         Type: data.Type,
         Tel: "",
         Address: ""
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(ADD_GAMEGOODS_COUPON, { data });
         },
         sendData
      );
   },
   getBespeakDateList({ commit }, data) {
      // 预约日期列表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "601020923",
         CompanyId: homeInfo.shop.COMPANYID,
         EmpId: data.EmpId,
         TimeDate: data.TimeDate
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_BespeakDate_LIST, { data });
         },
         sendData
      );
   },
   getBespeakTimeList({ commit }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "601020924",
         CompanyId: homeInfo.shop.COMPANYID,
         EmpId: data.EmpId,
         TimeDate: data.TimeDate,
         GoodsId: data.GoodsId,
         ShopId: homeInfo.shop.ID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_BespeakTime_LIST, { data });
         },
         sendData
      );
   },
   getRecommendList({ commit }, data) {
      //推荐人报表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "6010341",
         CompanyId: homeInfo.shop.COMPANYID,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         Filter: "",
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_RECOMMEND_LIST, { data });
         },
         sendData
      );
   },
   getIncomeItem({ commit }, data) {
      //推荐人收益详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "6010343",
         CompanyId: homeInfo.shop.COMPANYID,
         VipId: data.VipId,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_INCOME_ITEM, { data });
         },
         sendData
      );
   },
   getIncomeVipInfo({ commit }, data) {
      // 推荐人详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "6010342",
         CompanyId: homeInfo.shop.COMPANYID,
         VipId: data.VipId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_INCOME_INFO, { data });
         },
         sendData
      );
   },
   saveRGiftsSet({ commit }, data) {
      //分享有礼保存
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "601020871",
         CompanyId: homeInfo.shop.COMPANYID,
         IsStart: data.IsStart,
         RShareGetType: data.RShareGetType,
         RVipGetType: data.RVipGetType,
         PVipPayMoney: data.PVipPayMoney,
         ShareGetType: data.ShareGetType,
         BrokerageMoney: data.BrokerageMoney,
         BrokerageRemark: data.BrokerageRemark,
         RShareGetQty: data.RShareGetQty,
         RVipGetQty: data.RVipGetQty,
         ShareGetQty: data.ShareGetQty
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(SAVE_RecommendGifts, { data });
         },
         sendData
      );
   },
   getRGiftsItem({ commit }) {
      //分享有礼详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "601020872",
         CompanyId: homeInfo.shop.COMPANYID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_RecommendGifts_ITEM, { data });
         },
         sendData
      );
   },
   getApplicationList({ commit }, data) {
      //提现申请列表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "601020241",
         CompanyId: homeInfo.shop.COMPANYID,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         IsCheck: data.IsCheck,
         IsCancel: data.IsCancel,
         IsFlag: data.IsFlag,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_APPLICATION_LIST, { data });
         },
         sendData
      );
   },
   setApplicationStep({ commit }, data) {
      //确认申请单(601020242)
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: data.InterfaceCode,
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BillId,
         Remark: ""
      };
      if (data.InterfaceCode == "601020244") {
         sendData.PayTypeName = "转账";
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(SET_APPLICATION_STATE, { data });
         },
         sendData
      );
   },
   saveSpecials({ commit }, data) {
      // 保存限时特价
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021051",
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.Name,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         IsStart: data.IsStart,
         GoodsList: data.GoodsList,
         Remark: data.Remark,
         ShopIdList: data.ShopIdList,
         ShopNameList: data.ShopNameList,
         IsVipDiscount: data.IsVipDiscount,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(SAVE_SPECIALS, { data });
         },
         sendData
      );
   },
   getSpecialsList({ commit }, data) {
      // 限时特价列表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021052",
         CompanyId: homeInfo.shop.COMPANYID,
         PN: data.PN,
         Filter: data.Filter,
         IsValid: data.IsValid
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_SPECIALS_LIST, { data });
         },
         sendData
      );
   },
   getSpecialsItem({ commit }, data) {
      // 限时特价详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021053",
         ShopId: homeInfo.shop.ID,
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(SPECIALS_ITEM, { data });
         },
         sendData
      );
   },
   delSpecials({ commit }, data) {
      // 限时特价删除
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021054",
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DEL_SPECIALS, { data });
         },
         sendData
      );
   },
   getMarketingList({ commit }, { obj, data }) {
      //
      let homeInfo = getHomeData();
      let pn = parseInt(state.marketingListARR[obj].paying.PN) + 1;
      let sendData = {
         InterfaceCode: state.marketingListARR[obj].InterfaceCode,
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid, // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0
         PN: data.PN ? data.PN : pn
      };
      selected.obj = obj;
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_LIST, { data });
         },
         sendData
      );
   },
   //充值赠送有礼列表
   getMarketingRechargeList({ commit, state }, data) {
      //
      let homeInfo = getHomeData();
      let pn = parseInt(state.marketingRechargeListState.paying.PN) + 1;
      let sendData = {
         InterfaceCode: 210021042,
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid, // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0
         PN: data.PN ? data.PN : pn,
         Filter: data.Filter
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_RECHARGE_LIST, { data });
         },
         sendData
      );
   },

   //充值赠送有礼详细
   getMarketingRechargeDetailed({ commit, state }, data) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: 210021044,
         CompanyId: homeInfo.shop.COMPANYID,
         Id: data
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_RECHARGE_DETAILED, { data });
         },
         sendData
      );
   },

   //充值有礼状态
   getMarketingRechargeStatus({ commit, state }, data) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: 601020856,
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: homeInfo.shop.ID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_RECHARGE_STATYS, { data });
         },
         sendData
      );
   },

   //发布充值有礼
   getMarketingRechargeAdd({ commit }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021041",
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.data.Name,
         BeginDate: data.data.BeginDate,
         EndDate: data.data.EndDate,
         IsStart: data.data.IsStart,
         GiftList: data.data.GiftList,
         ShopList: data.data.ShopList,
         ShopName: data.data.ShopName,
         Remark: "",
         IsDouble: 0
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MARKETING_RECHARGE_ADD, { data });
         },
         sendData
      );
   },
   //活动充值修改
   getMarketingRechargeEit({ commit }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021043",
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.data.Name,
         BeginDate: data.data.BeginDate,
         EndDate: data.data.EndDate,
         IsStart: data.data.IsStart,
         GiftList: data.data.GiftList,
         ShopList: data.data.ShopList,
         ShopName: data.data.ShopName,
         Remark: "",
         IsDouble: 0,
         Id: data.data.Id
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MARKETING_RECHARGE_EIT, { data });
         },
         sendData
      );
   },

   //活动充值删除
   getMarketingRechargeDel({ commit, state }, data) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: 210021045,
         CompanyId: homeInfo.shop.COMPANYID,
         Id: data
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(GET_REGISTERGIFTS_DEL, { data });
         },
         sendData
      );
   },

   //活动列表图片
   getMarketingListImg({ commit }, data) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: 21002061302,
         CompanyId: homeInfo.shop.COMPANYID,
         Type: data.Type
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_LIST_IMG, { data });
         },
         sendData
      );
   },

   //活动图片保存
   getMarketingSaveImg({ commit, state }, data) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: 21002061301,
         Id: data.Id ? data.Id : "",
         Image: data.Image,
         SmallImage: data.SmallImage,
         CompanyId: homeInfo.shop.COMPANYID,
         Type: data.Type,
         ImageNum: data.ImageNum
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_SAVE_IMG, { data });
         },
         sendData
      );
   },

   getMarketingShopList({ commit, state }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021023_01",
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid ? data.IsValid : 0, // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0
         PN: data.PN ? data.PN : 1,
         IsLitmitVip: 0
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_SHOP_LIST, { data });
         },
         sendData
      );
   },
   getMarketingShopList1({ commit, state }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021023_01",
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid ? data.IsValid : 1, // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0
         PN: data.PN ? data.PN : 1,
         IsLitmitVip: 0
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_SHOP_LISTS, { data });
         },
         sendData
      );
   },
   getMarketingShopList2({ commit, state }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021023_02",
         CompanyId: homeInfo.shop.COMPANYID,
         IsValid: data.IsValid ? data.IsValid : 0, // -1=全部，0=有效，1=失效。APP后台传入-1，微信公从号传入0
         PN: data.PN ? data.PN : 1,
         IsLitmitVip: 0
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_SHOP_LIST2, { data });
         },
         sendData
      );
   },
   getMarketingLotList({ commit, state }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021021_02",
         CompanyId: homeInfo.shop.COMPANYID,
         BillIdList: data.couponList,
         LitmitVipList: data.selMember,
         IsSMS: data.IsSMS
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_LOT_LIST, { data });
         },
         sendData
      );
   },
   setMarketingList({ commit, state }, obj) {
      let pageData = state.marketingListARR[obj].paying;
      state.marketingList = [...state.marketingListARR[obj].List];
      state.marketingListState = Object.assign(
         {
            message: "操作成功",
            success: true
         },
         { paying: pageData }
      );
   },
   getMarketingItem({ commit }, { obj, data }) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: state.marketingListARR[obj].ItemCode,
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BILLID
      };
      selected.obj = obj;
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_ITEM, { data });
         },
         sendData
      );
   },
   stopMarketingAction({ commit, state }, { obj, data }) {
      //
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: state.marketingListARR[obj].CodeStop,
         CompanyId: homeInfo.shop.COMPANYID,
         BillId: data.BILLID
      };
      selected.obj = obj;
      commonSend.commonSend(
         "get",
         data => {
            commit(STOP_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   dealPromotionAction({ commit }, { type, data }) {
      //发布优惠活动, 新增和编辑
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "",
         CompanyId: homeInfo.shop.COMPANYID,
         ImgName: data.ImgName,
         Caption: data.Caption,
         Remark1: data.Remark1,
         Remark2: data.Remark2,
         Remark3: data.Remark3,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         Tel: data.Tel,
         Address: data.Address,
         ShopList: data.ShopList, //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空
         TextColor: data.TextColor
      };
      switch (type) {
         case "add":
            sendData.InterfaceCode = "210021001";
            break;
         case "edit":
            sendData.InterfaceCode = "210021005";
            sendData.BillId = data.BillId;
            break;
         // case 'del': break;
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   dealGoodsAction({ commit }, { type, data }) {
      //发布优惠商品, 新增和编辑
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "",
         CompanyId: homeInfo.shop.COMPANYID,
         ImgName: data.ImgName ? data.ImgName : "",
         GoodsId: data.GoodsId,
         Price: data.Price,
         DisPrice: data.DisPrice,
         GoodsBrand: data.GoodsBrand ? data.GoodsBrand : "",
         GoodsRemark: data.GoodsRemark,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         Tel: data.Tel ? data.Tel : "",
         Address: data.Address ? data.Address : "",
         ShopList: data.ShopList //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空
      };
      switch (type) {
         case "add":
            sendData.InterfaceCode = "210021011";
            break;
         case "edit":
            sendData.InterfaceCode = "210021015";
            sendData.BillId = data.BillId;
            break;
         // case 'del': break;
      }
      commonSend.commonSend(
         "get",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   dealcouponAction({ commit }, { type, data }) {
      //发行优惠券, 新增和编辑
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "920801",
         CompanyId: homeInfo.shop.COMPANYID,
         ImgName: data.ImgName,
         ShopList: data.ShopList,
         Money: data.Money,
         Qty: data.Qty,
         Remark: data.Remark,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         Tel: data.Tel,
         Address: data.Address,
         LimitMoney: data.LimitMoney ? data.LimitMoney : 0
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   clearMarketingData({ state }, type) {
      switch (type) {
         case 1:
            break;
         case 2:
            state.marketingItem = {};
            break;
         default:
            state.marketingList = [];
            state.marketingListARR = Object.assign({}, ListARR);
            state.marketingListState = {
               paying: {
                  TotalNumber: 0,
                  PageNumber: 0,
                  PageSize: 20,
                  PN: 0
               },
               List: []
            };
            state.marketingState = {};
            state.marketingItem = {};
      }
   },
   addMCoyponAction({ commit }, data) {
      //发行定向优惠券
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "920803",
         CompanyId: homeInfo.shop.COMPANYID,
         Tel: data.Tel,
         Address: data.Address,
         SaleEmpId: data.SaleEmpId,

         ImgName: data.ImgName,
         Remark: data.Remark,
         ShopList: data.ShopList,
         Money: data.Money,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         LimitMoney: data.LimitMoney ? data.LimitMoney : 0,
         LitmitVipList: data.LitmitVipList,
         Type: data.Type,
         AllVipType: data.AllVipType,
         IsSMS: data.IsSMS,
         AllVip: data.AllVip,
         VipQty: data.VipQty,
         Qty: data.Qty,
         ShopId: data.ShopId
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   setSMSAction({ commit }, data) {
      // 短信群发
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "2100126",
         CompanyId: homeInfo.shop.COMPANYID,
         MobileList: data.MobileList,
         SmsRemark: data.SmsRemark,
         AllVip: data.AllVip // 0=非全部会员，1=全部会员
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },
   setSMSAction2({ commit }, data) {
      // 短信群发
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "2100126",
         MobileList: data.MobileList,
         SmsRemark: data.SmsRemark,
         AllVip: data.AllVip // 0=非全部会员，1=全部会员
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(DEAL_MARKETING_ACTION, { data });
         },
         sendData
      );
   },

   getSmsSign({ commit }, data) {
      // 短信群发
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "2100126",
         CompanyId: homeInfo.shop.COMPANYID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_RECHARGE_SMSSIGN, { data });
         },
         sendData
      );
   },
   clearMarketingAll({ state }) {
      state.marketingList = [];
      state.marketingListARR = Object.assign({}, ListARR);
      state.marketingListState.paying.PN = 0;
      state.marketingItem = {};
   },

   getRegisterGiftsData({ commit }, data) {
      // 注册有礼列表
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021032",
         CompanyId: homeInfo.shop.COMPANYID,
         Filter: data.Filter,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_REGISTERGIFTS_DATA, { data });
         },
         sendData
      );
   },
   DealRegisterGifts({ commit }, { type, data }) {
      // 注册有礼修改、发布
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021031",
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.Name,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         IsStart: data.IsStart,
         IsSendIntegtal: data.IsSendIntegtal,
         Integtal: data.Integtal,
         IsSendMoney: data.IsSendMoney,
         Money: data.Money,
         IsSendCoupon: data.IsSendCoupon,
         CouponList: data.CouponList,
         Remark: data.Remark
      };
      if (type == "edit") {
         sendData.InterfaceCode = "210021033";
         sendData.Id = data.Id;
      }
      commonSend.commonSend(
         "post",
         data => {
            commit(DEAL_REGISTERGIFTS, { data });
         },
         sendData
      );
   },
   getRegisterGiftsItem({ commit }, data) {
      // 注册有礼详情
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021034",
         CompanyId: homeInfo.shop.COMPANYID,
         Id: data.Id
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_REGISTERGIFTS_ITEM, { data });
         },
         sendData
      );
   },
   delRegisterGiffs({ commit }, data) {
      // 注册有礼删除
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210021035",
         CompanyId: homeInfo.shop.COMPANYID,
         Id: data.Id
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DEL_REGISTERGIFTS, { data });
         },
         sendData
      );
   },
   delImg({ commit }, data) {
      // 删除背景图片
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "21002061303",
         CompanyId: homeInfo.shop.COMPANYID,
         Id: data.id
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MARKETING_DEL_IMG, { data });
         },
         sendData
      );
   },

   setVipCardBg({ commit }, data) {
      // 会员卡设置
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020127",
         CompanyId: homeInfo.shop.COMPANYID,
         Name: data.Name,
         LevelId: data.LevelId,
         Color: data.Color,
         Explain: data.Explain,
         Image: data.ImgName
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(SET_VIPCARD_BACKGROUND, { data });
         },
         sendData
      );
   },

   getVipCardBg({ commit }, data) {
      // 获取会员卡信息
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020128",
         CompanyId: homeInfo.shop.COMPANYID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_VIPCARD_BACKGROUND, { data });
         },
         sendData
      );
   },

   getIntegralResetList({ commit }, data) {
      // 积分清零列表
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020121_0",
         CompanyId: userInfo.CompanyID,
         ShopId: homeInfo.shop.ID,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_INTEGRAL_RESET_LIST, { data });
         },
         sendData
      );
   },
   delIntegralReset({ commit }, data) {
      // 积分清零删除
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020121_3",
         CompanyId: userInfo.CompanyID,
         ShopId: homeInfo.shop.ID,
         IsSms: data.IsSms,
         IsWeChat: data.IsWeChat,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DEL_INTEGRAL_RESET, { data });
         },
         sendData
      );
   },
   saveIntegralReset({ commit }, data) {
      // 积分清零保存
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "91020262",
         CompanyId: userInfo.CompanyID,
         ShopId: homeInfo.shop.ID,
         Remark: data.Remark,
         IsSms: data.IsSms ? 1 : 0,
         IsWeChat: data.IsWeChat ? 1 : 0,
         AllVip: data.AllVip ? 1 : 0,
         VipId: data.VipId
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(SAVE_INTEGRAL_RESET, { data });
         },
         sendData
      );
   },
   detailIntegralReset({ commit }, data) {
      // 积分清零详情
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "91020263",
         CompanyId: userInfo.CompanyID,
         ShopId: homeInfo.shop.ID,
         PN: data.PN,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DETAIL_INTEGRAL_RESET, { data });
         },
         sendData
      );
   }
};
const mutations = {
   [DETAIL_INTEGRAL_RESET](state, { data }) {
      state.detailIntegralResetState = data;
   },
   [SAVE_INTEGRAL_RESET](state, { data }) {
      state.saveIntegralResetState = data;
   },
   [DEL_INTEGRAL_RESET](state, { data }) {
      state.delIntegralResetState = data;
   },
   [GET_INTEGRAL_RESET_LIST](state, { data }) {
      state.IntegralResetListState = data;
   },
   [GET_VIPCARD_BACKGROUND](state, { data }) {
      state.getVipCardBackGround = data;
   },
   [SET_VIPCARD_BACKGROUND](state, { data }) {
      state.setVipCardBackGround = data;
   },
   [SET_APPLICATION_STATE](state, { data }) {
      state.setApplicationState = data;
   },
   [GET_APPLICATION_LIST](state, { data }) {
      state.applicationListState = data;
   },
   [GET_BespeakDate_LIST](state, { data }) {
      state.bespeakDateListState = data;
   },
   [GET_BespeakTime_LIST](state, { data }) {
      state.bespeakTimeListState = data;
   },
   [GET_INCOME_INFO](state, { data }) {
      state.RecommendVipInfoState = data;
   },
   [GET_INCOME_ITEM](state, { data }) {
      state.RecommendVipItemState = data;
   },
   [GET_RECOMMEND_LIST](state, { data }) {
      state.RecommendListState = data;
   },
   [SAVE_RecommendGifts](state, { data }) {
      state.saveRecommendGiftsState = data;
   },
   [GET_RecommendGifts_ITEM](state, { data }) {
      state.RecommendGiftsItemState = data;
   },
   [SAVE_SPECIALS](state, { data }) {
      state.saveSpecialsState = data;
   },
   [GET_SPECIALS_LIST](state, { data }) {
      if (data.success) {
         state.specialsDataState = data.data.PageData;
      }
   },
   [SPECIALS_ITEM](state, { data }) {
      state.specialsItemState = data;
   },
   [DEL_SPECIALS](state, { data }) {
      state.delSpecialsState = data;
   },
   [GET_REGISTERGIFTS_DATA](state, { data }) {
      // 注册有礼列表
      if (data.success) {
         state.registerGiftsData = data.data.PageData.DataArr;
      }
      state.registerGiftsDataState = data.data;
   },
   [GET_REGISTERGIFTS_ITEM](state, { data }) {
      state.registerGiftsItem = data;
   },
   [DEAL_REGISTERGIFTS](state, { data }) {
      state.dealRegisterGiftsState = data;
   },
   [DEL_REGISTERGIFTS](state, { data }) {
      state.delRegisterGiftsState = data;
   },

   [MARKETING_DEL_IMG](state, { data }) {
      state.marketingDelImg = data;
   },

   [MARKETING_LIST](state, { data }) {
      let pageData = Object.assign({}, state.marketingListState.paying);
      if (data.success) {
         state.marketingList = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
         state.marketingListARR[selected.obj].paying = Object.assign({}, pageData);
         state.marketingListARR[selected.obj].List = [...state.marketingList];
      }
      state.marketingListState = Object.assign({}, data, {
         paying: pageData,
         List: state.marketingList
      });
   },

   [MARKETING_RECHARGE_LIST](state, { data }) {
      let pageData = Object.assign({}, state.marketingRechargeListState.paying);
      if (data.success) {
         state.marketingRechargeList = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.marketingRechargeListState = Object.assign({}, data, { paying: pageData });
   },

   [MARKETING_RECHARGE_DETAILED](state, { data }) {
      state.marketingRechargedetailed = Object.assign({}, data);
   },

   [MARKETING_RECHARGE_STATYS](state, { data }) {
      if (data.success) {
         state.marketingRechargeStatus = Object.assign({}, data);
      }
   },
   [GET_REGISTERGIFTS_DEL](state, { data }) {
      if (data.success) {
         state.marketingRechargeDel = Object.assign({}, data);
      }
   },

   [MARKETING_RECHARGE_ADD](state, { data }) {
      state.marketingRechargeAdd = Object.assign({}, data);
   },

   [MARKETING_RECHARGE_EIT](state, { data }) {
      state.marketingRechargeeit = Object.assign({}, data);
   },

   [MARKETING_LIST_IMG](state, { data }) {
      if (data.success) {
         state.marketingListImg = [...data.data.List];
         state.ImageMaxNum = data.data.ImageMaxNum;
         console.log(state.ImageMaxNum);
      }
   },

   [MARKETING_SAVE_IMG](state, { data }) {
      if (data.success) {
         state.marketingSaveImg = Object.assign({}, data);
      }
   },

   [MARKETING_SHOP_LIST](state, { data }) {
      let pageData = Object.assign({}, state.marketingShopListState.paying);
      if (data.success) {
         state.markeShopList = [...data.data.PageData.DataArr];
         state.markeShopList1 = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
         state.marketingShopListState = Object.assign({}, pageData);
      }
   },
   [MARKETING_SHOP_LIST2](state, { data }) {
      let pageData = Object.assign({}, state.marketingShopListState2.paying);
      if (data.success) {
         pageData = Object.assign(pageData, data.data.PageData);
         state.marketingShopListState2 = Object.assign({}, pageData, data.data.CouponCount);
      }
   },

   [MARKETING_SHOP_LISTS](state, { data }) {
      let pageData = Object.assign({}, state.marketingShopListState1.paying);
      if (data.success) {
         state.markeShopList1 = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
         state.marketingShopListState1 = Object.assign({}, pageData);
      }
   },

   [MARKETING_LOT_LIST](state, { data }) {
      state.marketingLotList = Object.assign({}, data);
   },

   [MARKETING_ITEM](state, { data }) {
      if (data.success) {
         state.marketingItem = Object.assign({}, data.data.obj);
      }
      state.marketingState = Object.assign({}, state.marketingState, data);
      selected = {};
   },
   [STOP_MARKETING_ACTION](state, { data }) {
      if (data.success) {
         state.marketingListState.paying.PN = 0;
      }
      state.marketingState = Object.assign({}, data);
      selected = {};
   },
   [DEAL_MARKETING_ACTION](state, { data }) {
      state.dealMarketingState = Object.assign({}, data);
   },
   [MARKETING_RECHARGE_SMSSIGN](state, { data }) {
      state.marketingSmStage = Object.assign({}, data.data);
   },
   [GETGAMEGOODS_COUPON_LIST](state, {data}){
      state.getGameGoodsCouponListState = data
   },
   [ADD_GAMEGOODS_COUPON](state, {data}){
      state.addGameGoodsCouponState = data
   },
   [OPEN_CLOSE_COUPON](state, {data}){
      state.openCloseCoupouState = data
   },
   [COUPON_GET_DETAILS](state, {data}){
      state.coupouGetDetailsState = data
   },
   [DEL_GETCOUPON](state, {data}){
      state.delGetCouponState = data
   },
   [CANCEL_ALL_COUPON](state, {data}){
      state.cancelAllCouponState = data
   },

};

export default {
   state,
   getters,
   actions,
   mutations
};
