/**
 * 会员
 *
 * ***/
import commonSend from '@/api/api'
import { getUserInfo, getHomeData } from '@/api/index'
import {
  MEMBER_BALANCE_ADJUST,
  MEMBER_RECHARGE,
  MEMBER_INTEGRAL_ADJUST,
  MEMBER_CARDS_ADJUST,
  MEMBER_CARDS_ADJUST_TIME,
  MEMBER_LIST2,
  GET_MEMBER_COUNT,
  MEMBER_FLESE,
  MEMBER_YUCI,
  MEMBER_TIME,
  MEMBER_TIME_EXPORT,
  NEW_MEMBER_INTEGRAL_ADJUST
} from '@/store/mutation-types'
let selected = {}


// initial state
const state = {
  memberBAdjustState: {},
  memberRechargeState: {},
  memberIAdjustState: {},
  memberCAdjustState: {},
  memberCAdjustStateTime: {},
  memberList2: [],
  memberListState2: {
    paying: {
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    },
    List: []
  },
  memberCount: {},
  memberFlese:[],
  memberYuci:[],
  memberTime:[],
  memberTimeExport:[],
  newMemberIAdjustState: {}
}

// getters
const getters = {
  memberBAdjustState: state => state.memberBAdjustState,
  memberRechargeState: state => state.memberRechargeState,
  memberIAdjustState: state => state.memberIAdjustState,
  memberCAdjustState: state => state.memberCAdjustState,
  memberCAdjustStateTime: state => state.memberCAdjustStateTime,
  memberList2: state => state.memberList2,
  memberListState2: state => state.memberListState2,
  memberCount: state => state.memberCount,
  memberFlese:state => state.memberFlese,
  memberYuci:state => state.memberYuci,
  memberTime:state => state.memberTime,
  memberTimeExport:state => state.memberTimeExport,
  newMemberIAdjustState: state => state.newMemberIAdjustState
}


// actions
const actions = {
  getMemberList2({ commit, state }, data) {
    let homeInfo = getHomeData();
    let pn = parseInt(state.memberListState2.paying.PN) + 1;
    let sendData = Object.assign({}, data, {
      'InterfaceCode': data.InterfaceCode,
      'Shops':homeInfo.shop.ID,
      'VipFlag': '',
      'VipCode': data.VipCode ? data.VipCode : '',
      'PN': data.PN ? data.PN : pn,
    });
    if (data.PN == 1) {
      state.memberList2 = []
    }
    commonSend.commonSend('get', data => {
      commit(MEMBER_LIST2, { data })
    }, sendData)
  },
  memberRecharge({ commit }, data) { // 储值卡充值
    let userInfo = getUserInfo(); // userInfo.CompanyID
    let homeInfo = getHomeData(); // homeInfo.shop.ID
    let sendData = {
      // 'InterfaceCode': '601020301',
      'InterfaceCode': '601020301A',
      'CompanyId': userInfo.CompanyID,
      'ShopId': data.ShopId,
      VipId: data.VipId,
      AddMoney: data.AddMoney ? data.AddMoney : 0, // 充值金额
      GiftMoney: data.GiftMoney ? data.GiftMoney : 0, // 赠送金额
      Remark: data.Remark ? data.Remark : '',
      IsSmd: data.IsSms ? 1 : 0,
      PayTypeId: data.PayTypeId, // 充值方式
      SaleEmpMoney: data.SaleEmpMoney // 员工提成信息
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_RECHARGE, { data })
    }, sendData)
  },

  memberBalanceAdjust({ commit }, data) { // 余额调整
    let userInfo = getUserInfo();
    let homeInfo = getHomeData(); // homeInfo.shop.ID
    console.log(userInfo)
    let sendData = {
      'InterfaceCode': '210020120',
      'ShopId': homeInfo.shop.ID,
      VipId: data.VipId,
      Money: data.Money ? data.Money : 0, // 增加为正数，减少为负数
      Remark: data.Remark ? data.Remark : '',
      IsSms: data.IsSms ? 1 : 0
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_BALANCE_ADJUST, { data })
    }, sendData)
  },
  memberIntegralAdjust({ commit }, data) { // 积分调整
    let homeInfo = getHomeData(); // homeInfo.shop.ID
    let sendData = {
      'InterfaceCode': '210020121',
      'ShopId': homeInfo.shop.ID,
      VipId: data.VipId,
      Integral: data.Integral ? data.Integral : 0, // 增加为正数，减少为负数
      Remark: data.Remark ? data.Remark : '',
      IsSms: data.IsSms ? 1 : 0
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_INTEGRAL_ADJUST, { data })
    }, sendData)
  },
  newMemberIntegralAdjust({ commit }, data) { // 德州 - 积分调整
   let homeInfo = getHomeData();
   let sendData = {
     'InterfaceCode': '9204021',
     'ShopId': homeInfo.shop.ID,
     VipId: data.VipId,
     Money: data.Money ? data.Money : 0,
     Integral: data.Integral ? data.Integral : 0, // 增加为正数，减少为负数
     Remark: data.Remark ? data.Remark : '',
     IsSms: data.IsSms ? 1 : 0
   };
   commonSend.commonSend('get', data => {
     commit(NEW_MEMBER_INTEGRAL_ADJUST, { data })
   }, sendData)
 },
  memberCardsAdjust({ commit }, data) { // 计次卡调整
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '210020122',
      'CompanyId': userInfo.CompanyID,
      'ShopId': data.ShopId,
      VipId: data.VipId,
      GoodsId: data.GoodsId,
      Qty: data.Qty ? data.Qty : 0,
      Remark: data.Remark ? data.Remark : '',
      IsSms: data.IsSms ? 1 : 0,
      EndDate: data.EndDate ? data.EndDate : '9999997999999',
      IsInvalid: data.IsInvalid ? 1 : 0, // 0=不限，1=限制
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_CARDS_ADJUST, { data })
    }, sendData)
  },

  memberCardsAdjustTime({ commit }, data) { // 时段卡调整
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '210020123',
      'ShopId': homeInfo.shop.ID,
      VipId: data.VipId,
      GoodsId: data.GoodsId,
      Remark: data.Remark ? data.Remark : '',
      EndDate: data.EndDate,
      IsSms: 1,
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_CARDS_ADJUST_TIME, { data })
    }, sendData)
  },

  getmemberTimeListExport({ commit },data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
          InterfaceCode:data.InterfaceCode,
          Shops:homeInfo.shop.ID,
          VipCode:'',
          VipFlag:'',
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_TIME_EXPORT, { data })
    }, sendData)
  },

  getmemberTimeList({ commit },data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002070603_01',
      VipID:data.setDates.VipID,
      'PN':1,
      GoodsId:data.setDates.GoodsId
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_TIME, { data })
    }, sendData)
  },

  getmemberYuciList({ commit },data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002070602_01',
      VipID:data.setDates.VipID,
      'PN':1,
      GoodsId:data.setDates.GoodsId
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_YUCI, { data })
    }, sendData)
  },


  getmemberFleseList({ commit },data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': data.setDates.InterfaceCode,
      'PN':1,
      'VipID':  data.setDates.VipID,
     'Type':  data.setDates.Type,
      'CompanyId': userInfo.CompanyID,
    };
    commonSend.commonSend('get', data => {
      commit(MEMBER_FLESE, { data })
    }, sendData)
  },


  getMemberCount({ commit }) { // 全部会员人数
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '601020204',
      'CompanyId': userInfo.CompanyID,
    };
    commonSend.commonSend('get', data => {
      commit(GET_MEMBER_COUNT, { data })
    }, sendData)
  },

}

// mutations
const mutations = {
  [MEMBER_BALANCE_ADJUST](state, { data }) {
    state.memberBAdjustState = Object.assign({}, data)
  },
  [MEMBER_RECHARGE](state, { data }) {
    state.memberRechargeState = Object.assign({}, data)
  },
  [MEMBER_INTEGRAL_ADJUST](state, { data }) {
    state.memberIAdjustState = Object.assign({}, data)
  },
  [NEW_MEMBER_INTEGRAL_ADJUST](state, { data }) {
    state.newMemberIAdjustState = Object.assign({}, data)
  },
  [MEMBER_CARDS_ADJUST](state, { data }) {
    state.memberCAdjustState = Object.assign({}, data)
  },

  [MEMBER_CARDS_ADJUST_TIME](state, { data }) {
    state.memberCAdjustStateTime = Object.assign({}, data)
  },
  [MEMBER_LIST2](state, { data }) {
    let pageData = Object.assign({}, state.memberListState2.paying);
    state.memberList2 = Object.assign({}, data.data.PageData);
    pageData = Object.assign(pageData, data.data.PageData)
    state.memberListState2 = Object.assign({}, data, { 'paying': pageData });
  },
  [GET_MEMBER_COUNT](state, { data }) {
    state.memberCount = Object.assign({}, data)
  },

  [MEMBER_TIME](state, { data }) {
    state.memberTime = Object.assign({}, data.data.PageData)
  },

  [MEMBER_TIME_EXPORT](state, { data }) {
    state.memberTimeExport = Object.assign({}, data.data.List)
  },

  [MEMBER_YUCI](state, { data }) {
    console.log("hahh",data.data.PageData.DataArr)
    state.memberYuci = Object.assign({}, data.data.PageData)
  },

  [MEMBER_FLESE](state, { data }) {
    state.memberFlese = Object.assign({}, data.data.PageData)
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
