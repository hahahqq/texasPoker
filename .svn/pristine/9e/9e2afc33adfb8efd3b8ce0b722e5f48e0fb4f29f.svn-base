// 会员注册统计
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_REGREPORT_DATA,
  GET_REGREPORT_LIST,
  GET_REGREPORT_ITEM,
  GET_REGREPORT_DATAEXPORT
} from '@/store/mutation-types'
let selected={}
var ListARR = [
  {InterfaceCode:'6010308_01',title:'会员注册详情',paying:{ "TotalNumber": 0, "PageNumber": 0, "PageSize": 20, "PN": 0,  },List:[]  },
]

// initial state
const state = {
  registeredReportState: {},
  registeredReportData: {paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[]},
  registeredReportList:[],
  registeredReportListState:{paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[]},
  registeredReportListARR: [...ListARR],
  registeredReportItem:{data:{}},
  registeredReportDataExport:[]
}

// getters
const getters = {
  registeredReportData: state => state.registeredReportData,
  registeredReportList: state => state.registeredReportList,
  registeredReportState: state => state.registeredReportState,
  registeredReportListState: state=>state.registeredReportListState,
  registeredReportListARR: state=>state.registeredReportListARR,
  registeredReportItem: state=>state.registeredReportItem,
  registeredReportDataExport: state=>state.registeredReportDataExport,
}

// actions
const actions = {
  getExportregistered ({commit},data) {
    let userInfo= getUserInfo();
    let sendData = {
      'InterfaceCode': '210021421',
      Type:data.Type,
      PN:1
    };
    commonSend.commonSend('get',data => {
      commit(GET_REGREPORT_DATAEXPORT, { data })
    }, sendData )
  },

  getregisteredReportData ({commit},data) {
    let userInfo= getUserInfo();
    let sendData = {
      'InterfaceCode': '210020710',
      Type:data.Type, // 0=日报 1=月报
      PN:data.PN?data.PN: 1
    };
    commonSend.commonSend('get',data => {
      commit(GET_REGREPORT_DATA, { data })
    }, sendData )
  },
  getregisteredReportList ({commit,state},{obj,data}) {
    let userInfo= getUserInfo();
    let sendData = {
      'InterfaceCode': '210020710_01',
      'CompanyId': userInfo.CompanyID,
      ShopId: data.ShopId ? data.ShopId : '',
      DateStr: data.str,
      PN:data.PN ? data.PN : 1
    };
    selected.obj = obj;
    commonSend.commonSend('get',data => {
      commit(GET_REGREPORT_LIST, { data })
    }, sendData )
  },
  clearregisteredReportList({state},index) {
    state.registeredReportList=[]
    state.registeredReportListState.paying.PN = 0 
    state.registeredReportListARR[index].paying.PN = 0 
  },
  clearregisteredReportList2({state}){
    state.registeredReportData.paying.PN = 0
    state.registeredReportData.List = []
    state.registeredReportData.info = {}
  },
  clearregisteredReportAll({state}) {
    state.registeredReportList=[]
    state.registeredReportListState.paying.PN = 0 
    state.registeredReportData.paying.PN = 0
    state.registeredReportData.List = []
    state.registeredReportData.info = {}
    state.registeredReportListARR= [...ListARR];
    state.registeredReportItem = {data:{}}
  },
  
}

// mutations
const mutations = {
  [GET_REGREPORT_DATA] (state, { data }) {
    console.log("8888888888888888888888")
    console.log(data.data.PageData)
    // if(data.success){
    //   let pageData = Object.assign({},state.registeredReportData.paying);
    //   let newArr = [...data.data.PageData.DataArr];
    //   if(newArr.length>0){
    //     pageData = Object.assign(pageData, data.data.PageData);
    //     delete pageData.DataArr;
    //     state.registeredReportData.paying = Object.assign({},pageData)
    //     state.registeredReportData.List = [...newArr];
    //   }
    // }
    // state.registeredReportState = Object.assign({},data.data.PageData);


    if(data.success){
      let pageData = Object.assign({},state.registeredReportData.paying);
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData);
        delete pageData.DataArr;
        state.registeredReportData.paying = Object.assign({},pageData)
        state.registeredReportData.List = [...newArr];
      }
    }
    state.registeredReportState = Object.assign({},data);


    // state.registeredReportState = Object.assign({},data);
  },
  [GET_REGREPORT_LIST](state, { data }) {
    let listArrData = state.registeredReportListARR[selected.obj.index]
    let pageData = Object.assign({},listArrData.paying);
    if(data.success){
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData)
        state.registeredReportList = [...newArr];
        state.registeredReportListARR[selected.obj.index].paying = Object.assign({},pageData)
        state.registeredReportListARR[selected.obj.index].List = [...state.registeredReportList]
      }
    }
    state.registeredReportListState = Object.assign({},data,{'paying':pageData,'List':state.registeredReportList});
    selected = {}
  },
  [GET_REGREPORT_ITEM](state,{data}){
    state.registeredReportItem = Object.assign({},data)
  },
  [GET_REGREPORT_DATAEXPORT](state,{data}){
    state.registeredReportDataExport = Object.assign({},data.data.List)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
