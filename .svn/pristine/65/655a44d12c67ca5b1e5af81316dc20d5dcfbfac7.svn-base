// 商品分析
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import {
    MEMBER_TABLE_CHOZHI,
    MEMBER_TABLE_CHOZHIEXPORT,
    CONSUME_STATISTICS_TABLE,
    INTEGRAL_STATISTICS_TABLE,
    INTEGRAL_DH_STATISTICS_TABLE,
    ADJUST_TABLE,
    TABLE_INVEST_CANCEL,
    MEMBER_TABLE_YUEREXPORT
} from '@/store/mutation-types'
let selected={}
var ListARR = [
]

// initial state
const state = {
  memberStatistics: [],
  memberStatisticsexport: [],
  memberYuetiaozhenexport:[],
  investCancelState:{},
  memberStatisticState: {
    paying: {
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
    }
  },
  consumeStatistics:[],
  consumeStatisticsState: {
    paying: {
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
    }
  },
  integralStatistics:[],
  integralStatisticsState: {
    paying: {
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
    }
  },
  integralDhStatistics:[],
  integralDhStatisticState: {
    paying: {
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
    }
  },
  adjustTable:[],
  adjustTableState: {
    paying: {
        "TotalNumber": 0,
        "PageNumber": 0,
        "PageSize": 20,
        "PN": 0,
    }
  },
}

// getters
const getters = {
  memberStatistics: state => state.memberStatistics,
  memberStatisticsexport:state => state.memberStatisticsexport,
  memberStatisticState:state =>state.memberStatisticState,
  consumeStatistics: state => state.consumeStatistics,
  consumeStatisticsState:state =>state.consumeStatisticsState,
  integralStatistics: state => state.integralStatistics,
  integralStatisticsState:state =>state.integralStatisticsState,
  integralDhStatistics: state => state.integralDhStatistics,
  integralDhStatisticState:state =>state.integralDhStatisticState,
  adjustTable: state => state.adjustTable,
  adjustTableState:state =>state.adjustTableState,
  investCancelState:state =>state.investCancelState,
  memberYuetiaozhenexport:state =>state.memberYuetiaozhenexport,
}
// actions


const actions = {
  getmembertableYueDataExport ({commit},data) {
    let sendData=data.sendData
    commonSend.commonSend('get',data => {
      commit(MEMBER_TABLE_YUEREXPORT, { data })
    }, sendData )
  },

  getmembertableData ({commit},data) {
    console.log("传过来的页面",data.setDate.PN);
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': '21002070101',
      VipCode:"",
      Shops:data.setDate.ShopId,
      BeginDate:data.setDate.BeginDate,
      EndDate:data.setDate.EndDate,
      PN:data.setDate.PN?data.setDate.PN:pn,
      AppType:0,
    };
    commonSend.commonSend('get',data => {
      commit(MEMBER_TABLE_CHOZHI, { data })
    }, sendData )
  },

  getmembertableDataExport ({commit},data) {
    console.log('有时间出马吗',data)
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': data.InterfaceCode,
      Shops:homeInfo.shop.ID,
      PayTypes:'',
      BeginDate:data.BeginDate? data.BeginDate:1,
      EndDate:data.EndDate? data.EndDate:9999999999999,
      AppType:0,
    };
    commonSend.commonSend('get',data => {
      commit(MEMBER_TABLE_CHOZHIEXPORT, { data })
    }, sendData )
  },
  getconsumetableData ({commit},data) {

    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': '21002070201',
      VipCode:"",
      Shops:data.setDate.ShopId,
      BeginDate:data.setDate.BeginDate,
      EndDate:data.setDate.EndDate,
      PN:data.setDate.PN?data.setDate.PN:pn,
      AppType:0,
    };
    commonSend.commonSend('get',data => {
      commit(CONSUME_STATISTICS_TABLE, { data })
    }, sendData )
  },
  getintegraltableData ({commit},data) {
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': '21002070301',
      VipCode:"",
      Shops:data.setDate.ShopId,
      BeginDate:data.setDate.BeginDate,
      EndDate:data.setDate.EndDate,
      PN:data.setDate.PN?data.setDate.PN:pn,
      AppType:0,
    };
    commonSend.commonSend('get',data => {
      commit(INTEGRAL_STATISTICS_TABLE, { data })
    }, sendData )
  },
  getintegralDhtableData ({commit},data) {
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': '21002070401',
      VipCode:"",
      Shops:data.setDate.ShopId,
      BeginDate:data.setDate.BeginDate,
      EndDate:data.setDate.EndDate,
      PN:data.setDate.PN?data.setDate.PN:pn,
      AppType:0,
    };
    commonSend.commonSend('get',data => {
      commit(INTEGRAL_DH_STATISTICS_TABLE, { data })
    }, sendData )
  },
  getadjustTableState ({commit},data) {
    console.log("计次调整",data)
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn =  1;
    let sendData = {
      'InterfaceCode': data.setDate.InterfaceCode,
      VipCode:"",
      Shops:data.setDate.ShopId,
      BeginDate:data.setDate.BeginDate,
      EndDate:data.setDate.EndDate,
      PN:data.setDate.PN?data.setDate.PN:pn,
      AppType:1,
      CompanyId:data.setDate.CompanyId,
      GoodsCode:data.setDate.GoodsCode,
    };
    commonSend.commonSend('get',data => {
      commit(ADJUST_TABLE, { data })
    }, sendData )
  },

  getinvestCancelTableState ({commit},data) {
    let sendData = {
      'InterfaceCode': data.InterfaceCode,
      BillId:data.BillId
    };
    commonSend.commonSend('get',data => {
      commit(TABLE_INVEST_CANCEL, { data })
    }, sendData )
  },
}

// mutations
const mutations = {
  [MEMBER_TABLE_CHOZHI] (state, { data }) {
    state.memberStatistics = Object.assign({},data.data.PageData);
    state.memberStatisticState = Object.assign({}, data, { 'paying': data.data.PageData});
  },
  [MEMBER_TABLE_CHOZHIEXPORT] (state, { data }) {
    // console.log("11111111111111111",data)
    state.memberStatisticsexport = Object.assign({},data);
    // state.memberStatisticState = Object.assign({}, data, { 'paying': data.data.PageData});
  },

  [MEMBER_TABLE_YUEREXPORT] (state, { data }) {
    // console.log("11111111111111111",data)
    state.memberYuetiaozhenexport = Object.assign({},data);
    // state.memberStatisticState = Object.assign({}, data, { 'paying': data.data.PageData});
  },

  [CONSUME_STATISTICS_TABLE] (state, { data }) {
    state.consumeStatistics = Object.assign({},data.data.PageData);
    state.consumeStatisticsState = Object.assign({}, data, { 'paying': data.data.PageData});
  },
  [INTEGRAL_STATISTICS_TABLE] (state, { data }) {
    state.integralStatistics = Object.assign({},data.data.PageData);
    state.integralStatisticsState = Object.assign({}, data, { 'paying': data.data.PageData});
  },
  [INTEGRAL_DH_STATISTICS_TABLE] (state, { data }) {
    state.integralDhStatistics = Object.assign({},data.data.PageData);
    state.integralDhStatisticState = Object.assign({}, data, { 'paying': data.data.PageData});
  },
  [ADJUST_TABLE] (state, { data }) {
    state.adjustTable = Object.assign({},data.data.PageData);
    state.adjustTableState = Object.assign({}, data, { 'paying': data.data.PageData});
  },
  [TABLE_INVEST_CANCEL] (state, { data }) {
    console.log(data)
    state.investCancelState = Object.assign({},data)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
