import commonSend from '@/api/api'
import {
  MY_INFO,
  EDIT_MY_INFO,
  GET_INDUSTRY,
  GET_MY_SHOP,
  GET_SHOP_VIPQTY
} from '@/store/mutation-types'
import { getHomeData, getUserInfo, setHomeData} from '@/api/index'
let selected={}

// init state
const state = {
  myinfo: {},
  myinfoState: {},
  industryList:[],
  getMyShop:{},
  getShopVipQtyState: {}
}
// getters
const getters = {
  myinfo: state => state.myinfo,
  myinfoState: state => state.myinfoState,
  industryList: state=>state.industryList,
  getMyShop: state => state.getMyShop,
  getShopVipQtyState: state => state.getShopVipQtyState
}

// actions
const actions = {
   getShopsVipQty({commit}, {}){  // 店铺会员数
      let userInfo = getUserInfo()
      let homeInfo = getHomeData()
      let sendData = {
         'InterfaceCode': '21002060905',
         'UserId': userInfo.UserID,
         'CompanyId': homeInfo.shop.COMPANYID,
      }
      commonSend.commonSend('get',data=>{
         commit(GET_SHOP_VIPQTY,{data})
       },sendData)
   },
  getMyInfo({commit}){ // 获取商家信息
    let homeInfo = getHomeData();
    let sendData= {
      'InterfaceCode' :'2100110',
      'Companyid': homeInfo.shop.COMPANYID
    }
    commonSend.commonSend('get',data=>{
      commit(MY_INFO,{data})
    },sendData)
  },
  // 获取店铺信息
  getShopInfo({commit}){
    let homeInfo = getHomeData().shop;
    console.log("homeInfo")
    console.log(homeInfo)
    let sendData= {
      'InterfaceCode' :'21002060902',
      'ID': homeInfo.SHOPID,
    }
    commonSend.commonSend('get',data=>{
      commit(GET_MY_SHOP,{data})
    },sendData)
  },

  editMyInfo({commit},data){
    let homeInfo = getHomeData();
    let sendData= Object.assign({},data,{
      'InterfaceCode' :'2100112',
      'Companyid': homeInfo.shop.COMPANYID,
    })
    commonSend.commonSend('get',data=>{
      commit(EDIT_MY_INFO,{data})
    },sendData)
  },

  getIndustry({commit}){ // 所属行业
    let sendData={
      'InterfaceCode' :'20052'
    }
    commonSend.commonSend('get',data=>{
      commit(GET_INDUSTRY,{data})
    },sendData)
  },
  clearMyInfoAll({state}){
    state.myinfo = {}
    state.industryList=[]
  }


}

const mutations = {
  [MY_INFO] (state, { data }) {
    if(data.success){
      state.myinfo = Object.assign({}, data.data);
    }
    state.myinfoState = Object.assign({}, data);
    selected={}
  },
  [GET_MY_SHOP] (state, { data }) {
    console.log(data.data)
    if(data.success){
      state.getMyShop = Object.assign({}, data.data.obj);
    }
  },
  [EDIT_MY_INFO] (state, { data }) {
    state.myinfoState = Object.assign({}, data);
  },
  [GET_INDUSTRY] (state, { data }) {
    if(data.success){
      state.industryList = [...data.data.List]
    }
  },
  [GET_SHOP_VIPQTY](state, { data }) {
   state.getShopVipQtyState = Object.assign({}, data);
 },
}

export default{
  state,
  getters,
  actions,
  mutations
}
