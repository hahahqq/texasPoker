import commonSend from '@/api/api'
import { getUserInfo, setHomeData, getHomeData } from '@/api/index'
import {
  GET_GUADANCX_LIST,
  GET_GUADANCD_LIST,
  GET_GUADANCDL_LIST,
  DEL_GUADANCDL_LIST,
} from '@/store/mutation-types'
let selected = {}

// initial state
const state = {
  guadancxlistState: {},
  guadancxlistBillCount: 0,
  guadancdlistState: {},
  guadancdlistobj: {},
  guadancdlistGoodsObj: [],
  guadancdlState: {},
  delguadancdlistState:{},
}

// getters
const getters = {
  guadancxlistState: state => state.guadancxlistState,
  guadancdlistState: state => state.guadancdlistState,
  guadancdlState: state => state.guadancdlState,
  delguadancdlistState: state => state.delguadancdlistState,
}

// actions
const actions = {
  getguadancxlistState({ commit }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210020517',
      CompanyId: homeInfo.shop.COMPANYID,
      ShopId: homeInfo.shop.SHOPID,
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_GUADANCX_LIST, { data })
    }, sendData)
  },
  getguadancdlistState({ commit }, data) {
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '920302',
      CompanyId: homeInfo.shop.COMPANYID,
      ShopId: homeInfo.shop.ID,
      BillId:data.BillId
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_GUADANCD_LIST, { data })
    }, sendData)
  },
  //根据单号查看挂单的商品详情
  getguadancdlState({ commit },data) {
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210020531',
      ShopId: homeInfo.shop.ID,
      BillId:data
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_GUADANCDL_LIST, { data })
    }, sendData)
  },
  //根据单号删除这个订单
  deleteguadancdlState({ commit },data) {
    console.log(data)
    let sendData = {
      InterfaceCode: '210020534',
      BillId:data
    };
    commonSend.commonSend('get', data => {
      commit(DEL_GUADANCDL_LIST, { data })
    }, sendData)
  },
}

// mutations
const mutations = {
  [GET_GUADANCX_LIST](state, { data }) {
    state.guadancxlistState = Object.assign({}, data);
    state.guadancxlistBillCount=data.data.BillCount;
  },
  [GET_GUADANCD_LIST](state, { data }) {
    state.guadancdlistState = Object.assign({}, data);
    state.guadancdlistobj = data.data.Obj;
    state.guadancdlistGoodsObj = [...data.data.GoodsObj];
  },
  [GET_GUADANCDL_LIST](state, { data }) {
    state.guadancdlState = Object.assign({}, data);
  },
  [DEL_GUADANCDL_LIST](state, { data }) {
    state.delguadancdlistState = Object.assign({}, data);
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
