import commonSend from '@/api/api'
import {
    GET_GAME_LIST,
    GET_GAME_DETAILS,
    SIGNUP_SCAN_VERIFITION,
    SIGNUP_SCAN_LIST
} from '@/store/mutation-types'
import { getUserInfo, getHomeData } from '@/api/index'

// init state
const state = {
    getGameListState: {},
    getGameDetailsState: {},
    signUpScanVerifitionState: {},
    signUpScanListState: {}
}

// getters
const getters = {
    getGameListState: state => state.getGameListState,
    getGameDetailsState: state => state.getGameDetailsState,
    signUpScanVerifitionState: state => state.signUpScanVerifitionState,
    signUpScanListState: state => state.signUpScanListState
}

// actions
const actions = {
    // 比赛项目
    getGameList({commit}, data){  // 赛事列表
        let userInfo = getUserInfo();
        let sendData = {
            'InterfaceCode': '920201001',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            UserId: '',
            Filter: '',
            Type: data.Type ? data.Type : -1,
            PN: data.PN ? data.PN : 1,
            IsIntegralMatch: data.IsIntegralMatch
        }
        commonSend.commonSend('get', data => {
            commit(GET_GAME_LIST, { data })
        }, sendData)
    },
    getGameDetails({commit}, data){   // 赛事详情
        let userInfo = getUserInfo()
        let sendData = {
            InterfaceCode: '920201002',
            'CompanyId': userInfo.CompanyID,
            'ShopId': getHomeData().shop.ID,
            UserId: '',
            BillId: data.BillId
        }
        commonSend.commonSend('get', data => {
            commit(GET_GAME_DETAILS, { data })
        }, sendData)
    },
    getSignUpScanList({commit}, data){
      let userInfo = getUserInfo()
      let sendData = {
         InterfaceCode: '920310',
         'CompanyId': userInfo.CompanyID,
         'ShopId': data.ShopId,
         BeginDate: data.BeginDate,
         EndDate: data.EndDate,
         IsCheck: data.IsCheck ? data.IsCheck : -1,
         Type: data.Type ? data.Type : -1,
         PN: data.PN
       }
       commonSend.commonSend('get', data => {
         commit(SIGNUP_SCAN_LIST, { data })
      }, sendData)
    },
    signUpScanVerifition({commit}, data){
       let userInfo = getUserInfo()
       let sendData = {
         InterfaceCode: '920311',
         'CompanyId': userInfo.CompanyID,
         CouponCode: data.CouponCode
       }
       commonSend.commonSend('post', data => {
         commit(SIGNUP_SCAN_VERIFITION, { data })
      }, sendData)

    }
}

// mutations
const mutations = {
   [SIGNUP_SCAN_VERIFITION](state, {data}){
      state.signUpScanVerifitionState = data
   },
   [SIGNUP_SCAN_LIST](state, data){
      state.signUpScanListState = data.data
   },
    [GET_GAME_LIST](state, { data }) {
        state.getGameListState = data
    },
    [GET_GAME_DETAILS](state, { data }) {
        state.getGameDetailsState = data
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}
