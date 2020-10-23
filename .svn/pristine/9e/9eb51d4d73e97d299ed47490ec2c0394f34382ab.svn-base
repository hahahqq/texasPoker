/**
 *  报表分析
 * ***/
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_REPORT_LIST,
} from '@/store/mutation-types'
var ListARR = {
  defrayReport:{ // 支出报表 支出分析
    InterfaceCode:'21002071201_04_01',paying:{PN:0},List:[]  },
}
let selected={}

// initial state
const state = {
  reportARR: Object.assign({},ListARR),
  reportList: [],
  reportListState: { paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  }},
}

// getters
const getters = {
  reportARR:state=>state.reportARR,
  reportListState: state => state.reportListState,
  reportList: state => state.reportList,
}

// actions
const actions = {
  getReportList ({commit},{obj,data}) {
    let userInfo = getUserInfo();
    let homeInfo = getHomeData();
    let pn = parseInt(state.reportARR[obj].paying.PN) +1;
    let sendData = Object.assign({},data,{
      'InterfaceCode': state.reportARR[obj].InterfaceCode,
      'CompanyId': userInfo.CompanyID,
      PN: data.PN?data.PN:pn
    })
    selected.obj = obj;
    commonSend.commonSend('get',data => {
      commit(GET_REPORT_LIST, { data })
    }, sendData )
  },
  clearReportAll({state}){
    state.reportList = [];
    state.reportListState.paying.PN=0;
    state.reportARR= Object.assign({},ListARR)
  }
}

// mutations
const mutations = {
  [GET_REPORT_LIST] (state, { data }) {
    let pageData = Object.assign({},state.reportListState.paying);
    if(data.success){
      console.log("data.data.PageData")
      console.log(data.data)
      state.reportList = [...data.data.List];
      pageData = Object.assign(pageData, data.data.List)
      state.reportARR[selected.obj].paying = Object.assign({},pageData)
      state.reportARR[selected.obj].List = [...state.reportList]
    }
    state.reportListState = Object.assign({},data,{'paying':pageData,'List':state.reportList});
    selected= {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
