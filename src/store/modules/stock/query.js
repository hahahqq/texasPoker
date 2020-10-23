
/**
 * 支出
 * 
 * ***/

import commonSend from '@/api/api'
import { 
  GET_STOCK_QI_LIST
} from '@/store/mutation-types'
import { getUserInfo,getHomeData } from '@/api/index'
let selected={}

// init state
const state = {
  stockqueryList:[],
  stockqueryiState:{ 
    paying:{
      "TotalNumber": 0,
      "PageNumber": 0,
      "PageSize": 20,
      "PN": 0,
    }
  },
  
}

// getters
const getters = {
  stockqueryList:state=>state.stockqueryList,
  stockqueryiState:state=>state.stockqueryiState,
}

// actions
const actions = {
  getsqueryItem ({commit},data) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '210021241',
      'CompanyId': userInfo.CompanyID,
      ShopId:data.ShopId?data.ShopId:'',
      CategoryId: data.CategoryId?data.CategoryId:'',
      Satus:data.Satus,
      ZeroQty:data.ZeroQty,
      Filter:data.Filter,
      PN:data.PN,
      OrderType:data.OrderType,
      OrderMode:data.OrderMode,
    };
    commonSend.commonSend('get',data => {
      commit(GET_STOCK_QI_LIST, { data })
    }, sendData )
  },
}


// mutations
const mutations = {
  [GET_STOCK_QI_LIST](state, { data }) {
    let pageData = Object.assign({},state.stockqueryiState.paying);
    if(data.success){
      state.stockqueryList=[...data.data.PageData.DataArr];
      pageData = Object.assign(pageData, data.data.PageData)
    }
    state.stockqueryiState = Object.assign({},data,{'paying': pageData});
  }
}


export default{
  state,
  getters,
  actions,
  mutations
}

