/**
 * 帐户
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_ACCOUNT_LIST,FIRST_ACCOUNT_MONEY,
  INOUT_ACCOUNT_PAY,
  ACCOUNT_FLOW_LIST,
  ADDACCOUNT,
} from '@/store/mutation-types'
let selected={}

// initial state
const state = {
  addaccount:{},
  accountListState: {},
  accountList: [],
  accountItem: {},
  accountState:{},
  dealAccountState:{},
  selaccount:{},
  accountFlowList:[],
  accountFlowListState:{ paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
}

// getters
const getters = {
  accountListState: state => state.accountListState,
  accountList: state => state.accountList,
  accountItem: state=>state.accountItem,
  accountState: state=>state.accountState,
  dealAccountState: state=>state.dealAccountState,
  selaccount : state=>state.selaccount,
  accountFlowList : state=>state.accountFlowList,
  accountFlowListState : state=>state.accountFlowListState,
  addaccount : state=>state.addaccount,
}

// actions
const actions = {
  getAccountList ({commit},data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 210020901,
      'ShopId':homeInfo.shop.ID,
      'CompanyId': userInfo.CompanyID,
      Filter:data.Filter?data.Filter:''
    };
    commonSend.commonSend('get',data => {
      commit(GET_ACCOUNT_LIST, { data })
    }, sendData )
  },
  addAccount ({commit},data) {
    let userInfo = getUserInfo();
    let sendData = {
      'InterfaceCode': 210020905,
      'CompanyId': userInfo.CompanyID,
      'ID': data.ID?data.ID:'',
      'Name': data.Account,
      'Remark': '',
      'IsHide': data.ISHIDE==true? 0 : 1,
    };
    commonSend.commonSend('get',data => {
      commit(ADDACCOUNT, { data })
    }, sendData )
  },
  setFirstAccountMoney ({commit},data) {
    console.log("数据传过来是多少",data)
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': 210020903,
      'ShopId':homeInfo.shop.ID,
      // 'CompanyId': userInfo.CompanyID,
      PayTypeId:data.ID,
      FirstMoney: data.Money
    };
    commonSend.commonSend('get',data => {
      commit(FIRST_ACCOUNT_MONEY, { data })
    }, sendData )
  },
  inoutAccountPay({commit},data) { // 帐户互转
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = Object.assign({},data,{
      'InterfaceCode': 601020703,
      'ShopId':homeInfo.shop.ID,
      'CompanyId': userInfo.CompanyID,
    });
    commonSend.commonSend('get',data => {
      commit(INOUT_ACCOUNT_PAY, { data })
    }, sendData )
  },
  gerAccountFlow({commit},data) { // 帐户流水明细
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let pn = parseInt(state.accountFlowListState.paying.PN) +1;
    if( state.accountFlowListState.paying.PageSize >= state.accountFlowListState.paying.TotalNumber){ 
      pn=1;
    }
    let sendData = Object.assign({},data,{
      'InterfaceCode': 210020907,
      'CompanyId': userInfo.CompanyID,
      PN: data.PN?data.PN:pn
    });
    commonSend.commonSend('get',data => {
      commit(ACCOUNT_FLOW_LIST, { data })
    }, sendData )
  },
  clearAccountAll({state}){
    // state.accountListState= {};
    state.accountList= [];
    state.accountItem= {};
    state.accountState={};
    // state.dealAccountState={};
    state.selaccount={};
    state.accountFlowList=[];
    state.accountFlowListState.paying.PN=0
  },
}

// mutations
const mutations = {
  [GET_ACCOUNT_LIST] (state, { data }) {
    if(data.success){
      state.accountList = [...data.data.List];
    }
    state.accountListState = Object.assign({},data);
  },
  
  [ADDACCOUNT] (state, { data }) {
    if(data.success){
     
    }
    state.addaccount = Object.assign({},data);
  },
  [FIRST_ACCOUNT_MONEY](state,{data}){
    state.dealAccountState = Object.assign({},data);
  },
  [INOUT_ACCOUNT_PAY](state,{data}){
    state.dealAccountState = Object.assign({},data);
  },

  [ACCOUNT_FLOW_LIST] (state, { data }) {
    let pageData = Object.assign({},state.accountFlowListState.paying);
    if(data.success){
      state.accountFlowList = [...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.accountFlowListState = Object.assign({},data,{'paying':pageData});
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
