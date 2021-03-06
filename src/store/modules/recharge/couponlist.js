import commonSend from '@/api/api'
import { getUserInfo, setHomeData, getHomeData } from '@/api/index'
import {
  GET_COUPONLIST_LIST,
  GET_COUPONCHECK_LIST
} from '@/store/mutation-types'
let selected = {}

// initial state
const state = {
  couponListState: { paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
  couponList: [],
  couponcheckState: {},
}

// getters
const getters = {
  couponListState: state => state.couponListState,
  couponList: state => state.couponList,
  couponcheckState: state => state.couponcheckState,
}

// actions
const actions = {
  //生意通获取优惠卷列表接口
  getcouponListState({ commit,state }, data) {
     console.log(data)
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '9204059',
      CompanyId: userInfo.CompanyID,
      PN: data.PN?data.PN : 1,
      Type: data.Type ? data.Type : 0,
      VipId:data.VipId,
      CouponType: data.CouponType
    };
    commonSend.commonSend('get', data => {
      commit(GET_COUPONLIST_LIST, { data })
    }, sendData)
  },
  getcouponcheckState({ commit }, data) {
    let userInfo = getUserInfo();
    let sendData = {
      InterfaceCode: '210020521',
      Code: data.Code,
      CompanyId: userInfo.CompanyID
    };
    if (data) {
      sendData = Object.assign({}, sendData, data)
    }
    commonSend.commonSend('get', data => {
      commit(GET_COUPONCHECK_LIST, { data })
    }, sendData)
  }


}

// mutations
const mutations = {
  [GET_COUPONLIST_LIST](state, { data }) {
    let pageData = Object.assign({},state.couponListState.paying);
    if(data.success){
      state.couponList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }else{
      state.couponList = []
    }
    state.couponListState = Object.assign({},data,{'paying':pageData});
  },
  [GET_COUPONCHECK_LIST](state, { data }) {
    state.couponcheckState = Object.assign({}, data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
