import commonSend from '@/api/api'
import { getUserInfo, setHomeData } from '@/api/index'
import {
  GET_SHOP_LIST,
  GET_SHOP_ITEM,
  SHOP_STATE,
  DEL_SHOP_STATE

} from '@/store/mutation-types'
let selected = {}

// initial state
const state = {
  shopListState: {},
  shopList: [],
  shopItem: {},
  selshop: {},
  shopState: {},
  dealShopState: {},
  delShopState: {}
}

// getters
const getters = {
  shopListState: state => state.shopListState,
  shopList: state => state.shopList,
  shopItem: state => state.shopItem,
  selshop: state => state.selshop,
  shopState: state => state.shopState,
  dealShopState: state => state.dealShopState,
  delShopState: state => state.delShopState
}

// actions
const actions = {
  getShopList({ commit }, data) {
    let userInfo = getUserInfo();
    console.log(userInfo)
    let sendData = {
      'InterfaceCode': '2100132A',
      Companyid: userInfo.CompanyID,
      Filterstr: data.Filterstr ? data.Filterstr : '',
      PN: 1,
      ClientType: 0,
      isinvalid: 0,
      userid: userInfo.UserID
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_SHOP_LIST, { data })
    }, sendData)
  },
  getShopItem({ commit }, data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '60102010602',
      'CompanyId': userInfo.CompanyID,
      ID: data.id
    };
    commonSend.commonSend('get', data => {
      commit(GET_SHOP_ITEM, { data })
    }, sendData)
  },
  choosingShop({ commit }, item) {
    console.log(item)
    setHomeData({ 'shop': item })
  },
  selectingShop({ state }, data) {
    state.selshop = Object.assign({}, data);
  },

  dealShopItem({ commit }, data) { // edit
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002060903',
      ShopID: data.ShopID ? data.ShopID : '',
      ShopCode: data.ShopCode ? data.ShopCode : '',
      ShopName: data.ShopName,
      Manager: data.Manager,
      Address: data.Address,
      ProvinceID: data.ProvinceID,
      CityID: data.CityID,
      DistrictID: data.DistrictID,
      PhoneNo: data.PhoneNo,
      Longitude: data.Longitude ? data.Longitude : '',
      Latitude: data.Latitude ? data.Latitude : ''
    };
    commonSend.commonSend('get', data => {
      commit(SHOP_STATE, { data })
    }, sendData)
  },
  delShopItem({ commit, state }, { index, data }) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002060904',
      'CompanyId': userInfo.CompanyID,
      ID: data.ID
    };
    commonSend.commonSend('get', data => {
      commit(DEL_SHOP_STATE, { data })
    }, sendData)
  },
  clearShopAll({ state }) {
    state.shopList = []
    state.shopItem = {}
    state.selshop = {}
  }
}

// mutations
const mutations = {
  [GET_SHOP_LIST](state, { data }) {
    if (data.success) {
      state.shopList = [...data.data.PageData.DataArr];
    }
    state.shopListState = Object.assign({}, data);
  },
  [GET_SHOP_ITEM](state, { data }) {
    if (data.success) {
      state.shopItem = Object.assign({}, data.data.obj);
    }
    state.shopState = Object.assign({}, data);
  },
  [SHOP_STATE](state, { data }) {
    state.dealShopState = Object.assign({}, data);
  },
  [DEL_SHOP_STATE](state, { data }) {
   state.delShopState = Object.assign({}, data);
 }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
