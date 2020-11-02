/**
 * 会员
 *
 * ***/
import commonSend from "@/api/api";
import {
   MEMBER_LIST,
   MEMBER_ITEM,
   MEMBER_ITEM2,
   ADD_MEMEBER,
   EDIT_MEMEBER,
   SET_REPORTLOSS,
   GET_MEMBER_LEVEL,
   GET_MEMBER_EXPORTDATA,
   MEMBER_IMPORTDATA,
   MEMBER_IMPORTDATA_CARD,
   GET_MEMBER_SPENDING,
   GET_MEMBER_BALANCE,
   GET_MEMBER_INTEGRAL,
   GET_MEMBER_ARREARS,
   GET_MEMBER_FLAG,
   REPAY_MEMBER_ARREARS,
   MEMBER_PROMOTION_LIST,
   EITMEMBER_PROMOTION_LIST,
   GET_MEMBER_SHOP,
   DEL_MEMBER,
   MEMBER_CODE,
   GET_AUTOVIPCODE,
   GET_MEMBER_BRITHDAY,
   GET_MEMBER_FOLLOWUP,
   GET_MEMBER_FOLLOWUP_DEL,
   GET_MEMBER_FOLLOWUP_EIT,
   GET_MEMBER_PASSWD,
   SAVE_VIP_IMG,
   MODIFY_VIP_PASSWD,
   VIP_BIRTHDAY_REMINDER_LIST,
   VIP_OVERDUE_REMINDER_LIST,
   GET_NEWVIP_LIST,
   VIPCODE_ADD_DATE,
   CONTEST_LIST,
   CONSUME_LIST,
   PARTICIPATE_LIST
} from "@/store/mutation-types";
import { getUserInfo, getHomeData } from "@/api/index";
import { data } from "jquery";
let selected = {};

// init state
const state = {
   consumeState: {},
   participateState: {},
   contestState : {},
   memberState: {},
   memberListState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      }
   },
   memberList: [],
   memberPromotionList: [],
   memberItem: { profile: {}, info: {} },
   reportLossState: {}, // 挂失
   memberLevelList: [],
   exportMemberState: {},
   importMemberState: {},
   importMemberStateCard: {},
   memberShop: {},
   memberSpendingState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   memberBalanceState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   memberIntegralState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   memberArrearsState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   memberFollowupState: {
      paying: {
         TotalNumber: 0,
         PageNumber: 0,
         PageSize: 20,
         PN: 0
      },
      List: []
   },
   repayMemberArrears: {},
   memberFlagList: [],
   selmember: {},
   selmemberArr: [],
   dealMemberState: {},
   memberPromotionCofig: {},
   eitmemberPromotionList: {},
   delMember: {},
   memberCodeState: {},
   getAutoVipCodeState: {},
   memberbrithday: {},
   memberFollowupDel: {},
   memberFollowupEit: {},
   getmemberPasswd: {},
   saveVipImgState: {},
   modifyVipPasswdState: {},
   vipBirthdayReminderListState:{},
   vipOverdueReminderListState:{},
   getNewVipListState:{},
   vipCodeAddDateState: {},
   memberItemState: {}
};

// getters
const getters = {
   consumeState: state => state.consumeState,
   participateState: state => state.participateState,
   contestState: state =>state.contestState,
   saveVipImgState: state => state.saveVipImgState,
   memberState: state => state.memberState,
   memberListState: state => state.memberListState,
   memberList: state => state.memberList,
   memberItem: state => state.memberItem,
   memberItemInfo: state => {
      return state.memberItem.info;
   },
   memberItemProfile: (state, getters) => {
      return state.memberItem.profile;
   },
   reportLossState: state => state.reportLossState,
   memberLevelList: state => state.memberLevelList,
   exportMemberState: state => state.exportMemberState,
   importMemberState: state => state.importMemberState,
   importMemberStateCard: state => state.importMemberStateCard,
   memberSpendingState: state => state.memberSpendingState,
   memberSpendingList: state => {
      return state.memberSpendingState.List ? [...state.memberSpendingState.List] : [];
   },
   memberBalanceState: state => state.memberBalanceState,
   memberBalanceList: state => {
      return state.memberBalanceState.List ? [...state.memberBalanceState.List] : [];
   },
   memberIntegralState: state => state.memberIntegralState,
   memberIntegralList: state => {
      return state.memberIntegralState.List ? [...state.memberIntegralState.List] : [];
   },
   memberArrearsState: state => state.memberArrearsState,
   memberArrearsList: state => {
      return state.memberArrearsState.List ? [...state.memberArrearsState.List] : [];
   },
   memberFollowupState: state => state.memberFollowupState,
   memberFollowupList: state => {
      return state.memberFollowupState.List ? [...state.memberFollowupState.List] : [];
   },

   repayMemberArrears: state => state.repayMemberArrears,
   memberFlagList: state => state.memberFlagList,
   selmember: state => state.selmember,
   selmemberArr: state => state.selmemberArr,
   dealMemberState: state => state.dealMemberState,
   memberPromotionList: state => state.memberPromotionList,
   memberPromotionCofig: state => state.memberPromotionCofig,
   eitmemberPromotionList: state => state.eitmemberPromotionList,
   memberShop: state => state.memberShop,
   delMember: state => state.delMember,
   memberCodeState: state => state.memberCodeState,
   getAutoVipCodeState: state => state.getAutoVipCodeState,
   memberbrithday: state => state.memberbrithday,
   memberFollowupDel: state => state.memberFollowupDel,
   memberFollowupEit: state => state.memberFollowupEit,
   getmemberPasswd: state => state.getmemberPasswd,
   modifyVipPasswdState: state => state.modifyVipPasswdState,
   vipBirthdayReminderListState: state=> state.vipBirthdayReminderListState,
   vipOverdueReminderListState: state=> state.vipOverdueReminderListState,
   getNewVipListState: state=> state.getNewVipListState,
   vipCodeAddDateState: state => state.vipCodeAddDateState,
   memberItemState: state =>state.memberItemState
};
// actions
const actions = {
   getMemberList({ commit, state }, data) {
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let pn = parseInt(state.memberListState.paying.PN) + 1;
      if (data.Filter) pn = 1;
      let sendData = Object.assign({}, data, {
         InterfaceCode: "210020104_1_3",
         Name: data.Name ? data.Name : "",
         ShopId: data.ShopId ? data.ShopId : homeInfo.shop.ID,
         VipFlag: data.VipFlag ? data.VipFlag : "",
         LevelName: data.LevelName ? data.LevelName : "",
         birthday: -1,
         PayCount: -1,
         LossVip: -1,
         Sex: -1,
         PN: data.PN ? data.PN : pn,
         SaleEmpId: data.SaleEmpId ? data.SaleEmpId : "",
         Status: data.Status ? data.Status : -1, // -1=全部,0=正常，2=挂失
         CompanyId: homeInfo.shop.COMPANYID,
         ShowMoney: 0, // 0=全部,1=余额大于0
         OweMoney: 0 // 0=全部,1=余额大于0
      });
      commonSend.commonSend(
         "get",
         data => {
            commit(MEMBER_LIST, { data });
         },
         sendData
      );
   },
   //折扣类型列表
   getMemberPromotionList({ commit, state }, data) {
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = Object.assign({}, data, {
         InterfaceCode: "21002060201",
         Name: ""
      });
      commonSend.commonSend(
         "get",
         data => {
            commit(MEMBER_PROMOTION_LIST, { data });
         },
         sendData
      );
   },
   // 获取归属店铺列表
   getShopName({ commit, state }, data) {
      let sendData = Object.assign({}, data, {
         InterfaceCode: "21002060901"
      });
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_SHOP, { data });
         },
         sendData
      );
   },

   eitMemberPromotionList({ commit, state }, data) {
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let sendData = Object.assign({}, data, {
         InterfaceCode: "60102011211",
         CompanyId: homeInfo.shop.COMPANYID,
         IsAutoLevelUp: data.IsAutoLevelUp,
         AutoLevelType: data.AutoLevelType,
         LevelUpIntegral: data.LevelUpIntegral
      });
      commonSend.commonSend(
         "get",
         data => {
            commit(EITMEMBER_PROMOTION_LIST, { data });
         },
         sendData
      );
   },

   getMemberPasswd({ commit, state }, item) {
      // NAME 必须传
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020124_01",
         Md5Pass: item.Md5Pass,
         VipId: item.VipId,
         IsUsePasswd: item.IsUsePasswd
      };
      state.memberItem.info = Object.assign({}, item);
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_PASSWD, { data });
         },
         sendData
      );
   },

   modifyVipPasswd({ commit }, data) {
      //修改密码
      let sendData = {
         InterfaceCode: "210020124",
         VipId: data.VipId,
         Md5Pass: data.Md5Pass
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MODIFY_VIP_PASSWD, { data });
         },
         sendData
      );
   },

   getMemberItem({ commit, state }, item) {
      // NAME 必须传
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020104_2",
         ID: item.ID
      };
      state.memberItem.info = Object.assign({}, item);
      commonSend.commonSend(
         "get",
         data => {
            commit(MEMBER_ITEM, { data });
         },
         sendData
      );
   },
   getMemberCode({ commit, state }, item) {
      // NAME 必须传
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "2100130",
         ShopID: homeInfo.shop.ID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MEMBER_CODE, { data });
         },
         sendData
      );
   },

   getMemberItem2({ commit }, item) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9204052",
         ID: item.ID,
         CompanyId: homeInfo.shop.COMPANYID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(MEMBER_ITEM2, { data });
         },
         sendData
      );
   },
   getConTestList({ commit }, data){  // 会员大师分记录
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: '9204058',
         VipId: data.VipId,
         PN:data.PN,
         CompanyId: homeInfo.shop.COMPANYID,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate
      }
      commonSend.commonSend("get", data =>{
         commit(CONTEST_LIST , {data})
      },sendData)
   },
   getParticipateList({ commit }, data){  // 会员参赛记录
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: '9204055',
         VipId: data.VipId,
         PN:data.PN,
         CompanyId: homeInfo.shop.COMPANYID
      }
      commonSend.commonSend("get", data =>{
         commit(PARTICIPATE_LIST , {data})
      },sendData)
   },
   getConsumeList({ commit }, data){  // 会员消费记录
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: '9204056',
         VipId: data.VipId,
         PN:data.PN,
         CompanyId: homeInfo.shop.COMPANYID
      }
      commonSend.commonSend("get", data =>{
         commit(CONSUME_LIST , {data})
      },sendData)
   },


   setReportLoss({ commit, state }, data) {
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020125",
         ShopId: homeInfo.shop.ID,
         VipId: data,
         Type: 0, // 0=挂失 1=取消挂失
         IsSms: 0,
         Remark: ""
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(SET_REPORTLOSS, { data });
         },
         sendData
      );
   },
   setReportLossAfter({ commit, state }, array) {
      let arr = [...array],
         list = [...state.memberList];
      for (let i = 0; i < arr.legnth; i++) {
         let index = list.findIndex(obj => Object.is(parseInt(arr[i].ID), parseInt(obj.ID)));
         list[index].STATUS = 0;
      }
      state.memberList = [...list];
   },
   addNewMember({ commit, state }, data) {
      //手动添加会员
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020102B",
         Code: data.Code,
         Name: data.Name,
         Sex: data.Sex,
         PhoneNo: data.PhoneNo,
         LevelID: data.LevelId,
         BirthDate: data.BirthDate ? data.BirthDate : "",
         QQ: data.QQ,
         WeChat: data.WeChat,
         EXFIELD1: "",
         EXFIELD2: "",
         EXFIELD3: "",
         EXFIELD4: "",
         VipFlag: data.VipFlag,
         ShopID: homeInfo.shop.ID,
         Passwd: data.Passwd,
         Address: data.Address,
         EMail: "",
         Remark: data.Remark,
         DepositMoney: data.DepositMoney,
         SaleEmpId: data.SaleEmpId,
         CreateDate: data.CreateDate,
         InvalidDate: data.InvalidDate,
         ShareVipId: "",
         IdCardNo: data.IdCardNo
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(ADD_MEMEBER, { data });
         },
         sendData
      );
   },

   editTheMember({ commit, state }, data) {
      // 修改会员卡
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020110B",
         VipID: data.id,
         VipCode: data.Code,
         VipName: data.Name,
         MobileNo: data.PhoneNo,
         Sex: data.Sex,
         ShopID: homeInfo.shop.ID,
         BirthDate: data.BirthDate ? data.BirthDate : "",
         InvalidDate: data.InvalidDate,
         LevelID: data.LevelId ? data.LevelId : "",
         Password: data.Passwd,
         Status: data.STATUS ? data.STATUS : 0, // 0-正常 1-停用 2-挂失 3-换卡
         ShareVipID: data.ShareVipId ? data.ShareVipId : "",
         SaleEmpID: data.SaleEmpId ? data.SaleEmpId : "",
         address: data.Address,
         EMail: data.EMail ? data.EMail : "",
         Remark: data.Remark,
         VipFlag: data.VipFlag,
         DepositMoney: data.DepositMoney,
         IsUsePassWd: data.IsUsePassWd ? 1 : 0, // 0=不启用，1=启用
         CreateDate: data.CreateDate,
         InvalidDate: data.InvalidDate,
         IdCardNo: data.IdCardNo //  身份证
      };
      selected = Object.assign({}, sendData);
      commonSend.commonSend(
         "get",
         data => {
            commit(EDIT_MEMEBER, { data });
         },
         sendData
      );
   },
   getMemberLevel({ commit }) {
      // 生意通会员级别
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "21002060201",
         CompanyId: homeInfo.shop.COMPANYID
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_LEVEL, { data });
         },
         sendData
      );
   },
   getExportMemberData({ commit }, data) {
      // 生意通导出
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "210020104_1_3_1",
         Name: data.Name,
         ShopId: homeInfo.shop.ID,
         VipFlag: "", // 会员标识
         DiscountTypeName: "", // 会员折扣
         birthday: -1,
         PayCount: -1,
         LossVip: -1,
         Status: "-1",
         OweMoney: "0",
         CompanyId: homeInfo.shop.COMPANYID,
         Sex: "-1",
         SaleEmpId: ""
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_EXPORTDATA, { data });
         },
         sendData
      );
   },
   getImportMemberData({ commit }, arr) {
      // 导入
      let homeInfo = getHomeData();
      let GoodsDetaila = {};
      for (let i = 0; i < arr.length; i++) {
         GoodsDetaila[i] = arr[i];
      }
      let sendData = {
         InterfaceCode: "210020104_1_1_2",
         ShopID: homeInfo.shop.ID,
         List: JSON.stringify(GoodsDetaila)
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MEMBER_IMPORTDATA, { data });
         },
         sendData
      );
   },
   getImportMemberDataCard({ commit }, arr) {
      // 导入
      let homeInfo = getHomeData();
      let GoodsDetaila = {};
      for (let i = 0; i < arr.length; i++) {
         GoodsDetaila[i] = arr[i];
      }
      let sendData = {
         InterfaceCode: "210020105",
         ShopId: homeInfo.shop.ID,
         CompanyId: homeInfo.shop.COMPANYID,
         List: JSON.stringify(GoodsDetaila)
      };
      commonSend.commonSend(
         "post",
         data => {
            commit(MEMBER_IMPORTDATA_CARD, { data });
         },
         sendData
      );
   },
   getMemberDel({ commit }, data) {
      // 会员删除
      let homeInfo = getHomeData();
      console.log(data);
      let sendData = {
         InterfaceCode: "210020104_3",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: homeInfo.shop.ID,
         VipId: data
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(DEL_MEMBER, { data });
         },
         sendData
      );
   },
   getMemberSpending({ commit }, data) {
      // 会员消费 消费记录
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let pn = parseInt(state.memberSpendingState.paying.PN) + 1;
      let sendData = {
         InterfaceCode: "210020130",
         CompanyId: userInfo.CompanyID,
         ShopId: homeInfo.shop.ID,
         VipId: data.ID,
         PN: data.PN ? data.PN : pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_SPENDING, { data });
         },
         sendData
      );
   },
   getMemberBalance({ commit }, data) {
      //  余额对帐明细
      let userInfo = getUserInfo();
      let homeInfo = getHomeData();
      let pn = parseInt(state.memberBalanceState.paying.PN) + 1;
      let sendData = {
         InterfaceCode: "210020131",
         ShopId: homeInfo.shop.ID,
         VipId: data.ID,
         PN: data.PN ? data.PN : pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_BALANCE, { data });
         },
         sendData
      );
   },
   getMemberIntegral({ commit }, data) {
      //  积分对帐明细
      let userInfo = getUserInfo();
      let pn = parseInt(state.memberIntegralState.paying.PN) + 1;
      let sendData = {
         InterfaceCode: "210020132",
         ShopId: getHomeData().shop.ID,
         VipId: data.ID,
         PN: data.PN ? data.PN : pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_INTEGRAL, { data });
         },
         sendData
      );
   },
   getAutoVipCode({ commit }, data) {
      //生成会员编码
      let sendData = {
         InterfaceCode: "2100127_12"
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_AUTOVIPCODE, { data });
         },
         sendData
      );
   },
   getMemberArrears({ commit }, data) {
      //  会员还款记录
      let sendData = {
         InterfaceCode: "210020154",
         VipId: data.ID,
         PN: data.PN ? data.PN : 1
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_ARREARS, { data });
         },
         sendData
      );
   },
   getMemberFollowup({ commit }, data) {
      //  会员跟进记录
      console.log("跟进记录", data);
      let pn = parseInt(state.memberFollowupState.paying.PN) + 1;
      let userInfo = getUserInfo();
      let sendData = {
         InterfaceCode: "210020162",
         CompanyId: userInfo.CompanyID,
         VipId: data.ID,
         Filter: "",
         EmpId: userInfo.UserID,
         BeginDate: 1,
         EndDate: 9999999999999,
         PN: data.PN ? data.PN : pn
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_FOLLOWUP, { data });
         },
         sendData
      );
   },
   getMemberFollowupDel({ commit }, data) {
      // 跟进会员删除
      let homeInfo = getHomeData();
      console.log(data);
      let sendData = {
         InterfaceCode: "210020164",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: homeInfo.shop.ID,
         VipId: data.VipId,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_FOLLOWUP_DEL, { data });
         },
         sendData
      );
   },
   getVipBirthdayReminder({ commit }, data) {
      // 会员生日提醒
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9204032",
         ShopId: data.ShopId ? data.ShopId : homeInfo.shop.ID,
         CompanyId: homeInfo.shop.COMPANYID,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(VIP_BIRTHDAY_REMINDER_LIST, { data });
         },
         sendData
      );
   },
   getVipOverdueReminder({ commit }, data) {
      // 会员过期提醒
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9204031",
         ShopId: data.ShopId ? data.ShopId : homeInfo.shop.ID,
         CompanyId: homeInfo.shop.COMPANYID,
         InvalidDate: data.InvalidDate,
         PN: data.PN,
         Filter: ''
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(VIP_OVERDUE_REMINDER_LIST, { data });
         },
         sendData
      );
   },
   vipCardAddDate({commit}, data){  // 会员卡续期
      let homeInfo = getHomeData()
      let sendData = {
         'InterfaceCode': '210020109',
         'CompanyId': homeInfo.shop.COMPANYID,
         VipId: data.VipId,
         ValidDate: data.ValidDate
      }
      commonSend.commonSend(
         "post",
         data => {
            commit(VIPCODE_ADD_DATE, { data });
         },
         sendData
      );

   },
   getNewVipList({ commit }, data) {
      // 新增会员
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9204033",
         ShopId: data.ShopId ? data.ShopId : homeInfo.shop.ID,
         CompanyId: homeInfo.shop.COMPANYID,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         PN: data.PN
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_NEWVIP_LIST, { data });
         },
         sendData
      );
   },

   getMemberFollowupEit({ commit }, data) {
      // 跟进会员编辑
      let homeInfo = getHomeData();
      let userInfo = getUserInfo();
      console.log(data);
      let sendData = {
         InterfaceCode: data.InterfaceCode,
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: homeInfo.shop.ID,
         VipId: data.VipId,
         EmpId: userInfo.UserID,
         Remark: data.Remark,
         BillDate: data.BillDate,
         BillId: data.BillId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_FOLLOWUP_EIT, { data });
         },
         sendData
      );
   },
   getMemberBrithday({ commit }, data) {
      //  会员还款记录
      let pn = 1;
      let homeInfo = getHomeData();
      let userInfo = getUserInfo();
      let sendData = {
         PN: 1,
         ShopId: data.sendData.ShopId,
         BeginDate: data.sendData.BeginDate,
         EndDate: data.sendData.EndDate,
         InterfaceCode: data.sendData.InterfaceCode,
         CompanyId: data.sendData.CompanyId
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_BRITHDAY, { data });
         },
         sendData
      );
   },
   repayMemberArrears({ commit }, data) {
      // 会员还款保存
      let userInfo = getUserInfo(); // userInfo.CompanyID
      let homeInfo = getHomeData(); // homeInfo.shop.ID
      let sendData = {
         InterfaceCode: "210020153_01",
         ShopId: data.ShopId,
         VipId: data.VipId,
         Money: data.Money ? data.Money : 0,
         PayTypeId: data.PayTypeId, // 还款方式ID
         Remark: data.Remark ? data.Remark : ""
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(REPAY_MEMBER_ARREARS, { data });
         },
         sendData
      );
   },
   cancelMemberArrears({ commit }, data) {
      // 会员还款作废
      let userInfo = getUserInfo(); // userInfo.CompanyID
      let homeInfo = getHomeData(); // homeInfo.shop.ID
      let sendData = {
         InterfaceCode: "601020229",
         CompanyId: userInfo.CompanyID,
         BillId: data.BillId
      };
   },
   getMemberFlag({ commit }) {
      //  会员标况列表
      commonSend.commonSend(
         "get",
         data => {
            commit(GET_MEMBER_FLAG, { data });
         },
         { InterfaceCode: "210020103" }
      );
   },
   selectingMember({ state }, { isArr, data }) {
      if (isArr) {
         state.selmemberArr = [...data];
      } else {
         state.selmember = Object.assign({}, data);
      }
   },
   saveVipImg({ commit }, data) {
      // 会员头像保存
      let userInfo = getUserInfo(); // userInfo.CompanyID
      let sendData = {
         InterfaceCode: "9204011",
         CompanyId: userInfo.CompanyID,
         VipId: data.VipId,
         ImageUrl: data.ImageUrl
      };
      commonSend.commonSend(
         "get",
         data => {
            commit(SAVE_VIP_IMG, { data });
         },
         sendData
      );
   },



   clearMemberList({ state }) {
      state.memberListState.paying.PN = 0;
      state.memberList = [];
   },
   clearMember({ state }, index) {
      switch (index) {
         case 1:
            state.memberItem = { profile: {}, info: {} };
            break;
         case 2:
            state.memberLevelList = [];
            break;
         case 3:
            state.memberSpendingState.paying.PN = 0;
            state.memberSpendingState.List = [];
            break;
         case 4:
            state.memberBalanceState.paying.PN = 0;
            state.memberBalanceState.List = [];
            break;
         case 5:
            state.memberIntegralState.paying.PN = 0;
            state.memberIntegralState.List = [];
            break;
         case 6: // 欠款记录
            state.memberArrearsState.paying.PN = 0;
            state.memberArrearsState.List = [];
            state.repayMemberArrears = {};
            break;
         case 7: //跟进记录
            state.memberFollowupState.paying.PN = 0;
            state.memberFollowupState.List = [];
            break;
         case 8:
            state.memberFlagList = [];
            break;
         case 9:
            state.selmember = {};
            state.selmemberArr = [];
            break;
         default:
            state.memberListState.paying.PN = 0;
            state.memberList = [];
      }
   },
   clearMemberAll({ state }) {
      state.memberListState.paying.PN = 0;
      state.memberList = [];
      state.memberItem = { profile: {}, info: {} };
      state.memberLevelList = [];
      state.memberSpendingState.paying.PN = 0;
      state.memberBalanceState.paying.PN = 0;
      state.memberIntegralState.paying.PN = 0;
      state.memberArrearsState.paying.PN = 0;
      state.memberFollowupState.paying.PN = 0;
      state.memberFlagList = [];
      state.selmember = {};
      state.selmemberArr = [];
   }
};

// mutations
const mutations = {
   [MODIFY_VIP_PASSWD](state, { data }) {
      state.modifyVipPasswdState = data;
   },
   [SAVE_VIP_IMG](state, { data }) {
      state.saveVipImgState = data;
   },
   [GET_MEMBER_BRITHDAY](state, { data }) {
      if (data.success) {
         state.memberbrithday = data.data.PageData;
      }
   },
   [GET_AUTOVIPCODE](state, { data }) {
      if (data.success) {
         state.getAutoVipCodeState = data;
      }
   },
   [MEMBER_LIST](state, { data }) {
      let pageData = Object.assign({}, state.memberListState.paying);
      if (data.success) {
         state.memberList = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberListState = Object.assign({}, data, { paying: pageData });
   },
   //会员折扣类型列表
   [MEMBER_PROMOTION_LIST](state, { data }) {
      if (data.success) {
         state.memberPromotionList = [...data.data.List];
         state.memberPromotionCofig = data.data.CompanyConfig;
      }
   },
   //获取归属店铺
   [GET_MEMBER_SHOP](state, { data }) {
      state.memberShop = [...data.data.List];
   },

   [EITMEMBER_PROMOTION_LIST](state, { data }) {
      if (data.success) {
         state.eitmemberPromotionList = Object.assign({}, data);
      }
   },

   [GET_MEMBER_PASSWD](state, { data }) {
      if (data.success) {
         console.log("提交回来的数据", data);
         state.getmemberPasswd = data;
      }
   },

   [MEMBER_ITEM](state, { data }) {
      if (data.success) {
         state.memberItem.profile = Object.assign({}, data.data);
         state.memberItem.info = Object.assign({}, state.memberItem.info, data.data.obj);
      }
      state.memberState = Object.assign({}, data);
   },

   [MEMBER_CODE](state, { data }) {
      if (data.success) {
         console.log("店铺二维码", data);
         state.memberCodeState = Object.assign({}, data.data);
      }
   },

   [MEMBER_ITEM2](state, { data }) {
      if (data.success) {
         state.memberItem.profile = Object.assign({}, data.data);
         state.memberItem.info = Object.assign({}, state.memberItem.info, data.data.obj);
      }

      state.memberItemState = Object.assign({}, data);

   },
   [SET_REPORTLOSS](state, { data }) {
      state.reportLossState = Object.assign({}, data);
   },
   [GET_MEMBER_LEVEL](state, { data }) {
      state.memberLevelList = data.success ? [...data.data.List] : [];
   },
   [ADD_MEMEBER](state, { data }) {
      // add
      if (data.success) {
         state.memberListState.paying.PN = 0;
      }
      state.dealMemberState = Object.assign({}, data);
   },
   [EDIT_MEMEBER](state, { data }) {
      //edit
      if (data.success) {
         state.memberItem.profile.obj.ISUSEPASSWD = selected.IsUsePassWd == 1 ? true : false;
         for (let key in selected) {
            let kk = key.toUpperCase();
            state.memberItem.info[kk] = selected[key];
         }
         state.memberItem.info.CODE = selected.VipCode;
         state.memberItem.info.NAME = selected.VipName;
         let list = [...state.memberList];
         let index = list.findIndex(obj => Object.is(parseInt(selected.VipID), parseInt(obj.ID)));
         state.memberList[index] = Object.assign(
            {},
            state.memberList[index],
            state.memberItem.info
         );
         state.memberListState = Object.assign({}, state.memberListState);
      }
      state.dealMemberState = Object.assign({}, data);
      selected = {};
   },
   [GET_MEMBER_EXPORTDATA](state, { data }) {
      // 导出
      state.exportMemberState = Object.assign({}, data);
   },
   [MEMBER_IMPORTDATA](state, { data }) {
      // 导入
      state.importMemberState = Object.assign({}, data);
   },
   [MEMBER_IMPORTDATA_CARD](state, { data }) {
      // 导入
      state.importMemberStateCard = Object.assign({}, data);
   },
   [DEL_MEMBER](state, { data }) {
      // 会员删除
      state.delMember = Object.assign({}, data);
   },
   [GET_MEMBER_FOLLOWUP_DEL](state, { data }) {
      // 跟进会员删除
      state.memberFollowupDel = Object.assign({}, data);
   },
   [GET_MEMBER_FOLLOWUP_EIT](state, { data }) {
      // 跟进会员编辑
      state.memberFollowupEit = Object.assign({}, data);
   },
   [GET_MEMBER_SPENDING](state, { data }) {
      // 消费明细
      let pageData = Object.assign({}, state.memberSpendingState.paying);
      let list = [];
      let homeInfo = getHomeData();
      if (data.success) {
         list = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberSpendingState = Object.assign({}, data, { paying: pageData, List: list });
   },
   [GET_MEMBER_BALANCE](state, { data }) {
      // 余额对帐明细
      let pageData = Object.assign({}, state.memberBalanceState.paying);
      let list = [];
      if (data.success) {
         list = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberBalanceState = Object.assign({}, data, { paying: pageData, List: list });
   },
   [GET_MEMBER_INTEGRAL](state, { data }) {
      // 积分对帐明细
      let pageData = Object.assign({}, state.memberIntegralState.paying);
      let list = [];
      if (data.success) {
         list = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberIntegralState = Object.assign({}, data, { paying: pageData, List: list });
   },

   [GET_MEMBER_ARREARS](state, { data }) {
      // 会员还款记录
      let pageData = Object.assign({}, state.memberArrearsState.paying);
      let list = [];
      if (data.success) {
         list = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberArrearsState = Object.assign({}, data, { paying: pageData, List: list });
   },

   [GET_MEMBER_FOLLOWUP](state, { data }) {
      // 会员跟进记录
      console.log("跟进数据返回", data);
      let pageData = Object.assign({}, state.memberFollowupState.paying);
      let list = [];
      if (data.success) {
         list = [...data.data.PageData.DataArr];
         pageData = Object.assign(pageData, data.data.PageData);
      }
      state.memberFollowupState = Object.assign({}, data, { paying: pageData, List: list });
   },

   [REPAY_MEMBER_ARREARS](state, { data }) {
      state.repayMemberArrears = Object.assign({}, data);
   },
   [GET_MEMBER_FLAG](state, { data }) {
      state.memberFlagList = data.success ? [...data.data.List] : [];
   },
   [VIP_BIRTHDAY_REMINDER_LIST](state, data){
      state.vipBirthdayReminderListState = data.data
   },
   [VIP_OVERDUE_REMINDER_LIST](state, data){
      state.vipOverdueReminderListState = data.data
   },
   [GET_NEWVIP_LIST](state, data){
      state.getNewVipListState = data.data
   },
   [VIPCODE_ADD_DATE](state, data){
      console.log(data)
      state.vipCodeAddDateState = data.data
   },
   [CONTEST_LIST](state, data){
      state.contestState = data.data
   },
   [CONSUME_LIST](state, data){
      state.consumeState = data.data
   },
   [PARTICIPATE_LIST](state, data){
      state.participateState = data.data
   },
};

export default {
   state,
   getters,
   actions,
   mutations
};
