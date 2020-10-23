/**
 * 付款项目（支出项目）
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_PAYMENT_LIST,
  GET_PAYWAY_LIST,
  DEAL_PAYMENT,
  ADD_PAYWAY,
  DEL_PAYWAY,
  SORT_PAYWAY
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  paymentListState: {},
  paymentList: [],
  paymentItem: {},
  paymentState:{},
  dealPaymentState:{},
  selpayment:{},
  paywayListState: {},
  paywayList: [],
  addPayWayInfoState:{},
  delPayWayInfoState:{},
  sortPaywayList:{},
}

// getters
const getters = {
  paymentListState: state => state.paymentListState,
  paymentList: state => state.paymentList,
  paymentItem: state=>state.paymentItem,
  paymentState: state=>state.paymentState,
  dealPaymentState: state=>state.dealPaymentState,
  selpayment : state=>state.selpayment,
  paywayListState: state => state.paywayListState,
  paywayList: state => state.paywayList,
  addPayWayInfoState:state => state.addPayWayInfoState,
  delPayWayInfoState:state => state.delPayWayInfoState,
  sortPaywayList:state => state.sortPaywayList,
}

// actions
const actions = {
  getPaymentList ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 210020801,
      Name:data.Name?data.Name:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_PAYMENT_LIST, { data })
    }, sendData )
  },
  dealPaymentItem({commit},{type,data}) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 210020803,
      'CompanyId': userInfo.CompanyID,
      Name:data.Name,
      Remark : data.Remark
    };
    if(type=='edit'){
      sendData.Id = data.ID
    }
    if(type=='del'){
      sendData = {
        'InterfaceCode': 210020804,
        'CompanyId': userInfo.CompanyID,
        Id:data.ID,
      }
    }
    selected.type=type;
    selected.data=Object.assign({},sendData);
    commonSend.commonSend('get',data => {
      commit(DEAL_PAYMENT, { data })
    }, sendData )
  },
  selectingPayment({commit,state},data){
    state.selpayment = Object.assign({},data);
  },

  getPaywayList ({commit},data) { // 支付方式
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002060306',
      'CompanyId': userInfo.CompanyID,
      Fliter:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_PAYWAY_LIST, { data })
    }, sendData )
  },
  sortPaywayList ({commit},data) { // 支付方式
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': '21002060307',
      'CompanyId': userInfo.CompanyID,
      PayList:data.PayList
    };
    commonSend.commonSend('get',data => {
      commit(SORT_PAYWAY, { data })
    }, sendData )
  },
  addPayWayState({commit}, data){  // 新增支付账户
    let userInfo = getUserInfo()
    let sendData = {
      InterfaceCode: '21002060303',
      ID: data.ID,
      Name:data.Name,
      Remark: data.Remark,
      IsHide:data.IsHide? data.IsHide:''
    }
    commonSend.commonSend('get', data =>{
      commit(ADD_PAYWAY, {data})
    }, sendData)
  },
  delPayWayState({commit}, data){  // 删除支付账户
    let sendData = {
      InterfaceCode : '21002060304',
      ID: data.ID
    }
    commonSend.commonSend('get', data =>{
      commit(DEL_PAYWAY, {data})
    }, sendData)
  },
  clearPaymentAll({state}){
    state.paymentList= []
    state.paymentItem= {}
    state.selpayment={}
    state.paywayList= []
  }
  
}

// mutations
const mutations = {
  [DEL_PAYWAY](state,{data}){
    state.delPayWayInfoState = Object.assign({}, data)
  },
  [ADD_PAYWAY](state, {data}){
    state.addPayWayInfoState = Object.assign({}, data)
  },
  [GET_PAYMENT_LIST] (state, { data }) {
    if(data.success){
      state.paymentList = [...data.data.List];
    }
    state.paymentListState = Object.assign({},data);
  },
  [GET_PAYWAY_LIST] (state, { data }) {
    if(data.success){
      state.paywayList = [...data.data.List];
    }
    state.paywayListState = Object.assign({},data);
  },

  [SORT_PAYWAY] (state, { data }) {
    console.log("555555",data)
    if(data.success){
      state.sortPaywayList = [...data.data.List];
    }
  },

  [DEAL_PAYMENT](state,{data}){
    state.dealPaymentState = Object.assign({},data);
    selected = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
