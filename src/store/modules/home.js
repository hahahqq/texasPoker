import commonSend from '@/api/api'
import {
  GET_HOME_WEEKSDAYTIME,
  GET_NOTICE_INFO,
  GET_SaleTable_DATA,
  GET_PaiHang_Group
} from '@/store/mutation-types'
import { getHomeData } from '@/api/index'

// init state
const state = {
  homedaycombackobj:{},
  noticeInfoState:{},
  getSaleTableState: {},
  getPaiHangGroupState: {}
}

// getters
const getters = {
  homedaycombackobj: state => state.homedaycombackobj,
  noticeInfoState: state => state.noticeInfoState,
  getSaleTableState: state => state.getSaleTableState,
  getPaiHangGroupState: state => state.getPaiHangGroupState
}

// actions
const actions = {
  getweeksdayssaleList({ commit }, data = {}) { // 日经营情况
    let userInfo = getHomeData().shop;
    let sendData = Object.assign({}, data, {
      // 'InterfaceCode': '2100203A',
      InterfaceCode: '9207041',
      'ShopID': userInfo.ID,
      'CompanyId': userInfo.COMPANYID
    });
    commonSend.commonSend('get', data => {
      commit(GET_HOME_WEEKSDAYTIME, { data })
    }, sendData)
  },
  getNoticeInfo({commit}, {}){  // 提醒事项
    let userInfo = getHomeData()
    commonSend.commonSend('get', data => {
      commit(GET_NOTICE_INFO, { data })
    }, { ShopId: userInfo.shop.ID, InterfaceCode: '2100211'})
  },
  getsaleTableData ({commit},data) {
    let userInfo = getHomeData().shop;
    let sendData = {
      'InterfaceCode': '9207042',
      'CompanyId': userInfo.COMPANYID,
      ShopListId:userInfo.ID,
      BeginDate:data.BeginDate,
      EndDate:data.EndDate
    };
    commonSend.commonSend('get',data => {
      commit(GET_SaleTable_DATA, { data })
    }, sendData )
  },


  GetPaiHangGroup({commit}, data){  //排行榜
    let userInfo = getHomeData().shop
    let sendData = {
      'InterfaceCode': '21002072103',
      ShopId: userInfo.ID,
      CompanyId: userInfo.COMPANYID,
      BeginDate: data.BeginDate,
      EndDate: data.EndDate,
      OrderType: 1
    }
    commonSend.commonSend('get', data =>{
      commit(GET_PaiHang_Group, {data})
    }, sendData)
  },
  clearHomeAll({state}){
    state.homedaycombackobj={}
   //  state.SaleInfo7Dayobj={}
   //  state.homeoperatingdata={}
    state.noticeInfoState = {}
    state.getSaleTableState = {}
    state.getPaiHangGroupState = {}
  }
}

const mutations = {
  [GET_PaiHang_Group](state, {data}){
    state.getPaiHangGroupState = data
  },
  [GET_SaleTable_DATA](state, {data}){
    state.getSaleTableState = data
  },
  [GET_NOTICE_INFO](state, {data}){
    state.noticeInfoState = data
  },
  [GET_HOME_WEEKSDAYTIME](state, { data }) {
    console.log("今天数据",data)
    if (data.success) {
      state.homedaycombackobj=data.data;
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
