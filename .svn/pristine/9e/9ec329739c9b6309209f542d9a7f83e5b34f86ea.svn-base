import commonSend from '@/api/api'
import { getUserInfo,setHomeData,getHomeData } from '@/api/index'
import {
  GET_COMMODITYCFL_LIST,
  GET_COMMODITYCCONSUMPTION,
  GET_MEMBERQRCODEURL,
  GET_COMMODITYCFL_DISCOUNT
} from '@/store/mutation-types'
let selected={}
let ItemsHeaderType=0;

// initial state
const state = {
  commoditycflListState: {},
  commoditycflList: [],
  commoditycconsumption: {},
  saveQRcodeIMG:'',
  memberQRcodeurlstate:{},
  commoditycflDiscountList:[],
}

// getters
const getters = {
  commoditycflListState: state => state.commoditycflListState,
  commoditycflList: state => state.commoditycflList,
  commoditycconsumption: state => state.commoditycconsumption,
  memberQRcodeurlstate: state => state.memberQRcodeurlstate,
  commoditycflDiscountList: state => state.commoditycflDiscountList,
}

// actions
const actions = {
  //生意通商品类别接口调
  getcommoditycflList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      InterfaceCode: 21002030104,
      PID:'',
      CompanyId: userInfo.CompanyID,
      PN: 1
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_COMMODITYCFL_LIST, { data })
    }, sendData )
  },
  //生意通折扣列表接口调
  getcommoditycDiscountList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      InterfaceCode: 21002060201,
      Name:''
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_COMMODITYCFL_DISCOUNT, { data })
    }, sendData )
  },

  // 商品消费结账包括挂单在内
  getcommoditycconsumption ({commit},data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: '210020516A',
      CompanyId: userInfo.CompanyID,
      ShopId: homeInfo.shop.ID
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('post',data => {
      commit(GET_COMMODITYCCONSUMPTION, { data })
    }, sendData )
  },
  getmemberQRcodeurlstate ({commit},data) {
    let homeInfo = getHomeData();
    let sendData = {
      InterfaceCode: 2100130,
      ShopID: homeInfo.shop.SHOPID
    };
    if(data){
      sendData = Object.assign({},sendData,data)
    }
    commonSend.commonSend('get',data => {
      commit(GET_MEMBERQRCODEURL, { data })
    }, sendData )
  }
}

// mutations
const mutations = {
  [GET_COMMODITYCFL_LIST] (state, { data }) {
    if(data.success){
       state.commoditycflList = [...data.data.PageData.DataArr];
    }
    state.commoditycflListState = Object.assign({},data);
  },
   [GET_COMMODITYCCONSUMPTION] (state, { data }) {
    state.commoditycconsumption = Object.assign({},data);
  },
   [GET_MEMBERQRCODEURL] (state, { data }) {
    state.memberQRcodeurlstate = Object.assign({},data);
  },
  [GET_COMMODITYCFL_DISCOUNT] (state, { data }) {
    state.commoditycflDiscountList = Object.assign({},data.data.List);
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
