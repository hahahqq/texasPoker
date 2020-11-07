import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import {
  GET_SRORAGEVALUERRECHARGE,
  GET_SRORAGEVALUERROYALTY
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  storagevaluerroyaltyState: {},
  storagevaluerrechargeState: {},
}


// getters
const getters = {
  storagevaluerroyaltyState: state => state.storagevaluerroyaltyState,
  storagevaluerrechargeState: state => state.storagevaluerrechargeState,
}

// actions
const actions = {
  getstoragevaluerroyaltyState ({commit}) { // 充值提成详情
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210021046',
      CompanyId: userInfo.CompanyID,
      ShopId:homeInfo.shop.ID
    };
    commonSend.commonSend('get',data => {
      commit(GET_SRORAGEVALUERROYALTY, { data })
    }, sendData )
  },
  //生意通储值
  getstoragevaluerrechargeState ({commit},data) {
    console.log("datafdsofu",data)
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210020111A',
      shopid: homeInfo.shop.ID
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('post',data => {
      commit(GET_SRORAGEVALUERRECHARGE, { data })
    }, sendData )
  },
  clearStorageValueAll({ state }) {
     state.storagevaluerroyaltyState = {}
     state.storagevaluerrechargeState = {}
  }
}

// mutations
const mutations = {
  [GET_SRORAGEVALUERROYALTY] (state, { data }) {
    state.storagevaluerroyaltyState = Object.assign({},data);
  },
   [GET_SRORAGEVALUERRECHARGE] (state, { data }) {
    state.storagevaluerrechargeState = Object.assign({},data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
