import commonSend from '@/api/api'
import { getUserInfo, setHomeData, getHomeData } from '@/api/index'
import {
  GET_SETMEALRSELECT_LIST,
  GET_SETMEALRSELECT_DETAIL,
  GET_SETMEALRTIMERECHARGE
} from '@/store/mutation-types'
let selected = {}

// initial state
const state = {
  setmealrselectList: [],
  setmealrselectlistState: {
    paying: {
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    },
    List: []
  },
  setmealrselectdetailState: {},
  setmealrtimesrechargeState: {},
}

// getters
const getters = {
  setmealrselectList: state => state.setmealrselectList,
  setmealrselectlistState: state => state.setmealrselectlistState,
  setmealrselectdetailState: state => state.setmealrselectdetailState,
  setmealrtimesrechargeState: state => state.setmealrtimesrechargeState,
}

// actions
const actions = {
  getsetmealrselectlistState({ commit, state }, data) { // 套餐项目列表
    let userInfo = getUserInfo();
    let pn = parseInt(state.setmealrselectlistState.paying.PN) + 1;
    let sendData = {
      InterfaceCode: '60102010731',
      CompanyId: userInfo.CompanyID,
      Filter: data.Filter ? data.Filter : '',
      Status: data.Status,
      PN: data.PN ? data.PN : pn
    };
    commonSend.commonSend('get', data => {
      commit(GET_SETMEALRSELECT_LIST, { data })
    }, sendData)
  },
  getssetmealrselectdetailState({ commit }, data) {
    let userInfo = getUserInfo();
    let sendData = {
      InterfaceCode: '60102010732',
      CompanyId: userInfo.CompanyID
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_SETMEALRSELECT_DETAIL, { data })
    }, sendData)
  },

  // 生意通计次卡充值
  getsetmealrtimesrechargeState({ commit }, data) { 
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '210020112_1',
      VipId: data.VipId,
      AddMoney: data.AddMoney,
      'shopid': homeInfo.shop.ID,
      'CompanyId': userInfo.CompanyID,
      IsSmd: data.IsSms?data.IsSms:0,
      Remark: data.Remark ? data.Remark : '',
      PayTypeID: data.PayTypeID, // 支付方式
      GetIntegral: data.GetIntegral?data.GetIntegral:0, // 获得积分
      SaleEmpList: data.SaleEmpList?data.SaleEmpList:'{}',
      GoodsList: data.GoodsList, // [{"GoodsId":"162316","Qty":10,"Price":35,"IsInvalid":1,"InvalidDate":9999999999999}]
      GiftMoney:data.GiftMoney?data.GiftMoney:0, // 优惠金额
    };
    if (data.GoodsPackId) {
      sendData.GoodsPackId = data.GoodsPackId; // 套餐ID
      sendData.GoodsPackQty = data.GoodsPackQty;
    }
    console.log(sendData)
    commonSend.commonSend('post', data => {
      commit(GET_SETMEALRTIMERECHARGE, { data })
    }, sendData)
  },
}

// mutations
const mutations = {
  [GET_SETMEALRSELECT_LIST](state, { data }) {
    let pageData = Object.assign({}, state.setmealrselectlistState.paying);
    if (data.success) {
      state.setmealrselectList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.setmealrselectlistState = Object.assign({}, data, { 'paying': pageData });
  },
  [GET_SETMEALRSELECT_DETAIL](state, { data }) {
    state.setmealrselectdetailState = Object.assign({}, data);
  },
  [GET_SETMEALRTIMERECHARGE](state, { data }) {
    state.setmealrtimesrechargeState = Object.assign({}, data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
