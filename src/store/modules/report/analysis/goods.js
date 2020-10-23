// 商品分析 员工分析
import commonSend from '@/api/api'
import { getUserInfo,getHomeData } from '@/api/index'
import { 
  GET_GOODSREPORT_DATA,
  GET_GOODSREPORT_LIST,
  STAFF_LIST_REPORT,
} from '@/store/mutation-types'
let selected={}
var ListARR = [
]

// initial state
const state = {
  goodsReportState: {},
  staffReportState:{},
  goodsReportData: {paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[],info:{}},
  goodsReportList:[],
  goodsReportListState:{paying:{
    "TotalNumber": 0,
    "PageNumber": 0,
    "PageSize": 20,
    "PN": 0,
  },List:[]},
  goodsReportListARR: [...ListARR],
}

// getters
const getters = {
  goodsReportData: state => state.goodsReportData,
  goodsReportList: state => state.goodsReportList,
  goodsReportState: state => state.goodsReportState,
  goodsReportListState: state=>state.goodsReportListState,
  goodsReportListARR: state=>state.goodsReportListARR,
  staffReportState: state=>state.staffReportState,
}

// actions
const actions = {
  getgoodsReportData ({commit},data) { 
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let pn = parseInt(state.goodsReportData.paying.PN) +1;
    let sendData = {
      'InterfaceCode': '21002072101',
      'CompanyId': userInfo.CompanyID,
      ShopId:data.ShopId?data.ShopId:'',
      BeginDate:data.BeginDate?data.BeginDate :1,
      EndDate:data.EndDate?data.EndDate : 9999999999999,
      PN:data.PN?data.PN:pn,
    };
    commonSend.commonSend('get',data => {
      commit(GET_GOODSREPORT_DATA, { data })
    }, sendData )
  },
  getstaffReportData ({commit},data) { 
    let userInfo= getUserInfo();
    let homeInfo = getHomeData();
    let sendData = {
      'InterfaceCode': '21002070801_V1',
      'CompanyId': userInfo.CompanyID,
      ShipIDList:data.ShopId?data.ShopId:'',
      BeginDate:data.BeginDate?data.BeginDate :1,
      EndDate:data.EndDate?data.EndDate : 9999999999999,
    };
    commonSend.commonSend('get',data => {
      commit(STAFF_LIST_REPORT, { data })
    }, sendData )
  },
  cleargoodsReportList({state},index) {
    state.goodsReportList=[]
    state.goodsReportListState.paying.PN = 0 
    state.goodsReportListARR[index].paying.PN = 0 
  },
  cleargoodsReportList2({state}){
    state.goodsReportData.paying.PN = 0
    state.goodsReportData.List = []
    state.goodsReportData.info = {}
  },
  cleargoodsReportAll({state}){
    state.goodsReportList = [];
    state.goodsReportListState.paying.PN=0
    state.goodsReportData.paying.PN = 0
    state.goodsReportData.List = []
    state.goodsReportData.info = {}
    state.goodsReportListARR= [...ListARR]
  },
}

// mutations
const mutations = {
  [GET_GOODSREPORT_DATA] (state, { data }) {
    if(data.success){
      let pageData = Object.assign({},state.goodsReportData.paying);
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData);
        delete pageData.DataArr;
        state.goodsReportData.paying = Object.assign({},pageData)
        state.goodsReportData.List = [...newArr];
        state.goodsReportData.info=Object.assign({},data.data.SumInfo);
      }
    }
    state.goodsReportState = Object.assign({},data);
  },
  [GET_GOODSREPORT_LIST](state, { data }) {
    let listArrData = state.goodsReportListARR[selected.obj.index]
    let pageData = Object.assign({},listArrData.paying);
    if(data.success){
      let newArr = [...data.data.PageData.DataArr];
      if(newArr.length>0){
        pageData = Object.assign(pageData, data.data.PageData)
        state.goodsReportList = [...newArr];
        state.goodsReportListARR[selected.obj.index].paying = Object.assign({},pageData)
        state.goodsReportListARR[selected.obj.index].List = [...state.goodsReportList]
      }
    }
    state.goodsReportListState = Object.assign({},data,{'paying':pageData,'List':state.goodsReportList});
    selected = {}
  },

  [STAFF_LIST_REPORT] (state, { data }) {
    state.staffReportState = Object.assign({},data);
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
