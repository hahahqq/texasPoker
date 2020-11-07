import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import {
    GET_INTEGRAL_EXCHANGE
} from '@/store/mutation-types'
let selected={}
let ItemsHeaderType=0;

// initial state
const state = {
    integralExchange:{},
}

// getters
const getters = {
    integralExchange: state => state.integralExchange,
}

// actions
const actions = {
  //生意通积分兑换接口调
  getIntegralExchange ({commit},data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    console.log("userInfo")
    let sendData = {
      InterfaceCode: 920331,
      ShopId:homeInfo.shop.SHOPID,
      VipId:data.VipId,
      goodsdetail:data.goodsdetail,
      Remark:data.Remark,
      IsSms:data.IsSms ? '1' : '0',
      PayIntegral:data.PayIntegral,
      PayMoney: data.PayMoney,
      SaleEmpList:""
    };
    if(data){
      sendData = Object.assign({},sendData)
    }
    commonSend.commonSend('post',data => {
      commit(GET_INTEGRAL_EXCHANGE, { data })
    }, sendData )
  },
}

// mutations
const mutations = {
  [GET_INTEGRAL_EXCHANGE] (state, { data }) {
    state.integralExchange = Object.assign({},data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
