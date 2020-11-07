import commonSend from '@/api/api'
import {
GET_PARAMETERSTATE,
SET_PARAMETERSTATE
} from '@/store/mutation-types'
import { getHomeData, getUserInfo, setUserInfo } from '@/api/index'
let selected={}

// init state
const state = {
  gparameterstate: {},
  sparameterstate: {},
}

// getters
const getters = {
  gparameterstate: state => state.gparameterstate,
  sparameterstate: state => state.sparameterstate,
}

// actions
const actions = {
  getparameterstate({commit}){ // 获取商家信息
    let homeInfo = getHomeData();
    let sendData= {
      'InterfaceCode' :'2100116',
      'CompanyId': homeInfo.shop.COMPANYID
    }
    commonSend.commonSend('get',data=>{
      commit(GET_PARAMETERSTATE,{data})
    },sendData)
  },
  setparameterstate({commit},data){
    let homeInfo = getHomeData();
    let sendData= Object.assign({},data,{
      'InterfaceCode' :'9201011'
    })
    commonSend.commonSend('post',data=>{
      commit(SET_PARAMETERSTATE,{data})
    },sendData)
  },
}

const mutations = {
  [GET_PARAMETERSTATE] (state, { data }) {
    state.gparameterstate = Object.assign({}, data);
    let userInfo = getUserInfo();
    userInfo.CompanyConfig = Object.assign({}, userInfo.CompanyConfig, data.data.CompanyConfig)
    console.log(userInfo)
    setUserInfo(userInfo)
  },
  [SET_PARAMETERSTATE] (state, { data }) {
    state.sparameterstate = Object.assign({}, data);
  },
}

export default{
  state,
  getters,
  actions,
  mutations
}
